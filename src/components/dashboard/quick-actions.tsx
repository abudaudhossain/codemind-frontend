import Link from "next/link";
import { FolderGit2Icon, MessageSquarePlusIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ACTIONS = [
  {
    href: "/repositories",
    label: "Add Repository",
    description: "Connect a GitHub repository for indexing",
    icon: PlusIcon,
  },
  {
    href: "/chat",
    label: "Ask CodeMind",
    description: "Start a repository-aware conversation",
    icon: MessageSquarePlusIcon,
  },
  {
    href: "/repositories",
    label: "Explore Repositories",
    description: "Browse indexed codebases and status",
    icon: FolderGit2Icon,
  },
] as const;

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Jump into the most common workflows.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-3">
        {ACTIONS.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-auto flex-col items-start gap-2 whitespace-normal px-3 py-3 text-left"
            render={<Link href={action.href} />}
          >
            <span className="flex size-8 items-center justify-center rounded-md border border-border bg-muted/40">
              <action.icon className="size-4 text-brand" aria-hidden />
            </span>
            <span className="space-y-0.5">
              <span className="block text-sm font-medium text-foreground">
                {action.label}
              </span>
              <span className="block text-xs font-normal text-muted-foreground">
                {action.description}
              </span>
            </span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
