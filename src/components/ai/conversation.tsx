"use client";

/**
 * @file Scrollable conversation container with "stick to bottom".
 * Source: shadcn.io/ai/conversation (MIT). Collected: 2025-09-04.
 *
 * Behavior:
 * - Auto-sticks to bottom while new messages stream in.
 * - If the user scrolls up, auto-stick pauses; a "Jump to latest"
 *   button appears. Clicking it restores stickiness and focuses end.
 * - Emits onStickChange so you can reflect state (e.g., hide typing).
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export type ConversationProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Distance (px) from bottom to consider “at bottom”.
   * Increase if you have large paddings or oversized bubbles.
   */
  bottomThreshold?: number;
  /**
   * Callback when sticky state flips (true = stick to bottom).
   */
  onStickChange?: (stuck: boolean) => void;
  /**
   * Show/hide the floating jump button. Defaults to true.
   */
  showJumpButton?: boolean;
};

/**
 * A scroll container that stays pinned to the latest messages unless
 * the user scrolls up. Compatible with streaming/SSR and variable-height
 * content (markdown, code blocks, images).
 */
export const Conversation: React.FC<ConversationProps> = ({
  className,
  children,
  bottomThreshold = 24,
  onStickChange,
  showJumpButton = true,
  ...props
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [stuck, setStuck] = useState(true);
  const [showJump, setShowJump] = useState(false);

  // Keep a tiny "sentinel" at the end we can scrollIntoView on.
  const endRef = useRef<HTMLDivElement | null>(null);

  const computeIsAtBottom = useCallback(() => {
    const el = ref.current;
    if (!el) return true;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distance <= bottomThreshold;
  }, [bottomThreshold]);

  const stickToBottom = useCallback((behavior: ScrollBehavior = "instant") => {
    const el = ref.current;
    if (!el) return;
    // Use the sentinel for smoother behavior with variable-height blocks.
    endRef.current?.scrollIntoView({ behavior, block: "end" });
  }, []);

  // Observe scrolls to toggle sticky state and jump button.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const atBottom = computeIsAtBottom();
      if (atBottom && !stuck) {
        setStuck(true);
        onStickChange?.(true);
      } else if (!atBottom && stuck) {
        setStuck(false);
        onStickChange?.(false);
      }
      setShowJump(!atBottom);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    // Run once to initialize.
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [computeIsAtBottom, onStickChange, stuck]);

  // When children change and we’re “stuck”, keep the latest in view.
  useEffect(() => {
    if (stuck) {
      stickToBottom("smooth");
    }
  }, [children, stuck, stickToBottom]);

  return (
    <div className="relative">
      <div
        ref={ref}
        className={cn(
          "h-full max-h-[70vh] overflow-y-auto overscroll-contain scroll-smooth",
          "pr-1", // tiny space for scrollbar
          className
        )}
        {...props}
      >
        {children}
        {/* Sentinel for precise bottom tracking */}
        <div ref={endRef} aria-hidden="true" />
      </div>

      {showJumpButton && showJump && (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="absolute bottom-3 left-1/2 -translate-x-1/2 shadow-md"
          onClick={() => {
            stickToBottom("smooth");
            // Re-enable sticky after jump
            setStuck(true);
            onStickChange?.(true);
          }}
        >
          <ChevronDown className="mr-1 h-4 w-4" />
          Jump to latest
        </Button>
      )}
    </div>
  );
};

