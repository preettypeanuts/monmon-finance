import { formatIdr } from "@/lib/finance/format-currency";
import type { JournalCondition } from "@/types/journal";
import type { PlansOverview } from "@/types/plan";
import type { OverviewAiBrief } from "@/types/overview";
import type { TodaySummary } from "@/types/summary";

export function buildOverviewBrief(
  condition: JournalCondition,
  todaySummary: TodaySummary,
  plansOverview: PlansOverview,
): OverviewAiBrief {
  const conditionLabel = condition.label;
  const hasActivity =
    todaySummary.totalIncome > 0 || todaySummary.totalExpense > 0;

  if (!hasActivity) {
    const planNote =
      plansOverview.activeCount > 0
        ? ` ${plansOverview.activeCount} wish aktif menunggu keputusan.`
        : "";

    return {
      conditionLabel,
      text: `Belum ada transaksi hari ini. Saldo tersedia ${formatIdr(plansOverview.availableBalance)}.${planNote}`,
    };
  }

  const expenseLabel = formatIdr(todaySummary.totalExpense);
  const balanceLabel = formatIdr(plansOverview.availableBalance);

  if (conditionLabel === "Kritis" || conditionLabel === "Boros") {
    return {
      conditionLabel,
      text: `Pengeluaran hari ini ${expenseLabel}. Saldo kumulatif ${balanceLabel} — pertimbangkan tunda belanja non-esensial.`,
    };
  }

  if (conditionLabel === "Waspada") {
    return {
      conditionLabel,
      text: `Pengeluaran ${expenseLabel} hari ini cukup tinggi. Saldo ${balanceLabel}; prioritaskan kebutuhan penting dulu.`,
    };
  }

  const incomePart =
    todaySummary.totalIncome > 0
      ? ` Pemasukan ${formatIdr(todaySummary.totalIncome)}.`
      : "";

  return {
    conditionLabel,
    text: `Pengeluaran ${expenseLabel} masih terkendali.${incomePart} Saldo kumulatif ${balanceLabel}.`,
  };
}
