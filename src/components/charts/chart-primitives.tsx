"use client";

/**
 * @file Chart primitives — tooltip & legend content used across chart wrappers.
 * Source: community charts on shadcn.io (MIT). Collected: 2025-09-04.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export type TooltipItem = {
  name: string;
  color?: string;
  value: string | number | null;
};

export type ChartTooltipContentProps = React.HTMLAttributes<HTMLDivElement> & {
  items?: TooltipItem[];
  label?: React.ReactNode;
};

/** Compact tooltip card for Recharts */
export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({
  items,
  label,
  className,
  ...props
}) => {
  if (!items || items.length === 0) return null;
  return (
    <div
      className={cn(
        "min-w-[160px] space-y-1 rounded-md border bg-popover px-2.5 py-2 text-xs text-popover-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {label ? <div className="mb-1 font-medium">{label}</div> : null}
      <div className="grid gap-1">
        {items.map((it, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ background: it.color || "currentColor" }}
              />
              <span className="text-muted-foreground">{it.name}</span>
            </div>
            <span className="font-medium tabular-nums">{it.value ?? "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export type ChartLegendProps = React.HTMLAttributes<HTMLDivElement> & {
  items: { name: string; color?: string }[];
};

/** Inline legend rendered under chart */
export const ChartLegend: React.FC<ChartLegendProps> = ({ items, className, ...props }) => {
  if (!items?.length) return null;
  return (
    <div className={cn("mt-2 flex flex-wrap items-center gap-3 text-xs", className)} {...props}>
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ background: it.color || "currentColor" }}
          />
          <span className="text-muted-foreground">{it.name}</span>
        </div>
      ))}
    </div>
  );
};

