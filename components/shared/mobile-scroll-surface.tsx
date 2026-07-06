"use client";

import { useRef } from "react";

import { MobilePageTitle } from "@/components/shared/mobile-page-title";
import { useSyncMobileScrollChrome } from "@/components/shared/mobile-scroll-chrome-provider";
import {
  MOBILE_CHROME_SCROLL_INSET,
  MOBILE_PAGE_SCROLL_INSET_X,
  MOBILE_SCROLL_BOTTOM_SPACER,
} from "@/config/mobile-chrome";
import { useMobileLargeTitleScroll } from "@/hooks/use-mobile-large-title-scroll";
import { cn } from "@/lib/utils";

interface MobileScrollSurfaceProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function MobileScrollSurface({
  children,
  className,
  title,
}: MobileScrollSurfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { showBlur, showCompactTitle } = useMobileLargeTitleScroll(
    () => scrollRef.current,
    titleRef,
  );

  useSyncMobileScrollChrome(title, showBlur, showCompactTitle);

  return (
    <div
      ref={scrollRef}
      className={cn(
        MOBILE_PAGE_SCROLL_INSET_X,
        MOBILE_CHROME_SCROLL_INSET,
        className,
      )}
    >
      {title ? <MobilePageTitle ref={titleRef}>{title}</MobilePageTitle> : null}
      {children}
      <div aria-hidden className={MOBILE_SCROLL_BOTTOM_SPACER} />
    </div>
  );
}
