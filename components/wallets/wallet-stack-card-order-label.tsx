import { WALLETS_STACK_CARD_ORDER_LABEL } from "@/config/wallets-stack";

interface WalletStackCardOrderLabelProps {
  position: number;
}

export function WalletStackCardOrderLabel({
  position,
}: WalletStackCardOrderLabelProps) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center"
    >
      <span className={WALLETS_STACK_CARD_ORDER_LABEL}>{position}</span>
    </span>
  );
}
