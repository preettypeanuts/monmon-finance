import { JournalEntryRow } from "@/components/journal/journal-entry-row";
import {
  JOURNAL_EMPTY_STATE,
  JOURNAL_LIST_CONTAINER,
  JOURNAL_LIST_DIVIDER,
  JOURNAL_LIST_FRAME,
  JOURNAL_LIST_GROUP,
  JOURNAL_LIST_SCROLL,
  JOURNAL_LIST_SECTION,
  JOURNAL_LIST_SECTION_LABEL,
} from "@/config/journal-table";
import { groupJournalEntriesByDay } from "@/lib/journal/group-journal-entries";
import type { JournalEntry } from "@/types/journal";

interface JournalTableProps {
  items: JournalEntry[];
}

export function JournalTable({ items }: JournalTableProps) {
  if (items.length === 0) {
    return (
      <div className={JOURNAL_EMPTY_STATE}>
        <p className="text-sm font-medium">Belum ada transaksi</p>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Catat lewat inbox atau ubah filter untuk melihat entri lain.
        </p>
      </div>
    );
  }

  const groups = groupJournalEntriesByDay(items);

  return (
    <div className={JOURNAL_LIST_CONTAINER}>
      <div className={JOURNAL_LIST_FRAME}>
        <div className={JOURNAL_LIST_SCROLL}>
          {groups.map((group) => (
            <section key={group.dayKey} className={JOURNAL_LIST_SECTION}>
              <h2 className={JOURNAL_LIST_SECTION_LABEL}>{group.label}</h2>
              <div className={JOURNAL_LIST_GROUP}>
                {group.items.map((item, index) => (
                  <div key={item.id}>
                    <JournalEntryRow item={item} />
                    {index < group.items.length - 1 ? (
                      <div className={JOURNAL_LIST_DIVIDER} aria-hidden />
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
