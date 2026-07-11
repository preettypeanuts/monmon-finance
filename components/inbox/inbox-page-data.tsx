import { InboxClientShell } from "@/components/inbox/inbox-client-shell";
import { InboxPageShell } from "@/components/inbox/inbox-page-shell";
import { requireUserId } from "@/lib/auth/session";
import { getAvailableBalance } from "@/lib/db/balance";
import { getInboxMessagesPage } from "@/lib/db/inbox-messages";
import { getTodaySummary } from "@/lib/db/transactions";

export async function InboxPageData() {
  const userId = await requireUserId();
  const [messagesPage, summary, availableBalance] = await Promise.all([
    getInboxMessagesPage(userId),
    getTodaySummary(userId),
    getAvailableBalance(userId),
  ]);

  return (
    <InboxPageShell>
      <InboxClientShell
        initialBootstrap={{
          messages: messagesPage.messages,
          hasMoreMessages: messagesPage.hasMore,
          summary,
          availableBalance,
        }}
      />
    </InboxPageShell>
  );
}
