import { CHAT_INPUT_HINT_BADGE } from "@/config/chat-input-mobile";
import { cn } from "@/lib/utils";

interface ChatInputHintBadgesProps {
  onInsert: (token: string) => void;
  disabled?: boolean;
  showSlash?: boolean;
  showWallet?: boolean;
}

export function ChatInputHintBadges({
  onInsert,
  disabled = false,
  showSlash = true,
  showWallet = false,
}: ChatInputHintBadgesProps) {
  return (
    <div className="max-md:-mr-0.5 flex shrink-0 items-center gap-1">
      {showSlash ? (
        <button
          type="button"
          disabled={disabled}
          aria-label="Perintah slash"
          onClick={() => onInsert("/")}
          className={cn(CHAT_INPUT_HINT_BADGE)}
        >
          /
        </button>
      ) : null}
      <button
        type="button"
        disabled={disabled}
        aria-label="Sebut kategori"
        onClick={() => onInsert("@")}
        className={cn(CHAT_INPUT_HINT_BADGE)}
      >
        @
      </button>
      {showWallet ? (
        <button
          type="button"
          disabled={disabled}
          aria-label="Pilih wallet"
          onClick={() => onInsert(";")}
          className={cn(CHAT_INPUT_HINT_BADGE)}
        >
          ;
        </button>
      ) : null}
    </div>
  );
}
