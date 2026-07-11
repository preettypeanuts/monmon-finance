import { NextResponse } from "next/server";

import { getApiUserId } from "@/lib/auth/api-session";
import { getAvailableBalance } from "@/lib/db/balance";
import { getInboxMessagesPage } from "@/lib/db/inbox-messages";
import { getTodaySummary } from "@/lib/db/transactions";

export async function GET() {
  const userId = await getApiUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [messagesPage, summary, availableBalance] = await Promise.all([
    getInboxMessagesPage(userId),
    getTodaySummary(userId),
    getAvailableBalance(userId),
  ]);

  return NextResponse.json({
    messages: messagesPage.messages,
    hasMoreMessages: messagesPage.hasMore,
    summary,
    availableBalance,
  });
}
