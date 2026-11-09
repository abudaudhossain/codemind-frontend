"use client";

import { Logo } from "@/components/layout/logo";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUiStore } from "@/stores/ui-store";
import { mockUser } from "@/lib/mock-data";

export function MobileNav() {
  const mobileNavOpen = useUiStore((state) => state.mobileNavOpen);
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);

  return (
    <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
      <SheetContent side="left" className="w-[288px] gap-0 p-0 md:hidden">
        <SheetHeader className="h-14 justify-center border-b border-border px-4">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Logo />
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-3">
          <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
        </div>
        <Separator />
        <div className="p-2">
          <UserMenu user={mockUser} variant="sidebar" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
