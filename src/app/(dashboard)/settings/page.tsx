import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { mockUser } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Settings",
};

export const instant = false;

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage workspace preferences. Account and integration settings will connect to NestJS later."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Display values for UI development only — not backed by authentication.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={mockUser.name} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={mockUser.email} readOnly />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>
              GitHub and AI provider connections will be configured here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
              <span>GitHub</span>
              <span className="text-xs">Not connected</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
              <span>Google Gemini</span>
              <span className="text-xs">Via NestJS API</span>
            </div>
            <Separator />
            <p>
              Authentication, secrets, and provider keys will never be stored in the
              frontend. NestJS will own those concerns.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
