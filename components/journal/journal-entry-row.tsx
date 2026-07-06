import { JournalCategoryIcon } from "@/components/journal/journal-category-icon";
import {
  JOURNAL_LIST_AMOUNT_EXPENSE,
  JOURNAL_LIST_AMOUNT_INCOME,
  JOURNAL_LIST_ROW,
  JOURNAL_LIST_ROW_AMOUNT,
  JOURNAL_LIST_ROW_CONTENT,
  JOURNAL_LIST_ROW_META,
  JOURNAL_LIST_ROW_TITLE,
} from "@/config/journal-table";
import { getCategoryLabel } from "@/config/categories";
import { formatJournalTime } from "@/lib/finance/format-datetime";
import { formatIdr } from "@/lib/finance/format-currency";
import { cn } from "@/lib/utils";
import type { JournalEntry } from "@/types/journal";

interface JournalEntryRowProps {
  item: JournalEntry;
  onClick?: () => void;
}

export function JournalEntryRow({ item, onClick }: JournalEntryRowProps) {
  const isIncome = item.type === "income";
  const title = item.rawInput.trim() || item.description;
  const categoryLabel = getCategoryLabel(item.category);

  const content = (
    <>
      <JournalCategoryIcon category={item.category} type={item.type} />

      <div className={JOURNAL_LIST_ROW_CONTENT}>
        <p className={JOURNAL_LIST_ROW_TITLE}>{title}</p>
        <p className={JOURNAL_LIST_ROW_META}>
          {isIncome ? "Pemasukan" : "Pengeluaran"} · {categoryLabel} ·{" "}
          {formatJournalTime(item.occurredAt)}
        </p>
      </div>

      <p
        className={cn(
          JOURNAL_LIST_ROW_AMOUNT,
          isIncome ? JOURNAL_LIST_AMOUNT_INCOME : JOURNAL_LIST_AMOUNT_EXPENSE,
        )}
      >
        {isIncome ? "+" : "−"}
        {formatIdr(item.amount)}
      </p>
    </>
  );

  if (!onClick) {
    return <article className={JOURNAL_LIST_ROW}>{content}</article>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        JOURNAL_LIST_ROW,
        "w-full text-left transition-colors",
        "hover:bg-black/3 active:bg-black/5 dark:hover:bg-white/5 dark:active:bg-white/8",
      )}
    >
      {content}
    </button>
  );
}
