"use client";

/**
 * @file FilterBar — responsive filter/query bar with search, status, tags, and date range.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ChevronDownIcon, XIcon } from "lucide-react";

export type FilterBarProps = React.HTMLAttributes<HTMLDivElement> & {
  query: string;
  onQueryChange: (next: string) => void;
  status?: string;
  statusOptions?: string[];
  onStatusChange?: (next: string) => void;
  tags?: string[];
  selectedTags?: string[];
  onToggleTag?: (tag: string) => void;
  from?: string;
  to?: string;
  onDateRangeChange?: (next: { from?: string; to?: string }) => void;
  onClearAll?: () => void;
  dense?: boolean;
};

export const FilterBar: React.FC<FilterBarProps> = ({
  query,
  onQueryChange,
  status,
  statusOptions = ["All", "Open", "Closed"],
  onStatusChange,
  tags = [],
  selectedTags = [],
  onToggleTag,
  from,
  to,
  onDateRangeChange,
  onClearAll,
  dense,
  className,
  ...props
}) => {
  const hasAnyFilter =
    (status && status !== statusOptions[0]) ||
    selectedTags.length > 0 ||
    Boolean(from) ||
    Boolean(to) ||
    query.length > 0;

  return (
    <div
      className={cn(
        "grid gap-2 md:grid-cols-[1fr_auto_auto_auto_auto]",
        "rounded-xl border bg-card p-2 md:p-3",
        className
      )}
      {...props}
    >
      <Input
        value={query}
        onChange={(e) => onQueryChange(e.currentTarget.value)}
        placeholder="Search…"
        className={cn("h-9", dense && "h-8")}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={cn("h-9", dense && "h-8")}> 
            {status ?? statusOptions[0]} <ChevronDownIcon className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {statusOptions.map((opt) => (
            <DropdownMenuItem key={opt} onClick={() => onStatusChange?.(opt)}>
              {opt}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={cn("h-9", dense && "h-8")}> 
            Tags <ChevronDownIcon className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-52">
          <DropdownMenuLabel>Tags</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {tags.map((t) => (
            <DropdownMenuCheckboxItem
              key={t}
              checked={selectedTags.includes(t)}
              onCheckedChange={() => onToggleTag?.(t)}
            >
              {t}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          className={cn("h-9 px-2 text-xs font-normal", dense && "h-8")}
          onClick={() => onDateRangeChange?.({ from: undefined, to: undefined })}
          title="Clear dates"
        >
          <CalendarIcon className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">Date</span>
        </Button>
        <input
          type="date"
          value={from ?? ""}
          onChange={(e) => onDateRangeChange?.({ from: e.currentTarget.value || undefined, to })}
          className={cn(
            "h-9 rounded-md border bg-background px-2 text-sm outline-none",
            "ring-offset-background focus-visible:ring-2 focus-visible:ring-ring",
            dense && "h-8"
          )}
          aria-label="From date"
        />
        <span className="px-1 text-muted-foreground">–</span>
        <input
          type="date"
          value={to ?? ""}
          onChange={(e) => onDateRangeChange?.({ from, to: e.currentTarget.value || undefined })}
          className={cn(
            "h-9 rounded-md border bg-background px-2 text-sm outline-none",
            "ring-offset-background focus-visible:ring-2 focus-visible:ring-ring",
            dense && "h-8"
          )}
          aria-label="To date"
        />
      </div>

      <div className="flex items-center justify-end">
        <Button
          variant="ghost"
          className={cn("h-9 text-muted-foreground", dense && "h-8")}
          disabled={!hasAnyFilter}
          onClick={onClearAll}
        >
          <XIcon className="mr-1 h-4 w-4" />
          Clear
        </Button>
      </div>

      {selectedTags.length > 0 && (
        <div className="col-span-full -mt-1 flex flex-wrap gap-1">
          {selectedTags.map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => onToggleTag?.(t)}
              title="Remove tag"
            >
              {t}
              <XIcon className="ml-1 h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

