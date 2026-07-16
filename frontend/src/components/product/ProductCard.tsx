import { useBuilderStore } from "../../store/builderStore";
import { useActiveVariantId, useCardQuantity } from "../../hooks/useBuilder";
import type { Product } from "../../types/domain";
import { Badge, PriceTag } from "./PriceTag";
import { QuantityStepper } from "./QuantityStepper";
import { VariantSelector } from "./VariantSelector";
import { cn } from "../../lib/cn";
import { resolveImageUrl } from "../../lib/assets";

export function ProductCard({ product }: { product: Product }) {
  const activeVariantId = useActiveVariantId(product);
  const { variantQuantity, productQuantity } = useCardQuantity(product);
  const setQuantity = useBuilderStore((s) => s.setQuantity);
  const selectVariant = useBuilderStore((s) => s.selectVariant);
  const selectPlan = useBuilderStore((s) => s.selectPlan);

  const isPlan = product.hasQuantity === false;
  const isSelected = productQuantity > 0;

  return (
    <div
      className={cn(
        "flex gap-3 flex-col md:flex-row h-full items-center",
        "relative rounded-[10px]  bg-white p-3 transition-colors border-line",
        {
          "border-2 border-[#4E2FD2B2]": isSelected,
        },
      )}
    >
      {product.badge && <Badge>{product.badge}</Badge>}

      <div className="md:max-w-[101px] shrink-0 flex-1">
        <img
          src={resolveImageUrl(product.image)}
          alt=""
          className={cn(
            "lg:max-w-[101px] w-full shrink-0 rounded-lg object-cover ",
          )}
        />
      </div>

      <div className="space-y-2.5 min-w-0 flex-1 gap-2.5">
        <div className="min-w-0 flex-1">
          <h3 className=" font-semibold text-ink">{product.title}</h3>
          <div className="flex justify-start items-start">
            {product.description && (
              <p className="mt-0.5 text-xs leading-snug text-ink-muted">
                {product.description}
                {product.learnMoreUrl && (
                  <a
                    href={product.learnMoreUrl}
                    className="ms-1 mt-1 inline-block text-xs font-medium text-[#0000EE] underline"
                  >
                    Learn More
                  </a>
                )}
              </p>
            )}
          </div>
        </div>

        {product.variants && product.variants.length > 0 && (
          <VariantSelector
            variants={product.variants}
            activeVariantId={activeVariantId}
            onSelect={(variantId) => selectVariant(product.id, variantId)}
          />
        )}

        <div className="mt-auto flex items-center justify-between">
          {isPlan ? (
            <button
              type="button"
              onClick={() => selectPlan(product.id)}
              aria-pressed={isSelected}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                isSelected
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-line text-ink-muted hover:border-brand-500 hover:text-brand-600"
              }`}
            >
              {isSelected ? "Selected" : "Choose plan"}
            </button>
          ) : (
            <QuantityStepper
              variant="card"
              quantity={variantQuantity}
              min={product.minQuantity}
              max={product.maxQuantity}
              label={product.title}
              onChange={(quantity) =>
                setQuantity(product.id, activeVariantId, quantity)
              }
            />
          )}
          <PriceTag
            variant="card"
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            billingSuffix={product.billingSuffix}
          />
        </div>
      </div>
    </div>
  );
}
