/**
 * @file Intl-based formatting helpers for numbers, bytes, currency, percent,
 * and time-series ticks. No external deps.
 */

export type Locale = string | string[] | undefined;

/** Format large numbers with compact K/M/B/T suffixes. */
export function formatCompact(n: number, locale?: Locale, maximumFractionDigits = 1) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits,
  }).format(n);
}

/** Format bytes (binary units). */
export function formatBytes(bytes: number, maximumFractionDigits = 1) {
  if (!Number.isFinite(bytes)) return "—";
  const u = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.min(u.length - 1, Math.max(0, Math.floor(Math.log2(Math.max(bytes, 1)) / 10)));
  const v = bytes / Math.pow(1024, i);
  return `${v.toFixed(v < 10 ? maximumFractionDigits : 0)} ${u[i]}`;
}

/** Format currency (defaults USD). */
export function formatCurrency(n: number, currency = "USD", locale?: Locale) {
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(n);
}

/** Format percent (0..1 or 0..100 based on `alreadyScaled`). */
export function formatPercent(v: number, { alreadyScaled = false, maximumFractionDigits = 1, locale }: { alreadyScaled?: boolean; maximumFractionDigits?: number; locale?: Locale } = {}) {
  const val = alreadyScaled ? v / 100 : v;
  return new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits }).format(val);
}

/** Safe date parser for epoch ms or ISO strings. */
export function toDate(x: number | string | Date): Date {
  if (x instanceof Date) return x;
  if (typeof x === "number") return new Date(x);
  const d = new Date(x);
  return Number.isNaN(+d) ? new Date(Number(x)) : d;
}

/** Short date like “Sep 5” or “Sep 5, 2025” if year differs. */
export function formatShortDate(x: number | string | Date, locale?: Locale) {
  const d = toDate(x);
  const now = new Date();
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (d.getFullYear() !== now.getFullYear()) opts.year = "numeric";
  return new Intl.DateTimeFormat(locale, opts).format(d);
}

/** Short time like “3:04 PM”. */
export function formatShortTime(x: number | string | Date, locale?: Locale) {
  const d = toDate(x);
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(d);
}

/** Date+time compact. */
export function formatShortDateTime(x: number | string | Date, locale?: Locale) {
  const d = toDate(x);
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

/** Create a tick formatter for time-series X axes. */
export function makeTimeTickFormatter(opts: {
  unit?: "auto" | "second" | "minute" | "hour" | "day" | "month" | "year";
  showTimeForDay?: boolean;
  locale?: Locale;
}) {
  const { unit = "auto", showTimeForDay = false, locale } = opts;
  return (x: any, index?: number, ticks?: any[]) => {
    const d = toDate(x);
    const u = unit === "auto" ? inferUnit(ticks) : unit;
    switch (u) {
      case "second":
      case "minute":
      case "hour":
        return formatShortTime(d, locale);
      case "day":
        return showTimeForDay ? formatShortDateTime(d, locale) : formatShortDate(d, locale);
      case "month":
        return new Intl.DateTimeFormat(locale, { month: "short" }).format(d);
      case "year":
        return String(d.getFullYear());
      default:
        return formatShortDateTime(d, locale);
    }
  };
}

/** Infer a unit from tick spacing (ms). */
function inferUnit(ticks?: any[]): Exclude<Parameters<typeof makeTimeTickFormatter>[0]["unit"], "auto"> {
  if (!ticks || ticks.length < 2) return "day";
  const ms = Math.abs(+toDate(ticks[1]) - +toDate(ticks[0]));
  const minute = 60_000, hour = 3_600_000, day = 86_400_000, month = day * 30, year = day * 365;
  if (ms < minute) return "second";
  if (ms < hour) return "minute";
  if (ms < day) return "hour";
  if (ms < month) return "day";
  if (ms < year) return "month";
  return "year";
}

/** Build a “nice” [min,max] domain with padding (e.g., 5%). */
export function niceDomain(values: Array<number | null | undefined>, pad = 0.05): [number, number] {
  const xs = values.filter((v): v is number => Number.isFinite(v as number));
  if (!xs.length) return [0, 1];
  const min = Math.min(...xs);
  const max = Math.max(...xs);
  if (min === max) return [min - 1, max + 1];
  const span = max - min;
  return [min - span * pad, max + span * pad];
}

