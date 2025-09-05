"use client";

/**
 * @file MessageSelectionBar — sticky bulk-actions bar for selected messages.
 * Source: community pattern from shadcn.io (MIT). Collected: 2025-09-04.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckSquareIcon,
  CopyIcon,
  DownloadIcon,
  ListPlusIcon,
  ScissorsIcon,
  Trash2Icon,
  XIcon,
  MoreHorizontalIcon,
} from "lucide-react";

export type MessageSelectionBarProps = React.HTMLAttributes<HTMLDivElement> & {
  totalCount: number;
  selectedIds: string[];
  onSelectAll?: () => void;
  onClear?: () => void;
  onBulkCopy?: () => void;
  onBulkDelete?: () => void;
  onBulkExport?: () => void;
  onBulkMerge?: () => void;
  onBulkTag?: () => void;
};

/** Sticky toolbar that appears when messages are selected. */
export const MessageSelectionBar: React.FC<MessageSelectionBarProps> = ({
  totalCount,
  selectedIds,
  onSelectAll,
  onClear,
  onBulkCopy,
  onBulkDelete,
  onBulkExport,
  onBulkMerge,
  onBulkTag,
  className,
  ...props
}) => {
  const count = selectedIds.length;
  if (count === 0) return null;

  const allSelected = totalCount > 0 && count === totalCount;

  return (
    <div
      className={cn(
        "sticky bottom-3 z-20 mx-auto flex w-fit items-center gap-2 rounded-xl border bg-background/95 px-2 py-1.5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/75",
        className
      )}
      {...props}
    >
      <label className="flex items-center gap-2 pl-1 pr-2">
        <Checkbox
          checked={allSelected}
          onCheckedChange={(v) => (v ? onSelectAll?.() : onClear?.())}
          aria-label={allSelected ? "Unselect all" : "Select all"}
        />
        <span className="text-sm tabular-nums">
          {count} selected <span className="text-muted-foreground">/ {totalCount}</span>
        </span>
      </label>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-lg"
          onClick={onBulkCopy}
          disabled={!onBulkCopy}
        >
          <CopyIcon className="mr-1 h-4 w-4" /> Copy
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-lg text-red-600 hover:text-red-700 focus-visible:text-red-700"
          onClick={onBulkDelete}
          disabled={!onBulkDelete}
        >
          <Trash2Icon className="mr-1 h-4 w-4" /> Delete
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="rounded-lg">
              <MoreHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">More actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            <DropdownMenuItem disabled={!onBulkExport} onClick={() => onBulkExport?.()} className="gap-2">
              <DownloadIcon className="h-4 w-4" /> Export…
            </DropdownMenuItem>
            <DropdownMenuItem disabled={!onBulkMerge} onClick={() => onBulkMerge?.()} className="gap-2">
              <ScissorsIcon className="h-4 w-4" /> Merge to note
            </DropdownMenuItem>
            <DropdownMenuItem disabled={!onBulkTag} onClick={() => onBulkTag?.()} className="gap-2">
              <ListPlusIcon className="h-4 w-4" /> Add tag…
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSelectAll?.()} className="gap-2">
              <CheckSquareIcon className="h-4 w-4" /> Select all
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onClear?.()} className="gap-2">
              <XIcon className="h-4 w-4" /> Clear selection
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

