import { MOBILE_BOTTOM_NAV_INDICATOR } from "@/config/mobile-bottom-nav-motion";
import { cn } from "@/lib/utils";

interface MobileBottomNavActiveIndicatorProps {
  width: number;
  x: number;
  visible: boolean;
}

export function MobileBottomNavActiveIndicator({
  width,
  x,
  visible,
}: MobileBottomNavActiveIndicatorProps) {
  return (
    <span
      aria-hidden
      className={cn(
        MOBILE_BOTTOM_NAV_INDICATOR,
        !visible && "opacity-0",
      )}
      style={{
        width: `${width}px`,
        transform: `translateX(${x}px)`,
      }}
    />
  );
}
