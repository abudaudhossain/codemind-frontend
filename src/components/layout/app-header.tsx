"use client";

import { BellIcon, MenuIcon, SearchIcon } from "lucide-react";
import { AppBreadcrumbs } from "@/components/layout/app-breadcrumbs";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUiStore } from "@/stores/ui-store";
import { mockUser } from "@/lib/mock-data";

export function AppHeader() {
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-sm md:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open navigation"
      >
        <MenuIcon />
      </Button>

      <AppBreadcrumbs />

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <div className="relative hidden w-56 lg:block xl:w-72">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search repositories, code…"
            className="h-8 pl-8"
            aria-label="Global search"
          />
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden text-muted-foreground"
          aria-label="Search"
          render={<a href="/search" />}
        >
          <SearchIcon />
        </Button>

        <ThemeToggle />

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Notifications"
          className="relative text-muted-foreground"
        >
          <BellIcon />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-brand" />
        </Button>

        <UserMenu user={mockUser} variant="header" />
      </div>
    </header>
  );
}
