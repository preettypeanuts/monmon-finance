import { NextResponse } from "next/server";

import { getApiUserId } from "@/lib/auth/api-session";
import { ensureDailySummaryForDay, getDailySummaryForDay } from "@/lib/db/daily-summary";
import { getInboxSlashContext } from "@/lib/inbox/get-inbox-deferred-data";

export async function GET(request: Request) {
  const userId = await getApiUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scope = new URL(request.url).searchParams.get("scope");

  if (scope === "slash") {
    return NextResponse.json(await getInboxSlashContext(userId));
  }

  if (scope === "daily-summary") {
    const today = new Date();
    await ensureDailySummaryForDay(userId, today);
    const dailySummary = await getDailySummaryForDay(userId, today);
    return NextResponse.json({ dailySummary });
  }

  return NextResponse.json({ error: "Invalid scope." }, { status: 400 });
}
