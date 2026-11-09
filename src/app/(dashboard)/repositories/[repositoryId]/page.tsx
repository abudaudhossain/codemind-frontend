import type { Metadata } from "next";
import { RepositoryDetailsView } from "@/components/repository/repository-details-view";

export const metadata: Metadata = {
  title: "Repository details",
};

export default async function RepositoryDetailsPage({
  params,
}: {
  params: Promise<{ repositoryId: string }>;
}) {
  const { repositoryId } = await params;
  return <RepositoryDetailsView repositoryId={repositoryId} />;
}
