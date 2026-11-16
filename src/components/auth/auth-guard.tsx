"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/services/api-client";
import { Skeleton } from "@/components/ui/skeleton";

const noStoreSubscription = () => () => {};
const browserHydrated = () => true;
const serverNotHydrated = () => false;

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useSyncExternalStore(
    noStoreSubscription,
    browserHydrated,
    serverNotHydrated
  );
  const authenticated = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener("codemind-auth-change", onStoreChange);
      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener("codemind-auth-change", onStoreChange);
      };
    },
    () => Boolean(getAccessToken()),
    () => false
  );

  useEffect(() => {
    if (hydrated && !authenticated) {
      router.replace(
        `/login?next=${encodeURIComponent(window.location.pathname)}`
      );
    }
  }, [authenticated, hydrated, router]);

  if (!hydrated || !authenticated) {
    return <Skeleton className="min-h-svh w-full rounded-none" />;
  }

  return children;
}
