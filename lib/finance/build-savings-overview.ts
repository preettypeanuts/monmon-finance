import type { SavingsGoalRecord, SavingsOverview } from "@/types/savings-goal";

export function buildSavingsOverview(
  goals: SavingsGoalRecord[],
  availableBalance: number,
): SavingsOverview {
  const activeGoals = goals.filter((goal) => goal.status === "active");
  const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
  const totalTarget = activeGoals.reduce(
    (sum, goal) => sum + goal.targetAmount,
    0,
  );

  return {
    activeCount: activeGoals.length,
    totalSaved,
    totalTarget,
    availableBalance,
    freeBalance: availableBalance - totalSaved,
  };
}

export function getSavingsGoalProgress(goal: SavingsGoalRecord): number {
  if (goal.targetAmount <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
}
