import { OverviewScrollShell } from "@/components/overview/overview-scroll-shell";
import { OverviewView } from "@/components/overview/overview-view";
import { requireUserId } from "@/lib/auth/session";
import { getOverviewPageData } from "@/lib/db/overview";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const userId = await requireUserId();
  const data = await getOverviewPageData(userId);

  return (
    <OverviewScrollShell>
      <OverviewView data={data} />
    </OverviewScrollShell>
  );
}
