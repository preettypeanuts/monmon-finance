"use client";

import { useEffect, useMemo, useState } from "react";

import {
  buildInitialWalletStackOrder,
  mergeWalletStackOrder,
  orderWalletsByStack,
  reorderWalletStackOrder,
} from "@/lib/wallets/wallet-stack-order";
import {
  readWalletStackOrder,
  writeWalletStackOrder,
} from "@/lib/wallets/wallet-stack-order-storage";
import type { WalletWithBalance } from "@/types/wallet";

export function useWalletStackOrder(wallets: WalletWithBalance[]) {
  const walletKey = wallets.map((wallet) => wallet.id).join("|");
  const [order, setOrder] = useState<string[]>(() =>
    buildInitialWalletStackOrder(wallets),
  );

  useEffect(() => {
    setOrder(() => {
      const merged = mergeWalletStackOrder(readWalletStackOrder(), wallets);
      writeWalletStackOrder(merged);
      return merged;
    });
  }, [walletKey, wallets]);

  const orderedWallets = useMemo(
    () => orderWalletsByStack(wallets, order),
    [order, wallets],
  );

  function reorder(fromIndex: number, toIndex: number) {
    setOrder((current) => {
      const next = reorderWalletStackOrder(current, fromIndex, toIndex);
      writeWalletStackOrder(next);
      return next;
    });
  }

  return {
    order,
    orderedWallets,
    reorder,
  };
}
