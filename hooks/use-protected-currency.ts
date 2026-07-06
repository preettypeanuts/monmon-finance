"use client";

import { useCallback } from "react";

import { useAppearance } from "@/components/shared/appearance-provider";
import { HIDDEN_BALANCE_LABEL } from "@/config/balance-visibility";
import {
  formatProtectedIdr,
  formatProtectedSignedIdr,
  formatProtectedSignedIdrDelta,
} from "@/lib/finance/format-protected-currency";
import { formatIdr } from "@/lib/finance/format-currency";

export function useProtectedCurrency() {
  const { balanceVisible, toggleBalanceVisibility } = useAppearance();

  const formatAmount = useCallback(
    (amount: number) => formatProtectedIdr(amount, balanceVisible),
    [balanceVisible],
  );

  const formatSignedAmount = useCallback(
    (amount: number) => formatProtectedSignedIdr(amount, balanceVisible),
    [balanceVisible],
  );

  const formatSignedDelta = useCallback(
    (delta: number) => formatProtectedSignedIdrDelta(delta, balanceVisible),
    [balanceVisible],
  );

  const formatExpenseAmount = useCallback(
    (amount: number) =>
      balanceVisible ? `−${formatIdr(amount)}` : HIDDEN_BALANCE_LABEL,
    [balanceVisible],
  );

  return {
    balanceVisible,
    toggleBalanceVisibility,
    formatAmount,
    formatSignedAmount,
    formatSignedDelta,
    formatExpenseAmount,
  };
}
