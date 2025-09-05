"use client";

/**
 * @file PieChart — pie or donut chart wrapper.
 * Source: community charts on shadcn.io (MIT). Collected: 2025-09-04.
 */

import * as React from "react";
import {
  PieChart as RPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartLegend, ChartTooltipContent, type TooltipItem } from "./chart-primitives";

export type PieDatum = {
  name: string;
  value: number;
  color?: string;
};

export type PieChartProps = {
  data: PieDatum[];
  innerRadius?: number;
  outerRadius?: number;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  height?: number;
};

export const PieChart: React.FC<PieChartProps> = ({
  data,
  innerRadius = 40,
  outerRadius = 80,
  title,
  subtitle,
  height,
}) => (
  <ChartContainer title={title} subtitle={subtitle} height={height ?? 260}>
    <ResponsiveContainer width="100%" height="100%">
      <RPieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          strokeWidth={2}
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload || !payload.length) return null;
            const p = payload[0];
            const items: TooltipItem[] = [
              {
                name: p.name as string,
                value: p.value as number,
                color: (p.payload as any).fill,
              },
            ];
            return <ChartTooltipContent label={p.name} items={items} />;
          }}
        />
      </RPieChart>
    </ResponsiveContainer>
    <ChartLegend items={data.map((d) => ({ name: d.name, color: d.color }))} />
  </ChartContainer>
);

