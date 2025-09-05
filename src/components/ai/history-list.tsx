"use client";

/**
 * @file HistoryList — searchable, groupable list of conversation tiles.
 * Provides search box, optional sections, and empty states.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationTile, type ConversationTileProps } from "./conversation-tile";

export type HistoryItem = {
  id: string;
  title: string;
  preview?: string;
  time?: string;
  avatar?: ConversationTileProps["avatar"];
  pinned?: boolean;
};

export type HistorySection = {
  label: string;
  items: HistoryItem[];
};

export type HistoryListProps = React.HTMLAttributes<HTMLDivElement> & {
  items?: HistoryItem[];
  sections?: HistorySection[];
  searchPlaceholder?: string;
  onOpen?: (id: string) => void;
  onPin?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export const HistoryList: React.FC<HistoryListProps> = ({
  items,
  sections,
  searchPlaceholder = "Search conversations…",
  onOpen,
  onPin,
  onDelete,
  className,
  ...props
}) => {
  const [query, setQuery] = React.useState("");

  const filterMatch = (h: HistoryItem) =>
    !query ||
    h.title.toLowerCase().includes(query.toLowerCase()) ||
    (h.preview ?? "").toLowerCase().includes(query.toLowerCase());

  const content = sections?.length
    ? sections.map((sec) => ({ label: sec.label, items: sec.items.filter(filterMatch) }))
    : [{ label: "", items: (items ?? []).filter(filterMatch) }];

  const empty = content.every((sec) => sec.items.length === 0);

  return (
    <div className={cn("flex h-full w-full flex-col gap-2", className)} {...props}>
      <Input
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        placeholder={searchPlaceholder}
        className="h-9"
      />

      <ScrollArea className="flex-1">
        <div className="pr-2">
          {empty ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No conversations.</div>
          ) : (
            content.map((sec, i) => (
              <div key={i} className="space-y-2">
                {sec.label ? (
                  <div className="px-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {sec.label}
                  </div>
                ) : null}
                <div className="space-y-1.5">
                  {sec.items.map((h) => (
                    <ConversationTile
                      key={h.id}
                      id={h.id}
                      title={h.title}
                      preview={h.preview}
                      time={h.time}
                      avatar={h.avatar}
                      pinned={h.pinned}
                      onOpen={onOpen}
                      onPin={onPin}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
