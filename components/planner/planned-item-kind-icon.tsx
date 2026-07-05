import {
  CreditCardIcon,
  CurrencyCircleDollarIcon,
  ReceiptIcon,
  type Icon,
} from "@/lib/icons";

import { PLANNER_KIND_STYLES } from "@/config/planner-manage";
import { PLANNER_LIST_ICON } from "@/config/planner-table";
import { cn } from "@/lib/utils";
import type { PlannedItemKind } from "@/types/planner";

const KIND_ICONS: Record<PlannedItemKind, Icon> = {
  bill: ReceiptIcon,
  subscription: CreditCardIcon,
  installment: CreditCardIcon,
  income: CurrencyCircleDollarIcon,
};

interface PlannedItemKindIconProps {
  kind: PlannedItemKind;
  className?: string;
}

export function PlannedItemKindIcon({ kind, className }: PlannedItemKindIconProps) {
  const style = PLANNER_KIND_STYLES[kind];
  const IconComponent = KIND_ICONS[kind];

  return (
    <div className={cn(PLANNER_LIST_ICON, style.surface, className)}>
      <IconComponent className={cn("size-3.5", style.color)} />
    </div>
  );
}
