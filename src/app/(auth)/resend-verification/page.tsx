import type { Metadata } from "next";
import { ResendVerificationForm } from "@/components/auth/resend-verification-form";

export const metadata: Metadata = {
  title: "Resend verification email",
};

export default function ResendVerificationPage() {
  return <ResendVerificationForm />;
}
