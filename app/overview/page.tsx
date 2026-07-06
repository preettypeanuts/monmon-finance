import { OverviewScrollShell } from "@/components/overview/overview-scroll-shell";
import { OverviewView } from "@/components/overview/overview-view";
import { getOverviewPageData } from "@/lib/db/overview";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const data = await getOverviewPageData();

  return (
    <OverviewScrollShell>
      <OverviewView data={data} />
    </OverviewScrollShell>
  );
}
