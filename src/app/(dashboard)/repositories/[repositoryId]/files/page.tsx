import type { Metadata } from "next";
import { FileExplorerView } from "@/components/repository/file-explorer-view";

export const metadata: Metadata = {
  title: "Repository files",
};

export default async function RepositoryFilesPage({
  params,
}: {
  params: Promise<{ repositoryId: string }>;
}) {
  const { repositoryId } = await params;
  return <FileExplorerView repositoryId={repositoryId} />;
}
