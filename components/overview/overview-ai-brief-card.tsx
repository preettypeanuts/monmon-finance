import { FinanceConditionBadgeIcon } from "@/components/shared/ai-summary-badge-icon";
import { OverviewIconShell } from "@/components/overview/overview-icon-shell";
import { OverviewStatusBadge } from "@/components/overview/overview-status-badge";
import { SparkleIcon } from "@/lib/icons";

import {
  OVERVIEW_CARD,
  OVERVIEW_CARD_PADDING,
  OVERVIEW_SECTION_LABEL,
} from "@/config/overview";
import { cn } from "@/lib/utils";
import type { OverviewAiBrief } from "@/types/overview";

interface OverviewAiBriefCardProps {
  brief: OverviewAiBrief;
  className?: string;
}

export function OverviewAiBriefCard({
  brief,
  className,
}: OverviewAiBriefCardProps) {
  return (
    <section className={cn(OVERVIEW_CARD, OVERVIEW_CARD_PADDING, className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <OverviewIconShell variant="purple">
            <SparkleIcon />
          </OverviewIconShell>
          <p className={OVERVIEW_SECTION_LABEL}>AI Brief</p>
        </div>
        <OverviewStatusBadge
          icon={<FinanceConditionBadgeIcon label={brief.conditionLabel} />}
          label={brief.conditionLabel}
        />
      </div>

      <p className="mt-3 text-[13px] leading-[1.6] text-foreground/90">
        {brief.text}
      </p>
    </section>
  );
}
