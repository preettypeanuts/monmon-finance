import {
  CalendarBlankIcon,
  ListStarIcon,
  NotebookIcon,
  SquaresFourIcon,
  TrayIcon,
  type Icon,
} from "@/lib/icons";

import {
  SIDEBAR_APP_ICON_GRADIENTS,
  type SidebarAppIconGradient,
} from "@/config/sidebar";

export const OVERVIEW_ROUTE = "/overview";
export const PAYPLAN_ROUTE = "/payplan";
export const PLANS_ROUTE = "/plans";

export interface NavItem {
  title: string;
  href: string;
  icon: Icon;
  gradient: SidebarAppIconGradient;
}

export const mainNavItems: NavItem[] = [
  {
    title: "Overview",
    href: OVERVIEW_ROUTE,
    icon: SquaresFourIcon,
    gradient: SIDEBAR_APP_ICON_GRADIENTS.overview,
  },
  {
    title: "Inbox",
    href: "/",
    icon: TrayIcon,
    gradient: SIDEBAR_APP_ICON_GRADIENTS.inbox,
  },
  {
    title: "Journal",
    href: "/journal",
    icon: NotebookIcon,
    gradient: SIDEBAR_APP_ICON_GRADIENTS.journal,
  },
  {
    title: "PayPlan",
    href: PAYPLAN_ROUTE,
    icon: CalendarBlankIcon,
    gradient: SIDEBAR_APP_ICON_GRADIENTS.payplan,
  },
  {
    title: "Plans",
    href: PLANS_ROUTE,
    icon: ListStarIcon,
    gradient: SIDEBAR_APP_ICON_GRADIENTS.plans,
  },
];
