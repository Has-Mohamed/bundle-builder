import type { Money } from '../types/domain';

/** 2798 -> "$27.98" */
export function formatMoney(cents: Money): string {
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

export function formatMoneyPerPeriod(cents: Money, suffix?: string): string {
  return suffix ? `${formatMoney(cents)}${suffix}` : formatMoney(cents);
}
