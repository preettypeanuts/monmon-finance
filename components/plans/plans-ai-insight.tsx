import { generatePlansInsight } from "@/lib/ai/generate-plans-insight";
import { PlansAiSummary } from "@/components/plans/plans-ai-summary";
import { buildPlansOverview } from "@/lib/finance/build-plans-overview";
import type { PlansInsightInputs } from "@/types/plan";

export async function PlansAiInsight({
  userId,
  plans,
  availableBalance,
}: PlansInsightInputs) {
  const insight = await generatePlansInsight(userId, plans, availableBalance);
  const overview = buildPlansOverview(plans, availableBalance, insight);

  return <PlansAiSummary overview={overview} />;
}
