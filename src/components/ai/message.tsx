"use client";

/**
 * @file Message UI elements for chat UIs (MIT).
 * Source: https://www.shadcn.io/ai/message
 * Collected on: 2025-09-04
 */

import React, { type ComponentProps, type HTMLAttributes } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { UIMessage } from "ai";

/** Props for the top-level chat message container. */
export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  /** The sender role; controls alignment and styling. */
  from: UIMessage["role"]; // "user" | "assistant" | "system"
};

/**
 * A role-aware chat message container.
 * - user → right-aligned
 * - assistant → left-aligned
 * - system → centered (inherits “assistant” styles unless you theme it)
 */
export const Message: React.FC<MessageProps> = ({ className, from, ...props }) => (
  <div
    className={cn(
      "group flex w-full items-end justify-end gap-2 py-4",
      from === "user" ? "is-user" : "is-assistant flex-row-reverse justify-end",
      "[&>div]:max-w-[80%]",
      className,
    )}
    {...props}
  />
);

/** Props for the chat message content region. */
export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

/**
 * MessageContent wraps the message text/body with proper background,
 * padding, and role-based colors.
 */
export const MessageContent: React.FC<MessageContentProps> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={cn(
      "flex flex-col gap-2 overflow-hidden rounded-lg px-4 py-3 text-foreground text-sm",
      "group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground",
      "group-[.is-assistant]:bg-secondary group-[.is-assistant]:text-foreground",
      className,
    )}
    {...props}
  >
    <div className="is-user:dark">{children}</div>
  </div>
);

/** Props for the avatar displayed next to a message. */
export type MessageAvatarProps = ComponentProps<typeof Avatar> & {
  /** Avatar image URL. */
  src: string;
  /** Optional full name used for initials fallback. */
  name?: string;
};

/**
 * MessageAvatar renders an 8x8 avatar with ring and sensible fallbacks.
 */
export const MessageAvatar: React.FC<MessageAvatarProps> = ({
  src,
  name,
  className,
  ...props
}) => (
  <Avatar className={cn("size-8 ring ring-1 ring-border", className)} {...props}>
    <AvatarImage alt="" className="mt-0 mb-0" src={src} />
    <AvatarFallback>{name?.slice(0, 2) || "ME"}</AvatarFallback>
  </Avatar>
);

