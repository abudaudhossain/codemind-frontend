"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2Icon, LoaderCircleIcon, XCircleIcon } from "lucide-react";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface VerifyEmailViewProps {
  token: string | null;
}

type VerificationState = "loading" | "success" | "error";

export function VerifyEmailView({ token }: VerifyEmailViewProps) {
  const [state, setState] = useState<VerificationState>(
    token ? "loading" : "error"
  );
  const [errorMessage, setErrorMessage] = useState(
    token ? null : "The email verification token is missing."
  );

  useEffect(() => {
    if (!token) return;

    let active = true;
    void authService
      .verifyEmail(token)
      .then(() => {
        if (active) setState("success");
      })
      .catch((error: unknown) => {
        if (!active) return;
        setErrorMessage(getErrorMessage(error));
        setState("error");
      });

    return () => {
      active = false;
    };
  }, [token]);

  if (state === "loading") {
    return (
      <VerificationCard
        icon={<LoaderCircleIcon className="animate-spin" />}
        title="Verifying your email"
        description="Please wait while we confirm your email address."
      />
    );
  }

  if (state === "success") {
    return (
      <VerificationCard
        icon={<CheckCircle2Icon className="text-green-600" />}
        title="Email verified"
        description="Your email address has been verified successfully."
        action={
          <Button className="w-full" render={<Link href="/login" />}>
            Continue to sign in
          </Button>
        }
      />
    );
  }

  return (
    <VerificationCard
      icon={<XCircleIcon className="text-destructive" />}
      title="Email verification failed"
      description={errorMessage ?? "The verification link is invalid or expired."}
      action={
        <Button variant="outline" className="w-full" render={<Link href="/login" />}>
          Return to sign in
        </Button>
      }
    />
  );
}

function VerificationCard({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <div className="flex size-10 items-center justify-center">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {action ? <CardContent>{action}</CardContent> : null}
      <CardFooter className="justify-center">
        <Link
          href="/register"
          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          Need a new account?
        </Link>
      </CardFooter>
    </Card>
  );
}
