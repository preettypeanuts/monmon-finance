import type { WalletType, WalletWithBalance } from "@/types/wallet";

const STACK_TYPE_ORDER: Record<WalletType, number> = {
  bank: 0,
  ewallet: 1,
  cash: 2,
  other: 3,
};

function compareStackCandidates(
  left: WalletWithBalance,
  right: WalletWithBalance,
): number {
  const typeDelta = STACK_TYPE_ORDER[left.type] - STACK_TYPE_ORDER[right.type];
  if (typeDelta !== 0) {
    return typeDelta;
  }

  return right.createdAt.localeCompare(left.createdAt);
}

/** Front of stack first; default wallet sits at the back. */
export function buildInitialWalletStackOrder(
  wallets: WalletWithBalance[],
): string[] {
  const defaultWallet = wallets.find((wallet) => wallet.isDefault);
  const others = wallets
    .filter((wallet) => !wallet.isDefault)
    .sort(compareStackCandidates);

  const order = others.map((wallet) => wallet.id);

  if (defaultWallet) {
    order.push(defaultWallet.id);
  }

  return order;
}

export function mergeWalletStackOrder(
  storedOrder: string[] | null,
  wallets: WalletWithBalance[],
): string[] {
  const initial = buildInitialWalletStackOrder(wallets);
  if (wallets.length === 0) {
    return [];
  }

  if (!storedOrder?.length) {
    return initial;
  }

  const walletIds = new Set(wallets.map((wallet) => wallet.id));
  const preserved = storedOrder.filter((id) => walletIds.has(id));
  const missing = wallets
    .filter((wallet) => !preserved.includes(wallet.id))
    .sort(compareStackCandidates)
    .map((wallet) => wallet.id);

  return [...missing, ...preserved];
}

export function reorderWalletStackOrder(
  order: string[],
  fromIndex: number,
  toIndex: number,
): string[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= order.length ||
    toIndex >= order.length
  ) {
    return order;
  }

  const next = [...order];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

/** Maps each stack index to its animated layout slot while dragging. */
export function getWalletStackPreviewLayoutIndices(
  count: number,
  fromIndex: number,
  dropIndex: number,
): number[] {
  if (count <= 0) {
    return [];
  }

  if (fromIndex === dropIndex) {
    return Array.from({ length: count }, (_, index) => index);
  }

  const previewOrder = reorderWalletStackOrder(
    Array.from({ length: count }, (_, index) => String(index)),
    fromIndex,
    dropIndex,
  ).map(Number);

  const layoutIndexByStackIndex = new Array<number>(count);
  for (let layoutIndex = 0; layoutIndex < count; layoutIndex += 1) {
    layoutIndexByStackIndex[previewOrder[layoutIndex]] = layoutIndex;
  }

  return layoutIndexByStackIndex;
}

export function orderWalletsByStack(
  wallets: WalletWithBalance[],
  order: string[],
): WalletWithBalance[] {
  const walletById = new Map(wallets.map((wallet) => [wallet.id, wallet]));

  return order
    .map((id) => walletById.get(id))
    .filter((wallet): wallet is WalletWithBalance => wallet !== undefined);
}

export interface WalletStackDropInput {
  fromIndex: number;
  offsetY: number;
  step: number;
  count: number;
}

/** Card bottom offset after drag — mirrors CSS `bottom` + `translateY`. */
export function getWalletStackEffectiveBottom(
  fromIndex: number,
  offsetY: number,
  step: number,
): number {
  return fromIndex * step - offsetY;
}

/** Nearest stack slot for a dragged card bottom offset. */
export function resolveNearestWalletStackSlot(
  effectiveBottom: number,
  step: number,
  count: number,
  offsetY = 0,
): number {
  if (count <= 1 || step <= 0) {
    return 0;
  }

  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < count; index += 1) {
    const distance = Math.abs(effectiveBottom - index * step);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
      continue;
    }

    if (distance !== bestDistance) {
      continue;
    }

    if (offsetY > 0 && index < bestIndex) {
      bestIndex = index;
    } else if (offsetY < 0 && index > bestIndex) {
      bestIndex = index;
    }
  }

  return bestIndex;
}

/** Drop target from dragged card layout position. */
export function resolveWalletStackDropIndex(
  input: WalletStackDropInput,
): number {
  const { fromIndex, offsetY, step, count } = input;

  if (count <= 1 || step <= 0) {
    return fromIndex;
  }

  const minimumDrag = step * 0.12;
  if (Math.abs(offsetY) < minimumDrag) {
    return fromIndex;
  }

  const effectiveBottom = getWalletStackEffectiveBottom(
    fromIndex,
    offsetY,
    step,
  );

  return resolveNearestWalletStackSlot(
    effectiveBottom,
    step,
    count,
    offsetY,
  );
}

/** Display position: 1 = top/back peek, count = front/bottom card. */
export function getWalletStackDisplayPosition(
  stackIndex: number,
  count: number,
): number {
  return count - stackIndex;
}

export function getWalletStackIndexFromDisplayPosition(
  position: number,
  count: number,
): number {
  return count - position;
}
