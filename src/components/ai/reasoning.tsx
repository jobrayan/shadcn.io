"use client";

/**
 * @file Collapsible "Reasoning" panel that auto-opens while thinking and shows elapsed time.
 * Source: https://www.shadcn.io/ai/reasoning (MIT). Collected: 2025-09-04.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  BrainIcon,
  ChevronDown,
  PauseCircle,
  PlayCircle,
} from "lucide-react";

/** Possible model thinking states. */
export type ReasoningState = "idle" | "thinking" | "complete" | "hidden";

export type ReasoningProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Current state from your stream/controller. */
  state: ReasoningState;
  /** Raw textual reasoning (can be partial while streaming). */
  text?: string;
  /** Start timestamp (ms) to compute duration; defaults when state becomes "thinking". */
  startedAt?: number;
  /** Called whenever the user toggles open/closed. */
  onOpenChange?: (open: boolean) => void;
  /** Allow pause/resume UI (wire backend yourself). */
  allowPause?: boolean;
};

/**
 * Reasoning panel with:
 * - Auto-open on "thinking" and elapsed timer
 * - Collapsible body for chain-of-thought text
 * - Optional pause/resume affordance
 */
export const Reasoning: React.FC<ReasoningProps> = ({
  state,
  text,
  startedAt,
  onOpenChange,
  allowPause,
  className,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const [baseStart, setBaseStart] = React.useState<number | null>(null);
  const [elapsed, setElapsed] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (state === "thinking") {
      setOpen(true);
      if (!baseStart) setBaseStart(startedAt ?? Date.now());
    }
  }, [state, startedAt, baseStart]);

  React.useEffect(() => {
    if (state !== "thinking" || paused || !baseStart) return;
    const id = window.setInterval(() => {
      setElapsed(Date.now() - baseStart);
    }, 1000);
    return () => window.clearInterval(id);
  }, [state, paused, baseStart]);

  const seconds = Math.max(0, Math.floor(elapsed / 1000));
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const handleToggle = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  if (state === "hidden") return null;

  return (
    <Collapsible
      open={open}
      onOpenChange={handleToggle}
      className={cn("w-full rounded-lg border bg-muted/40", className)}
      {...props}
    >
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <BrainIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium">
            {state === "thinking" ? "Thinking…" : "Reasoning"}
          </span>
          {state === "thinking" && (
            <span className="text-xs tabular-nums text-muted-foreground">
              {mm}:{ss}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {allowPause && state === "thinking" && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? (
                <PlayCircle className="h-4 w-4" />
              ) : (
                <PauseCircle className="h-4 w-4" />
              )}
            </Button>
          )}
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  open && "rotate-180"
                )}
              />
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent className="border-t px-3 py-2 text-xs leading-relaxed">
        <pre className="whitespace-pre-wrap break-words font-mono">
          {text?.trim() || (state === "thinking" ? "…" : "No reasoning provided.")}
        </pre>
      </CollapsibleContent>
    </Collapsible>
  );
};

