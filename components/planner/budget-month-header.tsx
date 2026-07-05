"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { PlannerCalendarHeader } from "@/components/planner/planner-calendar-header";
import { getCurrentMonthKey, shiftMonthKey } from "@/lib/planner/calendar";

interface BudgetMonthHeaderProps {
  monthKey: string;
}

export function BudgetMonthHeader({ monthKey }: BudgetMonthHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function navigateMonth(nextMonthKey: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "budget");
    params.set("month", nextMonthKey);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <PlannerCalendarHeader
      monthKey={monthKey}
      onPrevious={() => navigateMonth(shiftMonthKey(monthKey, -1))}
      onToday={() => navigateMonth(getCurrentMonthKey())}
      onNext={() => navigateMonth(shiftMonthKey(monthKey, 1))}
    />
  );
}
