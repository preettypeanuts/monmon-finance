"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  WalletFormDialog,
  type WalletFormMode,
} from "@/components/wallets/wallet-form-dialog";
import { WalletTransferFormDialog } from "@/components/wallets/wallet-transfer-form-dialog";
import { WalletsActionFab } from "@/components/wallets/wallets-action-fab";
import { WalletsHelpTip } from "@/components/wallets/wallets-help-tip";
import { WalletsStack } from "@/components/wallets/wallets-stack";
import { WalletsStarterTemplates } from "@/components/wallets/wallets-starter-templates";
import { WalletsTotalRow } from "@/components/wallets/wallets-total-row";
import { BalanceVisibilityToggle } from "@/components/shared/balance-visibility-toggle";
import { useAppearance } from "@/components/shared/appearance-provider";
import {
  WALLETS_STACK_CONTAINER,
  WALLETS_VIEW_BOTTOM_PADDING,
} from "@/config/wallets-stack";
import { UI_LABEL_HIDE, UI_LABEL_SHOW } from "@/config/ui-labels";
import { useProtectedCurrency } from "@/hooks/use-protected-currency";
import { cn } from "@/lib/utils";
import type { WalletWithBalance } from "@/types/wallet";

interface WalletsViewProps {
  wallets: WalletWithBalance[];
}

export function WalletsView({ wallets }: WalletsViewProps) {
  const router = useRouter();
  const { balanceVisible } = useAppearance();
  const { formatAmount } = useProtectedCurrency();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [formMode, setFormMode] = useState<WalletFormMode | null>(null);

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  const canTransfer = wallets.length >= 2;
  const showStarter = wallets.length === 0;

  function openNew() {
    setFormMode({ kind: "new" });
    setDialogOpen(true);
  }

  function openEdit(wallet: WalletWithBalance) {
    setFormMode({ kind: "edit", wallet });
    setDialogOpen(true);
  }

  return (
    <div className={cn("flex flex-col gap-5", WALLETS_VIEW_BOTTOM_PADDING)}>
      {showStarter ? (
        <WalletsStarterTemplates onManualAdd={openNew} />
      ) : (
        <>
          <div className={cn(WALLETS_STACK_CONTAINER, "flex flex-col gap-4")}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between md:justify-end">
                <span className="text-xs font-medium text-muted-foreground md:hidden">
                  {balanceVisible ? UI_LABEL_HIDE : UI_LABEL_SHOW}
                </span>
                <BalanceVisibilityToggle />
              </div>
              <WalletsTotalRow totalLabel={formatAmount(totalBalance)} />
            </div>
            <WalletsStack wallets={wallets} onSelect={openEdit} />
          </div>

          <WalletsActionFab
            onAdd={openNew}
            onTransfer={() => setTransferOpen(true)}
            canTransfer={canTransfer}
          />

          <WalletsHelpTip />
        </>
      )}

      <WalletFormDialog
        open={dialogOpen}
        mode={formMode}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            router.refresh();
          }
        }}
      />

      {canTransfer ? (
        <WalletTransferFormDialog
          open={transferOpen}
          onOpenChange={setTransferOpen}
          wallets={wallets}
        />
      ) : null}
    </div>
  );
}
