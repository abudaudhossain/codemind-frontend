"use client";

import { useMemo, useState } from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import python from "highlight.js/lib/languages/python";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import { CheckIcon, CopyIcon } from "lucide-react";
import { RelativeTime } from "@/components/shared/relative-time";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPathSegments } from "@/lib/file-tree";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("tsx", typescript);
hljs.registerLanguage("jsx", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("mdx", markdown);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("python", python);
hljs.registerLanguage("go", go);
hljs.registerLanguage("java", java);

interface CodeViewerProps {
  path: string;
  content: string;
  language?: string | null;
  isIndexed?: boolean;
  updatedAt?: string | null;
  className?: string;
}

function resolveLanguage(language: string | null | undefined, path: string) {
  if (language) {
    const normalized = language.toLowerCase();
    if (hljs.getLanguage(normalized)) return normalized;
  }

  const extension = path.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    json: "json",
    md: "markdown",
    mdx: "markdown",
    css: "css",
    html: "xml",
    py: "python",
    go: "go",
    java: "java",
  };
  return extension ? map[extension] : undefined;
}

export function CodeViewer({
  path,
  content,
  language,
  isIndexed,
  updatedAt,
  className,
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const highlighted = useMemo(() => {
    const lang = resolveLanguage(language, path);
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(content, { language: lang }).value;
    }
    return hljs.highlightAuto(content).value;
  }, [content, language, path]);

  const lines = content.split("\n");
  const segments = getPathSegments(path);
  const fileName = segments.at(-1) ?? path;

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden bg-card",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2.5">
        <div className="min-w-0 space-y-1">
          <div className="flex min-w-0 flex-wrap items-center gap-1 text-xs text-muted-foreground">
            {segments.map((segment, index) => {
              const isLast = index === segments.length - 1;
              return (
                <span key={`${segment}-${index}`} className="inline-flex min-w-0 items-center gap-1">
                  {index > 0 ? <span className="text-border">/</span> : null}
                  <span
                    className={cn(
                      "truncate",
                      isLast && "font-medium text-foreground"
                    )}
                  >
                    {segment}
                  </span>
                </span>
              );
            })}
          </div>
          <p className="flex flex-wrap items-center gap-x-1.5 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground/80">{fileName}</span>
            <span>·</span>
            <span>{formatNumber(lines.length)} lines</span>
            {language ? (
              <>
                <span>·</span>
                <span>{language}</span>
              </>
            ) : null}
            {typeof isIndexed === "boolean" ? (
              <>
                <span>·</span>
                <span>{isIndexed ? "Indexed" : "Not indexed"}</span>
              </>
            ) : null}
            {updatedAt ? (
              <>
                <span>·</span>
                <RelativeTime value={updatedAt} prefix="Updated" />
              </>
            ) : null}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex min-w-full font-mono text-[12px] leading-5">
          <div
            aria-hidden
            className="sticky left-0 select-none border-r border-border bg-muted/30 px-3 py-3 text-right text-muted-foreground"
          >
            {lines.map((_, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </div>
          <pre className="overflow-x-auto px-4 py-3 text-foreground">
            <code
              className="hljs block"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </pre>
        </div>
      </ScrollArea>
    </div>
  );
}
