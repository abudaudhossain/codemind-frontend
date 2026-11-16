import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "GitHub setup",
};

interface SetupResponse {
  success: boolean;
  message: string;
  data?: {
    message?: string;
    installationId?: string;
  };
}

export default async function GithubSetupPage({
  searchParams,
}: {
  searchParams: Promise<{
    installation_id?: string;
    setup_action?: string;
    state?: string;
  }>;
}) {
  const params = await searchParams;
  const result = await completeGithubSetup(params);
  const successful = result.success;

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          {successful ? (
            <CheckCircle2Icon className="size-10 text-green-600" />
          ) : (
            <XCircleIcon className="size-10 text-destructive" />
          )}
          <CardTitle>
            {successful ? "GitHub connected" : "GitHub setup failed"}
          </CardTitle>
          <CardDescription>{result.message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-center text-sm text-muted-foreground">
          {result.data?.installationId ? (
            <p>Installation ID: {result.data.installationId}</p>
          ) : null}
          {result.data?.message ? <p>{result.data.message}</p> : null}
        </CardContent>
        <CardFooter>
          <Button className="w-full" render={<Link href="/repositories" />}>
            Continue to repositories
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

async function completeGithubSetup(
  params: {
    installation_id?: string;
    setup_action?: string;
    state?: string;
  }
): Promise<SetupResponse> {
  if (!params.installation_id || !params.setup_action || !params.state) {
    return {
      success: false,
      message: "The GitHub setup callback is missing required parameters.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
  const query = new URLSearchParams({
    installation_id: params.installation_id,
    setup_action: params.setup_action,
    state: params.state,
  });

  try {
    const response = await fetch(
      `${baseUrl.replace(/\/$/, "")}/github/setup?${query.toString()}`,
      { cache: "no-store" }
    );
    const payload = (await response.json()) as SetupResponse;

    if (!response.ok) {
      return {
        success: false,
        message: payload.message || "The GitHub setup request failed.",
        data: payload.data,
      };
    }

    return payload;
  } catch {
    return {
      success: false,
      message: "Unable to reach the CodeMind API.",
    };
  }
}
