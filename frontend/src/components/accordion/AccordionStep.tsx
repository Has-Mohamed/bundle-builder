import type { StepDefinition } from "../../types/domain";
import {
  useProductsByStep,
  useStepSelectedCount,
} from "../../hooks/useBuilder";
import { ProductCard } from "../product/ProductCard";
import { StepHeader } from "./StepHeader";
import { cn } from "../../lib/cn";

interface AccordionStepProps {
  step: StepDefinition;
  totalSteps: number;
  isOpen: boolean;
  onToggle: () => void;
  onNext: () => void;
  isLastStep: boolean;
  nextStepTitle?: string;
}

export function AccordionStep({
  step,
  totalSteps,
  isOpen,
  onToggle,
  onNext,
  isLastStep,
  nextStepTitle,
}: AccordionStepProps) {
  const products = useProductsByStep(step.id);
  const selectedCount = useStepSelectedCount(step.id);

  return (
    <div className={cn({ "md:rounded-[10px] bg-panel pt-[15px]": isOpen })}>
      <StepHeader
        step={step}
        totalSteps={totalSteps}
        isOpen={isOpen}
        selectedCount={selectedCount}
        onToggle={onToggle}
        isLastStep={isLastStep}
      />

      {isOpen && (
        <div className="px-[15px] pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[15px] w-full">
            {products.map((product, index) => {
              const isTrailingOrphan =
                index === products.length - 1 && products.length % 2 === 1;
              return (
                <div
                  key={product.id}
                  className={cn("h-full", {
                    "sm:col-span-2 sm:flex sm:justify-center": isTrailingOrphan,
                  })}
                >
                  <div
                    className={cn("h-full", {
                      "sm:w-[calc(50%-0.375rem)]": isTrailingOrphan,
                    })}
                  >
                    <ProductCard product={product} />
                  </div>
                </div>
              );
            })}
          </div>

          {!isLastStep && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={onNext}
                className="rounded-[7px] border border-brand-600 px-6 py-[5px] text-lg font-semibold text-brand-600 transition-colors hover:bg-brand-50"
              >
                Next: {nextStepTitle}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
