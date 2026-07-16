import { cn } from "../../lib/cn";
import type { StepDefinition } from "../../types/domain";
import { ChevronIcon, stepIcons } from "../icons";

interface StepHeaderProps {
  step: StepDefinition;
  totalSteps: number;
  isOpen: boolean;
  selectedCount: number;
  onToggle: () => void;
  isLastStep: boolean;
}

export function StepHeader({
  step,
  totalSteps,
  isOpen,
  selectedCount,
  onToggle,
  isLastStep,
}: StepHeaderProps) {
  const Icon = stepIcons[step.id];

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="flex w-full flex-col justify-between text-left"
    >
      <p className="text-[11px] font-medium uppercase ms-[15px] tracking-wide text-ink-muted pb-[5px]">
        Step {step.order} of {totalSteps}
      </p>

      <div
        className={cn(
          "flex items-center border-[#1F1F1F] border-y-[0.5px] justify-between gap-1.5 w-full text-sm font-medium text-brand-600",
          "px-[15px] py-5",

          {
            "border-b-0 pb-[15px]": isOpen,
            "max-md:border-b-0!": isLastStep && !isOpen,
          },
        )}
      >
        <div className="mt-1 flex items-center gap-2">
          <Icon className="size-[26px]  text-ink-muted" />
          <h2 className="md:text-[22px] text-lg font-semibold text-ink">
            {step.title}
          </h2>
        </div>
        <div className="flex items-center gap-[5px]">
          {<span>{selectedCount} selected</span>}
          <ChevronIcon direction={isOpen ? "up" : "down"} className="size-3" />
        </div>
      </div>
    </button>
  );
}
