"use client";

import { useEffect, useRef } from "react";

import { ChatMessageMenu } from "@/components/chat/chat-message-menu";
import { ChatMessageRetryButton } from "@/components/chat/chat-message-retry-button";
import { MessageBubble } from "@/components/chat/message-bubble";
import { MessageTimestamp } from "@/components/chat/message-timestamp";
import { TransactionPreview } from "@/components/chat/transaction-preview";
import { MobilePageTitle } from "@/components/shared/mobile-page-title";
import { useSyncMobileScrollChrome } from "@/components/shared/mobile-scroll-chrome-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CHAT_MESSAGE_INSET_BOTTOM,
  CHAT_MESSAGE_INSET_TOP,
  CHAT_MESSAGE_INSET_X,
} from "@/config/chat-layout";
import { INBOX_MESSAGE_CONTENT_INSET } from "@/config/inbox-mobile";
import { MOBILE_CHROME_SCROLL_INSET_TOP } from "@/config/mobile-chrome";
import { STACK_GAP } from "@/config/spacing";
import { useMobileLargeTitleScroll } from "@/hooks/use-mobile-large-title-scroll";
import { getInboxRetryContext } from "@/lib/chat/inbox-error";
import { canManageSentUserMessage } from "@/lib/chat/inbox-message-actions";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";

interface MessageListProps {
  messages: ChatMessage[];
  onRetry?: (assistantMessageId: string) => Promise<void>;
  onEditMessage?: (userMessageId: string) => Promise<void>;
  onUndoMessage?: (userMessageId: string) => Promise<void>;
  actionsDisabled?: boolean;
  fixedMobileTopBar?: boolean;
}

function resolveScrollViewport(
  root: HTMLDivElement | null,
): HTMLElement | null {
  return root?.querySelector('[data-slot="scroll-area-viewport"]') ?? null;
}

export function MessageList({
  messages,
  onRetry,
  onEditMessage,
  onUndoMessage,
  actionsDisabled = false,
  fixedMobileTopBar = false,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { showBlur, showCompactTitle } = useMobileLargeTitleScroll(
    () => resolveScrollViewport(scrollRootRef.current),
    titleRef,
    { enabled: !fixedMobileTopBar },
  );

  useSyncMobileScrollChrome(
    fixedMobileTopBar ? undefined : "Inbox",
    showBlur,
    showCompactTitle,
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const contentClassName = fixedMobileTopBar
    ? INBOX_MESSAGE_CONTENT_INSET
    : cn(
        CHAT_MESSAGE_INSET_X,
        MOBILE_CHROME_SCROLL_INSET_TOP,
        CHAT_MESSAGE_INSET_TOP,
        CHAT_MESSAGE_INSET_BOTTOM,
      );

  return (
    <div ref={scrollRootRef} className="h-full min-h-0">
      <ScrollArea className="h-full min-h-0">
        {messages.length === 0 ? (
          <div
            className={cn(
              "flex min-h-full flex-col text-center",
              contentClassName,
            )}
          >
            {!fixedMobileTopBar ? (
              <MobilePageTitle ref={titleRef}>Inbox</MobilePageTitle>
            ) : null}
            <div className="flex flex-1 flex-col items-center justify-center">
              <p className="max-w-sm text-muted-foreground">
                Catat keuangan lewat chat. Contoh:{" "}
                <span className="font-medium text-foreground">
                  makan warteg 15K
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className={cn("flex flex-col", STACK_GAP, contentClassName)}>
            {!fixedMobileTopBar ? (
              <MobilePageTitle ref={titleRef}>Inbox</MobilePageTitle>
            ) : null}
            {messages.map((message, index) => {
              const isUser = message.role === "user";
              const retryContext = getInboxRetryContext(messages, index);
              const canManage =
                canManageSentUserMessage(message) &&
                Boolean(onEditMessage) &&
                Boolean(onUndoMessage);

              const bubble = (
                <MessageBubble
                  role={message.role}
                  content={message.content}
                  className={canManage ? "max-w-full" : undefined}
                />
              );

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex flex-col gap-1",
                    isUser ? "items-end" : "items-start",
                  )}
                >
                  {canManage ? (
                    <ChatMessageMenu
                      disabled={actionsDisabled}
                      onEdit={() => void onEditMessage?.(message.id)}
                      onUndo={() => void onUndoMessage?.(message.id)}
                    >
                      {bubble}
                    </ChatMessageMenu>
                  ) : (
                    bubble
                  )}
                  <MessageTimestamp
                    createdAt={message.createdAt}
                    role={message.role}
                  />
                  {retryContext && onRetry ? (
                    <ChatMessageRetryButton
                      disabled={actionsDisabled}
                      onRetry={() => void onRetry(retryContext.assistantMessageId)}
                    />
                  ) : null}
                  {message.transaction ? (
                    <div className="mt-1 max-w-[85%]">
                      <TransactionPreview transaction={message.transaction} />
                    </div>
                  ) : null}
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
