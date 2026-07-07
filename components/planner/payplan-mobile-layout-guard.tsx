"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useIsMobileViewport } from "@/hooks/use-is-mobile-viewport";
import type { PlannerCalendarLayout } from "@/types/planner";

/** Mobile combines calendar + list — strip manage layout from URL. */
export function PayplanMobileLayoutGuard({
  layout,
  monthKey,
}: {
  layout: PlannerCalendarLayout;
  monthKey: string;
}) {
  const isMobile = useIsMobileViewport();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isMobile || layout === "month") {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "calendar");
    params.set("month", monthKey);
    params.delete("layout");
    router.replace(`${pathname}?${params.toString()}`);
  }, [isMobile, layout, monthKey, pathname, router, searchParams]);

  return null;
}
