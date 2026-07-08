import { Suspense } from "react";

import { OverviewAiBrief } from "@/components/overview/overview-ai-brief";
import { OverviewAiBriefSkeleton } from "@/components/overview/overview-ai-brief-skeleton";
import { OverviewScrollShell } from "@/components/overview/overview-scroll-shell";
import { OverviewView } from "@/components/overview/overview-view";
import { requireUserId } from "@/lib/auth/session";
import { getOverviewPageData } from "@/lib/db/overview";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const userId = await requireUserId();
  const { data, aiBriefInputs } = await getOverviewPageData(userId);

  return (
    <OverviewScrollShell>
      <OverviewView
        data={data}
        aiBrief={
          <Suspense
            fallback={<OverviewAiBriefSkeleton className="h-full" />}
          >
            <OverviewAiBrief {...aiBriefInputs} className="h-full" />
          </Suspense>
        }
      />
    </OverviewScrollShell>
  );
}
