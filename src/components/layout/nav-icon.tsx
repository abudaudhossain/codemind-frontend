import {
  GitBranchIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  SearchIcon,
  SettingsIcon,
  type LucideIcon,
} from "lucide-react";
import type { NavItem } from "@/types";

const NAV_ICONS: Record<NavItem["icon"], LucideIcon> = {
  "layout-dashboard": LayoutDashboardIcon,
  "git-branch": GitBranchIcon,
  "message-square": MessageSquareIcon,
  search: SearchIcon,
  settings: SettingsIcon,
};

interface NavIconProps {
  name: NavItem["icon"];
  className?: string;
}

export function NavIcon({ name, className }: NavIconProps) {
  const Icon = NAV_ICONS[name];
  return <Icon className={className} aria-hidden />;
}
