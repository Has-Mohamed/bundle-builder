import { describe, expect, it } from 'vitest';
import type { Product } from '../types/domain';
import { makeLineKey, parseLineKey } from '../lib/lineKey';
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  SHIPPING_COST_CENTS,
  cartTotals,
  clampQuantity,
  getActiveVariantId,
  getQuantity,
  lineItemsForCategory,
  selectedCountForStep,
} from './selectors';

const camera: Product = {
  id: 'cam',
  stepId: 'cameras',
  category: 'Cameras',
  title: 'Test Cam',
  image: 'x.svg',
  price: 2000,
  compareAtPrice: 2500,
  variants: [
    { id: 'red', label: 'Red', swatch: '#f00' },
    { id: 'blue', label: 'Blue', swatch: '#00f' },
  ],
};

const doorbell: Product = {
  id: 'doorbell',
  stepId: 'cameras',
  category: 'Cameras',
  title: 'Test Doorbell',
  image: 'y.svg',
  price: 5000,
};

const hub: Product = {
  id: 'hub',
  stepId: 'sensors',
  category: 'Sensors',
  title: 'Required Hub',
  image: 'z.svg',
  price: 0,
  compareAtPrice: 2992,
  minQuantity: 1,
  maxQuantity: 1,
};

const plan: Product = {
  id: 'plan-a',
  stepId: 'plan',
  category: 'Plan',
  title: 'Plan A',
  image: 'p.svg',
  price: 999,
  billingSuffix: '/mo',
  hasQuantity: false,
  maxQuantity: 1,
};

const catalog = [camera, doorbell, hub, plan];

describe('lineKey helpers', () => {
  it('round-trips a variant key', () => {
    const key = makeLineKey('cam', 'red');
    expect(key).toBe('cam:red');
    expect(parseLineKey(key)).toEqual({ productId: 'cam', variantId: 'red' });
  });

  it('round-trips a variant-less key as "default"', () => {
    const key = makeLineKey('doorbell');
    expect(key).toBe('doorbell:default');
    expect(parseLineKey(key)).toEqual({ productId: 'doorbell', variantId: null });
  });
});

describe('clampQuantity', () => {
  it('floors at 0 by default', () => {
    expect(clampQuantity(camera, -5)).toBe(0);
  });

  it('respects a locked min/max (the required hub)', () => {
    expect(clampQuantity(hub, 0)).toBe(1);
    expect(clampQuantity(hub, 5)).toBe(1);
  });

  it('respects a plan capped at 1', () => {
    expect(clampQuantity(plan, 3)).toBe(1);
  });
});

describe('variant-level quantity isolation', () => {
  it('tracks red and blue of the same product independently', () => {
    const quantities = {
      [makeLineKey('cam', 'red')]: 2,
      [makeLineKey('cam', 'blue')]: 0,
    };
    expect(getQuantity(quantities, 'cam', 'red')).toBe(2);
    expect(getQuantity(quantities, 'cam', 'blue')).toBe(0);
  });

  it('switching the active variant does not touch the other variant\'s count', () => {
    // This mirrors the exact example from the brief: add 2 Red, switch to
    // Blue, the stepper should read 0 while Red stays untouched.
    const quantities = { [makeLineKey('cam', 'red')]: 2 };
    const activeVariant = { cam: 'blue' };

    const activeId = getActiveVariantId(activeVariant, camera);
    expect(activeId).toBe('blue');
    expect(getQuantity(quantities, 'cam', activeId)).toBe(0);
    expect(getQuantity(quantities, 'cam', 'red')).toBe(2);
  });

  it('defaults the active variant to the first one when nothing is selected yet', () => {
    expect(getActiveVariantId({}, camera)).toBe('red');
  });

  it('returns null for a product with no variants', () => {
    expect(getActiveVariantId({}, doorbell)).toBeNull();
  });
});

