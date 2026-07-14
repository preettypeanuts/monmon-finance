import {
  CHAT_SLASH_MENU,
  CHAT_SLASH_MENU_ITEM,
  CHAT_SLASH_MENU_ITEM_ACTIVE,
  CHAT_PICKER_MENU_BODY,
  CHAT_PICKER_MENU_DESC,
  CHAT_PICKER_MENU_HEADER,
  CHAT_PICKER_MENU_TITLE,
} from "@/config/chat-layout";
import type { WalletMentionOption } from "@/lib/chat/wallet-mentions";
import { WalletIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
interface ChatWalletMentionMenuProps {
  options: WalletMentionOption[];
  highlightedIndex: number;
  onHighlight: (index: number) => void;
  onSelect: (option: WalletMentionOption) => void;
}

export function ChatWalletMentionMenu({
  options,
  highlightedIndex,
  onHighlight,
  onSelect,
}: ChatWalletMentionMenuProps) {
  return (
    <div className={CHAT_SLASH_MENU} role="listbox" aria-label="Pilih wallet">
      <div className={CHAT_PICKER_MENU_HEADER}>
        <p className={CHAT_PICKER_MENU_TITLE}>Wallet</p>
        <p className={CHAT_PICKER_MENU_DESC}>
          Pilih sumber dana untuk transaksi ini.
        </p>
      </div>

      {options.length === 0 ? (
        <p className="px-3.5 py-4 text-center text-xs text-muted-foreground">
          Wallet tidak ditemukan.
        </p>
      ) : (
        <div className={CHAT_PICKER_MENU_BODY}>
          {options.map((option, index) => (
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
              <span
                className={cn(
                  "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl",
                  "bg-[#34C759]/15 text-[#34C759] dark:bg-[#34C759]/20",
                )}
              >
                <WalletIcon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-foreground/90">
                    {option.name}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                    ;{option.token}
                  </span>
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                  Ketik ;{option.token} untuk memilih wallet ini
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
