import type { SavingsGoalRecord } from "@/types/savings-goal";

export function findSavingsGoalByQuery(
  goals: SavingsGoalRecord[],
  query: string,
): SavingsGoalRecord | null {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  const exact = goals.find((goal) => goal.name.toLowerCase() === normalized);
  if (exact) {
    return exact;
  }

  const matches = goals.filter((goal) =>
    goal.name.toLowerCase().includes(normalized),
  );

  if (matches.length === 1) {
    return matches[0];
  }

  if (matches.length > 1) {
    throw new Error(
      `Ada beberapa tabungan cocok: ${matches.map((goal) => goal.name).join(", ")}. Sebut nama yang lebih spesifik.`,
    );
  }

  return null;
}
