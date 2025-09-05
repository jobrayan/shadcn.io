"use client";

/**
 * @file RadialProgressChart — circular progress/gauge visualization.
 */

import * as React from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "./chart-container";

export type RadialProgressChartProps = {
  /** Current value. */
  value: number;
  /** Maximum value. */
  max?: number;
  /** Gauge color. */
  color?: string;
  /** Inner radius (px). */
  innerRadius?: number;
  /** Outer radius (px). */
  outerRadius?: number;
  /** Optional center label. */
  label?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  height?: number;
};

/**
 * Displays a radial progress bar (full circle) using RadialBarChart.
 */
export const RadialProgressChart: React.FC<RadialProgressChartProps> = ({
  value,
  max = 100,
  color = "hsl(var(--primary))",
  innerRadius = 60,
  outerRadius = 80,
  label,
  title,
  subtitle,
  height,
}) => {
  const data = [{ name: "value", value }];

  return (
    <ChartContainer title={title} subtitle={subtitle} height={height ?? 260}>
      <div className="relative h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={data}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={90}
            endAngle={-270}
            barSize={12}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, max]}
              tick={false}
            />
            <RadialBar
              background
              dataKey="value"
              cornerRadius={roundness}
              fill={color}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        {label != null && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-center">
              {label}
            </div>
          </div>
        )}
      </div>
    </ChartContainer>
  );
};

// helper to compute corner radius relative to size
const roundness = 999;
