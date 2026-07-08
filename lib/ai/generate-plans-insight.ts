import { isGeminiConfigured } from "@/lib/ai/gemini-client";
import { generatePlansInsightWithGemini } from "@/lib/ai/generate-plans-insight-gemini";
import {
  getCachedAiInsight,
  setCachedAiInsight,
  todayDateKey,
} from "@/lib/db/ai-insight-cache";
import { buildFallbackPlansInsight } from "@/lib/finance/build-plans-overview";
import type { PlanRecord } from "@/types/plan";

export async function generatePlansInsight(
  userId: string,
  plans: PlanRecord[],
  availableBalance: number,
): Promise<string> {
  const dateKey = todayDateKey();
  const cached = await getCachedAiInsight<string>(
    userId,
    "plans_insight",
    dateKey,
  );

  if (cached) {
    return cached;
  }

  const activePlans = plans.filter((plan) => plan.status === "active");
  const estimatedCost = activePlans.reduce((sum, plan) => sum + plan.amount, 0);

  if (isGeminiConfigured()) {
    try {
      const insight = await generatePlansInsightWithGemini({
        activeCount: activePlans.length,
        estimatedCost,
        availableBalance,
        planNames: activePlans.map((plan) => plan.name),
      });
      await setCachedAiInsight(userId, "plans_insight", dateKey, insight);
      return insight;
    } catch {
      return buildFallbackPlansInsight(estimatedCost, availableBalance);
    }
  }

  return buildFallbackPlansInsight(estimatedCost, availableBalance);
}
