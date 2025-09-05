"use client";

/**
 * @file SparklineChart — tiny line or area chart for inline trends.
 */

import * as React from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

export type SparklineChartProps = {
  /** Array of numbers or objects with a valueKey. */
  data: number[] | Record<string, number>[];
  /** Field name when using object data. Defaults to 'value'. */
  dataKey?: string;
  /** Color of line/fill. */
  color?: string;
  /** Height of chart (px). */
  height?: number;
  /** Render as area (filled) or line only. */
  type?: "line" | "area";
  /** Optional className for container. */
  className?: string;
};

/**
 * Minimal sparkline for dashboard summaries and compact displays.
 */
export const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  dataKey = "value",
  color = "hsl(var(--primary))",
  height = 40,
  type = "line",
  className,
}) => {
  const chartData = Array.isArray(data)
    ? data.map((v, i) => ({ index: i, value: typeof v === "number" ? v : (v as any)[dataKey] }))
    : (data as any).map((d: any, i: number) => ({ index: i, value: d[dataKey] }));

  return (
    <div style={{ width: "100%", height }} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        {type === "area" ? (
          <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={color}
              fillOpacity={0.2}
              isAnimationActive={false}
            />
          </AreaChart>
        ) : (
          <LineChart data={chartData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
