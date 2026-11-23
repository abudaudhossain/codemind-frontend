"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/api-error";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const resendVerificationSchema = z.object({
  email: z.email("Enter a valid email address"),
});

type ResendVerificationValues = z.infer<typeof resendVerificationSchema>;

type ResendVerificationFormProps = {
  initialEmail?: string;
};

export function ResendVerificationForm({
  initialEmail = "",
}: ResendVerificationFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResendVerificationValues>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: { email: initialEmail },
  });

  const onSubmit = handleSubmit(async ({ email }) => {
    setFormError(null);
    setSubmitted(false);
    try {
      await authService.resendVerification(email);
      setSubmitted(true);
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resend verification email</CardTitle>
        <CardDescription>
          {initialEmail ? (
            <>
              Verify your email to finish signing in. We&apos;ll send a new
              verification link.
            </>
          ) : (
            <>
              Enter your email address and we&apos;ll send you a new verification
              link.
            </>
          )}
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit} noValidate>
        <CardContent className="space-y-4">
          {formError ? (
            <div
              className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              <AlertCircleIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
              <p>{formError}</p>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            ) : null}
          </div>
          {submitted ? (
            <p className="flex items-center gap-2 text-sm text-green-600" role="status">
              <CheckCircle2Icon className="size-4" />
              If the account exists, a verification email has been sent.
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send verification email"}
          </Button>
          <Link
            href="/login"
            className="text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
