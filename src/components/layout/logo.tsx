import Link from "next/link";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

interface LogoProps {
  collapsed?: boolean;
  href?: string;
  className?: string;
}

export function Logo({ collapsed = false, href = "/dashboard", className }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-xs">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className="size-4"
        >
          <path
            d="M7.5 8.5 4 12l3.5 3.5M16.5 8.5 20 12l-3.5 3.5M13.5 6.5 10.5 17.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {!collapsed ? (
        <span className="truncate text-sm font-semibold tracking-tight text-foreground">
          {APP_NAME}
        </span>
      ) : (
        <span className="sr-only">{APP_NAME}</span>
      )}
    </Link>
  );
}
