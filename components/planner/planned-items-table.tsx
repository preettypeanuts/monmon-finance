import { PlannedItemListRow } from "@/components/planner/planned-item-list-row";
import { PLANNER_MANAGE_EMPTY } from "@/config/planner-manage";
import {
  PLANNER_LIST_CONTAINER,
  PLANNER_LIST_DIVIDER,
  PLANNER_LIST_FRAME,
  PLANNER_LIST_GROUP,
  PLANNER_LIST_SCROLL,
  PLANNER_LIST_SECTION,
  PLANNER_LIST_SECTION_LABEL,
} from "@/config/planner-table";
import { groupPlannedItemsByKind } from "@/lib/planner/group-planned-items";
import type { PlannedItemRecord } from "@/types/planner";

interface PlannedItemsTableProps {
  items: PlannedItemRecord[];
  disabled?: boolean;
  filteredEmpty?: boolean;
  onEdit: (item: PlannedItemRecord) => void;
  onDelete: (item: PlannedItemRecord) => void;
}

export function PlannedItemsTable({
  items,
  disabled = false,
  filteredEmpty = false,
  onEdit,
  onDelete,
}: PlannedItemsTableProps) {
  if (items.length === 0) {
    return (
      <div className={PLANNER_MANAGE_EMPTY}>
        <p className="text-sm font-medium">
          {filteredEmpty ? "Tidak ada jadwal cocok" : "Belum ada jadwal"}
        </p>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          {filteredEmpty
            ? "Ubah filter atau reset untuk melihat jadwal lain."
            : "Tambah tagihan, langganan, atau cicilan untuk muncul di kalender."}
        </p>
      </div>
    );
  }

  const groups = groupPlannedItemsByKind(items);

  return (
    <div className={PLANNER_LIST_CONTAINER}>
      <div className={PLANNER_LIST_FRAME}>
        <div className={PLANNER_LIST_SCROLL}>
          {groups.map((group) => (
            <section key={group.kind} className={PLANNER_LIST_SECTION}>
              <h2 className={PLANNER_LIST_SECTION_LABEL}>{group.label}</h2>
              <div className={PLANNER_LIST_GROUP}>
                {group.items.map((item, index) => (
                  <div key={item.id}>
                    <PlannedItemListRow
                      item={item}
                      disabled={disabled}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                    {index < group.items.length - 1 ? (
                      <div className={PLANNER_LIST_DIVIDER} aria-hidden />
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
