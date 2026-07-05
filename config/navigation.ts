import {
  CalendarBlankIcon,
  ChatIcon,
  HeartIcon,
  NotebookIcon,
  SquaresFourIcon,
  type Icon,
} from "@/lib/icons";

import {
  SIDEBAR_APP_ICON_GRADIENTS,
  type SidebarAppIconGradient,
} from "@/config/sidebar";

export const OVERVIEW_ROUTE = "/overview";
export const PAYPLAN_ROUTE = "/payplan";
export const PLANS_ROUTE = "/plans";

/** User-facing page title for `/plans` — internal route unchanged. */
export const WISH_PAGE_TITLE = "Wish";

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
    icon: ChatIcon,
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
    title: WISH_PAGE_TITLE,
    href: PLANS_ROUTE,
    icon: HeartIcon,
    gradient: SIDEBAR_APP_ICON_GRADIENTS.plans,
  },
];
