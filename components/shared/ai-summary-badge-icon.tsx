import { cn } from "@/lib/utils";
import {
  resolveFinanceConditionIcon,
  resolvePlansInsightIcon,
} from "@/lib/finance/resolve-ai-summary-icon";
import type { PlansInsightTone } from "@/types/plan";

interface FinanceConditionBadgeIconProps {
  label: string;
  className?: string;
}

interface PlansInsightBadgeIconProps {
  tone: PlansInsightTone;
  className?: string;
}

export function FinanceConditionBadgeIcon({
  label,
  className,
}: FinanceConditionBadgeIconProps) {
  const IconComponent = resolveFinanceConditionIcon(label);

  return (
    <IconComponent aria-hidden className={cn("size-3 shrink-0", className)} />
  );
}

export function PlansInsightBadgeIcon({
  tone,
  className,
}: PlansInsightBadgeIconProps) {
  const IconComponent = resolvePlansInsightIcon(tone);

  return (
    <IconComponent aria-hidden className={cn("size-3 shrink-0", className)} />
  );
}
