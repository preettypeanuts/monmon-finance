import { formatJournalHeaderDate } from "@/lib/finance/format-datetime";
import type { OverviewGreeting } from "@/types/overview";

function resolveGreetingTitle(date: Date): string {
  const hour = date.getHours();

  if (hour < 11) {
    return "Selamat pagi";
  }

  if (hour < 15) {
    return "Selamat siang";
  }

  if (hour < 18) {
    return "Selamat sore";
  }

  return "Selamat malam";
}

export function formatOverviewGreeting(date: Date = new Date()): OverviewGreeting {
  return {
    title: resolveGreetingTitle(date),
    subtitle: formatJournalHeaderDate(date),
  };
}
