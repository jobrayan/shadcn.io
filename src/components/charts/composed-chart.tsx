"use client";

/**
 * @file ComposedChart — combined bar + line chart wrapper.
 * Source: community charts on shadcn.io (MIT). Collected: 2025-09-04.
 */

import * as React from "react";
import {
  ComposedChart as RComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartLegend, ChartTooltipContent, type TooltipItem } from "./chart-primitives";

export type ComposedDatum = Record<string, string | number | null | undefined>;

export type ComposedSeries =
  | { type: "line"; dataKey: string; name: string; color?: string; smooth?: boolean }
  | { type: "bar"; dataKey: string; name: string; color?: string; stacked?: boolean };

export type ComposedChartProps = {
  data: ComposedDatum[];
  xKey: string;
  series: ComposedSeries[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  height?: number;
};

export const ComposedChart: React.FC<ComposedChartProps> = ({
  data,
  xKey,
  series,
  title,
  subtitle,
  height,
}) => (
  <ChartContainer title={title} subtitle={subtitle} height={height ?? 260}>
    <ResponsiveContainer width="100%" height="100%">
      <RComposedChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="fill-muted-foreground text-xs"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={36}
          className="fill-muted-foreground text-xs"
        />
        <Tooltip
          cursor={{ strokeOpacity: 0.1 }}
          content={({ active, label, payload }) => {
            if (!active || !payload) return null;
            const items: TooltipItem[] = payload.map((p) => ({
              name: (p.name as string) ?? String(p.dataKey),
              value: p.value as number,
              color: p.color,
            }));
            return <ChartTooltipContent label={label} items={items} />;
          }}
        />
        {series.map((s) =>
          s.type === "line" ? (
            <Line
              key={s.dataKey}
              type={s.smooth === false ? "linear" : "monotone"}
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ) : (
            <Bar
              key={s.dataKey}
              dataKey={s.dataKey}
              name={s.name}
              fill={s.color}
              isAnimationActive={false}
              stackId={s.stacked ? "stack" : undefined}
              radius={[6, 6, 0, 0]}
            />
          )
        )}
      </RComposedChart>
    </ResponsiveContainer>
    <ChartLegend items={series.map((s) => ({ name: s.name, color: s.color }))} />
  </ChartContainer>
);

