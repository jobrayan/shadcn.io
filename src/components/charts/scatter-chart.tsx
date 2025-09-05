"use client";

/**
 * @file ScatterChart — x/y point chart with optional categories and bubble size.
 */

import * as React from "react";
import {
  ScatterChart as RScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ZAxis,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartLegend, ChartTooltipContent, type TooltipItem } from "./chart-primitives";

export type ScatterPoint = {
  x: number | string;
  y: number;
  z?: number;
  c?: string;
};

export type ScatterSeries = {
  id: string;
  name: string;
  color?: string;
};

export type ScatterChartProps = {
  data: ScatterPoint[];
  series?: ScatterSeries[];
  xLabel?: string;
  yLabel?: string;
  maxBubbleSize?: number;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  height?: number;
};

export const ScatterChart: React.FC<ScatterChartProps> = ({
  data,
  series,
  xLabel,
  yLabel,
  maxBubbleSize = 60,
  title,
  subtitle,
  height,
}) => {
  const cats = Array.from(new Set(data.map((d) => d.c ?? "default")));
  const seriesList: ScatterSeries[] =
    series?.length
      ? series
      : cats.map((id, i) => ({
          id,
          name: id,
          color:
            i === 0
              ? "hsl(var(--primary))"
              : i === 1
              ? "hsl(var(--secondary-foreground))"
              : "hsl(var(--muted-foreground))",
        }));
  const grouped = new Map<string, ScatterPoint[]>();
  for (const s of seriesList) grouped.set(s.id, []);
  for (const p of data) grouped.get(p.c ?? "default")?.push(p);
  const usesZ = data.some((d) => typeof d.z === "number");

  return (
    <ChartContainer title={title} subtitle={subtitle} height={height ?? 260}>
      <ResponsiveContainer width="100%" height="100%">
        <RScatterChart margin={{ top: 8, right: 12, left: 8, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="x"
            name={xLabel}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-xs fill-muted-foreground"
          />
          <YAxis
            dataKey="y"
            name={yLabel}
            tickLine={false}
            axisLine={false}
            width={36}
            className="text-xs fill-muted-foreground"
          />
          {usesZ && <ZAxis dataKey="z" range={[6, maxBubbleSize]} />}
          <Tooltip
            cursor={{ strokeOpacity: 0.15 }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0];
              const d = p.payload as ScatterPoint;
              const items: TooltipItem[] = [
                { name: xLabel ?? "x", value: d.x as any, color: p.color },
                { name: yLabel ?? "y", value: d.y, color: p.color },
              ];
              if (typeof d.z === "number") items.push({ name: "size", value: d.z, color: p.color });
              if (d.c) items.push({ name: "series", value: d.c, color: p.color });
              return <ChartTooltipContent label={undefined} items={items} />;
            }}
          />
          {seriesList.map((s) => (
            <Scatter key={s.id} name={s.name} data={grouped.get(s.id)} fill={s.color} />
          ))}
        </RScatterChart>
      </ResponsiveContainer>
      <ChartLegend items={seriesList.map((s) => ({ name: s.name, color: s.color }))} />
    </ChartContainer>
  );
};
