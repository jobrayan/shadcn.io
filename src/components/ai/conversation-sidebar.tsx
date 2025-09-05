"use client";

/**
 * @file ConversationSidebar — folders/labels + New Chat + quick actions.
 * Use inside a sidebar (pairs well with AppSidebar/AppShell).
 */

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FolderIcon,
  PlusIcon,
  PinIcon,
  InboxIcon,
  SettingsIcon,
  SearchIcon,
  UploadIcon,
  DownloadIcon,
} from "lucide-react";

export type Folder = { id: string; name: string; href: string; count?: number };
export type Label = { id: string; name: string; color?: string; count?: number };
export type PinnedChat = { id: string; title: string; href: string; unread?: number };

export type ConversationSidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  onNewChat?: () => void;
  folders?: Folder[];
  labels?: Label[];
  pinned?: PinnedChat[];
  onImport?: () => void;
  onExport?: () => void;
  showSearch?: boolean;
};

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  onNewChat,
  folders = [
    { id: "inbox", name: "All chats", href: "/ai/chat", count: 42 },
    { id: "work", name: "Work", href: "/ai/chat/work", count: 8 },
    { id: "personal", name: "Personal", href: "/ai/chat/personal", count: 5 },
  ],
  labels = [{ id: "bug", name: "Bug" }, { id: "idea", name: "Idea" }],
  pinned = [],
  onImport,
  onExport,
  showSearch = true,
  className,
  ...props
}) => {
  const [q, setQ] = React.useState("");
  return (
    <div className={cn("flex h-full w-72 flex-col", className)} {...props}>
      <div className="flex items-center gap-2 p-2">
        <Button className="w-full" onClick={onNewChat}>
          <PlusIcon className="mr-1 h-4 w-4" />
          New chat
        </Button>
      </div>

      {showSearch && (
        <div className="px-2">
          <div className="relative">
            <Input
              value={q}
              onChange={(e) => setQ(e.currentTarget.value)}
              placeholder="Search chats…"
              className="h-9 pl-8"
            />
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        {/* Pinned */}
        {pinned.length > 0 && (
          <div className="px-2 py-2">
            <div className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Pinned
            </div>
            <div className="space-y-1">
              {pinned
                .filter((p) => p.title.toLowerCase().includes(q.toLowerCase()))
                .map((p) => (
                  <Link
                    key={p.id}
                    href={p.href}
                    className="group flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
                  >
                    <PinIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate">{p.title}</span>
                    {p.unread ? (
                      <Badge variant="secondary" className="ml-auto">
                        {p.unread}
                      </Badge>
                    ) : null}
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* Folders */}
        <div className="px-2 py-2">
          <div className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Folders
          </div>
          <div className="space-y-1">
            {folders
              .filter((f) => f.name.toLowerCase().includes(q.toLowerCase()))
              .map((f) => (
                <Link
                  key={f.id}
                  href={f.href}
                  className="group flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
                >
                  {f.id === "inbox" ? (
                    <InboxIcon className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <FolderIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="truncate">{f.name}</span>
                  {f.count ? (
                    <Badge variant="secondary" className="ml-auto">
                      {f.count}
                    </Badge>
                  ) : null}
                </Link>
              ))}
          </div>
        </div>

        {/* Labels */}
        <div className="px-2 py-2">
          <div className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Labels
          </div>
          <div className="flex flex-wrap gap-1.5 px-2">
            {labels
              .filter((l) => l.name.toLowerCase().includes(q.toLowerCase()))
              .map((l) => (
                <Badge
                  key={l.id}
                  variant="secondary"
                  className="cursor-pointer"
                  title={`${l.name}${l.count ? ` • ${l.count}` : ""}`}
                >
                  <span
                    className="mr-1 inline-block size-2 rounded-[2px]"
                    style={{ background: l.color ?? "hsl(var(--primary))" }}
                  />
                  {l.name}
                  {l.count ? <span className="ml-1 text-[10px] opacity-60">{l.count}</span> : null}
                </Badge>
              ))}
          </div>
        </div>
      </ScrollArea>

      <Separator />
      {/* Quick actions */}
      <div className="flex items-center gap-1 p-2">
        <Button variant="outline" className="flex-1" onClick={onImport}>
          <UploadIcon className="mr-1 h-4 w-4" />
          Import
        </Button>
        <Button variant="outline" className="flex-1" onClick={onExport}>
          <DownloadIcon className="mr-1 h-4 w-4" />
          Export
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <SettingsIcon className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

