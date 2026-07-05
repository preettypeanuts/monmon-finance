import { OverviewAiBriefCard } from "@/components/overview/overview-ai-brief-card";
import { OverviewAlertsCard } from "@/components/overview/overview-alerts-card";
import { OverviewBalanceHero } from "@/components/overview/overview-balance-hero";
import { OverviewGreetingCard } from "@/components/overview/overview-greeting-card";
import { OverviewMonthlySnapshotCard } from "@/components/overview/overview-monthly-snapshot-card";
import { OverviewPlansProgressCard } from "@/components/overview/overview-plans-progress-card";
import { OverviewTodayActivityCard } from "@/components/overview/overview-today-activity-card";
import { OverviewUpcomingCard } from "@/components/overview/overview-upcoming-card";
import {
  OVERVIEW_BENTO_GRID,
  OVERVIEW_SPAN_FULL,
  OVERVIEW_SPAN_WIDE,
  OVERVIEW_TOP_PAIR,
} from "@/config/overview";
import type { OverviewPageData } from "@/types/overview";

interface OverviewViewProps {
  data: OverviewPageData;
}

export function OverviewView({ data }: OverviewViewProps) {
  return (
    <div className={OVERVIEW_BENTO_GRID}>
      <div className={OVERVIEW_TOP_PAIR}>
        <OverviewGreetingCard greeting={data.greeting} className="h-full" />
        <OverviewAiBriefCard brief={data.aiBrief} className="h-full" />
      </div>

      <OverviewBalanceHero
        balance={data.balance}
        todayIncome={data.todaySummary.totalIncome}
        todayExpense={data.todaySummary.totalExpense}
        dayDeltas={data.dayDeltas}
        className={OVERVIEW_SPAN_FULL}
      />

      <OverviewAlertsCard alerts={data.alerts} />

      <OverviewUpcomingCard items={data.upcoming} />

      <OverviewPlansProgressCard overview={data.plansOverview} />

      <OverviewMonthlySnapshotCard snapshot={data.monthlySnapshot} />

      <OverviewTodayActivityCard
        items={data.todayActivity}
        className={OVERVIEW_SPAN_WIDE}
      />
    </div>
  );
}
