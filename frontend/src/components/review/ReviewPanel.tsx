import { useBuilderStore } from "../../store/builderStore";
import { ReviewCategoryGroup } from "./ReviewCategoryGroup";
import { TotalsSummary } from "./TotalsSummary";

const CATEGORY_ORDER = ["Cameras", "Sensors", "Accessories", "Plan"] as const;

export function ReviewPanel() {
  const restoredFromSave = useBuilderStore((s) => s.restoredFromSave);

  return (
    <aside className="md:rounded-panel bg-panel p-5 lg:sticky lg:top-6">
      <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">
        Review
      </p>
      <h1 className="mt-1 text-[22px] font-semibold text-ink">
        Your security system
      </h1>
      <p className="mt-1 text-sm text-ink-muted">
        Review your personalized protection system designed to keep what matters
        most safe.
      </p>

      {restoredFromSave && (
        <p className="mt-3 rounded-lg bg-brand-100 px-3 py-2 text-xs font-medium text-brand-700">
          Welcome back — we restored your saved system.
        </p>
      )}

      <div className="mt-4">
        {CATEGORY_ORDER.map((category) => (
          <ReviewCategoryGroup key={category} category={category} />
        ))}
      </div>

      <TotalsSummary />
    </aside>
  );
}
