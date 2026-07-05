import Link from "next/link";

import { OVERVIEW_ACTION_LINK } from "@/config/overview";
import { cn } from "@/lib/utils";

interface OverviewActionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function OverviewActionLink({
  href,
  children,
  className,
}: OverviewActionLinkProps) {
  return (
    <Link href={href} className={cn(OVERVIEW_ACTION_LINK, className)}>
      {children}
    </Link>
  );
}
