"use client";

import { PlannerCalendarIosEventPill } from "@/components/planner/planner-calendar-ios-event-pill";
import {
  PLANNER_CALENDAR_MOBILE_DAY_BUTTON,
  PLANNER_CALENDAR_MOBILE_DAY_NUMBER,
  PLANNER_CALENDAR_MOBILE_EVENT_SLOT_HEIGHT,
  PLANNER_CALENDAR_MOBILE_EVENTS_GRID_HEIGHT,
  PLANNER_CALENDAR_MOBILE_MAX_VISIBLE,
  PLANNER_CALENDAR_MOBILE_OVERFLOW_LABEL,
  PLANNER_CALENDAR_MOBILE_WEEK_ROW,
  PLANNER_CALENDAR_MOBILE_WEEKDAY_CELL,
  PLANNER_CALENDAR_MOBILE_WEEKDAY_ROW,
  PLANNER_CALENDAR_MOBILE_WEEKS,
  PLANNER_CALENDAR_MOBILE_EVENT_SLOTS,
  PLANNER_CALENDAR_WEEKDAYS,
} from "@/config/planner-calendar-mobile";
import { getPlannerEventColor } from "@/config/planner-calendar";
import { toDayKey } from "@/lib/finance/day-range";
import { isPastDay, isSameMonth, isToday } from "@/lib/planner/calendar";
import { isOccurrencePaid } from "@/lib/planner/installment-occurrence";
import { cn } from "@/lib/utils";
import type { PlannedOccurrence } from "@/types/planner";

type CalendarEntry = {
  key: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

type EventSlot =
  | { kind: "entry"; entry: CalendarEntry }
  | { kind: "overflow"; label: string }
  | { kind: "empty" };

interface PlannerCalendarMonthGridMobileProps {
  year: number;
  month: number;
  gridDays: Date[];
  itemsByDay: Map<string, PlannedOccurrence[]>;
  selectedDayKey: string;
  onSelectDay: (dayKey: string) => void;
}

function chunkWeeks(days: Date[]): Date[][] {
  const weeks: Date[][] = [];

  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7));
  }

  return weeks;
}

function isOverdueOccurrence(item: PlannedOccurrence): boolean {
  if (item.type !== "expense") {
    return false;
  }

  if (isOccurrencePaid(item)) {
    return false;
  }

  return isPastDay(item.dueAt);
}

function buildDayEntries(dayItems: PlannedOccurrence[]): CalendarEntry[] {
  const entries: CalendarEntry[] = [];

  for (const item of dayItems) {
    const overdue = isOverdueOccurrence(item);
    const paid = isOccurrencePaid(item);
    const label = item.type === "income" ? `+ ${item.title}` : item.title;
    const color = getPlannerEventColor(item.category, item.type);

    entries.push({
      key: item.id,
      label,
      className: cn(overdue && "bg-red-500 text-white dark:bg-red-500", paid && "opacity-55"),
      style: overdue ? undefined : { backgroundColor: color },
      title: label,
    });
  }

  return entries;
}

function buildEventSlots(entries: CalendarEntry[]): EventSlot[] {
  const hiddenCount = Math.max(
    entries.length - PLANNER_CALENDAR_MOBILE_MAX_VISIBLE,
    0,
  );
  const slots: EventSlot[] = Array.from(
    { length: PLANNER_CALENDAR_MOBILE_EVENT_SLOTS },
    () => ({ kind: "empty" }),
  );

  if (hiddenCount > 0) {
    if (entries[0]) {
      slots[0] = { kind: "entry", entry: entries[0] };
    }
    if (entries[1]) {
      slots[1] = { kind: "entry", entry: entries[1] };
    }
    slots[2] = {
      kind: "overflow",
      label: `+${hiddenCount} lainnya`,
    };
    return slots;
  }

  entries.slice(0, PLANNER_CALENDAR_MOBILE_EVENT_SLOTS).forEach((entry, index) => {
    slots[index] = { kind: "entry", entry };
  });

  return slots;
}

export function PlannerCalendarMonthGridMobile({
  year,
  month,
  gridDays,
  itemsByDay,
  selectedDayKey,
  onSelectDay,
}: PlannerCalendarMonthGridMobileProps) {
  const weeks = chunkWeeks(gridDays);

  return (
    <div className="min-w-0 overflow-hidden md:hidden">
      <div className={PLANNER_CALENDAR_MOBILE_WEEKDAY_ROW}>
        {PLANNER_CALENDAR_WEEKDAYS.map((weekday) => (
          <div className={PLANNER_CALENDAR_MOBILE_WEEKDAY_CELL} key={weekday.id}>
            {weekday.label}
          </div>
        ))}
      </div>

      <div className={PLANNER_CALENDAR_MOBILE_WEEKS}>
        {weeks.map((week, weekIndex) => (
          <div className={PLANNER_CALENDAR_MOBILE_WEEK_ROW} key={`week-${weekIndex}`}>
            {week.map((date) => {
              const dayKey = toDayKey(date);
              const inMonth = isSameMonth(date, year, month);
              const today = isToday(date);
              const isSelected = dayKey === selectedDayKey;
              const entries = buildDayEntries(itemsByDay.get(dayKey) ?? []);
              const slots = buildEventSlots(entries);

              return (
                <button
                  className={cn(
                    PLANNER_CALENDAR_MOBILE_DAY_BUTTON,
                    !inMonth && "opacity-45",
                  )}
                  key={dayKey}
                  type="button"
                  aria-label={dayKey}
                  aria-pressed={isSelected}
                  onClick={() => onSelectDay(dayKey)}
                >
                  <span
                    className={cn(
                      PLANNER_CALENDAR_MOBILE_DAY_NUMBER,
                      today && "bg-red-500 text-white",
                      isSelected &&
                        !today &&
                        "bg-primary text-primary-foreground",
                      !today &&
                        !isSelected &&
                        inMonth &&
                        "text-foreground",
                      !today &&
                        !isSelected &&
                        !inMonth &&
                        "text-muted-foreground",
                    )}
                  >
                    {date.getDate()}
                  </span>

                  <div
                    className={cn(
                      "mt-1 grid shrink-0 grid-rows-3 gap-0.5 overflow-hidden",
                      PLANNER_CALENDAR_MOBILE_EVENTS_GRID_HEIGHT,
                    )}
                  >
                    {slots.map((slot, slotIndex) => (
                      <div
                        aria-hidden={slot.kind === "empty" ? true : undefined}
                        className={PLANNER_CALENDAR_MOBILE_EVENT_SLOT_HEIGHT}
                        key={`${dayKey}-slot-${slotIndex}`}
                      >
                        {slot.kind === "entry" ? (
                          <PlannerCalendarIosEventPill
                            className={slot.entry.className}
                            label={slot.entry.label}
                            style={slot.entry.style}
                            {...(slot.entry.title ? { title: slot.entry.title } : {})}
                          />
                        ) : null}
                        {slot.kind === "overflow" ? (
                          <span className={PLANNER_CALENDAR_MOBILE_OVERFLOW_LABEL}>
                            <span className="truncate">{slot.label}</span>
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
