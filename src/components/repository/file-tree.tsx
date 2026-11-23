"use client";

import { useEffect, useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileCodeIcon,
  FolderIcon,
  FolderOpenIcon,
} from "lucide-react";
import { getLanguageColor } from "@/lib/language-color";
import type { FileTreeNode } from "@/types";
import { cn } from "@/lib/utils";

interface FileTreeProps {
  nodes: FileTreeNode[];
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
  /** When true, folders start expanded (e.g. during search). */
  forceExpand?: boolean;
}

export function FileTree({
  nodes,
  selectedPath,
  onSelectFile,
  forceExpand = false,
}: FileTreeProps) {
  return (
    <ul className="space-y-0.5 p-2 text-sm" role="tree">
      {nodes.map((node) => (
        <FileTreeNodeItem
          key={node.id}
          node={node}
          depth={0}
          selectedPath={selectedPath}
          onSelectFile={onSelectFile}
          forceExpand={forceExpand}
        />
      ))}
    </ul>
  );
}

function FileTreeNodeItem({
  node,
  depth,
  selectedPath,
  onSelectFile,
  forceExpand,
}: {
  node: FileTreeNode;
  depth: number;
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
  forceExpand: boolean;
}) {
  const [expanded, setExpanded] = useState(depth < 1 || forceExpand);
  const isFolder = node.type === "folder";
  const isSelected = selectedPath === node.path;
  const languageColor = getLanguageColor(node.language ?? guessLanguage(node.name));

  useEffect(() => {
    if (forceExpand) setExpanded(true);
  }, [forceExpand]);

  if (isFolder) {
    return (
      <li role="treeitem" aria-expanded={expanded} aria-selected={false}>
        <button
          type="button"
          className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          style={{ paddingLeft: 8 + depth * 12 }}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? (
            <ChevronDownIcon className="size-3.5 shrink-0 opacity-70" />
          ) : (
            <ChevronRightIcon className="size-3.5 shrink-0 opacity-70" />
          )}
          {expanded ? (
            <FolderOpenIcon className="size-3.5 shrink-0 text-brand" />
          ) : (
            <FolderIcon className="size-3.5 shrink-0 text-brand/80" />
          )}
          <span className="truncate font-medium text-foreground/90">
            {node.name}
          </span>
        </button>
        {expanded && node.children?.length ? (
          <ul role="group">
            {node.children.map((child) => (
              <FileTreeNodeItem
                key={child.id}
                node={child}
                depth={depth + 1}
                selectedPath={selectedPath}
                onSelectFile={onSelectFile}
                forceExpand={forceExpand}
              />
            ))}
          </ul>
        ) : null}
      </li>
    );
  }

  return (
    <li role="treeitem" aria-selected={isSelected}>
      <button
        type="button"
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition-colors",
          isSelected
            ? "bg-brand/10 text-foreground ring-1 ring-brand/20"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        )}
        style={{ paddingLeft: 8 + depth * 12 + 16 }}
        onClick={() => onSelectFile(node.path)}
      >
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: languageColor }}
          aria-hidden
        />
        <FileCodeIcon className="size-3.5 shrink-0 opacity-70" />
        <span className="truncate">{node.name}</span>
      </button>
    </li>
  );
}

function guessLanguage(filename: string): string | undefined {
  const extension = filename.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    ts: "TypeScript",
    tsx: "TypeScript",
    js: "JavaScript",
    jsx: "JavaScript",
    py: "Python",
    go: "Go",
    rs: "Rust",
    java: "Java",
    md: "Markdown",
    css: "CSS",
    html: "HTML",
    json: "JavaScript",
  };
  return extension ? map[extension] : undefined;
}
