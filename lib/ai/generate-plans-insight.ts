import { isGeminiConfigured } from "@/lib/ai/gemini-client";
import { generatePlansInsightWithGemini } from "@/lib/ai/generate-plans-insight-gemini";
import { buildFallbackPlansInsight } from "@/lib/finance/build-plans-overview";
import type { PlanRecord } from "@/types/plan";

export async function generatePlansInsight(
  plans: PlanRecord[],
  availableBalance: number,
): Promise<string> {
  const activePlans = plans.filter((plan) => plan.status === "active");
  const estimatedCost = activePlans.reduce((sum, plan) => sum + plan.amount, 0);

  if (isGeminiConfigured()) {
    try {
      return await generatePlansInsightWithGemini({
        activeCount: activePlans.length,
        estimatedCost,
        availableBalance,
        planNames: activePlans.map((plan) => plan.name),
      });
    } catch {
      return buildFallbackPlansInsight(estimatedCost, availableBalance);
    }
  }

  return buildFallbackPlansInsight(estimatedCost, availableBalance);
}
