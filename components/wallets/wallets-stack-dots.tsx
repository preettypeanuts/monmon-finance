import {
  WALLETS_STACK_DOT,
  WALLETS_STACK_DOT_ACTIVE,
  WALLETS_STACK_DOTS,
} from "@/config/wallets-stack";
import { cn } from "@/lib/utils";
import type { WalletWithBalance } from "@/types/wallet";

interface WalletsStackDotsProps {
  wallets: WalletWithBalance[];
  expandedWalletId: string | null;
  onSelect: (walletId: string | null) => void;
}

export function WalletsStackDots({
  wallets,
  expandedWalletId,
  onSelect,
}: WalletsStackDotsProps) {
  const count = wallets.length;

  if (count <= 1) {
    return null;
  }

  return (
    <div
      className={WALLETS_STACK_DOTS}
      role="tablist"
      aria-label="Wallet"
      data-wallet-stack-dots
    >
      {Array.from({ length: count }, (_, positionIndex) => {
        const stackIndex = count - (positionIndex + 1);
        const wallet = wallets[stackIndex];
        const isExpanded = expandedWalletId === wallet.id;

        return (
          <button
            key={wallet.id}
            type="button"
            role="tab"
            aria-selected={isExpanded}
            aria-label={wallet.name}
            onClick={() => onSelect(isExpanded ? null : wallet.id)}
            className={cn(
              WALLETS_STACK_DOT,
              isExpanded && WALLETS_STACK_DOT_ACTIVE,
            )}
          />
        );
      })}
    </div>
  );
}
