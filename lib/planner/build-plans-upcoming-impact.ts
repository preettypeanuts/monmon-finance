import { getPlannedItemsForExpansion } from "@/lib/db/planned-items";
import { addDays, startOfDay } from "@/lib/finance/day-range";
import { formatCompactDayMonth } from "@/lib/finance/format-datetime";
import {
  getDueDateForInstallmentIndex,
  getPlannedItemPaymentStatus,
} from "@/lib/planner/installment-progress";
import type { PlansUpcomingImpactItem } from "@/types/plan";

const DEFAULT_HORIZON_DAYS = 60;
const MAX_ITEMS = 8;

function formatDaysUntilLabel(daysUntil: number): string {
  if (daysUntil > 0) {
    return `${daysUntil} hari lagi`;
  }

  if (daysUntil === 0) {
    return "hari ini";
  }

  return `${Math.abs(daysUntil)} hari lalu`;
}

export async function getPlansUpcomingImpact(
  referenceDate: Date = new Date(),
  horizonDays = DEFAULT_HORIZON_DAYS,
): Promise<PlansUpcomingImpactItem[]> {
  const today = startOfDay(referenceDate);
  const rangeEnd = addDays(today, horizonDays);
  const plannedItems = await getPlannedItemsForExpansion();

  return plannedItems
    .filter((item) => item.flowType === "expense")
    .map((item) => {
      const paymentStatus = getPlannedItemPaymentStatus(item, referenceDate);

      if (!paymentStatus || paymentStatus.status !== "pending") {
        return null;
      }

      const dueAt = getDueDateForInstallmentIndex(
        item,
        item.paidInstallmentCount,
      );
      const daysUntil = paymentStatus.daysUntil ?? 0;

      return {
        id: `${item.id}:${dueAt.toISOString()}`,
        name: item.name,
        amount: item.amount,
        dueAt: dueAt.toISOString(),
        dueLabel: formatCompactDayMonth(dueAt),
        daysUntil,
        daysUntilLabel: formatDaysUntilLabel(daysUntil),
      };
    })
    .filter((item): item is PlansUpcomingImpactItem => {
      if (!item) {
        return false;
      }

      return startOfDay(new Date(item.dueAt)).getTime() <= rangeEnd.getTime();
    })
    .sort((left, right) => left.dueAt.localeCompare(right.dueAt))
    .slice(0, MAX_ITEMS);
}
