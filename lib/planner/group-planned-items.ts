import { formatPlannedItemKind } from "@/lib/planner/format-planned-item";
import type { PlannedItemKind, PlannedItemRecord } from "@/types/planner";

const KIND_ORDER: PlannedItemKind[] = [
  "bill",
  "subscription",
  "installment",
  "income",
];

export interface PlannedItemGroup {
  kind: PlannedItemKind;
  label: string;
  items: PlannedItemRecord[];
}

export function groupPlannedItemsByKind(
  items: PlannedItemRecord[],
): PlannedItemGroup[] {
  const groups = new Map<PlannedItemKind, PlannedItemRecord[]>();

  for (const item of items) {
    const existing = groups.get(item.kind);

    if (existing) {
      existing.push(item);
      continue;
    }

    groups.set(item.kind, [item]);
  }

  return KIND_ORDER.filter((kind) => groups.has(kind)).map((kind) => ({
    kind,
    label: formatPlannedItemKind(kind),
    items: groups.get(kind) ?? [],
  }));
}
