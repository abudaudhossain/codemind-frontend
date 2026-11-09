"use client";

import { useSyncExternalStore } from "react";
import { formatRelativeTime } from "@/lib/format";

interface RelativeTimeProps {
  value: string;
  prefix?: string;
}

function formatAbsolute(value: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function subscribe(onStoreChange: () => void) {
  const intervalId = window.setInterval(onStoreChange, 60_000);
  return () => window.clearInterval(intervalId);
}

export function RelativeTime({ value, prefix }: RelativeTimeProps) {
  const label = useSyncExternalStore(
    subscribe,
    () => formatRelativeTime(value),
    () => formatAbsolute(value)
  );

  return (
    <time dateTime={value}>{prefix ? `${prefix} ${label}` : label}</time>
  );
}
