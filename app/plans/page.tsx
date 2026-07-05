import { PlansView } from "@/components/plans/plans-view";
import { PlansShell } from "@/components/plans/plans-shell";
import { MobileBackButton } from "@/components/shared/mobile-back-button";
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
    <div className={cn("flex min-h-0 flex-1 flex-col", APP_GUTTER)}>
      <PlansShell className="min-h-0 flex-1">
        <div className={cn("flex min-h-0 flex-1 flex-col", STACK_GAP)}>
          <header className="shrink-0">
            <div className="flex min-w-0 items-start gap-2">
              <MobileBackButton className="mt-0.5 shrink-0 md:hidden" />
              <div className="min-w-0">
                <h1 className="mt-0.5 text-base font-semibold tracking-tight sm:text-lg">
                  {WISH_PAGE_TITLE}
                </h1>
                <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                  Wishlist belanja dan sisa saldo setelah wish.
                </p>
              </div>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
            <div className={cn("flex flex-col", STACK_GAP)}>
              <PlansView
                plans={plans}
                overview={overview}
                upcomingImpact={upcomingImpact}
              />
            </div>
          </div>
        </div>
      </PlansShell>
    </div>
  );
}
