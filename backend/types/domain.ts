/**
 * Domain types for the bundle builder.
 *
 * Money is always stored in integer cents to avoid floating point
 * rounding issues when summing/discounting across many line items.
 */
export type Money = number;

export type StepId = "cameras" | "plan" | "sensors" | "protection";

export type Category = "Cameras" | "Sensors" | "Accessories" | "Plan";

export interface Variant {
  id: string;
  label: string;
  /** hex color for the swatch, or an image path if the swatch is a thumbnail */
  swatch: string;
}

export interface Product {
  id: string;
  stepId: StepId;
  category: Category;
  title: string;
  description?: string;
  image: string;
  learnMoreUrl?: string;
  /** e.g. "Save 22%" — omitted for products with no discount badge */
  badge?: string;
  price: Money;
  compareAtPrice?: Money;
  /** billing suffix for subscription-style products, e.g. "/mo" */
  billingSuffix?: string;
  /** absent = the product has no color/variant selector */
  variants?: Variant[];
  /**
   * false only for subscription/plan products, which are chosen (radio-style,
   * one active plan at a time) rather than counted. Everything else uses the
   * normal quantity stepper. Defaults to true when omitted.
   */
  hasQuantity?: boolean;
  /** stepper floor, defaults to 0 */
  minQuantity?: number;
  /** stepper ceiling, defaults to unlimited. Plans use 1 (single unit). */
  maxQuantity?: number;
}
