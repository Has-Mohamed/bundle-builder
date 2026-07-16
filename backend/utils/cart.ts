import type { Product } from "../types/domain";
import { parseLineKey } from "./lineKey";

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
