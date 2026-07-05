"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { SIDEBAR_DOCK_ICON_SIZE } from "@/config/sidebar";
import { getDockScale } from "@/lib/sidebar/dock-scale";
import { cn } from "@/lib/utils";

const ITEM_GAP_PX = 6;

interface SidebarDockContextValue {
  mouseY: number | null;
}

const SidebarDockContext = createContext<SidebarDockContextValue>({
  mouseY: null,
});

interface SidebarDockProps {
  children: ReactNode;
  className?: string;
}

export function SidebarDock({ children, className }: SidebarDockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseY, setMouseY] = useState<number | null>(null);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const node = containerRef.current;
      if (!node) {
        return;
      }

      const rect = node.getBoundingClientRect();
      setMouseY(event.clientY - rect.top);
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    setMouseY(null);
  }, []);

  const value = useMemo(() => ({ mouseY }), [mouseY]);

  return (
    <SidebarDockContext.Provider value={value}>
      <div
        ref={containerRef}
        className={cn(
          "flex flex-col items-center overflow-visible",
          className,
        )}
        style={{ gap: ITEM_GAP_PX }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </SidebarDockContext.Provider>
  );
}

interface SidebarDockItemProps {
  index: number;
  children: ReactNode;
  className?: string;
}

export function SidebarDockItem({
  index,
  children,
  className,
}: SidebarDockItemProps) {
  const { mouseY } = useContext(SidebarDockContext);

  // Stable center from layout index (unscaled) — Apple dock approach
  const centerY =
    SIDEBAR_DOCK_ICON_SIZE / 2 +
    index * (SIDEBAR_DOCK_ICON_SIZE + ITEM_GAP_PX);

  const scale = getDockScale(mouseY, centerY);
  const isMagnifying = mouseY !== null;

  return (
    <div
      className={cn(
        "flex origin-left items-center justify-center will-change-transform",
        className,
      )}
      style={{
        height: SIDEBAR_DOCK_ICON_SIZE,
        width: SIDEBAR_DOCK_ICON_SIZE,
        transform: `scale(${scale})`,
        marginBlock: `${((scale - 1) * SIDEBAR_DOCK_ICON_SIZE) / 2}px`,
        transition: isMagnifying
          ? "transform 45ms linear, margin 45ms linear"
          : "transform 200ms cubic-bezier(0.22, 1, 0.36, 1), margin 200ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {children}
    </div>
  );
}
