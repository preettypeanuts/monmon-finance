import { formatIdr } from "@/lib/finance/format-currency";
import { getSavingsGoalProgress } from "@/lib/finance/build-savings-overview";
import type { SavingsGoalRecord } from "@/types/savings-goal";

export function formatSavingsGoalLine(goal: SavingsGoalRecord): string {
  const progress = getSavingsGoalProgress(goal);
  return `${goal.name}: ${formatIdr(goal.savedAmount)} / ${formatIdr(goal.targetAmount)} (${progress}%)`;
}

export function formatSavingsGoalsList(goals: SavingsGoalRecord[]): string {
  if (goals.length === 0) {
    return "Belum ada tabungan. Contoh: buat tabungan liburan 5jt";
  }

  const lines = goals.map((goal) => `• ${formatSavingsGoalLine(goal)}`);
  return ["Tabungan kamu:", ...lines].join("\n");
}

export function formatSavingsGoalDetail(goal: SavingsGoalRecord): string {
  const progress = getSavingsGoalProgress(goal);
  const lines = [
    goal.name,
    `Terkumpul: ${formatIdr(goal.savedAmount)}`,
    `Target: ${formatIdr(goal.targetAmount)}`,
    `Progress: ${progress}%`,
    `Status: ${goal.status}`,
  ];

  if (goal.note?.trim()) {
    lines.push(`Catatan: ${goal.note.trim()}`);
  }

  return lines.join("\n");
}
