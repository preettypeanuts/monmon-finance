import { JournalCategoryIcon } from "@/components/journal/journal-category-icon";
import type { CategoryMentionOption } from "@/config/category-mentions";
import {
  CHAT_SLASH_MENU,
  CHAT_SLASH_MENU_ITEM,
  CHAT_SLASH_MENU_ITEM_ACTIVE,
} from "@/config/chat-layout";
import { cn } from "@/lib/utils";

interface ChatCategoryMentionMenuProps {
  options: CategoryMentionOption[];
  highlightedIndex: number;
  onHighlight: (index: number) => void;
  onSelect: (option: CategoryMentionOption) => void;
}

export function ChatCategoryMentionMenu({
  options,
  highlightedIndex,
  onHighlight,
  onSelect,
}: ChatCategoryMentionMenuProps) {
  return (
    <div className={CHAT_SLASH_MENU} role="listbox" aria-label="Pilih kategori">
      <div className="border-b border-black/6 px-3 py-2 dark:border-white/8">
        <p className="text-xs font-semibold text-foreground/90">Kategori</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Pilih kategori eksplisit untuk transaksi ini.
        </p>
      </div>

      {options.length === 0 ? (
        <p className="px-3 py-4 text-center text-xs text-muted-foreground">
          Kategori tidak ditemukan.
        </p>
      ) : (
        options.map((option, index) => (
          <button
            key={option.id}
            type="button"
            role="option"
            aria-selected={index === highlightedIndex}
            className={cn(
              CHAT_SLASH_MENU_ITEM,
              index === highlightedIndex && CHAT_SLASH_MENU_ITEM_ACTIVE,
            )}
            onMouseEnter={() => onHighlight(index)}
            onClick={() => onSelect(option)}
          >
            <JournalCategoryIcon
              category={option.id}
              type="expense"
              className="size-8 shrink-0 rounded-xl"
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-foreground/90">
                  {option.label}
                </span>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                  @{option.token}
                </span>
              </span>
              <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                Ketik @{option.token} untuk memilih kategori ini
              </span>
            </span>
          </button>
        ))
      )}
    </div>
  );
}
