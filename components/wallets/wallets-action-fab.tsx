"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  WALLETS_FAB_BUTTON,
  WALLETS_FAB_CLUSTER,
  WALLETS_FAB_PRIMARY,
} from "@/config/wallets-stack";
import { MOBILE_ADD_FAB_ICON } from "@/config/mobile-nav";
import {
  WALLET_FAB_MENU,
  WALLET_FAB_NEW_CARD,
  WALLET_TRANSFER,
} from "@/config/wallet-labels";
import { ArrowsLeftRightIcon, CreditCardIcon, PlusIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface WalletsActionFabProps {
  onAdd: () => void;
  onTransfer: () => void;
  canTransfer?: boolean;
  className?: string;
}

export function WalletsActionFab({
  onAdd,
  onTransfer,
  canTransfer = false,
  className,
}: WalletsActionFabProps) {
  return (
    <div className={cn(WALLETS_FAB_CLUSTER, className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              aria-label={WALLET_FAB_MENU}
              className={cn(WALLETS_FAB_BUTTON, WALLETS_FAB_PRIMARY)}
            />
          }
        >
          <PlusIcon aria-hidden className={MOBILE_ADD_FAB_ICON} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" sideOffset={10} className="min-w-44">
          <DropdownMenuItem onClick={onAdd}>
            <CreditCardIcon />
            {WALLET_FAB_NEW_CARD}
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!canTransfer} onClick={onTransfer}>
            <ArrowsLeftRightIcon />
            {WALLET_TRANSFER}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
