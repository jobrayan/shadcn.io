"use client";

/**
 * @file ChartContainer — shared wrapper for Recharts with title/subtitle.
 * Source: community charts on shadcn.io (MIT). Collected: 2025-09-04.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export type ChartContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  height?: number;
};

/** Provides consistent heading + padded card for charts. */
export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  height = 260,
  className,
  children,
  ...props
}) => (
  <div className={cn("w-full", className)} {...props}>
    {(title || subtitle) && (
      <div className="mb-2">
        {title ? <h3 className="text-sm font-medium">{title}</h3> : null}
        {subtitle ? (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
    )}
    <div
      className="rounded-xl border bg-card text-card-foreground shadow-sm px-3 py-2"
      style={{ height }}
    >
      {children}
    </div>
  </div>
);

