"use client";

import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileCodeIcon,
  FolderIcon,
  FolderOpenIcon,
} from "lucide-react";
import type { FileTreeNode } from "@/types";
import { cn } from "@/lib/utils";

interface FileTreeProps {
  nodes: FileTreeNode[];
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
}

export function FileTree({ nodes, selectedPath, onSelectFile }: FileTreeProps) {
  return (
    <ul className="space-y-0.5 p-2 text-sm" role="tree">
      {nodes.map((node) => (
        <FileTreeNodeItem
          key={node.id}
          node={node}
          depth={0}
          selectedPath={selectedPath}
          onSelectFile={onSelectFile}
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
}: {
  node: FileTreeNode;
  depth: number;
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 1);
  const isFolder = node.type === "folder";
  const isSelected = selectedPath === node.path;

  if (isFolder) {
    return (
      <li role="treeitem" aria-expanded={expanded} aria-selected={false}>
        <button
          type="button"
          className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          style={{ paddingLeft: 8 + depth * 12 }}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? (
            <ChevronDownIcon className="size-3.5 shrink-0" />
          ) : (
            <ChevronRightIcon className="size-3.5 shrink-0" />
          )}
          {expanded ? (
            <FolderOpenIcon className="size-3.5 shrink-0" />
          ) : (
            <FolderIcon className="size-3.5 shrink-0" />
          )}
          <span className="truncate">{node.name}</span>
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
          "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted/50",
          isSelected
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
        style={{ paddingLeft: 8 + depth * 12 + 16 }}
        onClick={() => onSelectFile(node.path)}
      >
        <FileCodeIcon className="size-3.5 shrink-0" />
        <span className="truncate">{node.name}</span>
      </button>
    </li>
  );
}
