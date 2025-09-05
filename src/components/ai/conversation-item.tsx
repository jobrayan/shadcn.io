"use client";

/**
 * @file Per-message wrapper for chat threads (avatar + header/meta + body slots).
 * Source: https://www.shadcn.io/ai/message and https://www.shadcn.io/ai/conversation (MIT). Collected: 2025-09-04.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type Role = "user" | "assistant" | "system";

/** Header meta shown above the bubble (e.g., model name, timestamp). */
export type ConversationItemHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export const ConversationItemHeader: React.FC<ConversationItemHeaderProps> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "mb-1 flex items-center gap-2 text-[11px] text-muted-foreground",
      className
    )}
    {...props}
  />
);

/** Footer actions under the bubble (e.g., copy, like). */
export type ConversationItemFooterProps = React.HTMLAttributes<HTMLDivElement>;
export const ConversationItemFooter: React.FC<ConversationItemFooterProps> = ({
  className,
  ...props
}) => (
  <div className={cn("mt-1 flex items-center gap-2 text-xs", className)} {...props} />
);

export type ConversationItemProps = React.HTMLAttributes<HTMLDivElement> & {
  role: Role;
  avatar?: { src?: string; name?: string };
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClassName?: string;
};

/**
 * ConversationItem lays out one chat row with avatar, header, body, and footer.
 */
export const ConversationItem: React.FC<ConversationItemProps> = ({
  role,
  avatar,
  children,
  header,
  footer,
  className,
  maxWidthClassName = "max-w-[80%]",
  ...props
}) => {
  const isUser = role === "user";
  return (
    <div
      className={cn(
        "group flex w-full items-end gap-2 py-3",
        isUser ? "justify-end" : "justify-start",
        className
      )}
      {...props}
    >
      <div className={cn("shrink-0", isUser && "order-2")}>
        <Avatar className="size-8 ring ring-1 ring-border">
          {avatar?.src ? <AvatarImage src={avatar.src} alt="" /> : null}
          <AvatarFallback>
            {avatar?.name?.slice(0, 2) ?? (isUser ? "ME" : "AI")}
          </AvatarFallback>
        </Avatar>
      </div>
      <div
        className={cn(
          "flex min-w-0 flex-col",
          maxWidthClassName,
          isUser ? "items-end text-right" : "items-start text-left"
        )}
      >
        {header ? <div className="px-2">{header}</div> : null}
        <div
          className={cn(
            "w-full overflow-hidden rounded-lg px-4 py-3 text-sm",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-foreground"
          )}
        >
          {children}
        </div>
        {footer ? <div className="px-2">{footer}</div> : null}
      </div>
    </div>
  );
};

