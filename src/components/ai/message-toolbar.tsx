"use client";

/**
 * @file MessageToolbar — floating per-message action bar.
 * Source: community pattern from shadcn.io (MIT). Collected: 2025-09-04.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type ToolbarAction = {
  id: string;
  label: string;
  icon: React.ReactNode;
  onSelect?: () => void;
  tone?: "default" | "danger";
  disabled?: boolean;
};

export type MessageToolbarProps = React.HTMLAttributes<HTMLDivElement> & {
  actions: ToolbarAction[];
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  offset?: { x?: number; y?: number };
  alwaysVisible?: boolean;
  capturePointerEvents?: boolean;
  size?: "sm" | "md";
};

/** Absolute-positioned toolbar shown on hover/focus of parent (group). */
export const MessageToolbar: React.FC<MessageToolbarProps> = ({
  actions,
  position = "top-right",
  offset,
  alwaysVisible = false,
  capturePointerEvents = true,
  size = "sm",
  className,
  ...props
}) => {
  const x = offset?.x ?? 8;
  const y = offset?.y ?? 8;

  const corner =
    position === "top-right"
      ? "top-0 right-0"
      : position === "top-left"
      ? "top-0 left-0"
      : position === "bottom-right"
      ? "bottom-0 right-0"
      : "bottom-0 left-0";

  const translateY = position.startsWith("top") ? `translate-y-[${y}px]` : `-translate-y-[${y}px]`;
  const translateX = position.endsWith("right") ? `-translate-x-[${x}px]` : `translate-x-[${x}px]`;

  const pad = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const gap = size === "sm" ? "gap-1" : "gap-1.5";

  return (
    <TooltipProvider delayDuration={80}>
      <div
        className={cn(
          "absolute z-10", corner, translateY, translateX,
          alwaysVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
          "transition-opacity duration-150",
          capturePointerEvents ? "pointer-events-auto" : "pointer-events-none",
          className
        )}
        tabIndex={-1}
        {...props}
      >
        <div
          className={cn(
            "flex rounded-lg border bg-background/95 px-1.5 py-1 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/75",
            gap
          )}
          role="toolbar"
          aria-label="Message actions"
        >
          {actions.map((a) => (
            <ToolbarIconButton key={a.id} action={a} pad={pad} />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

function ToolbarIconButton({ action, pad }: { action: ToolbarAction; pad: string }) {
  const { label, icon, onSelect, tone = "default", disabled } = action;
  const toneClass =
    tone === "danger"
      ? "text-red-600 hover:text-red-700 focus-visible:text-red-700"
      : "text-muted-foreground";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={cn("rounded-md", pad, toneClass)}
          aria-label={label}
          title={label}
          onClick={onSelect}
          disabled={disabled}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="center" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

