/** Start of calendar day in local time. */
export function startOfDay(value: Date = new Date()): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

/** End of calendar day in local time. */
export function endOfDay(value: Date = new Date()): Date {
  return new Date(
    value.getFullYear(),
    value.getMonth(),
    value.getDate(),
    23,
    59,
    59,
    999,
  );
}

export function getDayRange(value: Date = new Date()) {
  const start = startOfDay(value);
  const end = endOfDay(value);

  return { start, end };
}

export function addDays(value: Date, days: number): Date {
  const next = new Date(value);
  next.setDate(next.getDate() + days);
  return next;
}

/** YYYY-MM-DD from a calendar Date using local calendar day. */
export function dateInputFromCalendarDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parse YYYY-MM-DD to UTC noon — stable across server/client timezones. */
export function parseDateOnlyInput(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function toDayKey(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;

  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

export function parseDayKey(dayKey: string): Date {
  const [year, month, day] = dayKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getYesterday(): Date {
  return addDays(startOfDay(new Date()), -1);
}
