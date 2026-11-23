import type { FileTreeNode } from "@/types";

export function findFirstFilePath(nodes: FileTreeNode[]): string | null {
  for (const node of nodes) {
    if (node.type === "file") return node.path;
    if (node.children?.length) {
      const nested = findFirstFilePath(node.children);
      if (nested) return nested;
    }
  }
  return null;
}

export function countFiles(nodes: FileTreeNode[]): number {
  return nodes.reduce((total, node) => {
    if (node.type === "file") return total + 1;
    return total + countFiles(node.children ?? []);
  }, 0);
}

export function filterFileTree(
  nodes: FileTreeNode[],
  query: string
): FileTreeNode[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return nodes;

  return nodes.flatMap((node) => {
    if (node.type === "file") {
      return node.name.toLowerCase().includes(normalized) ||
        node.path.toLowerCase().includes(normalized)
        ? [node]
        : [];
    }

    const children = filterFileTree(node.children ?? [], normalized);
    if (
      children.length > 0 ||
      node.name.toLowerCase().includes(normalized)
    ) {
      return [{ ...node, children }];
    }
    return [];
  });
}

export function getPathSegments(path: string): string[] {
  return path.split("/").filter(Boolean);
}
