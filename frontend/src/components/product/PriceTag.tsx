import type { ReactNode } from "react";
import { formatMoney } from "../../lib/money";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const priceTagVariants = cva(
  "flex items-end flex-col leading-none [&_.compare-at]:line-through ",
  {
    variants: {
      variant: {
        card: "gap-[3px] [&_.compare-at]:text-[#D8392B]  [&_.main-price]:text-[#575757]",
        review:
          "text-sm [&_.main-price]:font-semibold [&_.main-price]:text-brand-600 [&_.compare-at]:text-[#6F7882] [&_.compare-at]:font-medium",
      },
    },
    defaultVariants: {
      variant: "card",
    },
  },
);

interface PriceTagProps {
  price: number;
  compareAtPrice?: number;
  billingSuffix?: string;
}

export function PriceTag({
  price,
  compareAtPrice,
  billingSuffix = "",
  variant,
}: PriceTagProps & VariantProps<typeof priceTagVariants>) {
  const hasDiscount = compareAtPrice !== undefined && compareAtPrice > price;

  return (
    <div className={cn(priceTagVariants({ variant }))}>
      {hasDiscount && (
        <span className="compare-at ">
          {formatMoney(compareAtPrice)}
          {billingSuffix}
        </span>
      )}
      <span className="main-price">
        {price === 0 ? "FREE" : `${formatMoney(price)}${billingSuffix}`}
      </span>
    </div>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white">
      {children}
    </span>
  );
}
