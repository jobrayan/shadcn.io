"use client";

/**
 * @file Streaming-friendly markdown renderer for AI outputs.
 * Source: shadcn.io/ai/response (MIT). Collected: 2025-09-04.
 *
 * Features:
 * - Renders Markdown (GFM), tables, task lists.
 * - Inline math/LaTeX (rehype-katex) optional; safe to disable.
 * - Robust code blocks with syntax highlighting (refractor) and
 *   graceful handling of incomplete (streaming) fences.
 * - Preserves your shadcn/ui typography styles via Tailwind prose.
 */

import React from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Markdown + plugins
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw"; // allow inline HTML (optional; keep trusted)
import rehypeKatex from "rehype-katex"; // math support (optional)

// Syntax highlighting
import { refractor } from "refractor/lib/common.js";
import { toHtml } from "hast-util-to-html";
import { visit } from "unist-util-visit";

export type ResponseProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * The markdown string (may be partial while streaming).
   */
  content: string;
  /**
   * Enable KaTeX rendering for $math$ and $$blocks$$.
   * Requires katex CSS in your app entry (see notes below).
   */
  math?: boolean;
  /**
   * Languages to pass through highlighting (fallbacks gracefully).
   */
  allowedLanguages?: string[];
};

/**
 * remark plugin: highlight fenced code with refractor (Prism).
 * Safely handles unknown languages and partial fences.
 */
function remarkRefractorHighlight(allowed?: string[]) {
  return () => (tree: any) => {
    visit(tree, "code", (node: any) => {
      const lang = (node.lang || "").toLowerCase();
      const value: string = node.value ?? "";

      // If streaming caused an unterminated fence, still render.
      const safeValue = value.endsWith("```") ? value.slice(0, -3) : value;

      // Gate by allow-list if provided.
      if (allowed && lang && !allowed.includes(lang)) {
        node.type = "html";
        node.value = `<pre><code>${escapeHtml(safeValue)}</code></pre>`;
        return;
      }

      try {
        if (lang && refractor.registered(lang)) {
          const hast = refractor.highlight(safeValue, lang);
          node.type = "html";
          node.value = `<pre class="language-${lang}"><code class="language-${lang}">${toHtml(
            hast
          )}</code></pre>`;
        } else {
          // Unknown language → plain pre/code (no classes)
          node.type = "html";
          node.value = `<pre><code>${escapeHtml(safeValue)}</code></pre>`;
        }
      } catch {
        // Parsing error → plain text block
        node.type = "html";
        node.value = `<pre><code>${escapeHtml(safeValue)}</code></pre>`;
      }
    });
  };
}

/** Escape minimal HTML entities for safe <pre><code> fallback. */
function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/**
 * Streaming-optimized AI response renderer.
 *
 * Usage:
 * ```tsx
 * <Response content={markdown} />
 * ```
 */
export const Response: React.FC<ResponseProps> = ({
  content,
  className,
  math,
  allowedLanguages,
  ...props
}) => {
  return (
    <div
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none",
        // tighten vertical rhythm in chat bubbles
        "[&_pre]:my-3 [&_pre]:rounded-lg [&_pre]:p-3 [&_code:not(pre_*)]:px-1.5 [&_code:not(pre_*)]:py-0.5",
        "[&_table]:w-full [&_th]:font-semibold [&_td]:align-top",
        className
      )}
      {...props}
    >
      <ReactMarkdown
        // Allow raw HTML only if your pipeline is trusted.
        // Remove rehypeRaw for stricter XSS surface.
        rehypePlugins={[math ? rehypeKatex : null, rehypeRaw].filter(Boolean)}
        remarkPlugins={[remarkGfm, remarkRefractorHighlight(allowedLanguages)]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

