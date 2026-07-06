import { HIDDEN_BALANCE_LABEL } from "@/config/balance-visibility";
import { formatIdr, formatSignedIdrDelta } from "@/lib/finance/format-currency";

export function formatProtectedIdr(amount: number, visible: boolean): string {
  return visible ? formatIdr(amount) : HIDDEN_BALANCE_LABEL;
}

export function formatProtectedSignedIdrDelta(
  delta: number,
  visible: boolean,
): string {
  return visible ? formatSignedIdrDelta(delta) : HIDDEN_BALANCE_LABEL;
}

export function formatProtectedSignedIdr(
  amount: number,
  visible: boolean,
): string {
  if (!visible) {
    return HIDDEN_BALANCE_LABEL;
  }

  const sign = amount >= 0 ? "+" : "−";
  return `${sign}${formatIdr(Math.abs(amount))}`;
}
