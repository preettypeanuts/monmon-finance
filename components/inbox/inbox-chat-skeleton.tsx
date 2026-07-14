import { Skeleton } from "@/components/ui/skeleton";
import {
  CHAT_MESSAGE_INSET_BOTTOM,
  CHAT_MESSAGE_INSET_TOP,
  CHAT_MESSAGE_INSET_X,
  INBOX_MESSAGE_SCROLL_AREA,
} from "@/config/chat-layout";
import {
  INBOX_DESKTOP_MESSAGE_PB,
  INBOX_DESKTOP_MESSAGE_PT,
} from "@/config/inbox-desktop";
import { INBOX_MESSAGE_CONTENT_INSET } from "@/config/inbox-mobile";
import { MOBILE_CHROME_SCROLL_INSET_TOP } from "@/config/mobile-chrome";
import { SEPARATED_SURFACE } from "@/config/shape";
import { STACK_GAP } from "@/config/spacing";
import { cn } from "@/lib/utils";

interface InboxChatSkeletonProps {
  fixedMobileTopBar?: boolean;
  className?: string;
}

function ChatBubbleSkeleton({
  align,
  tall = false,
}: {
  align: "user" | "assistant";
  tall?: boolean;
}) {
  const isUser = align === "user";

  return (
    <Skeleton
      className={cn(
        "max-w-[85%] rounded-[18px]",
        isUser ? "ml-auto rounded-br-[6px]" : "rounded-bl-[6px]",
        tall ? "h-12 w-[68%]" : "h-9",
        isUser ? (tall ? "w-[58%]" : "w-[48%]") : tall ? "w-[74%]" : "w-[62%]",
      )}
    />
  );
}

function TransactionPreviewSkeleton() {
  return (
    <div
      className={cn(
        "mt-1 w-full max-w-[85%] border border-black/8 p-4 dark:border-white/10",
        SEPARATED_SURFACE,
      )}
    >
      <div className="grid gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MessageTimestampSkeleton({ align }: { align: "user" | "assistant" }) {
  return (
    <Skeleton
      className={cn(
        "h-4 w-11 rounded-full",
        align === "user" ? "self-end" : "self-start",
      )}
    />
  );
}

function MessageGroupSkeleton({
  align,
  withTransaction = false,
  tallBubble = false,
}: {
  align: "user" | "assistant";
  withTransaction?: boolean;
  tallBubble?: boolean;
}) {
  const isUser = align === "user";

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-1",
        isUser ? "items-end" : "items-start",
      )}
    >
      <ChatBubbleSkeleton align={align} tall={tallBubble} />
      {!isUser && withTransaction ? <TransactionPreviewSkeleton /> : null}
      <MessageTimestampSkeleton align={align} />
    </div>
  );
}

export function InboxChatSkeleton({
  fixedMobileTopBar = true,
  className,
}: InboxChatSkeletonProps) {
  const contentClassName = fixedMobileTopBar
    ? cn(
        INBOX_MESSAGE_CONTENT_INSET,
        INBOX_DESKTOP_MESSAGE_PT,
        INBOX_DESKTOP_MESSAGE_PB,
      )
    : cn(
        CHAT_MESSAGE_INSET_X,
        MOBILE_CHROME_SCROLL_INSET_TOP,
        CHAT_MESSAGE_INSET_TOP,
        CHAT_MESSAGE_INSET_BOTTOM,
      );

  return (
    <div
      aria-hidden
      className={cn(
        INBOX_MESSAGE_SCROLL_AREA,
        "h-full min-h-0 flex-1 overflow-hidden",
        className,
      )}
    >
      <div className={cn("flex flex-col", STACK_GAP, contentClassName)}>
        <MessageGroupSkeleton align="user" />
        <MessageGroupSkeleton
          align="assistant"
          withTransaction
          tallBubble
        />
        <MessageGroupSkeleton align="user" tallBubble />
        <MessageGroupSkeleton align="assistant" />
      </div>
    </div>
  );
}
