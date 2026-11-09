import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RecentConversations } from "@/components/dashboard/recent-conversations";
import { RecentRepositories } from "@/components/dashboard/recent-repositories";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import type { DashboardData, UserProfile } from "@/types";

interface DashboardViewProps {
  user: UserProfile;
  data: DashboardData;
}

export function DashboardView({ user, data }: DashboardViewProps) {
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
