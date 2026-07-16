import { resolveImageUrl } from "../../lib/assets";
import { cn } from "../../lib/cn";
import { useBuilderStore } from "../../store/builderStore";
import type { ResolvedLineItem } from "../../store/selectors";
import { PriceTag } from "../product/PriceTag";
import { QuantityStepper } from "../product/QuantityStepper";

export function ReviewLineItem({ item }: { item: ResolvedLineItem }) {
  const setQuantity = useBuilderStore((s) => s.setQuantity);
  const { product, variantId, variantLabel, quantity } = item;
  const isPlan = product.hasQuantity === false;

  const planTitle = (
    <>
      Cam <span className="text-brand-600">{product.title}</span>
    </>
  );

  return (
    <div className="flex items-center gap-3 py-3">
      <img
        src={resolveImageUrl(product.image)}
        alt=""
        className={cn("size-11 shrink-0 rounded-lg bg-white object-cover", {
          "size-6 bg-transparent rounded-none object-fill": isPlan,
        })}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn("text-xs md:text-sm font-medium text-ink", {
            "font-bold text-sm md:text-base": isPlan,
          })}
        >
          {isPlan ? planTitle : product.title}
        </p>
        {variantLabel && (
          <p className="text-xs text-ink-muted">{variantLabel}</p>
        )}
      </div>

      {!isPlan && (
        <QuantityStepper
          variant="review"
          quantity={quantity}
          min={product.minQuantity}
          max={product.maxQuantity}
          label={`${product.title}${variantLabel ? ` ${variantLabel}` : ""}`}
          onChange={(next) => setQuantity(product.id, variantId, next)}
        />
      )}

      <PriceTag
        variant="review"
        price={item.lineTotal}
        compareAtPrice={
          item.lineCompareTotal > item.lineTotal
            ? item.lineCompareTotal
            : undefined
        }
        billingSuffix={product.billingSuffix}
      />
    </div>
  );
}
