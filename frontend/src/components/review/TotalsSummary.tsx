import { useState } from "react";
import { useBuilderStore } from "../../store/builderStore";
import { useCartTotals } from "../../hooks/useBuilder";
import { formatMoney } from "../../lib/money";
import { TruckIcon } from "../icons";
import useCheckout from "../../hooks/useCheckout";

export function TotalsSummary() {
  const totals = useCartTotals();
  const saveForLater = useBuilderStore((s) => s.saveForLater);
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = () => {
    saveForLater();
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 2500);
  };

  const { checkout, isLoading } = useCheckout();

  const hasSavings = totals.savings > 0;

  return (
    <div className="pt-2">
      <div className="flex items-center justify-between border-t border-panel-border pt-3">
        <div className="flex items-center gap-2 text-sm text-ink">
          <div className="bg-white p-1 rounded">
            <TruckIcon className="size-[29px] text-brand-600" />
          </div>
          Fast Shipping
        </div>
        <div className="flex flex-col items-end">
          {totals.shippingCost === 0 && (
            <span className="text-sm text-ink-muted line-through">
              {formatMoney(totals.shippingCompareAtCost)}
            </span>
          )}
          <span className="text-sm font-semibold text-brand-600">
            {totals.shippingCost === 0
              ? "FREE"
              : formatMoney(totals.shippingCost)}
          </span>
        </div>
      </div>

      <div className="flex gap-3 py-4 flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={"/images/review/satisfaction-badge.png"}
            alt="satisfaction badge"
            className="size-[78px] shrink-0 text-brand-600"
          />
        </div>

        <div className="flex flex-col gap-1 items-end">
          <span className="rounded-[3px] bg-brand-600 px-2.5 py-1 tracking-tight text-xs font-medium text-white">
            as low as {formatMoney(Math.round(totals.financingPerMonth))}/mo
          </span>
          <div className="flex items-baseline gap-2">
            {hasSavings && (
              <span className="text-lg font-medium text-ink-muted line-through">
                {formatMoney(totals.compareTotal)}
              </span>
            )}
            <span className="text-2xl font-bold text-brand-700">
              {formatMoney(totals.total)}
            </span>
          </div>
        </div>
      </div>

      {hasSavings && (
        <p className="pb-1 text-center text-xs font-medium text-[#0AA288]">
          Congrats! You're saving {formatMoney(totals.savings)} on your security
          bundle!
        </p>
      )}

      <button
        type="button"
        className="w-full rounded cursor-pointer bg-brand-600 py-3.5 px-4 text-lg font-bold text-white transition-colors hover:bg-brand-700"
        onClick={() => checkout()}
        disabled={isLoading}
      >
        <div className="flex items-center justify-center gap-2">
          {isLoading && (
            <div className="size-7 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          )}
          {!isLoading && "Checkout"}
        </div>
      </button>

      <div className="pt-3 text-center">
        <button
          type="button"
          onClick={handleSave}
          className="text-xs font-medium text-ink underline decoration-ink-muted underline-offset-2 hover:text-brand-600"
        >
          Save my system for later
        </button>
        {justSaved && (
          <p className="mt-1 text-xs text-success">
            Saved — come back anytime and it'll be here.
          </p>
        )}
      </div>
    </div>
  );
}
