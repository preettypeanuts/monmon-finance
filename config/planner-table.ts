import { GLASS_FILL } from "@/config/glass";
import { SEPARATED_SURFACE } from "@/config/shape";

export const PLANNER_LIST_CONTAINER =
  "flex min-h-0 flex-1 flex-col overflow-hidden";

export const PLANNER_LIST_FRAME = `${SEPARATED_SURFACE} flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl`;

export const PLANNER_LIST_SCROLL =
  "min-h-0 flex-1 overflow-y-auto overscroll-y-contain";

export const PLANNER_LIST_SECTION = "pb-1.5 last:pb-0";

export const PLANNER_LIST_SECTION_LABEL = [
  "sticky top-0 z-10 px-3 py-1",
  "text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/90",
].join(" ");

export const PLANNER_LIST_GROUP = `${SEPARATED_SURFACE} ${GLASS_FILL} overflow-hidden border-1 border-black/6 dark:border-white/8`;

export const PLANNER_LIST_ICON =
  "flex size-8 shrink-0 items-center justify-center rounded-[0.55rem]";

export const PLANNER_LIST_ROW =
  "flex items-center gap-2.5 px-3 py-2.5";

export const PLANNER_LIST_ROW_CONTENT = "min-w-0 flex-1 self-center";

export const PLANNER_LIST_ROW_TITLE =
  "truncate text-[13px] font-semibold leading-tight text-foreground/92";

export const PLANNER_LIST_ROW_META =
  "mt-0.5 truncate text-[11px] leading-tight text-muted-foreground";

export const PLANNER_LIST_ROW_TRAILING =
  "flex shrink-0 items-center gap-2";

export const PLANNER_LIST_ROW_TRAILING_STACK =
  "flex flex-col items-end gap-0.5";

export const PLANNER_LIST_ROW_STATUS =
  "text-[10px] font-medium leading-tight text-right";

export const PLANNER_LIST_ROW_AMOUNT =
  "text-[13px] font-semibold tabular-nums tracking-tight";

export const PLANNER_LIST_AMOUNT_INCOME =
  "text-[#2FAE52] dark:text-[#34C759]";

export const PLANNER_LIST_AMOUNT_EXPENSE = "text-foreground/88";

export const PLANNER_LIST_DIVIDER =
  "ml-[calc(2rem+0.625rem)] h-px bg-black/8 dark:bg-white/10";

/** @deprecated Use PLANNER_LIST_* constants — kept for imports during migration. */
export const PLANNER_TABLE_CONTAINER = PLANNER_LIST_CONTAINER;
export const PLANNER_TABLE_SCROLL = PLANNER_LIST_SCROLL;
