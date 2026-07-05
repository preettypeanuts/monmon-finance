"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChatCalculatorSheet } from "@/components/chat/chat-calculator-sheet";
import { ChatCategoryMentionMenu } from "@/components/chat/chat-category-mention-menu";
import { ChatSlashMenu } from "@/components/chat/chat-slash-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import type { CategoryMentionOption } from "@/config/category-mentions";
import { GLASS_SURFACE } from "@/config/glass";
import { CONTROL_GAP } from "@/config/spacing";
import {
  detectCategoryMentionRange,
  filterCategoryMentionOptions,
  insertCategoryMention,
} from "@/lib/chat/category-mentions";
import { ArrowUpIcon, CalculatorIcon, PlusIcon } from "@/lib/icons";
import { filterUnpaidPayPlanChatItems } from "@/lib/planner/unpaid-payplan-chat";
import { filterActivePlanChatItems } from "@/lib/plans/active-plan-chat";
import { cn } from "@/lib/utils";
import type {
  ActivePlanChatItem,
  ChatSlashEntry,
  UnpaidPayPlanChatItem,
} from "@/types/chat";

/** Min height shared by menu btn & input — keep in sync. */
const CONTROL_MIN_HEIGHT = "min-h-9";

interface ChatInputProps {
  onSubmit: (text: string) => Promise<void>;
  onPayPlan?: (item: UnpaidPayPlanChatItem) => Promise<void>;
  onMarkPlanDone?: (item: ActivePlanChatItem) => Promise<void>;
  unpaidPayPlanItems?: UnpaidPayPlanChatItem[];
  activePlanItems?: ActivePlanChatItem[];
  disabled?: boolean;
  draftText?: string | null;
  onDraftTextApplied?: () => void;
}

