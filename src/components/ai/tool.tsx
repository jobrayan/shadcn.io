"use client";

/**
 * @file Tool-call renderer (shows tool execution + output).
 * Source: https://www.shadcn.io/ai/tool (MIT). Collected: 2025-09-04.
 *
 * Usage:
 * <Tool name="weather" status="success">
 *   <pre>{JSON.stringify(data, null, 2)}</pre>
 * </Tool>
 */

import React from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader2, XCircle, CheckCircle2, Terminal } from "lucide-react";

export type ToolProps = HTMLAttributes<HTMLDivElement> & {
  /** Tool name/id, e.g., "weather", "search". */
  name: string;
  /** Status of execution. */
  status?: "pending" | "success" | "error";
};

/**
 * Tool component renders a bordered block with a header showing:
 * - Tool name
 * - Status icon (pending, success, error)
 * - Children (tool output) below
 */
export const Tool: React.FC<ToolProps> = ({
  name,
  status = "pending",
  className,
  children,
  ...props
}) => {
  let icon = <Terminal className="h-4 w-4 text-muted-foreground" />;
  if (status === "pending") {
    icon = <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
  } else if (status === "success") {
    icon = <CheckCircle2 className="h-4 w-4 text-green-500" />;
  } else if (status === "error") {
    icon = <XCircle className="h-4 w-4 text-red-500" />;
  }

  return (
    <div
      className={cn(
        "rounded-md border bg-muted/40 p-3 text-xs font-mono space-y-2",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 font-medium">
        {icon}
        <span>{name}</span>
      </div>
      <div className="whitespace-pre-wrap break-words">{children}</div>
    </div>
  );
};

