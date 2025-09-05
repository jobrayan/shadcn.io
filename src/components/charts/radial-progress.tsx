"use client";

/**
 * @file RadialProgress — circular progress/donut showing a single percentage.
 * Uses Recharts Pie with identical start/end radii + center label.
 */

import * as React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartTooltipContent } from "./chart-primitives";

export type RadialProgressProps = {
  /** Value from 0..100 (clamped). */
  value: number;
  /** Diameter of the chart area; defaults to container height. */
  size?: number;
  /** Donut inner radius (px). If undefined, uses 70% of outer radius. */
  innerRadius?: number;
  /** Outer radius (px). If undefined, auto-fits. */
  outerRadius?: number;
  /** Color of the filled arc. */
  color?: string;
  /** Background track color. */
  trackColor?: string;
  /** Optional center label (by default renders the %). */
  centerLabel?: React.ReactNode;
  /** Title/subtitle and height for the outer container. */
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  height?: number;
};

export const RadialProgress: React.FC<RadialProgressProps> = ({
  value,
  size,
  innerRadius,
  outerRadius,
  color = "hsl(var(--primary))",
  trackColor = "hsl(var(--muted-foreground) / 0.15)",
  centerLabel,
  title,
  subtitle,
  height = 220,
}) => {
  const v = Math.max(0, Math.min(100, value));
  const data = [
    { name: "value", value: v, color },
    { name: "rest", value: 100 - v, color: trackColor },
  ];

  return (
    <ChartContainer title={title} subtitle={subtitle} height={height}>
      <div className="relative h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              startAngle={90}
              endAngle={-270} // clockwise
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color as string} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0];
                return (
                  <ChartTooltipContent
                    label={String(p?.name ?? "value")}
                    items={[
                      { name: "Percent", value: `${v.toFixed(1)}%`, color: color },
                    ]}
                  />
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center content */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-2xl font-semibold tabular-nums leading-none">
              {centerLabel ?? `${v.toFixed(0)}%`}
            </div>
          </div>
        </div>
      </div>
    </ChartContainer>
  );
};

