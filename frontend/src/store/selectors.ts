import type { Category, Product, StepId } from "../types/domain";
import { makeLineKey, parseLineKey } from "../lib/lineKey";
import z from "zod";

export const SHIPPING_COST_CENTS = 599;
/** Orders at or above this product subtotal ship free. */
export const FREE_SHIPPING_THRESHOLD_CENTS = 5000;

export interface CartSnapshot {
  quantities: Record<string, number>;
  activeVariant: Record<string, string>;
}

export function clampQuantity(product: Product, quantity: number): number {
  const min = product.minQuantity ?? 0;
  const max = product.maxQuantity ?? Number.POSITIVE_INFINITY;
  return Math.min(Math.max(quantity, min), max);
}

export function getQuantity(
  quantities: Record<string, number>,
  productId: string,
  variantId?: string | null,
): number {
  return quantities[makeLineKey(productId, variantId)] ?? 0;
}

export function getProductQuantity(
  quantities: Record<string, number>,
  productId: string,
): number {
  return Object.keys(quantities).reduce((acc, key) => {
    const { productId: keyProductId } = parseLineKey(key);
    if (keyProductId === productId) {
      acc += quantities[key];
    }
    return acc;
  }, 0);
}

/** Which variant a product's card/stepper currently reflects. */
export function getActiveVariantId(
  activeVariant: Record<string, string>,
  product: Product,
): string | null {
  if (!product.variants || product.variants.length === 0) return null;
  return activeVariant[product.id] ?? product.variants[0].id;
}

/**
 * Distinct PRODUCTS (not variants) with any quantity above zero in a step.
 * Two variants of the same product still count once.
 */
export function selectedCountForStep(
  products: Product[],
  quantities: Record<string, number>,
  stepId: StepId,
): number {
  const stepProductIds = new Set(
    products.filter((p) => p.stepId === stepId).map((p) => p.id),
  );
  const productsWithStock = new Set<string>();

  for (const [lineKey, qty] of Object.entries(quantities)) {
    if (qty <= 0) continue;
    const { productId } = parseLineKey(lineKey);
    if (stepProductIds.has(productId)) productsWithStock.add(productId);
  }
  return productsWithStock.size;
}

export interface ResolvedLineItem {
  lineKey: string;
  product: Product;
  variantId: string | null;
  variantLabel: string | null;
  quantity: number;
  unitPrice: number;
  unitCompareAtPrice: number;
  lineTotal: number;
  lineCompareTotal: number;
}

/** Every line (product + variant) with qty > 0, grouped under its category. */
export function lineItemsForCategory(
  products: Product[],
  quantities: Record<string, number>,
  category: Category,
): ResolvedLineItem[] {
  const items: ResolvedLineItem[] = [];
  const byId = new Map(products.map((p) => [p.id, p] as const));

  for (const [lineKey, quantity] of Object.entries(quantities)) {
    if (quantity <= 0) continue;
    const { productId, variantId } = parseLineKey(lineKey);
    const product = byId.get(productId);
    if (!product || product.category !== category) continue;

    const variant = variantId
      ? product.variants?.find((v) => v.id === variantId)
      : undefined;
    const unitPrice = product.price;
    const unitCompareAtPrice = product.compareAtPrice ?? product.price;

    items.push({
      lineKey,
      product,
      variantId: variantId ?? null,
      variantLabel: variant?.label ?? null,
      quantity,
      unitPrice,
      unitCompareAtPrice,
      lineTotal: unitPrice * quantity,
      lineCompareTotal: unitCompareAtPrice * quantity,
    });
  }

  // Stable, readable order: by product catalog order, then variant label.
  items.sort((a, b) => {
    const productOrder =
      products.indexOf(a.product) - products.indexOf(b.product);
    if (productOrder !== 0) return productOrder;
    return (a.variantLabel ?? "").localeCompare(b.variantLabel ?? "");
  });

  return items;
}

export interface CartTotals {
  /** Sum of every product/plan line's active price. Excludes shipping. */
  productSubtotal: number;
  /** Sum of every product/plan line's compare-at (or price, if none). Excludes shipping. */
  productCompareSubtotal: number;
  shippingCost: number;
  shippingCompareAtCost: number;
  /** productSubtotal + shippingCost */
  total: number;
  /** productCompareSubtotal + shippingCost (shipping's own discount isn't counted as bundle savings) */
  compareTotal: number;
  savings: number;
  /** Rough "as low as" monthly financing figure, illustrative only. */
  financingPerMonth: number;
}

export function cartTotals(
  products: Product[],
  quantities: Record<string, number>,
): CartTotals {
  let productSubtotal = 0;
  let productCompareSubtotal = 0;
  const byId = new Map(products.map((p) => [p.id, p] as const));

  for (const [lineKey, quantity] of Object.entries(quantities)) {
    if (quantity <= 0) continue;
    const { productId } = parseLineKey(lineKey);
    const product = byId.get(productId);
    if (!product) continue;
    productSubtotal += product.price * quantity;
    productCompareSubtotal +=
      (product.compareAtPrice ?? product.price) * quantity;
  }

  const shippingCost =
    productSubtotal >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_COST_CENTS;

  const total = productSubtotal + shippingCost;
  const compareTotal = productCompareSubtotal + shippingCost;
  const savings = compareTotal - total;

  return {
    productSubtotal,
    productCompareSubtotal,
    shippingCost,
    shippingCompareAtCost: SHIPPING_COST_CENTS,
    total,
    compareTotal,
    savings,
    financingPerMonth: total / 12,
  };
}

export const lineItemsSchema = z.array(
  z.object({
    productId: z.string(),
    variantId: z.string().nullable(),
    quantity: z.number().int().positive(),
  }),
);

export function getLineItems(
  products: Product[],
  quantities: Record<string, number>,
): z.infer<typeof lineItemsSchema> {
  return Object.entries(quantities).flatMap(([quantityId, quantity]) => {
    if (quantity <= 0) return [];
    const { productId, variantId } = parseLineKey(quantityId);

    const product = products.find((p) => p.id === productId);
    if (!product) return [];

    return {
      productId,
      variantId,
      quantity,
    };
  });
}
