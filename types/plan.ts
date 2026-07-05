export type PlanStatus = "active" | "done";

export interface PlanRecord {
  id: string;
  name: string;
  amount: number;
  category: string;
  status: PlanStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlanFormInput {
  name: string;
  amount: number;
  category: string;
  status: PlanStatus;
  note?: string;
}

/** Tone derived from spend vs balance — drives AI summary styling. */
export type PlansInsightTone = "empty" | "safe" | "tight" | "unsafe";

export interface PlansInsightMeta {
  tone: PlansInsightTone;
  label: string;
}

export interface PlansOverview {
  activeCount: number;
  estimatedCost: number;
  availableBalance: number;
  remainingBalance: number;
  insight: string;
  insightMeta: PlansInsightMeta;
}

export interface PlansUpcomingImpactItem {
  id: string;
  name: string;
  amount: number;
  dueAt: string;
  dueLabel: string;
  daysUntil: number;
  daysUntilLabel: string;
}
