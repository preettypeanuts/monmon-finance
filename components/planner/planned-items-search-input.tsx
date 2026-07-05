"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { SEPARATED_CONTROL } from "@/config/shape";
import { buildPlannedItemsManageParams } from "@/lib/validations/planned-items-manage";
import { cn } from "@/lib/utils";
import type { PlannedItemsFilters, PlannerTab } from "@/types/planner";

interface PlannedItemsSearchInputProps {
  filters: PlannedItemsFilters;
  tab: Extract<PlannerTab, "cards" | "table">;
}

export function PlannedItemsSearchInput({
  filters,
  tab,
}: PlannedItemsSearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(filters.q);

  useEffect(() => {
    setQ(filters.q);
  }, [filters.q]);

  useEffect(() => {
    if (q.trim() === filters.q.trim()) {
      return;
    }

    const handle = window.setTimeout(() => {
      const params = buildPlannedItemsManageParams(
        { ...filters, q },
        tab,
        new URLSearchParams(searchParams.toString()),
      );

      router.push(`${pathname}?${params.toString()}`);
    }, 300);

    return () => window.clearTimeout(handle);
  }, [q, filters, tab, pathname, router, searchParams]);

  return (
    <Input
      value={q}
      onChange={(event) => setQ(event.target.value)}
      placeholder="Cari jadwal..."
      aria-label="Cari jadwal"
      className={cn(SEPARATED_CONTROL, "h-8 w-36 sm:w-44")}
    />
  );
}
