"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { WalletsStackCard } from "@/components/wallets/wallets-stack-card";
import { WalletsStackDots } from "@/components/wallets/wallets-stack-dots";
import {
  WALLETS_STACK_CONTAINER,
  WALLETS_STACK_FLOAT_LIFT_PX,
  WALLETS_STACK_SHELL,
  WALLETS_STACK_SHADOW_BLEED_PX,
} from "@/config/wallets-stack";
import { useWalletStackOrder } from "@/hooks/use-wallet-stack-order";
import { useWalletStackMetrics } from "@/hooks/use-wallet-stack-metrics";
import { useProtectedCurrency } from "@/hooks/use-protected-currency";
import {
  getWalletStackDisplayPosition,
  getWalletStackPreviewLayoutIndices,
  resolveWalletStackDropIndex,
} from "@/lib/wallets/wallet-stack-order";
import type { WalletWithBalance } from "@/types/wallet";

interface WalletsStackProps {
  wallets: WalletWithBalance[];
  onSelect: (wallet: WalletWithBalance) => void;
}

interface DragState {
  walletId: string;
  fromIndex: number;
  startY: number;
  offsetY: number;
  dropIndex: number;
}

export function WalletsStack({ wallets, onSelect }: WalletsStackProps) {
  const { formatAmount } = useProtectedCurrency();
  const containerRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const { orderedWallets, order, reorder } = useWalletStackOrder(wallets);
  const { cardHeight, step, stackHeight } = useWalletStackMetrics(
    containerRef,
    orderedWallets.length,
  );
  const [expandedWalletId, setExpandedWalletId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const dragMovedRef = useRef(false);
  const stepRef = useRef(step);
  const countRef = useRef(order.length);
  const [blockClick, setBlockClick] = useState(false);

  stepRef.current = step;
  countRef.current = order.length;

  const expandedLiftPadding = expandedWalletId ? WALLETS_STACK_FLOAT_LIFT_PX : 0;

  useEffect(() => {
    if (!expandedWalletId || dragState) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (target.closest("[data-wallet-stack-card]")) {
        return;
      }

      if (target.closest("[data-wallet-stack-dots]")) {
        return;
      }

      setExpandedWalletId(null);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [expandedWalletId, dragState]);

  const clearDragListeners = useCallback((listeners: {
    move: (event: PointerEvent) => void;
    up: (event: PointerEvent) => void;
  }) => {
    window.removeEventListener("pointermove", listeners.move);
    window.removeEventListener("pointerup", listeners.up);
    window.removeEventListener("pointercancel", listeners.up);
  }, []);

  function resolveDropIndex(
    fromIndex: number,
    offsetY: number,
  ): number {
    return resolveWalletStackDropIndex({
      fromIndex,
      offsetY,
      step: stepRef.current,
      count: countRef.current,
    });
  }

  function handleDragStart(
    walletId: string,
    stackIndex: number,
    event: React.PointerEvent<HTMLSpanElement>,
  ) {
    event.preventDefault();
    event.stopPropagation();
    dragMovedRef.current = false;

    const startY = event.clientY;
    const fromIndex = stackIndex;
    const listeners = {
      move: (moveEvent: PointerEvent) => {
        const offsetY = moveEvent.clientY - startY;
        if (Math.abs(offsetY) > 6) {
          dragMovedRef.current = true;
        }

        setDragState({
          walletId,
          fromIndex,
          startY,
          offsetY,
          dropIndex: resolveDropIndex(fromIndex, offsetY),
        });
      },
      up: (upEvent: PointerEvent) => {
        clearDragListeners(listeners);

        const finalOffsetY = upEvent.clientY - startY;
        const moved = Math.abs(finalOffsetY) > 6;
        const dropIndex = moved
          ? resolveDropIndex(fromIndex, finalOffsetY)
          : fromIndex;

        if (moved && dropIndex !== fromIndex) {
          reorder(fromIndex, dropIndex);
          setBlockClick(true);
          window.setTimeout(() => setBlockClick(false), 0);
        }

        setDragState(null);

        window.setTimeout(() => {
          dragMovedRef.current = false;
        }, 0);
      },
    };

    setExpandedWalletId(null);
    setDragState({
      walletId,
      fromIndex,
      startY,
      offsetY: 0,
      dropIndex: fromIndex,
    });

    window.addEventListener("pointermove", listeners.move);
    window.addEventListener("pointerup", listeners.up);
    window.addEventListener("pointercancel", listeners.up);
  }

  if (orderedWallets.length === 0) {
    return null;
  }

  const showDragPreview =
    dragState !== null && dragState.dropIndex !== dragState.fromIndex;
  const showDropIndicator =
    dragState !== null && Math.abs(dragState.offsetY) > 6;
  const previewLayoutIndices = showDragPreview
    ? getWalletStackPreviewLayoutIndices(
        orderedWallets.length,
        dragState.fromIndex,
        dragState.dropIndex,
      )
    : null;

  return (
    <div ref={containerRef} className={WALLETS_STACK_CONTAINER}>
      <div
        ref={shellRef}
        className={WALLETS_STACK_SHELL}
        style={{
          height:
            stackHeight +
            expandedLiftPadding +
            WALLETS_STACK_SHADOW_BLEED_PX,
          paddingTop: expandedLiftPadding,
          paddingBottom: WALLETS_STACK_SHADOW_BLEED_PX,
        }}
      >
        {orderedWallets.map((wallet, stackIndex) => {
          const isExpanded = expandedWalletId === wallet.id;
          const isDragging = dragState?.walletId === wallet.id;
          const layoutIndex = isDragging
            ? stackIndex
            : (previewLayoutIndices?.[stackIndex] ?? stackIndex);
          const orderLabelPosition = showDropIndicator
            ? getWalletStackDisplayPosition(
                isDragging ? dragState.dropIndex : layoutIndex,
                orderedWallets.length,
              )
            : null;

          return (
            <WalletsStackCard
              key={wallet.id}
              wallet={wallet}
              cardHeight={cardHeight}
              stackIndex={layoutIndex}
              stackCount={orderedWallets.length}
              step={step}
              isExpanded={isExpanded}
              isDimmed={Boolean(expandedWalletId && !isExpanded)}
              isDragging={isDragging}
              isShiftPreview={showDragPreview && !isDragging}
              dragOffsetY={isDragging ? dragState.offsetY : 0}
              orderLabelPosition={orderLabelPosition}
              clickDisabled={blockClick}
              formatAmount={formatAmount}
              onActivate={() => setExpandedWalletId(wallet.id)}
              onOpen={() => {
                setExpandedWalletId(null);
                onSelect(wallet);
              }}
              onDragStart={(event) =>
                handleDragStart(wallet.id, stackIndex, event)
              }
            />
          );
        })}
      </div>

      <WalletsStackDots
        wallets={orderedWallets}
        expandedWalletId={expandedWalletId}
        onSelect={(walletId) => setExpandedWalletId(walletId)}
      />
    </div>
  );
}
