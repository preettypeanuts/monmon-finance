"use client";

import { useState } from "react";

import {
  createPlannedItemFromSuggestionAction,
  dismissRecurringSuggestionAction,
} from "@/app/actions/planner";
import { CHAT_BUBBLE_STYLES } from "@/config/chat-bubbles";
import { SEPARATED_SURFACE } from "@/config/shape";
import type { RecurringSuggestion } from "@/lib/finance/detect-recurring-transaction";
import { formatIdr } from "@/lib/finance/format-currency";
import { cn } from "@/lib/utils";

const SHELL = cn(
  SEPARATED_SURFACE,
  CHAT_BUBBLE_STYLES.assistant.surface,
  "flex flex-col gap-2.5 p-3",
);

const BUTTON_BASE = [
  "rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors",
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
  "max-md:py-2 max-md:text-xs",
].join(" ");

const BUTTON_PRIMARY = [
  BUTTON_BASE,
  "border-primary/40 bg-primary/15 text-primary",
  "hover:bg-primary/20 dark:border-primary/50 dark:bg-primary/20",
].join(" ");

const BUTTON_SECONDARY = [
  BUTTON_BASE,
  "border-black/8 bg-black/4 text-foreground",
  "hover:bg-black/8 dark:border-white/12 dark:bg-white/8 dark:hover:bg-white/12",
].join(" ");

interface RecurringSuggestionPromptProps {
  suggestion: RecurringSuggestion;
  lastOccurredAt: string;
  disabled?: boolean;
  onResolved?: () => void;
}

export function RecurringSuggestionPrompt({
  suggestion,
  lastOccurredAt,
  disabled = false,
  onResolved,
}: RecurringSuggestionPromptProps) {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<"accepted" | "dismissed" | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (done === "accepted") {
    return (
      <div className={cn("mt-1.5 max-w-[85%]", SHELL)}>
        <p className="text-[12px] leading-snug text-muted-foreground">
          Oke, {suggestion.keyword} dijadwalkan bulanan di PayPlan (
          {formatIdr(suggestion.averageAmount)}).
        </p>
      </div>
    );
  }

  if (done === "dismissed") {
    return null;
  }

  async function handleAccept() {
    setPending(true);
    setError(null);
    const result = await createPlannedItemFromSuggestionAction({
      suggestion,
      lastOccurredAt,
    });
    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setDone("accepted");
    onResolved?.();
  }

  async function handleDismiss() {
    setPending(true);
    setError(null);
    const result = await dismissRecurringSuggestionAction(suggestion.keyword);
    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setDone("dismissed");
    onResolved?.();
  }

  return (
    <div className={cn("mt-1.5 max-w-[85%]", SHELL)}>
      <p className="text-[12px] leading-snug text-foreground">
        Ini transaksi ke-{suggestion.matchCount} berturut-turut buat{" "}
        <span className="font-medium">{suggestion.keyword}</span> tiap bulan (
        {formatIdr(suggestion.averageAmount)}). Mau aku jadwalkan otomatis di
        PayPlan?
      </p>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          disabled={disabled || pending}
          onClick={() => void handleAccept()}
          className={BUTTON_PRIMARY}
        >
          Ya, jadwalkan
        </button>
        <button
          type="button"
          disabled={disabled || pending}
          onClick={() => void handleDismiss()}
          className={BUTTON_SECONDARY}
        >
          Nanti aja
        </button>
      </div>
      {error ? (
        <p className="text-[11px] text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
