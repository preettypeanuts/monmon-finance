import { formatIdr } from "@/lib/finance/format-currency";
import type {
  PlanRecord,
  PlansInsightMeta,
  PlansInsightTone,
  PlansOverview,
} from "@/types/plan";

export function resolvePlansInsightMeta(
  estimatedCost: number,
  availableBalance: number,
): PlansInsightMeta {
  if (estimatedCost <= 0) {
    return { tone: "empty", label: "Kosong" };
  }

  const remaining = availableBalance - estimatedCost;

  if (remaining >= estimatedCost) {
    return { tone: "safe", label: "Aman" };
  }

  if (remaining >= 0) {
    return { tone: "tight", label: "Waspada" };
  }

  return { tone: "unsafe", label: "Risiko" };
}

export function buildPlansOverview(
  plans: PlanRecord[],
  availableBalance: number,
  insight: string,
): PlansOverview {
  const activePlans = plans.filter((plan) => plan.status === "active");
  const estimatedCost = activePlans.reduce((sum, plan) => sum + plan.amount, 0);
  const remainingBalance = availableBalance - estimatedCost;

  return {
    activeCount: activePlans.length,
    estimatedCost,
    availableBalance,
    remainingBalance,
    insight,
    insightMeta: resolvePlansInsightMeta(estimatedCost, availableBalance),
  };
}

export function buildFallbackPlansInsight(
  estimatedCost: number,
  availableBalance: number,
): string {
  if (estimatedCost <= 0) {
    return "Belum ada plan aktif. Tambahkan wishlist untuk melihat estimasi belanja.";
  }

  const remaining = availableBalance - estimatedCost;
  const spendLabel = formatIdr(estimatedCost);
  const balanceLabel = formatIdr(availableBalance);

  if (remaining >= estimatedCost) {
    return `Oke belanja ${spendLabel} dengan saldo ${balanceLabel}. Sisa masih longgar (${formatIdr(remaining)}).`;
  }

  if (remaining >= 0) {
    return `Cukup untuk ${spendLabel} dari saldo ${balanceLabel}, tapi sisa tipis (${formatIdr(remaining)}). Prioritaskan plan penting dulu.`;
  }

  return `Belum aman. Estimasi ${spendLabel} melebihi saldo ${balanceLabel} sebesar ${formatIdr(Math.abs(remaining))}. Tunda atau kurangi wishlist.`;
}

export function isPlansInsightTone(value: string): value is PlansInsightTone {
  return (
    value === "empty" ||
    value === "safe" ||
    value === "tight" ||
    value === "unsafe"
  );
}
