import {
  OVERVIEW_ICON_SHELL_BASE,
  OVERVIEW_ICON_SHELL_LG,
  OVERVIEW_ICON_SHELL_MD,
  OVERVIEW_ICON_VARIANTS,
  type OverviewIconVariant,
} from "@/config/overview";
import { cn } from "@/lib/utils";

interface OverviewIconShellProps {
  variant: OverviewIconVariant;
  size?: "md" | "lg";
  className?: string;
  children: React.ReactNode;
}

export function OverviewIconShell({
  variant,
  size = "md",
  className,
  children,
}: OverviewIconShellProps) {
  return (
    <div
      className={cn(
        OVERVIEW_ICON_SHELL_BASE,
        size === "lg" ? OVERVIEW_ICON_SHELL_LG : OVERVIEW_ICON_SHELL_MD,
        OVERVIEW_ICON_VARIANTS[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
