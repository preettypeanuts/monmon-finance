import type { ActivePlanChatItem } from "@/types/chat";
import type { PlanRecord } from "@/types/plan";

export function listActivePlanChatItems(plans: PlanRecord[]): ActivePlanChatItem[] {
  return plans
    .filter((plan) => plan.status === "active")
    .map((plan) => ({
      id: plan.id,
      name: plan.name,
      amount: plan.amount,
      category: plan.category,
    }))
    .sort((left, right) => left.name.localeCompare(right.name, "id"));
}

export function filterActivePlanChatItems(
  items: ActivePlanChatItem[],
  query: string,
): ActivePlanChatItem[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return items;
  }

  return items.filter((item) => {
    const haystack = `${item.name} ${item.category}`.toLowerCase();
    return haystack.includes(normalized);
  });
}
