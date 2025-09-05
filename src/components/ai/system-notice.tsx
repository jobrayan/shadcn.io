"use client";

/**
 * @file SystemNotice — a slim divider/notice row within a conversation.
 * Useful for "New conversation", "Model switched", or caution banners.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { InfoIcon, ShieldAlertIcon } from "lucide-react";

export type SystemNoticeProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Preset style: 'info' | 'warning' | 'neutral'. */
  tone?: "info" | "warning" | "neutral";
  /** Optional left icon override; defaults to tone-appropriate. */
  icon?: React.ReactNode;
  /** Optional compact divider lines at the sides. */
  withDividers?: boolean;
};

/**
 * A centered, small banner with optional side dividers.
 * Place between messages to indicate meta events or system states.
 */
export const SystemNotice: React.FC<SystemNoticeProps> = ({
  tone = "neutral",
  icon,
  withDividers = true,
  className,
  children,
  ...props
}) => {
  const classes =
    tone === "warning"
      ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
      : tone === "info"
      ? "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20"
      : "bg-muted/60 text-muted-foreground border-border";

  const defaultIcon =
    tone === "warning" ? <ShieldAlertIcon className="h-3.5 w-3.5" /> : <InfoIcon className="h-3.5 w-3.5" />;

  return (
    <div className={cn("py-2", className)} {...props}>
      <div className="flex items-center gap-3">
        {withDividers && <div className="h-px flex-1 bg-border" />}
        <div className={cn("inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs", classes)}>
          <span className="shrink-0">{icon ?? defaultIcon}</span>
          <span className="whitespace-pre-wrap">{children}</span>
        </div>
        {withDividers && <div className="h-px flex-1 bg-border" />}
      </div>
    </div>
  );
};
