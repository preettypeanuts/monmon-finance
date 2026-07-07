export type SavingsGoalStatus = "active" | "completed" | "paused";

export interface SavingsGoalRecord {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  status: SavingsGoalStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsGoalFormInput {
  name: string;
  targetAmount: number;
  savedAmount: number;
  status: SavingsGoalStatus;
  note?: string;
}

export interface SavingsOverview {
  activeCount: number;
  totalSaved: number;
  totalTarget: number;
  availableBalance: number;
  freeBalance: number;
}
