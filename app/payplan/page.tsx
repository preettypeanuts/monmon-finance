import { BudgetManage } from "@/components/planner/budget-manage";
import { PlannedItemsManage } from "@/components/planner/planned-items-manage";
import { PlannerCalendar } from "@/components/planner/planner-calendar";
import { PlannerCalendarTabBar } from "@/components/planner/planner-calendar-tab-bar";
import { PlannerShell } from "@/components/planner/planner-shell";
import { PlannerTabBar } from "@/components/planner/planner-tab-bar";
import { MobileBackButton } from "@/components/shared/mobile-back-button";
import { APP_GUTTER, STACK_GAP } from "@/config/spacing";
import { listBudgetsForMonth } from "@/lib/db/budgets";
import { listPlannedItems } from "@/lib/db/planned-items";
import { getPlannerMonthData } from "@/lib/db/planner";
import { pickDefaultDayKey } from "@/lib/planner/calendar";
import { cn } from "@/lib/utils";
import { parsePlannerSearchParams } from "@/lib/validations/planner";
import { isPlannerManageLayout } from "@/types/planner";

export const dynamic = "force-dynamic";

interface PayPlanPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PayPlanPage({ searchParams }: PayPlanPageProps) {
  const params = await searchParams;
  const { monthKey, tab, calendarLayout, filters } =
    parsePlannerSearchParams(params);
  const isManage = tab === "calendar" && isPlannerManageLayout(calendarLayout);
  const needsMonthOccurrences = isManage && filters.paymentStatus !== "all";
  const [data, plannedItems, budgets] = await Promise.all([
    tab === "calendar" && (calendarLayout === "month" || needsMonthOccurrences)
      ? getPlannerMonthData(monthKey)
      : null,
    isManage ? listPlannedItems() : null,
    tab === "budget" ? listBudgetsForMonth(monthKey) : null,
  ]);
  const initialDayKey = data
    ? pickDefaultDayKey(data.monthKey, data.marks)
    : null;

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", APP_GUTTER)}>
      <PlannerShell className="min-h-0 flex-1">
        <div className={cn("flex min-h-0 flex-1 flex-col", STACK_GAP)}>
          <header className="shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-2">
                <MobileBackButton className="mt-0.5 shrink-0 md:hidden" />
                <div className="min-w-0">
                  <h1 className="mt-0.5 text-base font-semibold tracking-tight sm:text-lg">
                    PayPlan
                  </h1>
                  <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                    {tab === "budget"
                      ? "Atur budget kategori — terhubung dengan Inbox."
                      : "Tagihan, pemasukan terjadwal, dan budget."}
                  </p>
                </div>
              </div>

              <PlannerTabBar
                tab={tab}
                monthKey={monthKey}
                className="mt-0.5 shrink-0"
              />
            </div>

            {tab === "calendar" ? (
              <div className="mt-3">
                <PlannerCalendarTabBar
                  layout={calendarLayout}
                  monthKey={monthKey}
                />
              </div>
            ) : null}
          </header>

          {tab === "budget" && budgets ? (
            <BudgetManage monthKey={monthKey} budgets={budgets} />
          ) : null}

          {isManage && plannedItems ? (
            <PlannedItemsManage
              layout={calendarLayout}
              items={plannedItems.map((item) => ({
                ...item,
                startAt: item.startAt.toISOString(),
                endAt: item.endAt?.toISOString() ?? null,
              }))}
              filters={filters}
              monthOccurrences={
                data?.items.map((item) => ({
                  ...item,
                  dueAt: item.dueAt.toISOString(),
                })) ?? []
              }
            />
          ) : null}

          {tab === "calendar" &&
          calendarLayout === "month" &&
          data &&
          initialDayKey ? (
            <PlannerCalendar
              monthKey={data.monthKey}
              year={data.year}
              month={data.month}
              initialDayKey={initialDayKey}
              items={data.items.map((item) => ({
                ...item,
                dueAt: item.dueAt.toISOString(),
              }))}
            />
          ) : null}
        </div>
      </PlannerShell>
    </div>
  );
}
