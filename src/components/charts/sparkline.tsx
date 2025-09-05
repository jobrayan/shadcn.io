"use client";

/**
 * @file Sparklines — ultra-compact line/area charts for inline summaries.
 * Minimal UI: no axes, no grid, optional dots & threshold band.
 */

import * as React from "react";
import {
  LineChart as RLineChart,
  Line,
  AreaChart as RAreaChart,
  Area,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import { ChartTooltipContent, type TooltipItem } from "./chart-primitives";

type NumLike = number | null | undefined;

export type SparklineBaseProps = {
  /** Array of numeric values; undefined/null entries render as gaps. */
  data: NumLike[];
  /** Height in px; width is 100% of parent. */
  height?: number;
  /** Stroke/fill color (CSS color). Defaults to currentColor. */
  color?: string;
  /** Smooth curve (monotone) or straight segments. Default: true (smooth). */
  smooth?: boolean;
  /** Show point dots (small). Default: false. */
  dots?: boolean;
  /** Optional [min, max] Y domain to keep multiple sparklines aligned. */
  yDomain?: [number, number];
  /** Optional threshold line value (e.g., goal). */
  threshold?: number;
  /** Optional highlight band: [low, high] (behind series). */
  band?: [number, number];
  /** Custom tooltip label for the value. */
  valueLabel?: string;
  /** Disable tooltip entirely. */
  noTooltip?: boolean;
};

function toRechartsData(values: NumLike[]) {
  return values.map((v, i) => ({ x: i, y: v ?? null }));
}

function renderTooltip(valueLabel?: string) {
  return ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const p = payload[0];
    const v = p.value as number;
    const items: TooltipItem[] = [
      { name: valueLabel ?? "Value", value: Number.isFinite(v) ? v : "—", color: p.color },
    ];
    return <ChartTooltipContent items={items} />;
  };
}

/** Tiny line sparkline. */
export const SparklineLine: React.FC<SparklineBaseProps> = ({
  data,
  height = 48,
  color,
  smooth = true,
  dots = false,
  yDomain,
  threshold,
  band,
  valueLabel,
  noTooltip,
}) => {
  const rows = toRechartsData(data);
  const stroke = color;
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <RLineChart data={rows} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          {band && (
            <ReferenceArea
              y1={band[0]}
              y2={band[1]}
              fill="currentColor"
              fillOpacity={0.06}
              strokeOpacity={0}
            />
          )}
          {typeof threshold === "number" && (
            <ReferenceLine y={threshold} stroke="currentColor" strokeDasharray="3 3" opacity={0.5} />
          )}
          <YAxis hide domain={yDomain ?? ["auto", "auto"]} />
          {!noTooltip && (
            <Tooltip isAnimationActive={false} cursor={{ strokeOpacity: 0.1 }} content={renderTooltip(valueLabel)} />
          )}
          <Line
            type={smooth ? "monotone" : "linear"}
            dataKey="y"
            stroke={stroke}
            strokeWidth={2}
            dot={dots ? { r: 2, strokeWidth: 0, fill: stroke } : false}
            isAnimationActive={false}
            connectNulls
          />
        </RLineChart>
      </ResponsiveContainer>
    </div>
  );
};

/** Tiny area sparkline (line + soft fill). */
export const SparklineArea: React.FC<SparklineBaseProps & { gradient?: boolean }> = ({
  data,
  height = 48,
  color,
  smooth = true,
  dots = false,
  yDomain,
  threshold,
  band,
  valueLabel,
  noTooltip,
  gradient = true,
}) => {
  const rows = toRechartsData(data);
  const fill = color || "currentColor";
  const gradId = React.useId();

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <RAreaChart data={rows} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <YAxis hide domain={yDomain ?? ["auto", "auto"]} />
          {band && (
            <ReferenceArea
              y1={band[0]}
              y2={band[1]}
              fill="currentColor"
              fillOpacity={0.06}
              strokeOpacity={0}
            />
          )}
          {typeof threshold === "number" && (
            <ReferenceLine y={threshold} stroke="currentColor" strokeDasharray="3 3" opacity={0.5} />
          )}
          {!noTooltip && (
            <Tooltip isAnimationActive={false} cursor={{ strokeOpacity: 0.1 }} content={renderTooltip(valueLabel)} />
          )}

          {gradient && (
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={fill} stopOpacity={0.28} />
                <stop offset="95%" stopColor={fill} stopOpacity={0.06} />
              </linearGradient>
            </defs>
          )}

          <Area
            type={smooth ? "monotone" : "linear"}
            dataKey="y"
            stroke={fill}
            fill={gradient ? `url(#${gradId})` : fill}
            strokeWidth={2}
            dot={dots ? { r: 2, strokeWidth: 0, fill } : false}
            isAnimationActive={false}
            connectNulls
          />
        </RAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

