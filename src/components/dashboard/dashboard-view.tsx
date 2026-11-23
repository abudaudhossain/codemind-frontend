"use client";

import { AlertCircleIcon } from "lucide-react";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RecentConversations } from "@/components/dashboard/recent-conversations";
import { RecentRepositories } from "@/components/dashboard/recent-repositories";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DashboardSkeleton } from "@/components/shared/loading-skeletons";
import { useDashboard } from "@/hooks/use-dashboard";
import { getErrorMessage } from "@/lib/api-error";

export function DashboardView() {
  const dashboardQuery = useDashboard();

  if (dashboardQuery.isLoading) {
    return <DashboardSkeleton />;
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <EmptyState
        icon={AlertCircleIcon}
        title="Unable to load dashboard"
        description={getErrorMessage(dashboardQuery.error)}
        className="min-h-[420px]"
      />
    );
  }

  const { user, data } = dashboardQuery.data;

  return (
    <div className="space-y-6">
      <WelcomeHeader user={user} />
      <StatsCards stats={data.stats} />
      <QuickActions />
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <RecentRepositories repositories={data.recentRepositories} />
          <RecentConversations conversations={data.recentConversations} />
        </div>
        <RecentActivity activity={data.recentActivity} />
      </div>
    </div>
  );
}
