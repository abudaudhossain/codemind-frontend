import type { Metadata } from "next";
import { Suspense } from "react";
import { ResendVerificationForm } from "@/components/auth/resend-verification-form";

export const metadata: Metadata = {
  title: "Resend verification email",
};

export default function ResendVerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  return (
    <Suspense fallback={<ResendVerificationForm initialEmail="" />}>
      <ResendVerificationContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ResendVerificationContent({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  return <ResendVerificationForm initialEmail={email?.trim() ?? ""} />;
}
