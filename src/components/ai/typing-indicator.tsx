"use client";

/**
 * @file TypingIndicator — subtle animated typing dots for chat UIs.
 * Works inside assistant bubbles or below PromptInput during streaming.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export type TypingIndicatorProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Size (dot diameter in px). Defaults to 6. */
  dotSize?: number;
  /** Space between dots (px). Defaults to 4. */
  gap?: number;
  /** Accessible label; defaults to "Assistant is typing". */
  ariaLabel?: string;
  /** If provided false, renders nothing. */
  active?: boolean;
};

/**
 * Renders three pulsating dots with slight phase offsets.
 * The animation is implemented via scoped CSS-in-JS to avoid global setup.
 */
export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  dotSize = 6,
  gap = 4,
  ariaLabel = "Assistant is typing",
  active = true,
  className,
  ...props
}) => {
  if (!active) return null;

  return (
    <div
      className={cn("inline-flex items-center", className)}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      {...props}
    >
      <span
        className="inline-block rounded-full bg-muted-foreground/70 will-change-transform"
        style={{ width: dotSize, height: dotSize, marginRight: gap, animation: "ti-bounce 1.2s infinite ease-in-out" }}
      />
      <span
        className="inline-block rounded-full bg-muted-foreground/70 will-change-transform"
        style={{ width: dotSize, height: dotSize, marginRight: gap, animation: "ti-bounce 1.2s infinite ease-in-out .15s" }}
      />
      <span
        className="inline-block rounded-full bg-muted-foreground/70 will-change-transform"
        style={{ width: dotSize, height: dotSize, animation: "ti-bounce 1.2s infinite ease-in-out .3s" }}
      />
      {/* Scoped keyframes */}
      <style jsx>{`
        @keyframes ti-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
