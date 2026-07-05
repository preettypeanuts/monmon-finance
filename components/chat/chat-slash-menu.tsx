import type { ReactNode } from "react";

import { HeartIcon, ReceiptIcon } from "@/lib/icons";

import {
  CHAT_SLASH_MENU,
  CHAT_SLASH_MENU_ITEM,
  CHAT_SLASH_MENU_ITEM_ACTIVE,
} from "@/config/chat-layout";
import { getCategoryLabel } from "@/config/categories";
import { formatIdr } from "@/lib/finance/format-currency";
import { cn } from "@/lib/utils";
import type {
  ActivePlanChatItem,
  ChatSlashEntry,
  UnpaidPayPlanChatItem,
} from "@/types/chat";

interface ChatSlashMenuProps {
  payPlanItems: UnpaidPayPlanChatItem[];
  planItems: ActivePlanChatItem[];
  entries: ChatSlashEntry[];
  highlightedIndex: number;
  onHighlight: (index: number) => void;
  onSelect: (entry: ChatSlashEntry) => void;
}

function SlashMenuSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="border-b border-black/6 px-3 py-2 dark:border-white/8">
        <p className="text-xs font-semibold text-foreground/90">{title}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

export function ChatSlashMenu({
  payPlanItems,
  planItems,
  entries,
  highlightedIndex,
  onHighlight,
  onSelect,
}: ChatSlashMenuProps) {
  const hasItems = entries.length > 0;

  return (
    <div className={CHAT_SLASH_MENU} role="listbox" aria-label="Slash commands">
      {payPlanItems.length > 0 ? (
        <SlashMenuSection
          title="PayPlan belum dibayar"
          description="Tandai tagihan sudah dibayar."
        >
          {payPlanItems.map((item) => {
            const entryIndex = entries.findIndex(
              (entry) => entry.kind === "payplan" && entry.item.id === item.id,
            );

            if (entryIndex === -1) {
              return null;
            }

            return (
              <button
                key={`payplan-${item.id}`}
                type="button"
                role="option"
                aria-selected={entryIndex === highlightedIndex}
                className={cn(
                  CHAT_SLASH_MENU_ITEM,
                  entryIndex === highlightedIndex && CHAT_SLASH_MENU_ITEM_ACTIVE,
                )}
                onMouseEnter={() => onHighlight(entryIndex)}
                onClick={() => onSelect({ kind: "payplan", item })}
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#FF9500]/15 text-[#FF9500] dark:bg-[#FF9500]/20">
                  <ReceiptIcon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-foreground/90">
                      {item.name}
                    </span>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                      {formatIdr(item.amount)}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                    {getCategoryLabel(item.category)} · {item.statusLabel}
                  </span>
                </span>
              </button>
            );
          })}
        </SlashMenuSection>
      ) : null}

      {planItems.length > 0 ? (
        <SlashMenuSection
          title="Wish aktif"
          description="Tandai wishlist sudah dibeli."
        >
          {planItems.map((item) => {
            const entryIndex = entries.findIndex(
              (entry) => entry.kind === "plan" && entry.item.id === item.id,
            );

            if (entryIndex === -1) {
              return null;
            }

            return (
              <button
                key={`plan-${item.id}`}
                type="button"
                role="option"
                aria-selected={entryIndex === highlightedIndex}
                className={cn(
                  CHAT_SLASH_MENU_ITEM,
                  entryIndex === highlightedIndex && CHAT_SLASH_MENU_ITEM_ACTIVE,
                )}
                onMouseEnter={() => onHighlight(entryIndex)}
                onClick={() => onSelect({ kind: "plan", item })}
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#FF2D55]/15 text-[#FF2D55] dark:bg-[#FF2D55]/20">
                  <HeartIcon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-foreground/90">
                      {item.name}
                    </span>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                      {formatIdr(item.amount)}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                    {getCategoryLabel(item.category)} · Aktif
                  </span>
                </span>
              </button>
            );
          })}
        </SlashMenuSection>
      ) : null}

      {!hasItems ? (
        <p className="px-3 py-4 text-center text-xs text-muted-foreground">
          Tidak ada PayPlan atau Wish yang bisa dieksekusi.
        </p>
      ) : null}
    </div>
  );
}
