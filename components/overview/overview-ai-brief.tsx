import { generateJournalCondition } from "@/lib/ai/generate-journal-condition";
import { OverviewAiBriefCard } from "@/components/overview/overview-ai-brief-card";
import { buildOverviewBrief } from "@/lib/finance/build-overview-brief";
import { cn } from "@/lib/utils";
import type { OverviewAiBriefInputs } from "@/types/overview";

interface OverviewAiBriefProps extends OverviewAiBriefInputs {
  className?: string;
}

export async function OverviewAiBrief({
  journalTransactions,
  availableBalance,
  todaySummary,
  plansOverview,
  className,
}: OverviewAiBriefProps) {
  const condition = await generateJournalCondition(
    new Date(),
    journalTransactions,
    availableBalance,
  );

  const brief = buildOverviewBrief(condition, todaySummary, plansOverview);

  return <OverviewAiBriefCard brief={brief} className={cn(className)} />;
}
