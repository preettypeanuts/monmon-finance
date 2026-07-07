import { APPLE_CALENDAR_EVENT_PILL } from "@/config/payplan-apple-calendar";
import { cn } from "@/lib/utils";

interface PlannerCalendarIosEventPillProps {
  label: string;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}

export function PlannerCalendarIosEventPill({
  label,
  className,
  style,
  title,
}: PlannerCalendarIosEventPillProps) {
  return (
    <div
      className={cn(APPLE_CALENDAR_EVENT_PILL, className)}
      style={style}
      title={title}
    >
      {label}
    </div>
  );
}
