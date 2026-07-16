import { cva, type VariantProps } from "class-variance-authority";
import { MinusIcon, PlusIcon } from "../icons";
import { cn } from "../../lib/cn";

const quantityStepperVariants = cva(
  "flex items-center justify-center size-5 rounded transition-colors hover:enabled:border-brand-600 hover:enabled:text-brand-600",
  {
    variants: {
      variant: {
        card: "bg-[#F0F4F7] text-[#525963] disabled:bg-[#FFFFFF] disabled:text-[#CED6DE] disabled:border-2 disabled:border-[#E6EBF0] disabled:cursor-not-allowed",
        review:
          "bg-[#FFFFFF] text-[#575757] disabled:bg-[#F1F1F2] disabled:border disabled:border-[#CED6DE] disabled:cursor-not-allowed",
      },
    },
    defaultVariants: {
      variant: "card",
    },
  },
);

interface QuantityStepperProps {
  quantity: number;
  min?: number;
  max?: number;
  onChange: (quantity: number) => void;
  label: string;
}

export function QuantityStepper({
  quantity,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  onChange,
  label,
  variant,
}: QuantityStepperProps & VariantProps<typeof quantityStepperVariants>) {
  const canDecrement = quantity > min;
  const canIncrement = quantity < max;

  return (
    <div
      className="inline-flex items-center gap-2.5 p-2"
      role="group"
      aria-label={`${label} quantity`}
    >
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        disabled={!canDecrement}
        aria-label={`Decrease ${label} quantity`}
        className={cn(quantityStepperVariants({ variant }))}
      >
        <MinusIcon className="h-3.5 w-3.5" />
      </button>
      <span
        className="w-4 text-center text-sm font-medium tabular-nums"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={!canIncrement}
        aria-label={`Increase ${label} quantity`}
        className={cn(quantityStepperVariants({ variant }))}
      >
        <PlusIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
