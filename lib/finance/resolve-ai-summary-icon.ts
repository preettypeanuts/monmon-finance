import {
  CheckCircleIcon,
  CloudBoltIcon,
  CloudRainIcon,
  ExclamationTriangleIcon,
  ListStarIcon,
  MoonIcon,
  ShieldIcon,
  SunIcon,
  XCircleIcon,
  type Icon,
} from "@/lib/icons";
import type { PlansInsightTone } from "@/types/plan";

const FINANCE_CONDITION_ICONS: Record<string, Icon> = {
  aman: SunIcon,
  stabil: ShieldIcon,
  waspada: ExclamationTriangleIcon,
  boros: CloudRainIcon,
  kritis: CloudBoltIcon,
  tenang: MoonIcon,
  kosong: ListStarIcon,
  risiko: XCircleIcon,
};

const PLANS_INSIGHT_ICONS: Record<PlansInsightTone, Icon> = {
  empty: ListStarIcon,
  safe: CheckCircleIcon,
  tight: ExclamationTriangleIcon,
  unsafe: XCircleIcon,
};

export function resolveFinanceConditionIcon(label: string): Icon {
  const key = label.trim().toLowerCase();
  return FINANCE_CONDITION_ICONS[key] ?? SunIcon;
}

export function resolvePlansInsightIcon(tone: PlansInsightTone): Icon {
  return PLANS_INSIGHT_ICONS[tone];
}
