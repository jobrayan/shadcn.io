"use client";

/**
 * @file LineChart — responsive line chart wrapper.
 * Source: community charts on shadcn.io (MIT). Collected: 2025-09-04.
 */

import * as React from "react";
import {
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartLegend, ChartTooltipContent, type TooltipItem } from "./chart-primitives";

export type LineDatum = Record<string, string | number | null | undefined>;

export type LineSeries = {
  dataKey: string;
  name: string;
  color?: string;
  smooth?: boolean;
};

export type LineChartProps = {
  data: LineDatum[];
  xKey: string;
  series: LineSeries[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  height?: number;
};

export const LineChart: React.FC<LineChartProps> = ({
  data,
  xKey,
  series,
  title,
  subtitle,
  height,
}) => (
  <ChartContainer title={title} subtitle={subtitle} height={height ?? 260}>
    <ResponsiveContainer width="100%" height="100%">
      <RLineChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 8 }}>
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
        {series.map((s) => (
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
        ))}
      </RLineChart>
    </ResponsiveContainer>
    <ChartLegend items={series.map((s) => ({ name: s.name, color: s.color }))} />
  </ChartContainer>
);

