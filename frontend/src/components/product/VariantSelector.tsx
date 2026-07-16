import type { Variant } from "../../types/domain";

interface VariantSelectorProps {
  variants: Variant[];
  activeVariantId: string | null;
  onSelect: (variantId: string) => void;
}

export function VariantSelector({
  variants,
  activeVariantId,
  onSelect,
}: VariantSelectorProps) {
  return (
    <div
      className="flex flex-wrap gap-[6px]"
      role="radiogroup"
      aria-label="Color"
    >
      {variants.map((variant) => {
        const isActive = variant.id === activeVariantId;
        return (
          <button
            key={variant.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelect(variant.id)}
            className={`flex items-center gap-1 rounded-xs border px-[7px] py-[5px] text-[10px] font-medium transition-colors ${
              isActive
                ? "border-[#0AA288] bg-brand-50 text-ink"
                : "border-line text-ink-muted hover:border-ink-muted"
            }`}
          >
            <span
              className="h-4 w-4 rounded-full border border-black/10"
              style={{ backgroundColor: variant.swatch }}
              aria-hidden="true"
            />
            {variant.label}
          </button>
        );
      })}
    </div>
  );
}
