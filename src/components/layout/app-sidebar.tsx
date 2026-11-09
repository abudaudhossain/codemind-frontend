"use client";

import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUiStore } from "@/stores/ui-store";
import { mockUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 hidden h-svh shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex",
        sidebarCollapsed ? "w-[68px]" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center gap-2 px-3",
          sidebarCollapsed && "justify-center px-2"
        )}
      >
        <Logo collapsed={sidebarCollapsed} className="min-w-0 flex-1" />
        {!sidebarCollapsed ? (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleSidebar}
            aria-label="Collapse sidebar"
            className="shrink-0 text-muted-foreground"
          >
            <PanelLeftCloseIcon />
          </Button>
        ) : null}
      </div>

      <Separator />

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-3">
        {sidebarCollapsed ? (
          <div className="flex justify-center px-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
              className="text-muted-foreground"
            >
              <PanelLeftOpenIcon />
            </Button>
          </div>
        ) : null}
        <SidebarNav collapsed={sidebarCollapsed} />
      </div>

      <div className="border-t border-sidebar-border p-2">
        <UserMenu user={mockUser} collapsed={sidebarCollapsed} variant="sidebar" />
      </div>
    </aside>
  );
}
