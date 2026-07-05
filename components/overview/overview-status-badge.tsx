import {
  OVERVIEW_STATUS_BADGE,
  OVERVIEW_STATUS_BADGE_ICON,
} from "@/config/overview";
import { cn } from "@/lib/utils";

interface OverviewStatusBadgeProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
}

export function OverviewStatusBadge({
  icon,
  label,
  className,
}: OverviewStatusBadgeProps) {
  return (
    <span className={cn(OVERVIEW_STATUS_BADGE, className)}>
      <span className={OVERVIEW_STATUS_BADGE_ICON}>{icon}</span>
      {label}
    </span>
  );
}
