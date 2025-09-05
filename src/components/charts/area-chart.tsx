"use client";

/**
 * @file AreaChart — stacked or single area chart with gradient fill.
 * Source: community charts on shadcn.io (MIT). Collected: 2025-09-04.
 */

import * as React from "react";
import {
  AreaChart as RAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartLegend, ChartTooltipContent, type TooltipItem } from "./chart-primitives";

export type AreaDatum = Record<string, string | number | null | undefined>;

export type AreaSeries = {
  dataKey: string;
  name: string;
  color?: string;
  stacked?: boolean;
};

export type AreaChartProps = {
  data: AreaDatum[];
  xKey: string;
  series: AreaSeries[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  height?: number;
};

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  xKey,
  series,
  title,
  subtitle,
  height,
}) => (
  <ChartContainer title={title} subtitle={subtitle} height={height ?? 260}>
    <ResponsiveContainer width="100%" height="100%">
      <RAreaChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 8 }}>
        <defs>
          {series.map((s) => {
            const id = `grad-${s.dataKey}`;
            const base = s.color || "hsl(var(--primary))";
            return (
              <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={base} stopOpacity={0.25} />
                <stop offset="95%" stopColor={base} stopOpacity={0.05} />
              </linearGradient>
            );
          })}
        </defs>
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
          <Area
            key={s.dataKey}
            type="monotone"
            dataKey={s.dataKey}
            name={s.name}
            stroke={s.color}
            fill={`url(#grad-${s.dataKey})`}
            strokeWidth={2}
            isAnimationActive={false}
            stackId={s.stacked ? "stack" : undefined}
          />
        ))}
      </RAreaChart>
    </ResponsiveContainer>
    <ChartLegend items={series.map((s) => ({ name: s.name, color: s.color }))} />
  </ChartContainer>
);

