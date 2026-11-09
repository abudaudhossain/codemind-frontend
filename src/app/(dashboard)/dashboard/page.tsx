import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { mockDashboardData, mockUser } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return <DashboardView user={mockUser} data={mockDashboardData} />;
}
