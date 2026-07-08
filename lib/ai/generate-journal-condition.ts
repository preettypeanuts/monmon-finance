import { isGeminiConfigured } from "@/lib/ai/gemini-client";
import { generateJournalConditionWithGemini } from "@/lib/ai/generate-journal-condition-gemini";
import {
  getCachedAiInsight,
  setCachedAiInsight,
} from "@/lib/db/ai-insight-cache";
import { buildFallbackJournalCondition } from "@/lib/finance/build-journal-condition";
import { buildTodaySummary } from "@/lib/finance/build-summary";
import { toDayKey } from "@/lib/finance/day-range";
import type { JournalCondition } from "@/types/journal";

interface JournalSummaryTransaction {
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
}

export async function generateJournalCondition(
  userId: string,
  date: Date,
  transactions: JournalSummaryTransaction[],
  cumulativeBalance: number,
): Promise<JournalCondition> {
  const dateKey = toDayKey(date);
  const cached = await getCachedAiInsight<JournalCondition>(
    userId,
    "journal_condition",
    dateKey,
  );

  if (cached) {
    return cached;
  }

  const summary = buildTodaySummary(transactions);

  if (isGeminiConfigured()) {
    try {
      const condition = await generateJournalConditionWithGemini(
        date,
        transactions,
        cumulativeBalance,
      );
      await setCachedAiInsight(
        userId,
        "journal_condition",
        dateKey,
        condition,
      );
      return condition;
    } catch {
      return buildFallbackJournalCondition(
        transactions,
        summary.totalExpense,
        summary.totalIncome,
        cumulativeBalance,
      );
    }
  }

  return buildFallbackJournalCondition(
    transactions,
    summary.totalExpense,
    summary.totalIncome,
    cumulativeBalance,
  );
}
