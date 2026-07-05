import {
  CarIcon,
  CoinsIcon,
  DotsThreeIcon,
  ForkKnifeIcon,
  HeartIcon,
  ReceiptIcon,
  ShoppingBagIcon,
  SparkleIcon,
  WalletIcon,
  type Icon,
} from "@/lib/icons";

import type { PlanIconName } from "@/config/plans";
import { cn } from "@/lib/utils";

const PLAN_ICONS: Record<PlanIconName, Icon> = {
  "arrow-down": WalletIcon,
  "arrow-up": WalletIcon,
  wallet: WalletIcon,
  "fork-knife": ForkKnifeIcon,
  car: CarIcon,
  "shopping-bag": ShoppingBagIcon,
  receipt: ReceiptIcon,
  "dots-three": DotsThreeIcon,
  coins: CoinsIcon,
  heart: HeartIcon,
  sparkle: SparkleIcon,
};

interface PlanIconProps {
  name: PlanIconName;
  className?: string;
}

export function PlanIcon({ name, className }: PlanIconProps) {
  const IconComponent = PLAN_ICONS[name];

  return <IconComponent className={cn("size-5 shrink-0", className)} />;
}
