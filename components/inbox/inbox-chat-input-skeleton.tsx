import { Skeleton } from "@/components/ui/skeleton";
import {
  CHAT_INPUT_CONTROL_MIN_HEIGHT,
  CHAT_INPUT_MENU_BUTTON,
} from "@/config/chat-input-mobile";
import { CONTROL_GAP } from "@/config/spacing";
import { cn } from "@/lib/utils";

export function InboxChatInputSkeleton() {
  return (
    <div className={cn("flex max-h-28 w-full items-end", CONTROL_GAP)}>
      <Skeleton className={cn(CHAT_INPUT_MENU_BUTTON, "rounded-full")} />
      <Skeleton
        className={cn(
          CHAT_INPUT_CONTROL_MIN_HEIGHT,
          "min-w-0 flex-1 rounded-[20px]",
        )}
      />
    </div>
  );
}
