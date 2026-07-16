import type { Category } from "../../types/domain";
import { useCategoryLineItems } from "../../hooks/useBuilder";
import { ReviewLineItem } from "./ReviewLineItem";

export function ReviewCategoryGroup({ category }: { category: Category }) {
  const items = useCategoryLineItems(category);
  if (items.length === 0) return null;

  return (
    <div className="border-b border-panel-border py-1 last:border-b-0">
      <p className="pt-2 text-xs font-medium uppercase tracking-wide text-[#A8B2BD]">
        {category}
      </p>
      <div className="divide-y divide-panel-border/70">
        {items.map((item) => (
          <ReviewLineItem key={item.lineKey} item={item} />
        ))}
      </div>
    </div>
  );
}
