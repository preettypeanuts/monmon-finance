import { getDayRange } from "@/lib/finance/day-range";

export function isTransactionToday(occurredAt: string | Date): boolean {
  const date = typeof occurredAt === "string" ? new Date(occurredAt) : occurredAt;
  const { start, end } = getDayRange();

  return date >= start && date <= end;
}
