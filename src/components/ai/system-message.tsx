"use client";

/**
 * @file SystemMessage — inline bubble for success/warning/error/info states.
 * Different from SystemNotice (divider). Use inside a ConversationItem.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2Icon, AlertTriangleIcon, InfoIcon, XCircleIcon } from "lucide-react";

export type SystemMessageProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?: "info" | "success" | "warning" | "error";
  title?: string;
};

export const SystemMessage: React.FC<SystemMessageProps> = ({
  tone = "info",
  title,
  className,
  children,
  ...props
}) => {
  const styles =
    tone === "success"
      ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
      : tone === "warning"
      ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
      : tone === "error"
      ? "bg-red-500/10 text-red-700 border-red-500/20"
      : "bg-blue-500/10 text-blue-700 border-blue-500/20";

  const Icon =
    tone === "success"
      ? CheckCircle2Icon
      : tone === "warning"
      ? AlertTriangleIcon
      : tone === "error"
      ? XCircleIcon
      : InfoIcon;

  return (
    <div className={cn("rounded-lg border p-3 text-sm", styles, className)} {...props}>
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="min-w-0">
          {title ? <div className="font-medium">{title}</div> : null}
          <div className="text-[13px]">{children}</div>
        </div>
      </div>
    </div>
  );
};

