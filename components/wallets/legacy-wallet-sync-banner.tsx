"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { assignLegacyTransactionsAction } from "@/app/actions/wallets";
import { Button } from "@/components/ui/button";
import { SEPARATED_CONTROL } from "@/config/shape";
import {
  LEGACY_WALLET_SYNC_ACTION,
  LEGACY_WALLET_SYNC_ACTIONING,
  LEGACY_WALLET_SYNC_DISMISS,
  LEGACY_WALLET_SYNC_OVERVIEW_DESC,
  LEGACY_WALLET_SYNC_OVERVIEW_TITLE,
  LEGACY_WALLET_SYNC_WALLETS_DESC,
  LEGACY_WALLET_SYNC_WALLETS_TITLE,
} from "@/config/wallet-labels";
import { useProtectedCurrency } from "@/hooks/use-protected-currency";
import { cn } from "@/lib/utils";

interface LegacyWalletSyncBannerProps {
  count: number;
  defaultWalletName: string;
  variant?: "wallets" | "overview";
  accountBalance?: number;
  defaultWalletBalance?: number;
  className?: string;
}

export function LegacyWalletSyncBanner({
  count,
  defaultWalletName,
  variant = "wallets",
  accountBalance = 0,
  defaultWalletBalance = 0,
  className,
}: LegacyWalletSyncBannerProps) {
  const router = useRouter();
  const { formatAmount } = useProtectedCurrency();
  const [isPending, startTransition] = useTransition();
  const [dismissed, setDismissed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (count <= 0 || dismissed) {
    return null;
  }

  const title =
    variant === "overview"
      ? LEGACY_WALLET_SYNC_OVERVIEW_TITLE
      : LEGACY_WALLET_SYNC_WALLETS_TITLE;

  const description =
    variant === "overview"
      ? LEGACY_WALLET_SYNC_OVERVIEW_DESC.replace(
          "{balance}",
          formatAmount(accountBalance),
        )
          .replace("{wallet}", defaultWalletName)
          .replace("{walletBalance}", formatAmount(defaultWalletBalance))
          .replace("{count}", String(count))
      : LEGACY_WALLET_SYNC_WALLETS_DESC.replace(
          "{count}",
          String(count),
        ).replace("{wallet}", defaultWalletName);

  const actionLabel = LEGACY_WALLET_SYNC_ACTION.replace(
    "{wallet}",
    defaultWalletName,
  );

  function handleAssign() {
    setError(null);
    startTransition(async () => {
      const result = await assignLegacyTransactionsAction();

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setDismissed(true);
      router.refresh();
    });
  }

  return (
    <section
      className={cn(
        "rounded-2xl border border-amber-500/25 bg-amber-500/10 px-3.5 py-3",
        className,
      )}
    >
      <p className="text-sm font-semibold text-amber-950 dark:text-amber-50">
        {title}
      </p>
      <p className="mt-1 text-[13px] leading-snug text-amber-950/90 dark:text-amber-50/90">
        {description}
      </p>
      {error ? (
        <p className="mt-2 text-[12px] text-destructive">{error}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          disabled={isPending}
          className={cn(SEPARATED_CONTROL, "h-8")}
          onClick={handleAssign}
        >
          {isPending ? LEGACY_WALLET_SYNC_ACTIONING : actionLabel}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={isPending}
          className="h-8 text-amber-950/80 dark:text-amber-50/80"
          onClick={() => setDismissed(true)}
        >
          {LEGACY_WALLET_SYNC_DISMISS}
        </Button>
      </div>
    </section>
  );
}
