"use client";

/**
 * @file AssistantActions — small action bar for assistant messages.
 * Source: community pattern from shadcn.io (MIT). Collected: 2025-09-04.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {  CopyIcon,
  RotateCcwIcon,
  SquareIcon,
  MoreHorizontalIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";

export type FeedbackValue = "up" | "down";

export type AssistantActionsProps = React.HTMLAttributes<HTMLDivElement> & {
  canStop?: boolean;
  canRegenerate?: boolean;
  disabled?: boolean;
  onStop?: () => void;
  onRegenerate?: () => void;
  onCopy?: () => void;
  onFeedback?: (value: FeedbackValue) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showCopy?: boolean;
  showFeedback?: boolean;
  showMenu?: boolean;
  size?: "sm" | "md";
};

/** Compact icon row for assistant message actions. */
export const AssistantActions: React.FC<AssistantActionsProps> = ({
  canStop,
  canRegenerate = true,
  disabled,
  onStop,
  onRegenerate,
  onCopy,
  onFeedback,
  onEdit,
  onDelete,
  showCopy = true,
  showFeedback = true,
  showMenu,
  size = "sm",
  className,
  ...props
}) => {
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const pad = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const menuVisible = showMenu ?? Boolean(onEdit || onDelete);

  return (
    <TooltipProvider delayDuration={80}>
      <div className={cn("flex items-center gap-1", className)} {...props}>
        {canStop ? (
          <IconButton
            label="Stop"
            ariaLabel="Stop generation"
            icon={<SquareIcon className={iconSize} />}
            pad={pad}
            onClick={onStop}
            disabled={disabled || !onStop}
          />
        ) : canRegenerate ? (
          <IconButton
            label="Regenerate"
            ariaLabel="Regenerate"
            icon={<RotateCcwIcon className={iconSize} />}
            pad={pad}
            onClick={onRegenerate}
            disabled={disabled || !onRegenerate}
          />
        ) : null}

        {showCopy && (
          <IconButton
            label="Copy"
            ariaLabel="Copy"
            icon={<CopyIcon className={iconSize} />}
            pad={pad}
            onClick={onCopy}
            disabled={disabled || !onCopy}
          />
        )}

        {showFeedback && (
          <>
            <IconButton
              label="Good"
              ariaLabel="Thumbs up"
              icon={<ThumbsUpIcon className={iconSize} />}
              pad={pad}
              onClick={() => onFeedback?.("up")}
              disabled={disabled || !onFeedback}
            />
            <IconButton
              label="Bad"
              ariaLabel="Thumbs down"
              icon={<ThumbsDownIcon className={iconSize} />}
              pad={pad}
              onClick={() => onFeedback?.("down")}
              disabled={disabled || !onFeedback}
            />
          </>
        )}

        {menuVisible && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className={cn("rounded-lg text-muted-foreground", pad)}
                disabled={disabled}
              >
                <MoreHorizontalIcon className={iconSize} />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
              <DropdownMenuItem disabled={!onEdit} onClick={() => onEdit?.()} className="gap-2">
                <PencilIcon className="h-4 w-4" /> Edit message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!onDelete}
                onClick={() => onDelete?.()}
                className="gap-2 text-red-600 focus:text-red-600"
              >
                <Trash2Icon className="h-4 w-4" /> Delete message
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </TooltipProvider>
  );
};

/** Internal icon button with tooltip. */
type IconButtonProps = {
  label: string;
  ariaLabel: string;
  icon: React.ReactNode;
  pad: string;
  onClick?: () => void;
  disabled?: boolean;
};

function IconButton({ label, ariaLabel, icon, pad, onClick, disabled }: IconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={cn("rounded-lg text-muted-foreground", pad)}
          aria-label={ariaLabel}
          onClick={onClick}
          disabled={disabled}
        >
          {icon}
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

