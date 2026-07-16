import { z } from "zod";

export const stepIdSchema = z.enum([
  "cameras",
  "plan",
  "sensors",
  "protection",
]);
export const categorySchema = z.enum([
  "Cameras",
  "Sensors",
  "Accessories",
  "Plan",
]);

export const variantSchema = z.object({
  id: z.string(),
  label: z.string(),
  swatch: z.string(),
});

export const productSchema = z.object({
  id: z.string(),
  stepId: stepIdSchema,
  category: categorySchema,
  title: z.string(),
  description: z.string().optional(),
  image: z.string(),
  learnMoreUrl: z.string().optional(),
  badge: z.string().optional(),
  price: z.number().int().nonnegative(),
  compareAtPrice: z.number().int().nonnegative().optional(),
  billingSuffix: z.string().optional(),
  variants: z.array(variantSchema).optional(),
  hasQuantity: z.boolean().optional(),
  minQuantity: z.number().int().nonnegative().optional(),
  maxQuantity: z.number().int().positive().optional(),
});

export const productCatalogSchema = z.array(productSchema);

/**
 * Shape written to localStorage by "Save my system for later".
 * Versioned so a future schema change can migrate or discard old saves
 * instead of crashing on them.
 */
export const persistedStateSchema = z.object({
  version: z.literal(1),
  quantities: z.record(z.string(), z.number().int().nonnegative()),
  activeVariant: z.record(z.string(), z.string()),
  savedAt: z.string(),
});

export type PersistedState = z.infer<typeof persistedStateSchema>;
