import { PLANS_GLASS } from "@/config/plans";
import { SEPARATED_SHELL } from "@/config/shape";
import { SHELL_PADDING } from "@/config/spacing";
import { cn } from "@/lib/utils";

interface PlansShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PlansShell({ children, className }: PlansShellProps) {
  return (
    <div
      className={cn(
        SEPARATED_SHELL,
        PLANS_GLASS,
        "flex h-full min-h-0 flex-col overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden",
          SHELL_PADDING,
        )}
      >
        {children}
      </div>
    </div>
  );
}
