"use client";

import { WalletInstitutionLogo } from "@/components/wallets/wallet-institution-logo";
import { WalletStackCardOrderLabel } from "@/components/wallets/wallet-stack-card-order-label";
import { WalletStackCardOrnaments } from "@/components/wallets/wallet-stack-card-ornaments";
import {
  WALLETS_STACK_ANIMATION,
  WALLETS_STACK_CARD_DIM_OVERLAY,
  WALLETS_STACK_CARD_DIMMED,
  WALLETS_STACK_CARD_RADIUS,
  WALLETS_STACK_EXPANDED_Z_INDEX,
  WALLETS_STACK_FLOAT_LIFT_PX,
  getWalletCardInfoHeight,
} from "@/config/wallets-stack";
import {
  WALLET_TYPE_LABELS,
  WALLETS_DEFAULT_BADGE,
} from "@/config/wallet-labels";
import { CaretRightIcon, DotsThreeVerticalIcon } from "@/lib/icons";
import { getWalletCardBackground } from "@/lib/wallets/get-wallet-card-background";
import { resolveWalletIconSlug } from "@/lib/wallets/resolve-wallet-icon-slug";
import { cn } from "@/lib/utils";
import type { WalletWithBalance } from "@/types/wallet";

interface WalletsStackCardProps {
  wallet: WalletWithBalance;
  cardHeight: number;
  stackIndex: number;
  stackCount: number;
  step: number;
  isExpanded: boolean;
  isDimmed: boolean;
  isDragging: boolean;
  isShiftPreview?: boolean;
  dragOffsetY: number;
  orderLabelPosition?: number | null;
  clickDisabled?: boolean;
  onActivate: () => void;
  onOpen: () => void;
  onDragStart: (event: React.PointerEvent<HTMLSpanElement>) => void;
  formatAmount: (value: number) => string;
  cardRef?: (element: HTMLButtonElement | null) => void;
}

export function WalletsStackCard({
  wallet,
  cardHeight,
  stackIndex,
  stackCount,
  step,
  isExpanded,
  isDimmed,
  isDragging,
  isShiftPreview = false,
  dragOffsetY,
  orderLabelPosition = null,
  clickDisabled = false,
  onActivate,
  onOpen,
  onDragStart,
  formatAmount,
  cardRef,
}: WalletsStackCardProps) {
  const infoHeight = getWalletCardInfoHeight(cardHeight);
  const iconSlug = resolveWalletIconSlug(
    wallet.name,
    wallet.type,
    wallet.icon,
  );
  const cardBackground = getWalletCardBackground(iconSlug, wallet.type);

  function handleClick() {
    if (isDragging || clickDisabled) {
      return;
    }

    if (isExpanded) {
      onOpen();
      return;
    }

    onActivate();
  }

  return (
    <div
      className={cn(
        "absolute left-0 right-0 w-full",
        WALLETS_STACK_ANIMATION,
        WALLETS_STACK_CARD_RADIUS,
        "shadow-[0_10px_32px_-10px_rgba(0,0,0,0.28)]",
        isExpanded &&
          "shadow-[0_18px_40px_-10px_rgba(0,0,0,0.38)]",
        isDragging && "z-50 shadow-[0_24px_52px_-12px_rgba(0,0,0,0.45)]",
        isShiftPreview && "opacity-95",
        isDimmed && WALLETS_STACK_CARD_DIMMED,
      )}
      style={{
        bottom: stackIndex * step,
        height: cardHeight,
        zIndex:
          isDragging || isExpanded
            ? WALLETS_STACK_EXPANDED_Z_INDEX
            : stackCount - stackIndex,
        transform: isDragging
          ? `translate3d(0, ${dragOffsetY}px, 0) scale(1.02)`
          : isExpanded
            ? `translate3d(0, -${WALLETS_STACK_FLOAT_LIFT_PX}px, 0)`
            : undefined,
      }}
    >
      <button
        ref={cardRef}
        type="button"
        data-wallet-stack-card
        onClick={handleClick}
        aria-label={`${wallet.name}, ${formatAmount(wallet.balance)}`}
        aria-expanded={isExpanded}
        className={cn(
          "relative h-full w-full overflow-hidden text-left",
          WALLETS_STACK_CARD_RADIUS,
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
          isDragging && "cursor-grabbing",
        )}
        style={cardBackground.style}
      >
      {orderLabelPosition !== null ? (
        <WalletStackCardOrderLabel position={orderLabelPosition} />
      ) : null}

      <div
        className="absolute inset-x-0 top-0 flex items-center gap-2.5 px-3.5"
        style={{ height: infoHeight }}
      >
        <WalletInstitutionLogo
          slug={iconSlug}
          name={wallet.name}
          size={44}
          variant="card"
        />

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold tracking-tight text-white">
              {wallet.name}
            </span>
            {wallet.isDefault ? (
              <span className="shrink-0 rounded-full bg-white/20 px-1.5 py-px text-[8px] font-semibold uppercase tracking-wide text-white/90">
                {WALLETS_DEFAULT_BADGE}
              </span>
            ) : null}
          </span>
          <span className="mt-px block truncate text-[11px] text-white/78">
            {WALLET_TYPE_LABELS[wallet.type]}
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-1">
          <span
            className={cn(
              "text-right text-sm font-bold tabular-nums tracking-tight text-white",
              wallet.balance < 0 && "text-[#FFD0CC]",
            )}
          >
            {formatAmount(wallet.balance)}
          </span>
          {isExpanded ? (
            <CaretRightIcon
              className="size-3.5 shrink-0 text-white/75"
              aria-hidden
            />
          ) : null}
        </span>
      </div>

      {stackCount > 1 ? (
        <span
          role="presentation"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            onDragStart(event);
          }}
          className="absolute right-5 top-1/2 z-10 -translate-y-1/2 touch-none cursor-grab text-white/50 active:cursor-grabbing"
        >
          <DotsThreeVerticalIcon className="size-4" aria-hidden />
        </span>
      ) : null}

      <WalletStackCardOrnaments wallet={wallet} infoHeight={infoHeight} />

      {isDimmed ? (
        <span aria-hidden className={WALLETS_STACK_CARD_DIM_OVERLAY} />
      ) : null}
      </button>
    </div>
  );
}
