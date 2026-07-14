import { LegacyWalletSyncBanner } from "@/components/wallets/legacy-wallet-sync-banner";

interface WalletsLegacyAssignBannerProps {
  count: number;
  defaultWalletName: string;
}

export function WalletsLegacyAssignBanner(props: WalletsLegacyAssignBannerProps) {
  return <LegacyWalletSyncBanner {...props} variant="wallets" />;
}
