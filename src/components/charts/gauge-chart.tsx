"use client";

/**
 * @file GaugeChart — semicircular gauge with a needle and colored ranges.
 * Implemented with a Pie (arc) + a custom Needle overlaid at the correct angle.
 */

import * as React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ChartContainer } from "./chart-container";

export type GaugeRange = {
  /** End value for this colored segment (relative within [min, max]). */
  to: number;
  /** Segment color. */
  color: string;
  /** Optional label shown in legend (not rendered inline here). */
  label?: string;
};

export type GaugeChartProps = {
  /** Current gauge value. */
  value: number;
  /** Min/Max bounds. */
  min?: number;
  max?: number;
  /** Colored segments ordered from low→high. `to` are absolute values. */
  ranges?: GaugeRange[];
  /** Arc thickness (difference between outer/inner radii). */
  thickness?: number;
  /** Start/end angles in degrees; default is 180° sweep (180→0) for semicircle. */
  startAngle?: number;
  endAngle?: number;
  /** Needle color. */
  needleColor?: string;
  /** Title/subtitle and height. */
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  height?: number;
  /** Optional center-top label (large number). If omitted, shows value. */
  label?: React.ReactNode;
};

/**
 * Draws a semicircular gauge:
 * - The background arc is split into colored segments (ranges).
 * - A Needle is drawn at the angle corresponding to `value`.
 * - Provide `ranges` like:
 *   [{ to: 30, color: "hsl(var(--muted-foreground))" },
 *    { to: 70, color: "hsl(var(--secondary-foreground))" },
 *    { to: 100, color: "hsl(var(--primary))" }]
 */
export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  min = 0,
  max = 100,
  ranges = [
    { to: min + (max - min) * 0.6, color: "hsl(var(--muted-foreground) / 0.35)" },
    { to: min + (max - min) * 0.85, color: "hsl(var(--secondary-foreground) / 0.6)" },
    { to: max, color: "hsl(var(--primary))" },
  ],
  thickness = 18,
  startAngle = 180,
  endAngle = 0,
  needleColor = "hsl(var(--foreground))",
  title,
  subtitle,
  height = 220,
  label,
}) => {
  const clamped = Math.max(min, Math.min(max, value));
  const span = max - min || 1;

  // Convert ranges to pie segments with values proportional to range lengths.
  const segments = [] as { name: string; value: number; color: string }[];
  let prev = min;
  for (const r of ranges) {
    const stop = Math.max(prev, Math.min(max, r.to));
    const len = stop - prev;
    if (len > 0) {
      segments.push({ name: `${prev}-${stop}`, value: len, color: r.color });
    }
    prev = stop;
  }

  // Needle angle from startAngle..endAngle according to normalized value.
  const progress = (clamped - min) / span; // 0..1
  const angle = startAngle + (endAngle - startAngle) * progress; // deg

  return (
    <ChartContainer title={title} subtitle={subtitle} height={height}>
      <div className="relative h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segments}
              dataKey="value"
              startAngle={startAngle}
              endAngle={endAngle}
              innerRadius={80 - thickness}
              outerRadius={80}
              cx="50%"
              cy="85%" /** push center down to make a semicircle */
              isAnimationActive={false}
              stroke="none"
            >
              {segments.map((s, i) => (
                <Cell key={i} fill={s.color as string} />
              ))}
            </Pie>

            {/* Needle overlay (absolute-positioned SVG path) */}
            <Needle
              angle={angle}
              cxPercent={50}
              cyPercent={85}
              radius={80}
              color={needleColor}
              hubRadius={6}
              lengthScale={0.9}
              thickness={2}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label (numeric value by default) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center">
          <div className="text-xl font-semibold tabular-nums">
            {label ?? clamped}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {min} – {max}
          </div>
        </div>
      </div>
    </ChartContainer>
  );
};

/**
 * Internal SVG needle overlay. Computes a line from the gauge center
 * at the given angle and draws a small hub circle.
 */
function Needle({
  angle,
  cxPercent,
  cyPercent,
  radius,
  color,
  hubRadius = 6,
  lengthScale = 0.9,
  thickness = 2,
}: {
  angle: number; // degrees
  cxPercent: number; // relative to container (0..100)
  cyPercent: number; // relative to container (0..100)
  radius: number; // outer radius used by Pie
  color: string;
  hubRadius?: number;
  lengthScale?: number;
  thickness?: number;
}) {
  const cx = cxPercent;
  const cy = cyPercent;
  const len = (radius / 100) * 100 * lengthScale;
  const rad = (angle * Math.PI) / 180;
  const x2 = cx + (Math.cos(rad) * len) / 1;
  const y2 = cy - (Math.sin(rad) * len) / 1;

  return (
    <g>
      <line
        x1={`${cx}%`}
        y1={`${cy}%`}
        x2={`${x2}%`}
        y2={`${y2}%`}
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
      />
      <circle cx={`${cx}%`} cy={`${cy}%`} r={hubRadius} fill={color} />
    </g>
  );
}

