import type { WalletType } from "@/types/wallet";

/** ISO 7810 ID-1 — width / height. */
export const WALLETS_CARD_ASPECT_RATIO = 1.586;

/** Top info band height — must match stack step so headers stay visible. */
export const WALLETS_STACK_PEEK_RATIO = 0.36;

export function getWalletCardInfoHeight(cardHeight: number): number {
  return cardHeight * WALLETS_STACK_PEEK_RATIO;
}

export const WALLETS_STACK_CARD_RADIUS = "rounded-[28px]";

export const WALLETS_STACK_CONTAINER = "mx-auto w-full max-w-md md:max-w-lg";

export const WALLETS_STACK_SHELL = "relative w-full overflow-visible";

/** Room below stack so bottom card shadows are not clipped by scroll parents. */
export const WALLETS_STACK_SHADOW_BLEED_PX = 24;

export const WALLETS_STACK_FLOAT_LIFT_PX = 12;

export const WALLETS_STACK_EXPANDED_Z_INDEX = 100;

export const WALLETS_STACK_ANIMATION =
  "transition-[bottom,transform,box-shadow,opacity,filter] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]";

export const WALLETS_STACK_CARD_DIMMED = "opacity-80 saturate-[0.92]";

export const WALLETS_STACK_CARD_DIM_OVERLAY = [
  "pointer-events-none absolute inset-0 z-10",
  WALLETS_STACK_CARD_RADIUS,
  "bg-white/12 backdrop-blur-[8px]",
  "transition-[opacity,backdrop-filter] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
].join(" ");

export const WALLETS_STACK_DOTS = "mt-4 flex items-center justify-center gap-1.5";

export const WALLETS_STACK_DOT =
  "size-1.5 rounded-full bg-foreground/15 transition-colors";

export const WALLETS_STACK_DOT_ACTIVE = "bg-primary";

export const WALLETS_STACK_CARD_ORDER_LABEL = [
  "flex size-7 items-center justify-center rounded-full",
  "bg-black/35 text-sm font-bold tabular-nums text-white",
  "ring-1 ring-white/25 backdrop-blur-sm",
].join(" ");

export const WALLETS_STACK_TOTAL_ROW = [
  "flex w-full items-center justify-between gap-3",
  "rounded-2xl bg-muted/55 px-4 py-3.5",
  "shadow-[0_2px_12px_-4px_rgba(0,0,0,0.12)]",
  "dark:bg-muted/35",
].join(" ");

/** Fixed action FAB — opens menu for new card / transfer. */
export const WALLETS_FAB_CLUSTER = [
  "pointer-events-none fixed z-30",
  "bottom-[calc(var(--mobile-bottom-nav-offset)+0.5rem)]",
  "right-[calc(var(--mobile-chrome-gutter)+var(--mobile-safe-right))]",
  "md:bottom-6 md:right-6",
].join(" ");

export const WALLETS_FAB_BUTTON = [
  "pointer-events-auto flex size-12 items-center justify-center rounded-full",
  "shadow-[0_6px_22px_rgba(0,0,0,0.2)]",
  "transition-transform active:scale-95",
].join(" ");

export const WALLETS_FAB_PRIMARY = "bg-primary text-primary-foreground";

export const WALLETS_FAB_SECONDARY = [
  "bg-background text-foreground",
  "ring-1 ring-black/10 dark:ring-white/12",
].join(" ");

/** Scroll clearance above fixed wallet FABs. */
export const WALLETS_VIEW_BOTTOM_PADDING = "pb-24 md:pb-28";

export const WALLETS_STACK_ACTIONS = "grid grid-cols-2 gap-2.5";

export const WALLETS_STACK_ACTION_PRIMARY = [
  "h-11 gap-2 rounded-2xl font-semibold shadow-sm",
  "shadow-[0_4px_16px_-4px_rgba(0,0,0,0.2)]",
].join(" ");

export const WALLETS_STACK_ACTION_SECONDARY = [
  "h-11 gap-2 rounded-2xl border-0 bg-muted/70 font-semibold text-foreground/90",
  "shadow-[0_2px_10px_-4px_rgba(0,0,0,0.12)]",
  "hover:bg-muted/85 dark:bg-muted/45 dark:hover:bg-muted/55",
].join(" ");

const WALLET_GRADIENT_BY_TYPE: Record<WalletType, string> = {
  bank: "bg-linear-to-br from-[#5BABFF] via-[#4A97F5] to-[#3588EB]",
  cash: "bg-linear-to-br from-[#34C759] via-[#2DB84E] to-[#28A745]",
  ewallet: "bg-linear-to-br from-[#9B87FF] via-[#7B66FF] to-[#6A55F0]",
  other: "bg-linear-to-br from-[#5E6B7A] via-[#4A5568] to-[#3D4654]",
};

export { WALLET_GRADIENT_BY_TYPE };

export function getWalletStackMetrics(width: number): {
  cardHeight: number;
  step: number;
  stackHeight: number;
} {
  const cardHeight = width / WALLETS_CARD_ASPECT_RATIO;
  const step = cardHeight * WALLETS_STACK_PEEK_RATIO;

  return { cardHeight, step, stackHeight: cardHeight };
}

export function getWalletStackHeightPx(
  walletCount: number,
  cardHeight: number,
  step: number,
): number {
  if (walletCount <= 0) {
    return 0;
  }

  return cardHeight + (walletCount - 1) * step;
}
