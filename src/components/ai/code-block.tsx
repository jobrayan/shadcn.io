"use client";

/**
 * @file CodeBlock — pretty <pre><code> with copy, line numbers, wrap toggle,
 * and minimal diff mode (lines prefixed with '+', '-', ' ').
 * Syntax highlighting can be added later; this keeps zero deps.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCopyToClipboard } from "@/components/hooks/use-copy-to-clipboard";
import { CopyIcon, CheckIcon, WrapTextIcon, UnlinkIcon } from "lucide-react";

export type CodeBlockProps = React.HTMLAttributes<HTMLDivElement> & {
  language?: string; // label only
  code: string;
  showLineNumbers?: boolean;
  /** Enables diff colors based on first char of each line: '+', '-', ' ' */
  diff?: boolean;
  /** Lines to emphasize (1-based). */
  highlight?: number[];
  /** Wrap long lines (toggleable). */
  wrap?: boolean;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  language,
  code,
  showLineNumbers = true,
  diff = false,
  highlight = [],
  wrap = false,
  className,
  ...props
}) => {
  const { copied, copy } = useCopyToClipboard();
  const [softWrap, setSoftWrap] = React.useState(Boolean(wrap));

  const lines = React.useMemo(() => code.replace(/\r\n/g, "\n").split("\n"), [code]);

  const renderLine = (ln: number, text: string) => {
    let cls = "";
    let marker = "";
    if (diff) {
      const first = text[0];
      if (first === "+" || first === "-" || first === " ") {
        marker = first;
        text = text.slice(1);
        if (first === "+") cls = "bg-emerald-500/10";
        if (first === "-") cls = "bg-red-500/10";
      }
    }
    const isHi = highlight.includes(ln + 1);
    return (
      <div key={ln} className={cn("flex w-full", isHi && "bg-amber-500/10")}> 
        {showLineNumbers && (
          <div className="select-none pr-3 text-right text-xs text-muted-foreground w-10 shrink-0">
            {ln + 1}
          </div>
        )}
        <div className={cn("relative flex-1", cls)}>
          {diff && marker ? (
            <span className="absolute left-0 top-0 h-full w-0.5 bg-border" />
          ) : null}
          <pre className={cn("whitespace-pre", softWrap && "whitespace-pre-wrap break-words")}> 
            <code>{text || " "}</code>
          </pre>
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider delayDuration={80}>
      <div className={cn("rounded-lg border bg-muted/40", className)} {...props}>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b px-2 py-1.5">
          <div className="text-xs text-muted-foreground">{language ? language : "code"}</div>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSoftWrap((v) => !v)}>
                  {softWrap ? <UnlinkIcon className="h-4 w-4" /> : <WrapTextIcon className="h-4 w-4" />}
                  <span className="sr-only">Toggle wrap</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">Toggle wrap</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copy(code)}>
                  {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                  <span className="sr-only">Copy</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {copied ? "Copied" : "Copy"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[520px] overflow-auto px-2 py-2 font-mono text-[12.5px] leading-relaxed">
          {lines.map((t, i) => renderLine(i, t))}
        </div>
      </div>
    </TooltipProvider>
  );
};

