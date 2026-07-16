const WALLET_STACK_ORDER_STORAGE_KEY = "wang:wallet-stack-order";

export function readWalletStackOrder(): string[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(WALLET_STACK_ORDER_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeWalletStackOrder(order: string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    WALLET_STACK_ORDER_STORAGE_KEY,
    JSON.stringify(order),
  );
}
