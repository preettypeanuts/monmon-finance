import { ExclamationTriangleIcon } from "@/lib/icons";

import { OverviewIconShell } from "@/components/overview/overview-icon-shell";
import {
  OVERVIEW_ALERT_TONE_STYLES,
  OVERVIEW_CARD,
  OVERVIEW_CARD_PADDING,
  OVERVIEW_SECTION_LABEL,
  OVERVIEW_SECTION_TITLE,
} from "@/config/overview";
import { cn } from "@/lib/utils";
import type { OverviewAlert } from "@/types/overview";

interface OverviewAlertsCardProps {
  alerts: OverviewAlert[];
  className?: string;
}

export function OverviewAlertsCard({
  alerts,
  className,
}: OverviewAlertsCardProps) {
  return (
    <section className={cn(OVERVIEW_CARD, OVERVIEW_CARD_PADDING, className)}>
      <div className="flex items-start gap-2.5">
        <OverviewIconShell variant="orange">
          <ExclamationTriangleIcon />
        </OverviewIconShell>
        <div className="min-w-0">
          <p className={OVERVIEW_SECTION_LABEL}>Alerts</p>
          <h2 className={cn("mt-0.5", OVERVIEW_SECTION_TITLE)}>Perlu perhatian</h2>
        </div>
      </div>

      {alerts.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Tidak ada alert saat ini. Semua terlihat aman.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className={cn(
                "rounded-xl px-3 py-2.5",
                OVERVIEW_ALERT_TONE_STYLES[alert.tone],
              )}
            >
              <p className="text-xs font-semibold">{alert.title}</p>
              <p className="mt-0.5 text-[11px] leading-snug opacity-90">
                {alert.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
