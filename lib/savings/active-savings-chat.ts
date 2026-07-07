import type { ActiveSavingsChatItem } from "@/types/chat";
import type { SavingsGoalRecord } from "@/types/savings-goal";

export function listActiveSavingsChatItems(
  goals: SavingsGoalRecord[],
): ActiveSavingsChatItem[] {
  return goals
    .filter((goal) => goal.status === "active")
    .map((goal) => ({
      id: goal.id,
      name: goal.name,
      savedAmount: goal.savedAmount,
      targetAmount: goal.targetAmount,
    }))
    .sort((left, right) => left.name.localeCompare(right.name, "id"));
}

export function filterActiveSavingsChatItems(
  items: ActiveSavingsChatItem[],
  query: string,
): ActiveSavingsChatItem[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return items;
  }

  return items.filter((item) => item.name.toLowerCase().includes(normalized));
}
