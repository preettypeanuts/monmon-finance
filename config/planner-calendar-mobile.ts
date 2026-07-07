import { mobileOnly } from "@/config/mobile-layout";
import { WEEKDAY_LABELS } from "@/lib/planner/calendar";

export const PLANNER_CALENDAR_MOBILE_MAX_VISIBLE = 3;
export const PLANNER_CALENDAR_MOBILE_EVENT_SLOTS = 3;

export const PLANNER_CALENDAR_MOBILE_EVENT_SLOT_HEIGHT =
  "h-[18px] min-h-[18px] max-h-[18px] min-w-0 overflow-hidden";

export const PLANNER_CALENDAR_MOBILE_EVENTS_GRID_HEIGHT =
  "h-[58px] min-h-[58px] max-h-[58px]";

export const PLANNER_CALENDAR_MOBILE_WEEK_ROW_HEIGHT =
  "h-[6.5rem] min-h-[6.5rem] max-h-[6.5rem]";

export const PLANNER_CALENDAR_MOBILE_WEEKDAY_ROW =
  "grid grid-cols-7 border-b border-border/50 pb-2";

export const PLANNER_CALENDAR_MOBILE_WEEKDAY_CELL =
  "text-center text-[11px] font-semibold uppercase text-muted-foreground";

export const PLANNER_CALENDAR_MOBILE_WEEKS = "divide-y divide-border/50";

export const PLANNER_CALENDAR_MOBILE_WEEK_ROW = [
  "grid grid-cols-7",
  "[&>button]:min-w-0 [&>button:first-child]:pl-0 [&>button:last-child]:pr-0",
  PLANNER_CALENDAR_MOBILE_WEEK_ROW_HEIGHT,
].join(" ");

export const PLANNER_CALENDAR_MOBILE_DAY_BUTTON = [
  "flex h-full min-h-0 min-w-0 flex-col overflow-hidden px-0.5 py-1.5 text-left",
  "transition-colors active:bg-muted/40",
].join(" ");

export const PLANNER_CALENDAR_MOBILE_DAY_NUMBER = [
  "mx-auto flex size-7 shrink-0 items-center justify-center rounded-full",
  "text-sm font-medium tabular-nums",
].join(" ");

export const PLANNER_CALENDAR_MOBILE_OVERFLOW_LABEL = [
  "flex h-full min-w-0 items-center overflow-hidden px-0.5",
  "text-[10px] font-medium leading-none text-muted-foreground",
].join(" ");

export const PLANNER_CALENDAR_WEEKDAYS = WEEKDAY_LABELS.map((label, index) => ({
  id: String(index),
  label,
}));
