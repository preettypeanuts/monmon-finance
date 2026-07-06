import { PlansView } from "@/components/plans/plans-view";
import { PlansShell } from "@/components/plans/plans-shell";
import { MobileScrollSurface } from "@/components/shared/mobile-scroll-surface";
import { WISH_PAGE_TITLE } from "@/config/navigation";
import { APP_GUTTER, STACK_GAP } from "@/config/spacing";
import { generatePlansInsight } from "@/lib/ai/generate-plans-insight";
import { getAvailableBalance } from "@/lib/db/balance";
import { listPlans } from "@/lib/db/plans";
import { buildPlansOverview } from "@/lib/finance/build-plans-overview";
import { getPlansUpcomingImpact } from "@/lib/planner/build-plans-upcoming-impact";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PlansPage() {
  const [plans, availableBalance, upcomingImpact] = await Promise.all([
    listPlans(),
    getAvailableBalance(),
    getPlansUpcomingImpact(),
  ]);
  const insight = await generatePlansInsight(plans, availableBalance);
  const overview = buildPlansOverview(plans, availableBalance, insight);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", APP_GUTTER, "max-md:p-0")}>
      <PlansShell className="min-h-0 flex-1">
        <MobileScrollSurface
          className={cn(
            "flex min-h-0 flex-1 flex-col",
            STACK_GAP,
            "max-md:overflow-y-auto max-md:overscroll-y-contain",
            "md:overflow-hidden",
          )}
          title={WISH_PAGE_TITLE}
        >
          <header className="shrink-0 max-md:hidden">
            <div className="min-w-0">
              <h1 className="mt-0.5 text-base font-semibold tracking-tight sm:text-lg">
                {WISH_PAGE_TITLE}
              </h1>
              <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                Wishlist belanja dan sisa saldo setelah wish.
              </p>
            </div>
          </header>

          <p className="text-[11px] text-muted-foreground md:hidden max-md:-mt-1">
            Wishlist belanja dan sisa saldo setelah wish.
          </p>

          <PlansView
            plans={plans}
            overview={overview}
            upcomingImpact={upcomingImpact}
          />
        </MobileScrollSurface>
      </PlansShell>
    </div>
  );
}
