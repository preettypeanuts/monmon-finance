import type { PlansOverview, PlansUpcomingImpactItem } from "@/types/plan";
import type { TodaySummary } from "@/types/summary";

export type OverviewAlertTone = "warning" | "danger" | "info";

export interface OverviewAlert {
  id: string;
  tone: OverviewAlertTone;
  title: string;
  message: string;
}

export interface OverviewGreeting {
  title: string;
  subtitle: string;
}

export interface OverviewAiBrief {
  text: string;
  conditionLabel: string;
}

export interface OverviewMonthlySnapshot {
  monthLabel: string;
  totalIncome: number;
  totalExpense: number;
  netFlow: number;
  transactionCount: number;
}

export interface OverviewActivityItem {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  timeLabel: string;
  categoryLabel: string;
}

export interface OverviewDayDeltas {
  incomeDelta: number;
  expenseDelta: number;
  balanceDelta: number;
}

export interface OverviewPageData {
  greeting: OverviewGreeting;
  balance: number;
  dayDeltas: OverviewDayDeltas;
  aiBrief: OverviewAiBrief;
  alerts: OverviewAlert[];
  upcoming: PlansUpcomingImpactItem[];
  plansOverview: PlansOverview;
  monthlySnapshot: OverviewMonthlySnapshot;
  todaySummary: TodaySummary;
  todayActivity: OverviewActivityItem[];
}
