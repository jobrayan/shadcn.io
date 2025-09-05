"use client";

/**
 * @file RadarChart — radial spokes comparing categories across series.
 */

import * as React from "react";
import {
  RadarChart as RRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartLegend, ChartTooltipContent, type TooltipItem } from "./chart-primitives";

export type RadarDatum = {
  key: string;
  [seriesKey: string]: string | number;
};

export type RadarSeries = {
  dataKey: string;
  name: string;
  color?: string;
  fillOpacity?: number;
};

export type RadarChartProps = {
  data: RadarDatum[];
  series: RadarSeries[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  height?: number;
  angleTickClassName?: string;
};

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  series,
  title,
  subtitle,
  height,
  angleTickClassName = "text-[10px] fill-muted-foreground",
}) => {
  return (
    <ChartContainer title={title} subtitle={subtitle} height={height ?? 300}>
      <ResponsiveContainer width="100%" height="100%">
        <RRadarChart data={data} margin={{ top: 16, right: 16, left: 16, bottom: 16 }}>
          <PolarGrid className="stroke-muted" />
          <PolarAngleAxis dataKey="key" className={angleTickClassName} />
          <PolarRadiusAxis className="text-[10px] fill-muted-foreground" />
          <Tooltip
            content={({ active, payload, label }) => {
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
            <Radar
              key={s.dataKey}
              name={s.name}
              dataKey={s.dataKey}
              stroke={s.color}
              fill={s.color}
              fillOpacity={s.fillOpacity ?? 0.2}
              isAnimationActive={false}
            />
          ))}
        </RRadarChart>
      </ResponsiveContainer>
      <ChartLegend items={series.map((s) => ({ name: s.name, color: s.color }))} />
    </ChartContainer>
  );
};
