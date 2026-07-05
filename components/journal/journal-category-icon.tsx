import {
  ArrowDownIcon,
  ArrowUpIcon,
  CarIcon,
  CoinsIcon,
  DotsThreeIcon,
  ForkKnifeIcon,
  ReceiptIcon,
  ShoppingBagIcon,
  WalletIcon,
  type Icon,
} from "@/lib/icons";

import { JOURNAL_LIST_ICON } from "@/config/journal-table";
import {
  getCategoryTileStyle,
  TOTAL_TILE_STYLES,
  type SummaryTileIcon,
} from "@/config/summary-tiles";
import { cn } from "@/lib/utils";

const TILE_ICONS: Record<SummaryTileIcon, Icon> = {
  "arrow-down": ArrowDownIcon,
  "arrow-up": ArrowUpIcon,
  wallet: WalletIcon,
  "fork-knife": ForkKnifeIcon,
  car: CarIcon,
  "shopping-bag": ShoppingBagIcon,
  receipt: ReceiptIcon,
  "dots-three": DotsThreeIcon,
  coins: CoinsIcon,
};

interface JournalCategoryIconProps {
  category: string;
  type: "income" | "expense";
  className?: string;
}

export function JournalCategoryIcon({
  category,
  type,
  className,
}: JournalCategoryIconProps) {
  const style =
    type === "income"
      ? TOTAL_TILE_STYLES.income
      : getCategoryTileStyle(category);
  const IconComponent = TILE_ICONS[style.icon];

  return (
    <div
      className={cn(
        JOURNAL_LIST_ICON,
        style.surface,
        className,
      )}
    >
      <IconComponent className={cn("size-3.5", style.iconColor)} />
    </div>
  );
}