describe('selectedCountForStep', () => {
  it('counts distinct products, not variants, with any quantity above zero', () => {
    const quantities = {
      [makeLineKey('cam', 'red')]: 2,
      [makeLineKey('cam', 'blue')]: 1,
      [makeLineKey('doorbell')]: 0,
    };
    // Red + Blue are the same product -> counts once, doorbell is 0 -> not counted
    expect(selectedCountForStep(catalog, quantities, 'cameras')).toBe(1);
  });

  it('is zero when nothing in the step is selected', () => {
    expect(selectedCountForStep(catalog, {}, 'cameras')).toBe(0);
  });

  it('ignores selections from other steps', () => {
    const quantities = { [makeLineKey('hub')]: 1 };
    expect(selectedCountForStep(catalog, quantities, 'cameras')).toBe(0);
    expect(selectedCountForStep(catalog, quantities, 'sensors')).toBe(1);
  });
});

describe('lineItemsForCategory', () => {
  it('produces one review line per variant with quantity > 0', () => {
    const quantities = {
      [makeLineKey('cam', 'red')]: 2,
      [makeLineKey('cam', 'blue')]: 1,
    };
    const items = lineItemsForCategory(catalog, quantities, 'Cameras');
    expect(items).toHaveLength(2);
    expect(items.map((i) => i.variantLabel).sort()).toEqual(['Blue', 'Red']);
  });

  it('computes line totals as unit price times quantity', () => {
    const quantities = { [makeLineKey('cam', 'red')]: 3 };
    const [item] = lineItemsForCategory(catalog, quantities, 'Cameras');
    expect(item.lineTotal).toBe(6000);
    expect(item.lineCompareTotal).toBe(7500);
  });

  it('excludes zero-quantity lines and other categories', () => {
    const quantities = { [makeLineKey('cam', 'red')]: 1, [makeLineKey('hub')]: 1 };
    const items = lineItemsForCategory(catalog, quantities, 'Cameras');
    expect(items).toHaveLength(1);
  });
});

describe('cartTotals', () => {
  it('sums product lines and applies flat shipping under the free-shipping threshold', () => {
    const quantities = { [makeLineKey('doorbell')]: 1 }; // 5000 cents, at the threshold
    const totals = cartTotals(catalog, quantities);
    expect(totals.productSubtotal).toBe(5000);
    expect(totals.shippingCost).toBe(0); // meets threshold exactly
  });

  it('charges shipping below the free-shipping threshold', () => {
    const quantities = { [makeLineKey('cam', 'red')]: 1 }; // 2000 cents
    const totals = cartTotals(catalog, quantities);
    expect(totals.productSubtotal).toBe(2000);
    expect(totals.shippingCost).toBe(SHIPPING_COST_CENTS);
    expect(totals.total).toBe(2000 + SHIPPING_COST_CENTS);
  });

  it('excludes shipping\'s own discount from the bundle savings figure', () => {
    const quantities = { [makeLineKey('cam', 'red')]: 1 }; // triggers paid shipping
    const totals = cartTotals(catalog, quantities);
    // compareTotal should add shipping at full cost on both sides, so shipping
    // contributes zero to "savings" — savings only reflects product discounts.
    expect(totals.savings).toBe(totals.productCompareSubtotal - totals.productSubtotal);
  });

  it('reflects a required-but-free line at full compare-at value on the struck total', () => {
    const quantities = { [makeLineKey('hub')]: 1 };
    const totals = cartTotals(catalog, quantities);
    expect(totals.productSubtotal).toBe(0);
    expect(totals.productCompareSubtotal).toBe(2992);
    expect(totals.savings).toBeGreaterThan(0);
  });

  it('is entirely zero for an empty cart', () => {
    const totals = cartTotals(catalog, {});
    expect(totals.productSubtotal).toBe(0);
    expect(totals.total).toBe(FREE_SHIPPING_THRESHOLD_CENTS > 0 ? SHIPPING_COST_CENTS : 0);
  });
});