export function ChatInput({
  onSubmit,
  onPayPlan,
  onMarkPlanDone,
  unpaidPayPlanItems = [],
  activePlanItems = [],
  disabled = false,
  draftText = null,
  onDraftTextApplied,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [cursor, setCursor] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const hasText = value.trim().length > 0;
  const isInputDisabled = disabled || isSubmitting;
  const slashMatch = value.match(/^\/(.*)$/);
  const hasSlashActions = Boolean(onPayPlan || onMarkPlanDone);
  const isSlashOpen = slashMatch !== null && hasSlashActions;
  const slashQuery = slashMatch?.[1]?.trim() ?? "";
  const mentionRange = useMemo(() => {
    if (isSlashOpen) {
      return null;
    }

    return detectCategoryMentionRange(value, cursor);
  }, [cursor, isSlashOpen, value]);
  const isMentionOpen = mentionRange !== null;
  const mentionQuery = mentionRange?.query ?? "";
  const filteredPayPlanItems = useMemo(
    () => filterUnpaidPayPlanChatItems(unpaidPayPlanItems, slashQuery),
    [slashQuery, unpaidPayPlanItems],
  );
  const filteredPlanItems = useMemo(
    () => filterActivePlanChatItems(activePlanItems, slashQuery),
    [activePlanItems, slashQuery],
  );
  const slashEntries = useMemo<ChatSlashEntry[]>(
    () => [
      ...filteredPayPlanItems.map(
        (item): ChatSlashEntry => ({ kind: "payplan", item }),
      ),
      ...filteredPlanItems.map(
        (item): ChatSlashEntry => ({ kind: "plan", item }),
      ),
    ],
    [filteredPayPlanItems, filteredPlanItems],
  );
  const mentionOptions = useMemo(
    () => filterCategoryMentionOptions(mentionQuery),
    [mentionQuery],
  );
  const isPickerOpen = isSlashOpen || isMentionOpen;

  useEffect(() => {
    if (draftText === null) {
      return;
    }

    setValue(draftText);
    setCursor(draftText.length);
    onDraftTextApplied?.();
  }, [draftText, onDraftTextApplied]);

  function syncCursor() {
    const nextCursor = textareaRef.current?.selectionStart ?? 0;
    setCursor(nextCursor);
  }

  async function handleSubmit() {
    if (isPickerOpen) {
      return;
    }

    const text = value.trim();
    if (!text || isSubmitting || disabled) return;

    setIsSubmitting(true);
    setValue("");
    setCursor(0);

    try {
      await onSubmit(text);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSelectSlashEntry(entry: ChatSlashEntry) {
    if (isSubmitting || disabled) {
      return;
    }

    setIsSubmitting(true);
    setValue("");
    setCursor(0);

    try {
      if (entry.kind === "payplan") {
        if (!onPayPlan) {
          return;
        }

        await onPayPlan(entry.item);
        return;
      }

      if (!onMarkPlanDone) {
        return;
      }

      await onMarkPlanDone(entry.item);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSelectCategoryMention(option: CategoryMentionOption) {
    if (!mentionRange) {
      return;
    }

    const { nextText, nextCursor } = insertCategoryMention(
      value,
      mentionRange,
      option.token,
    );

    setValue(nextText);
    setCursor(nextCursor);

    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) {
        return;
      }

      textarea.focus();
      textarea.setSelectionRange(nextCursor, nextCursor);
    });
  }

  function handleUseCalculatorAmount(amount: number) {
    const amountText = String(amount);
    setValue((current) => {
      const trimmed = current.trimEnd();
      return trimmed.length === 0 ? amountText : `${trimmed} ${amountText}`;
    });
    syncCursor();
  }

  function handlePickerEnter() {
    if (isSlashOpen) {
      const selected = slashEntries[highlightedIndex];
      if (selected) {
        void handleSelectSlashEntry(selected);
      }
      return;
    }

    if (isMentionOpen) {
      const selected = mentionOptions[highlightedIndex];
      if (selected) {
        handleSelectCategoryMention(selected);
      }
    }
  }

  function handlePickerArrowDown(event: React.KeyboardEvent) {
    event.preventDefault();
    const length = isSlashOpen ? slashEntries.length : mentionOptions.length;
    setHighlightedIndex((current) =>
      length === 0 ? 0 : (current + 1) % length,
    );
  }

  function handlePickerArrowUp(event: React.KeyboardEvent) {
    event.preventDefault();
    const length = isSlashOpen ? slashEntries.length : mentionOptions.length;
    setHighlightedIndex((current) =>
      length === 0 ? 0 : (current - 1 + length) % length,
    );
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (isPickerOpen) {
      if (event.key === "ArrowDown") {
        handlePickerArrowDown(event);
        return;
      }

      if (event.key === "ArrowUp") {
        handlePickerArrowUp(event);
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        if (isSlashOpen) {
          setValue("");
          setCursor(0);
        }
        return;
      }

      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handlePickerEnter();
        return;
      }
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  }

  return (
    <div className="relative shrink-0">
      {isSlashOpen ? (
        <ChatSlashMenu
          payPlanItems={filteredPayPlanItems}
          planItems={filteredPlanItems}
          entries={slashEntries}
          highlightedIndex={highlightedIndex}
          onHighlight={setHighlightedIndex}
          onSelect={(entry) => void handleSelectSlashEntry(entry)}
        />
      ) : null}

      {isMentionOpen ? (
        <ChatCategoryMentionMenu
          options={mentionOptions}
          highlightedIndex={highlightedIndex}
          onHighlight={setHighlightedIndex}
          onSelect={handleSelectCategoryMention}
        />
      ) : null}

      <div className={cn("flex max-h-28 w-full items-end", CONTROL_GAP)}>
        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={isInputDisabled}
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Menu"
                className={cn(
                  CONTROL_MIN_HEIGHT,
                  GLASS_SURFACE,
                  "size-9 shrink-0 rounded-full p-0",
                )}
              />
            }
          >
            <PlusIcon className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" sideOffset={8}>
            <DropdownMenuItem onClick={() => setIsCalculatorOpen(true)}>
              <CalculatorIcon className="size-4" />
              Kalkulator
            </DropdownMenuItem>
            <DropdownMenuItem>Upload struk</DropdownMenuItem>
            <DropdownMenuItem>Input manual</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ChatCalculatorSheet
          open={isCalculatorOpen}
          onOpenChange={setIsCalculatorOpen}
          onUseAmount={handleUseCalculatorAmount}
        />

        <div
          className={cn(
            CONTROL_MIN_HEIGHT,
            GLASS_SURFACE,
            "flex max-h-28 min-w-0 flex-1 items-center overflow-hidden rounded-full py-0 pl-3 pr-1",
          )}
        >
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setCursor(event.target.selectionStart ?? 0);
              setHighlightedIndex(0);
            }}
            onSelect={syncCursor}
            onClick={syncCursor}
            onKeyUp={syncCursor}
            onKeyDown={handleKeyDown}
            placeholder="Ketik transaksi... / PayPlan · @ kategori"
            disabled={isInputDisabled}
            rows={1}
            className={cn(
              CONTROL_MIN_HEIGHT,
              "max-h-24 flex-1 resize-none overflow-y-auto rounded-full border-0 bg-transparent px-0 py-0 text-sm leading-9 shadow-none focus-visible:border-0 focus-visible:ring-0",
            )}
          />

          {hasText && !isPickerOpen ? (
            <Button
              type="button"
              size="icon-xs"
              onClick={() => void handleSubmit()}
              disabled={isInputDisabled}
              aria-label="Kirim pesan"
              className="mr-0.5 size-7 shrink-0 rounded-full"
            >
              <ArrowUpIcon className="size-3.5" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
