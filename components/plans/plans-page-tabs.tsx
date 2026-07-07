"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SAVINGS_PAGE_TITLE, WISH_PAGE_TITLE } from "@/config/navigation";
import { cn } from "@/lib/utils";

export type PlansPageTab = "wish" | "savings";

interface PlansPageTabsProps {
  tab: PlansPageTab;
  className?: string;
}

export function PlansPageTabs({ tab, className }: PlansPageTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function navigate(nextTab: PlansPageTab) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextTab === "wish") {
      params.delete("tab");
    } else {
      params.set("tab", nextTab);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => navigate(value as PlansPageTab)}
      className={cn("w-fit shrink-0", className)}
    >
      <TabsList className="h-8">
        <TabsTrigger value="wish" className="px-2.5 text-xs">
          {WISH_PAGE_TITLE}
        </TabsTrigger>
        <TabsTrigger value="savings" className="px-2.5 text-xs">
          {SAVINGS_PAGE_TITLE}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
