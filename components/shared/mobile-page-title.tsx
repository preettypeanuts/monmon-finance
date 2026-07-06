import { forwardRef } from "react";

import { MOBILE_PAGE_TITLE_LARGE } from "@/config/mobile-chrome";
import { cn } from "@/lib/utils";

interface MobilePageTitleProps {
  children: React.ReactNode;
  className?: string;
}

/** iOS large title — left-aligned, scrolls with content. */
export const MobilePageTitle = forwardRef<HTMLHeadingElement, MobilePageTitleProps>(
  function MobilePageTitle({ children, className }, ref) {
    return (
      <h1 ref={ref} className={cn(MOBILE_PAGE_TITLE_LARGE, className)}>
        {children}
      </h1>
    );
  },
);
