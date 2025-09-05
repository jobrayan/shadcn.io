"use client";

/**
 * @file ConversationTile — compact card/list item for a single conversation.
 * Use inside a sidebar or HistoryList. Keyboard-focusable; supports menu.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon, PinIcon, Trash2Icon } from "lucide-react";

export type ConversationTileProps = React.HTMLAttributes<HTMLDivElement> & {
  id: string;
  title: string;
  preview?: string;
  time?: string;
  avatar?: { src?: string; name?: string };
  active?: boolean;
  pinned?: boolean;
  onOpen?: (id: string) => void;
  onPin?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export const ConversationTile: React.FC<ConversationTileProps> = ({
  id,
  title,
  preview,
  time,
  avatar,
  active,
  pinned,
  onOpen,
  onPin,
  onDelete,
  className,
  ...props
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left outline-none",
        "hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring",
        active ? "border-primary bg-accent/60" : "border-transparent",
        className
      )}
      onClick={() => onOpen?.(id)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen?.(id)}
      {...props}
    >
      <Avatar className="size-7 ring-1 ring-border">
        {avatar?.src ? <AvatarImage src={avatar.src} alt="" /> : null}
        <AvatarFallback>{avatar?.name?.slice(0, 2) ?? "AI"}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate text-sm font-medium">{title}</div>
          {pinned ? <PinIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /> : null}
          <div className="ml-auto shrink-0 text-[11px] text-muted-foreground">{time}</div>
        </div>
        {preview ? <div className="truncate text-xs text-muted-foreground">{preview}</div> : null}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem onClick={() => onPin?.(id)} className="gap-2">
            <PinIcon className="h-4 w-4" />
            {pinned ? "Unpin" : "Pin"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete?.(id)}
            className="gap-2 text-red-600 focus:text-red-600"
          >
            <Trash2Icon className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
