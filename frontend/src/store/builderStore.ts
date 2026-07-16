import { create } from "zustand";
import type { Product, StepId } from "../types/domain";
import productsData from "../data/products.json";
import { seedActiveVariant, seedOpenStep, seedQuantities } from "../data/seed";
import { productCatalogSchema } from "../data/schema";
import { makeLineKey } from "../lib/lineKey";
import { clampQuantity, getActiveVariantId } from "./selectors";
import { hasSavedSystem, loadSystem, saveSystem } from "./persistence";

const products: Product[] = productCatalogSchema.parse(
  productsData,
) as Product[];

interface BuilderState {
  products: Product[];
  quantities: Record<string, number>;
  activeVariant: Record<string, string>;
  openStep: StepId | "none";
  /** true right after a saved system was restored on load, for an optional "restored" hint in the UI */
  restoredFromSave: boolean;
  lastSavedAt: string | null;
  setProducts: (products: Product[], withDefaultValues?: boolean) => void;
  setQuantity: (
    productId: string,
    variantId: string | null | undefined,
    quantity: number,
  ) => void;
  selectVariant: (productId: string, variantId: string) => void;
  selectPlan: (productId: string) => void;
  setOpenStep: (step: StepId) => void;
  toggleStep: (step: StepId) => void;
  saveForLater: () => void;
  startOver: () => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  products: [],
  quantities: {},
  activeVariant: {},
  openStep: seedOpenStep,
  restoredFromSave: false,
  lastSavedAt: null,

  setProducts: (products: Product[], withDefaultValues = false) => {
    set({
      products: products,
      quantities: withDefaultValues ? { ...seedQuantities } : {},
      activeVariant: withDefaultValues ? { ...seedActiveVariant } : {},
    });
  },
  setQuantity: (productId, variantId, quantity) => {
    const product = get().products.find((p) => p.id === productId);
    if (!product) return;
    const resolvedVariantId =
      variantId ?? getActiveVariantId(get().activeVariant, product);
    const key = makeLineKey(productId, resolvedVariantId);
    const clamped = clampQuantity(product, quantity);

    set((state) => ({
      quantities: { ...state.quantities, [key]: clamped },
    }));
  },

  selectVariant: (productId, variantId) => {
    set((state) => ({
      activeVariant: { ...state.activeVariant, [productId]: variantId },
    }));
  },

  /** Plan products are single-select: choosing one clears any other plan's quantity. */
  selectPlan: (productId) => {
    const product = get().products.find((p) => p.id === productId);
    if (!product) return;

    set((state) => {
      const quantities = { ...state.quantities };
      for (const p of products) {
        if (p.category === "Plan") {
          quantities[makeLineKey(p.id)] = p.id === productId ? 1 : 0;
        }
      }
      return { quantities };
    });
  },

  setOpenStep: (step) => set({ openStep: step }),

  toggleStep: (step) =>
    set((state) => ({
      openStep: state.openStep === step ? "none" : step,
    })),

  saveForLater: () => {
    const { quantities, activeVariant } = get();
    saveSystem({ quantities, activeVariant });
    set({ lastSavedAt: new Date().toISOString() });
  },

  startOver: () => {
    set({
      quantities: { ...seedQuantities },
      activeVariant: { ...seedActiveVariant },
      openStep: seedOpenStep,
      restoredFromSave: false,
    });
  },
}));

/** Called once on app boot to restore a save, if one exists and is valid. */
export function hydrateBuilderStore(): void {
  if (!hasSavedSystem()) return;
  const saved = loadSystem();
  if (!saved) return;

  useBuilderStore.setState({
    quantities: saved.quantities,
    activeVariant: saved.activeVariant,
    restoredFromSave: true,
    lastSavedAt: saved.savedAt,
  });
}
