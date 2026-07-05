"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SettingsSheet } from "@/components/shared/settings-sheet";
import {
  SidebarDock,
  SidebarDockItem,
  useSidebarDockTooltipVisible,
} from "@/components/shared/sidebar-dock";
import { useSidebar } from "@/components/ui/sidebar";
import { APP_NAME, APP_NAME_INITIAL } from "@/config/app";
import { mainNavItems } from "@/config/navigation";
import {
  SIDEBAR_APP_ICON_GLYPH,
  SIDEBAR_APP_ICON_GRADIENTS,
  SIDEBAR_APP_ICON_SHELL,
} from "@/config/sidebar";
import { GearSixIcon, SidebarIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const DOCK_TRIGGER_CLASS =
  "flex size-9 items-center justify-center rounded-[0.7rem] outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/70";

const DOCK_LABEL_BASE =
  "pointer-events-none absolute top-1/2 left-[calc(100%+0.625rem)] z-50 -translate-y-1/2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-background shadow-md transition-opacity duration-100";

function DockLabel({ label }: { label: string }) {
  const visible = useSidebarDockTooltipVisible();

  return (
    <span
      className={cn(DOCK_LABEL_BASE, visible ? "opacity-100" : "opacity-0")}
      aria-hidden={!visible}
    >
      {label}
    </span>
  );
}

interface DockAppButtonProps {
  href?: string;
  label: string;
  gradient: string;
  isActive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

function DockActiveDot({ active }: { active: boolean }) {
  if (!active) {
    return null;
  }

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute top-1/2 -right-1.75 size-1 -translate-y-1/2 rounded-full bg-white "
    />
  );
}

function DockAppButton({
  href,
  label,
  gradient,
  isActive = false,
  onClick,
  children,
}: DockAppButtonProps) {
  const icon = (
    <span className={cn(SIDEBAR_APP_ICON_SHELL, "bg-linear-to-b", gradient)}>
      {children}
    </span>
  );

  return (
    <div className="relative flex items-center justify-center">
      {href ? (
        <Link
          href={href}
          aria-label={label}
          aria-current={isActive ? "page" : undefined}
          className={DOCK_TRIGGER_CLASS}
        >
          {icon}
        </Link>
      ) : (
        <button
          type="button"
          aria-label={label}
          className={DOCK_TRIGGER_CLASS}
          onClick={onClick}
        >
          {icon}
        </button>
      )}
      <DockLabel label={label} />
      <DockActiveDot active={isActive} />
    </div>
  );
}

export function SidebarCollapsedDock() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  let index = 0;

  return (
    <SidebarDock>
      <SidebarDockItem index={index++}>
        <DockAppButton
          href="/"
          label={APP_NAME}
          gradient={SIDEBAR_APP_ICON_GRADIENTS.brand}
        >
          <span className="text-sm font-semibold text-white drop-shadow-sm">
            {APP_NAME_INITIAL}
          </span>
        </DockAppButton>
      </SidebarDockItem>

      <SidebarDockItem index={index++}>
        <DockAppButton
          label="Perluas sidebar"
          gradient={SIDEBAR_APP_ICON_GRADIENTS.collapse}
          onClick={toggleSidebar}
        >
          <SidebarIcon className={SIDEBAR_APP_ICON_GLYPH} />
        </DockAppButton>
      </SidebarDockItem>

      {mainNavItems.map((item) => {
        const itemIndex = index++;
        const isActive = pathname === item.href;

        return (
          <SidebarDockItem key={item.href} index={itemIndex}>
            <DockAppButton
              href={item.href}
              label={item.title}
              gradient={item.gradient}
              isActive={isActive}
            >
              <item.icon className={SIDEBAR_APP_ICON_GLYPH} />
            </DockAppButton>
          </SidebarDockItem>
        );
      })}

      <SidebarDockItem index={index++}>
        <div className="relative flex items-center justify-center">
          <SettingsSheet
            trigger={
              <button
                type="button"
                aria-label="Pengaturan"
                className={DOCK_TRIGGER_CLASS}
              >
                <span
                  className={cn(
                    SIDEBAR_APP_ICON_SHELL,
                    "bg-linear-to-b",
                    SIDEBAR_APP_ICON_GRADIENTS.settings,
                  )}
                >
                  <GearSixIcon className={SIDEBAR_APP_ICON_GLYPH} />
                </span>
              </button>
            }
          />
          <DockLabel label="Pengaturan" />
        </div>
      </SidebarDockItem>
    </SidebarDock>
  );
}
