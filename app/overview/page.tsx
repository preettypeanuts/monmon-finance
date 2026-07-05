import { OverviewScrollShell } from "@/components/overview/overview-scroll-shell";
import { OverviewView } from "@/components/overview/overview-view";
import { MobileBackButton } from "@/components/shared/mobile-back-button";
import { getOverviewPageData } from "@/lib/db/overview";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const data = await getOverviewPageData();

  return (
    <OverviewScrollShell>
      <header className="flex min-w-0 items-start gap-2">
        <MobileBackButton className="mt-0.5 shrink-0 md:hidden" />
      </header>

      <OverviewView data={data} />
    </OverviewScrollShell>
  );
}
