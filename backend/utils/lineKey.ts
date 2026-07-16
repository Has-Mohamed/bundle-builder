/**
 * Cart quantities are keyed by `${productId}:${variantId}` (variant-less
 * products use the literal string "default" as their variant id). This is
 * what lets red and blue of the same product carry independent counts
 * without any special-casing elsewhere in the app.
 */
const NO_VARIANT = 'default';

export function makeLineKey(productId: string, variantId?: string | null): string {
  return `${productId}:${variantId ?? NO_VARIANT}`;
}

export function parseLineKey(lineKey: string): { productId: string; variantId: string | null } {
  const separatorIndex = lineKey.lastIndexOf(':');
  const productId = lineKey.slice(0, separatorIndex);
  const rawVariantId = lineKey.slice(separatorIndex + 1);
  return {
    productId,
    variantId: rawVariantId === NO_VARIANT ? null : rawVariantId,
  };
}
