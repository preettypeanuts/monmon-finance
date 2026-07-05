"use client";

import { CalendarBlankIcon, ChartBarIcon } from "@/lib/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { PlannerTab } from "@/types/planner";

interface PlannerTabBarProps {
  tab: PlannerTab;
  monthKey: string;
  className?: string;
}

export function PlannerTabBar({
  tab,
  monthKey,
  className,
}: PlannerTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function navigate(nextTab: PlannerTab) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", nextTab);
    params.set("month", monthKey);

    if (nextTab === "budget") {
      params.delete("layout");
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => navigate(value as PlannerTab)}
      className={cn("w-fit shrink-0", className)}
    >
      <TabsList className="h-8">
        <TabsTrigger
          value="calendar"
          className="gap-1.5 px-2.5 text-xs"
          aria-label="Kalender"
        >
          <CalendarBlankIcon className="size-3.5" />
          <span className="hidden sm:inline">Kalender</span>
        </TabsTrigger>
        <TabsTrigger
          value="budget"
          className="gap-1.5 px-2.5 text-xs"
          aria-label="Budget"
        >
          <ChartBarIcon className="size-3.5" />
          <span className="hidden sm:inline">Budget</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
