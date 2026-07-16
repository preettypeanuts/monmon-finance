import {
  WALLETS_CARD_UPDATED_LABEL,
} from "@/config/wallet-labels";
import { formatWalletCardUpdated } from "@/lib/wallets/format-wallet-card-ornament";
import type { WalletWithBalance } from "@/types/wallet";

interface WalletStackCardOrnamentsProps {
  wallet: WalletWithBalance;
  infoHeight: number;
}

export function WalletStackCardOrnaments({
  wallet,
  infoHeight,
}: WalletStackCardOrnamentsProps) {
  const updatedAt = wallet.lastActivityAt ?? wallet.createdAt;
  const updated = formatWalletCardUpdated(updatedAt);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden px-5 pb-4"
      style={{ top: infoHeight }}
      aria-hidden
    >
      <div className="relative flex h-full w-full items-end justify-between gap-4">
        <div>
          <p className="text-[8px] font-medium uppercase tracking-[0.14em] text-white/45">
            {WALLETS_CARD_UPDATED_LABEL}
          </p>
          <p className="mt-0.5 font-mono text-sm tracking-widest text-white/88">
            {updated.dayMonth}
          </p>
        </div>
        <p className="font-mono text-sm tracking-widest text-white/88">
          {updated.year}
        </p>
      </div>
    </div>
  );
}
