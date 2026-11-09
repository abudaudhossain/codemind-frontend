import { PageHeader } from "@/components/shared/page-header";
import type { UserProfile } from "@/types";

interface WelcomeHeaderProps {
  user: UserProfile;
}

export function WelcomeHeader({ user }: WelcomeHeaderProps) {
  const firstName = user.name.split(" ")[0] ?? user.name;

  return (
    <PageHeader
      title={`Welcome back, ${firstName}`}
      description="Track indexed repositories, recent conversations, and code intelligence activity."
    />
  );
}
