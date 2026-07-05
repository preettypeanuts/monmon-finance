import { getCurrentMonthKey, parseMonthKey } from "@/lib/planner/calendar";
import { parsePlannedItemsFilters } from "@/lib/validations/planned-items-manage";
import type { PlannerCalendarLayout, PlannerTab } from "@/types/planner";

function readParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
): string {
  const value = searchParams[key];
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function parsePlannerTab(
  searchParams: Record<string, string | string[] | undefined>,
): PlannerTab {
  const tabValue = readParam(searchParams, "tab");

  if (tabValue === "budget") {
    return "budget";
  }

  return "calendar";
}

function parseCalendarLayout(
  searchParams: Record<string, string | string[] | undefined>,
): PlannerCalendarLayout {
  const tabValue = readParam(searchParams, "tab");

  if (tabValue === "cards") {
    return "cards";
  }

  if (tabValue === "table") {
    return "table";
  }

  if (tabValue === "manage") {
    return readParam(searchParams, "layout") === "table" ? "table" : "cards";
  }

  const layoutValue = readParam(searchParams, "layout");

  if (layoutValue === "cards" || layoutValue === "table") {
    return layoutValue;
  }

  return "month";
}

export function parsePlannerSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): {
  monthKey: string;
  tab: PlannerTab;
  calendarLayout: PlannerCalendarLayout;
  filters: ReturnType<typeof parsePlannedItemsFilters>;
} {
  const monthValue = readParam(searchParams, "month");
  const tab = parsePlannerTab(searchParams);
  const calendarLayout =
    tab === "calendar" ? parseCalendarLayout(searchParams) : "month";
  const filters = parsePlannedItemsFilters(searchParams);

  if (monthValue && parseMonthKey(monthValue)) {
    return {
      monthKey: monthValue,
      tab,
      calendarLayout,
      filters,
    };
  }

  return {
    monthKey: getCurrentMonthKey(),
    tab,
    calendarLayout,
    filters,
  };
}
