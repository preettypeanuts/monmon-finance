import { InboxView } from "@/components/chat/inbox-view";
import { InboxMobileLayout } from "@/components/inbox/inbox-mobile-layout";
import { InboxPageShell } from "@/components/inbox/inbox-page-shell";
import { TodaySummaryPanel } from "@/components/finance/today-summary-panel";
import {
  INBOX_CHAT_COLUMN,
  INBOX_PAGE_ROW,
  INBOX_SUMMARY_ASIDE,
} from "@/config/inbox-desktop";
import { requireUserId } from "@/lib/auth/session";
import { getYesterdayDailySummary } from "@/lib/db/daily-summary";
import { getInboxMessages } from "@/lib/db/inbox-messages";
import { listPlans } from "@/lib/db/plans";
import { listPlannedItems } from "@/lib/db/planned-items";
import { listActiveSavingsGoals } from "@/lib/db/savings-goals";
import { getTodaySummary } from "@/lib/db/transactions";
import { listActivePlanChatItems } from "@/lib/plans/active-plan-chat";
import { listUnpaidPayPlanChatItems } from "@/lib/planner/unpaid-payplan-chat";
import { listActiveSavingsChatItems } from "@/lib/savings/active-savings-chat";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const userId = await requireUserId();
  const [summary, dailySummary, initialMessages, plannedItems, plans, savingsGoals] =
    await Promise.all([
      getTodaySummary(userId),
      getYesterdayDailySummary(userId),
      getInboxMessages(userId),
      listPlannedItems(userId),
      listPlans(userId),
      listActiveSavingsGoals(userId),
    ]);
  const unpaidPayPlanItems = listUnpaidPayPlanChatItems(plannedItems);
  const activePlanItems = listActivePlanChatItems(plans);
  const activeSavingsItems = listActiveSavingsChatItems(savingsGoals);

  return (
    <InboxPageShell>
      <div className={INBOX_PAGE_ROW}>
        <section className={INBOX_CHAT_COLUMN}>
          <InboxMobileLayout dailySummary={dailySummary} summary={summary}>
            <InboxView
              activePlanItems={activePlanItems}
              activeSavingsItems={activeSavingsItems}
              fixedMobileTopBar
              initialMessages={initialMessages}
              unpaidPayPlanItems={unpaidPayPlanItems}
            />
          </InboxMobileLayout>
        </section>
        <aside className={INBOX_SUMMARY_ASIDE}>
          <TodaySummaryPanel summary={summary} dailySummary={dailySummary} />
        </aside>
      </div>
    </InboxPageShell>
  );
}
