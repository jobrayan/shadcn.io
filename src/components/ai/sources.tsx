"use client";

/**
 * @file Sources list renderer (citations, references).
 * Source: https://www.shadcn.io/ai/sources (MIT). Collected: 2025-09-04.
 *
 * Usage:
 * <Sources items={[{ title: "OpenAI Docs", url: "https://platform.openai.com" }]} />
 */

import React from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { ExternalLinkIcon } from "lucide-react";

/** Shape of a single citation/source item. */
export type SourceItem = {
  /** Title or short label (e.g., "Wikipedia"). */
  title: string;
  /** Optional hyperlink to the source. */
  url?: string;
  /** Optional snippet or note. */
  description?: string;
};

export type SourcesProps = HTMLAttributes<HTMLDivElement> & {
  items: SourceItem[];
};

/**
 * Renders a list of sources/citations. Each item can have:
 * - title (required)
 * - url (optional; wraps title in <a>)
 * - description (optional; below the title)
 */
export const Sources: React.FC<SourcesProps> = ({ items, className, ...props }) => {
  if (!items?.length) return null;
  return (
    <div className={cn("flex flex-col gap-2 text-sm", className)} {...props}>
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="font-medium shrink-0">[{i + 1}]</span>
          <div className="flex flex-col">
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
              >
                {item.title}
                <ExternalLinkIcon className="h-3 w-3" />
              </a>
            ) : (
              <span>{item.title}</span>
            )}
            {item.description && (
              <span className="text-muted-foreground">{item.description}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

