"use client";

import {
  ArrowUpIcon,
  CalculatorIcon,
  PlusIcon,
} from "@/lib/icons";
import { useEffect, useMemo, useState } from "react";

import { ChatCalculatorSheet } from "@/components/chat/chat-calculator-sheet";
import { ChatSlashMenu } from "@/components/chat/chat-slash-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { GLASS_SURFACE } from "@/config/glass";
import { CONTROL_GAP } from "@/config/spacing";
import { filterActivePlanChatItems } from "@/lib/plans/active-plan-chat";
import { filterUnpaidPayPlanChatItems } from "@/lib/planner/unpaid-payplan-chat";
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
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const hasText = value.trim().length > 0;
  const isInputDisabled = disabled || isSubmitting;
  const slashMatch = value.match(/^\/(.*)$/);
  const hasSlashActions = Boolean(onPayPlan || onMarkPlanDone);
  const isSlashOpen = slashMatch !== null && hasSlashActions;
  const slashQuery = slashMatch?.[1]?.trim() ?? "";
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
      ...filteredPlanItems.map((item): ChatSlashEntry => ({ kind: "plan", item })),
    ],
    [filteredPayPlanItems, filteredPlanItems],
  );

  useEffect(() => {
    setHighlightedIndex(0);
  }, [slashQuery, slashEntries.length]);

  useEffect(() => {
    if (draftText === null) {
      return;
    }

    setValue(draftText);
    onDraftTextApplied?.();
  }, [draftText, onDraftTextApplied]);

  async function handleSubmit() {
    if (isSlashOpen) {
      return;
    }

    const text = value.trim();
    if (!text || isSubmitting || disabled) return;

    setIsSubmitting(true);
    setValue("");

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

  function handleUseCalculatorAmount(amount: number) {
    const amountText = String(amount);
    setValue((current) => {
      const trimmed = current.trimEnd();
      return trimmed.length === 0 ? amountText : `${trimmed} ${amountText}`;
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (isSlashOpen) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedIndex((current) =>
          slashEntries.length === 0
            ? 0
            : (current + 1) % slashEntries.length,
        );
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedIndex((current) =>
          slashEntries.length === 0
            ? 0
            : (current - 1 + slashEntries.length) % slashEntries.length,
        );
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setValue("");
        return;
      }

      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        const selected = slashEntries[highlightedIndex];

        if (selected) {
          void handleSelectSlashEntry(selected);
        }

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
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik transaksi... atau / untuk PayPlan & Plans"
            disabled={isInputDisabled}
            rows={1}
            className={cn(
              CONTROL_MIN_HEIGHT,
              "max-h-24 flex-1 resize-none overflow-y-auto rounded-full border-0 bg-transparent px-0 py-0 text-sm leading-9 shadow-none focus-visible:border-0 focus-visible:ring-0",
            )}
          />

          {hasText && !isSlashOpen ? (
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
