import { PlansView } from "@/components/plans/plans-view";
import {
  PlansPageTabs,
  type PlansPageTab,
} from "@/components/plans/plans-page-tabs";
import { PlansShell } from "@/components/plans/plans-shell";
import { SavingsGoalsView } from "@/components/savings/savings-goals-view";
import { MobileScrollSurface } from "@/components/shared/mobile-scroll-surface";
import { SAVINGS_PAGE_TITLE, WISH_PAGE_TITLE } from "@/config/navigation";
import { STACK_GAP } from "@/config/spacing";
import { generatePlansInsight } from "@/lib/ai/generate-plans-insight";
import { requireUserId } from "@/lib/auth/session";
import { getAvailableBalance } from "@/lib/db/balance";
import { listPlans } from "@/lib/db/plans";
import { listSavingsGoals } from "@/lib/db/savings-goals";
import { buildPlansOverview } from "@/lib/finance/build-plans-overview";
import { buildSavingsOverview } from "@/lib/finance/build-savings-overview";
import { getPlansUpcomingImpact } from "@/lib/planner/build-plans-upcoming-impact";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PlansPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parsePlansPageTab(
  params: Record<string, string | string[] | undefined>,
): PlansPageTab {
  const tab = params.tab;
  const value = Array.isArray(tab) ? tab[0] : tab;
  return value === "savings" ? "savings" : "wish";
}

export default async function PlansPage({ searchParams }: PlansPageProps) {
  const userId = await requireUserId();
  const params = await searchParams;
  const tab = parsePlansPageTab(params);
  const isSavingsTab = tab === "savings";

  const [plans, savingsGoals, availableBalance, upcomingImpact] =
    await Promise.all([
      listPlans(userId),
      listSavingsGoals(userId),
      getAvailableBalance(userId),
      getPlansUpcomingImpact(userId),
    ]);

  const insight = await generatePlansInsight(plans, availableBalance);
  const plansOverview = buildPlansOverview(plans, availableBalance, insight);
  const savingsOverview = buildSavingsOverview(savingsGoals, availableBalance);
  const pageTitle = isSavingsTab ? SAVINGS_PAGE_TITLE : WISH_PAGE_TITLE;
  const pageDescription = isSavingsTab
    ? "Target tabungan dan saldo bebas setelah alokasi."
    : "Wishlist belanja dan sisa saldo setelah wish.";

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col")}>
      <PlansShell className="min-h-0 flex-1">
        <MobileScrollSurface
          className={cn(
            "flex min-h-0 flex-1 flex-col md:p-3",
            STACK_GAP,
            "overflow-y-auto overscroll-y-contain",
            "md:pb-20",
          )}
          title={pageTitle}
        >
          <header className="shrink-0 max-md:hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="mt-0.5 text-base font-semibold tracking-tight sm:text-lg">
                  {pageTitle}
                </h1>
                <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                  {pageDescription}
                </p>
              </div>
              <PlansPageTabs tab={tab} />
            </div>
          </header>

          <div className="flex items-center justify-between gap-3 md:hidden">
            <p className="text-[11px] text-muted-foreground">{pageDescription}</p>
            <PlansPageTabs tab={tab} />
          </div>

          {isSavingsTab ? (
            <SavingsGoalsView
              goals={savingsGoals}
              overview={savingsOverview}
            />
          ) : (
            <PlansView
              plans={plans}
              overview={plansOverview}
              upcomingImpact={upcomingImpact}
            />
          )}
        </MobileScrollSurface>
      </PlansShell>
    </div>
  );
}
