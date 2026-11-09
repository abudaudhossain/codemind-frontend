import type { NavItem } from "@/types";

export const APP_NAME = "CodeMind AI";
export const APP_DESCRIPTION =
  "AI-powered GitHub repository understanding and code intelligence";

export const DASHBOARD_NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "layout-dashboard",
  },
  {
    title: "Repositories",
    href: "/repositories",
    icon: "git-branch",
  },
  {
    title: "AI Chat",
    href: "/chat",
    icon: "message-square",
  },
  {
    title: "Semantic Search",
    href: "/search",
    icon: "search",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "settings",
  },
];

export const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  repositories: "Repositories",
  files: "Files",
  chat: "AI Chat",
  search: "Semantic Search",
  settings: "Settings",
  login: "Sign in",
  register: "Create account",
};
