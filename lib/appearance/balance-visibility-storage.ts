import {
  BALANCE_VISIBILITY_STORAGE_KEY,
  DEFAULT_BALANCE_VISIBLE,
} from "@/config/balance-visibility";

export function readStoredBalanceVisible(): boolean {
  if (typeof window === "undefined") {
    return DEFAULT_BALANCE_VISIBLE;
  }

  const stored = window.localStorage.getItem(BALANCE_VISIBILITY_STORAGE_KEY);
  if (stored === null) {
    return DEFAULT_BALANCE_VISIBLE;
  }

  return stored === "true";
}

export function writeStoredBalanceVisible(visible: boolean): void {
  window.localStorage.setItem(
    BALANCE_VISIBILITY_STORAGE_KEY,
    String(visible),
  );
}
