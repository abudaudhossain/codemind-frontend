"use client";

import {
  Link2OffIcon,
  LoaderCircleIcon,
  UnplugIcon,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/github-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { GithubConnectionState } from "@/types";

interface GithubConnectionCardProps {
  connection?: GithubConnectionState;
  isLoading?: boolean;
  isConnecting?: boolean;
  isDisconnecting?: boolean;
  errorMessage?: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function GithubConnectionCard({
  connection,
  isLoading,
  isConnecting,
  isDisconnecting,
  errorMessage,
  onConnect,
  onDisconnect,
}: GithubConnectionCardProps) {
  const connected = Boolean(connection?.connected);

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted/40">
            <GithubIcon className="size-5" aria-hidden />
          </span>
          <div className="space-y-1">
            <CardTitle>GitHub connection</CardTitle>
            <CardDescription>
              CodeMind uses a GitHub App installation to access repositories.
            </CardDescription>
          </div>
        </div>
        <span
          className={
            connected
              ? "rounded-md border border-success/30 bg-success/10 px-2 py-1 text-xs text-success"
              : "rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground"
          }
        >
          {isLoading ? "Checking…" : connected ? "Connected" : "Not connected"}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        {connected ? (
          <div className="space-y-1 text-sm">
            <p className="font-medium text-foreground">
              {connection?.accountLogin ?? "GitHub account"}
            </p>
            <p className="text-muted-foreground">
              {[connection?.targetType, connection?.repositorySelection]
                .filter(Boolean)
                .join(" · ") || "Installation active"}
              {connection?.installationId
                ? ` · Installation ${connection.installationId}`
                : null}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Connect GitHub to browse accessible repositories and import them into
            CodeMind.
          </p>
        )}

        {errorMessage ? (
          <p className="text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {connected ? (
            <>
              <Button
                variant="outline"
                onClick={onDisconnect}
                disabled={isDisconnecting}
              >
                {isDisconnecting ? (
                  <LoaderCircleIcon className="animate-spin" />
                ) : (
                  <UnplugIcon />
                )}
                Disconnect
              </Button>
              <Button
                variant="ghost"
                render={
                  <a
                    href="https://github.com/settings/installations"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <Link2OffIcon />
                Manage on GitHub
              </Button>
            </>
          ) : (
            <Button onClick={onConnect} disabled={isConnecting || isLoading}>
              {isConnecting ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                <GithubIcon />
              )}
              Connect GitHub
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
