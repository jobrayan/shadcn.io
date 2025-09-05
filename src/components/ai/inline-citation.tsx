"use client";

/**
 * @file InlineCitation — in-text citation badge with hover preview.
 * Source: community pattern from shadcn.io (MIT). Collected: 2025-09-04.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

export type InlineCitationProps = React.HTMLAttributes<HTMLSpanElement> & {
  index: number;
  title: string;
  url?: string;
  snippet?: string;
  iconUrl?: string;
  newTab?: boolean;
};

/** Small badge like [1] that reveals a preview on hover. */
export const InlineCitation: React.FC<InlineCitationProps> = ({
  index,
  title,
  url,
  snippet,
  iconUrl,
  newTab,
  className,
  ...props
}) => {
  const openInNewTab = newTab ?? !!url;

  const badge = (
    <Badge
      variant="secondary"
      className={cn(
        "h-5 cursor-pointer px-1.5 py-0 text-[11px] leading-none align-baseline",
        "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      onClick={(e) => {
        if (!url) return;
        e.preventDefault();
        window.open(url, openInNewTab ? "_blank" : "_self");
      }}
      {...props}
    >
      [{index}]
    </Badge>
  );

  return (
    <HoverCard openDelay={80}>
      <HoverCardTrigger asChild>{badge}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex items-start gap-2">
          {iconUrl && (
            <img src={iconUrl} alt="" className="mt-0.5 size-4 rounded-sm border" />
          )}
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{title}</div>
            {snippet && (
              <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">
                {snippet}
              </p>
            )}
            {url && (
              <a
                href={url}
                target={openInNewTab ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-blue-600 hover:underline"
              >
                {url}
              </a>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

