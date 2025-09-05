"use client";

/**
 * @file VirtualizedList — thin wrapper around react-window FixedSizeList.
 * Handles empty states and AutoSizer.
 */

import * as React from "react";
import { FixedSizeList as RWFixedSizeList, type ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { cn } from "@/lib/utils";

export type VirtualizedListProps<T> = React.HTMLAttributes<HTMLDivElement> & {
  items: T[];
  itemHeight: number;
  height?: number;
  width?: number | "auto";
  renderRow: (args: { item: T; index: number; isScrolling: boolean }) => React.ReactNode;
  emptyState?: React.ReactNode;
  overscanCount?: number;
};

export function VirtualizedList<T>({
  items,
  itemHeight,
  height,
  width = "auto",
  renderRow,
  emptyState,
  overscanCount = 6,
  className,
  ...props
}: VirtualizedListProps<T>) {
  if (!items?.length) {
    return (
      <div
        className={cn(
          "grid place-items-center rounded-lg border bg-card p-8 text-sm text-muted-foreground",
          className
        )}
        {...props}
      >
        {emptyState ?? "No items"}
      </div>
    );
  }

  const Row = ({ index, style, isScrolling }: ListChildComponentProps) => {
    const item = items[index]!;
    return (
      <div style={style} className="outline-none">
        {renderRow({ item, index, isScrolling })}
      </div>
    );
  };

  const content = (w: number, h: number) => (
    <RWFixedSizeList
      height={h}
      width={w}
      itemCount={items.length}
      itemSize={itemHeight}
      overscanCount={overscanCount}
      className="rounded-lg border bg-card"
    >
      {Row}
    </RWFixedSizeList>
  );

  return (
    <div className={cn("w-full", className)} {...props}>
      {height != null && width !== "auto" ? (
        content(Number(width), height)
      ) : (
        <div className="h-[360px]">
          <AutoSizer disableWidth={width !== "auto"}>
            {({ width: w, height: h }) => content(width !== "auto" ? Number(width) : w, h ?? 360)}
          </AutoSizer>
        </div>
      )}
    </div>
  );
}

