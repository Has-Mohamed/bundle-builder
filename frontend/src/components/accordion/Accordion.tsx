import { stepDefinitions } from "../../data/steps";
import { useBuilderStore } from "../../store/builderStore";
import { AccordionStep } from "./AccordionStep";

export function Accordion() {
  const openStep = useBuilderStore((s) => s.openStep);
  const setOpenStep = useBuilderStore((s) => s.setOpenStep);
  const toggleStep = useBuilderStore((s) => s.toggleStep);
  console.log(openStep);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="md:hidden text-3xl px-5 mt-8 mb-5 font-bold text-[#1F1F1F] w-full text-center">
        Let’s get started!
      </h2>
      {stepDefinitions.map((step, index) => {
        const nextStep = stepDefinitions[index + 1];
        return (
          <AccordionStep
            key={step.id}
            step={step}
            totalSteps={stepDefinitions.length}
            isOpen={openStep === step.id}
            onToggle={() => toggleStep(step.id)}
            onNext={() => nextStep && setOpenStep(nextStep.id)}
            isLastStep={!nextStep}
            nextStepTitle={nextStep?.title}
          />
        );
      })}
    </div>
  );
}
