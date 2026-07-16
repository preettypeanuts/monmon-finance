import { WALLETS_STACK_TOTAL_ROW } from "@/config/wallets-stack";
import { WALLETS_TOTAL_LABEL } from "@/config/wallet-labels";
import { CaretRightIcon } from "@/lib/icons";

interface WalletsTotalRowProps {
  totalLabel: string;
}

export function WalletsTotalRow({ totalLabel }: WalletsTotalRowProps) {
  return (
    <div className={WALLETS_STACK_TOTAL_ROW}>
      <p className="text-sm text-muted-foreground">{WALLETS_TOTAL_LABEL}</p>
      <p className="flex items-center gap-1 text-base font-bold tabular-nums tracking-tight text-foreground">
        {totalLabel}
        <CaretRightIcon className="size-3.5 text-muted-foreground/70" aria-hidden />
      </p>
    </div>
  );
}
