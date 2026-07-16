"use client";

import { useEffect, useState } from "react";

import {
  WALLETS_CARD_ASPECT_RATIO,
  WALLETS_STACK_PEEK_RATIO,
  getWalletStackHeightPx,
} from "@/config/wallets-stack";

interface WalletStackMetrics {
  cardHeight: number;
  step: number;
  stackHeight: number;
  width: number;
}

const DEFAULT_WIDTH = 358;

function measure(width: number, walletCount: number): WalletStackMetrics {
  const cardHeight = width / WALLETS_CARD_ASPECT_RATIO;
  const step = cardHeight * WALLETS_STACK_PEEK_RATIO;

  return {
    width,
    cardHeight,
    step,
    stackHeight: getWalletStackHeightPx(walletCount, cardHeight, step),
  };
}

export function useWalletStackMetrics(
  containerRef: React.RefObject<HTMLElement | null>,
  walletCount: number,
): WalletStackMetrics {
  const [metrics, setMetrics] = useState(() =>
    measure(DEFAULT_WIDTH, walletCount),
  );

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    function update() {
      const width = element?.clientWidth ?? DEFAULT_WIDTH;
      setMetrics(measure(width, walletCount));
    }

    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => observer.disconnect();
  }, [containerRef, walletCount]);

  return metrics;
}
