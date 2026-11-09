import { Code2Icon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

interface CodeViewerPlaceholderProps {
  className?: string;
}

export function CodeViewerPlaceholder({ className }: CodeViewerPlaceholderProps) {
  return (
    <EmptyState
      icon={Code2Icon}
      title="Code viewer"
      description="Syntax-highlighted source viewing with citation anchors will be implemented when repository and chat APIs are connected."
      className={className}
    />
  );
}
