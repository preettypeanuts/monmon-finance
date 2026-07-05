import { toDayKey } from "@/lib/finance/day-range";
import { formatJournalSectionDate } from "@/lib/finance/format-datetime";
import type { JournalEntry } from "@/types/journal";

export interface JournalEntryGroup {
  dayKey: string;
  label: string;
  items: JournalEntry[];
}

export function groupJournalEntriesByDay(
  items: JournalEntry[],
  referenceDate: Date = new Date(),
): JournalEntryGroup[] {
  const groups = new Map<string, JournalEntry[]>();

  for (const item of items) {
    const dayKey = toDayKey(item.occurredAt);
    const existing = groups.get(dayKey);

    if (existing) {
      existing.push(item);
      continue;
    }

    groups.set(dayKey, [item]);
  }

  return [...groups.entries()].map(([dayKey, groupItems]) => ({
    dayKey,
    label: formatJournalSectionDate(groupItems[0].occurredAt, referenceDate),
    items: groupItems,
  }));
}
