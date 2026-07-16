import { useMemo } from "react";
import { useBuilderStore } from "../store/builderStore";
import {
  cartTotals,
  getActiveVariantId,
  getProductQuantity,
  getQuantity,
  lineItemsForCategory,
  selectedCountForStep,
} from "../store/selectors";
import type { Category, Product, StepId } from "../types/domain";

export function useProductsByStep(stepId: StepId): Product[] {
  const products = useBuilderStore((s) => s.products);
  return useMemo(
    () => products.filter((p) => p.stepId === stepId),
    [products, stepId],
  );
}

export function useStepSelectedCount(stepId: StepId): number {
  const products = useBuilderStore((s) => s.products);
  const quantities = useBuilderStore((s) => s.quantities);
  return useMemo(
    () => selectedCountForStep(products, quantities, stepId),
    [products, quantities, stepId],
  );
}

export function useActiveVariantId(product: Product): string | null {
  const activeVariant = useBuilderStore((s) => s.activeVariant);
  return getActiveVariantId(activeVariant, product);
}

/** The quantity currently shown on a product's card (its active variant's count). */
export function useCardQuantity(product: Product): {
  variantQuantity: number;
  productQuantity: number;
} {
  const quantities = useBuilderStore((s) => s.quantities);
  const activeVariantId = useActiveVariantId(product);
  return {
    variantQuantity: getQuantity(quantities, product.id, activeVariantId),
    productQuantity: getProductQuantity(quantities, product.id),
  };
}

export function useCategoryLineItems(category: Category) {
  const products = useBuilderStore((s) => s.products);
  const quantities = useBuilderStore((s) => s.quantities);
  return useMemo(
    () => lineItemsForCategory(products, quantities, category),
    [products, quantities, category],
  );
}

export function useCartTotals() {
  const products = useBuilderStore((s) => s.products);
  const quantities = useBuilderStore((s) => s.quantities);
  return useMemo(
    () => cartTotals(products, quantities),
    [products, quantities],
  );
}
