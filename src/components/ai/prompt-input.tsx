"use client";

/**
 * @file Prompt input components (MIT).
 * Source: https://www.shadcn.io/ai/prompt-input
 * Collected on: 2025-09-04
 */

import React,
  {
    Children,
    type ComponentProps,
    type HTMLAttributes,
    type KeyboardEventHandler,
  } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ChatStatus } from "ai";
import { Loader2Icon, SendIcon, SquareIcon, XIcon } from "lucide-react";

/** Container form for the prompt input (provides border, rounding, and dividers). */
export type PromptInputProps = HTMLAttributes<HTMLFormElement>;
export const PromptInput: React.FC<PromptInputProps> = ({ className, ...props }) => (
  <form
    className={cn(
      "w-full divide-y overflow-hidden rounded-xl border bg-background shadow-sm",
      className,
    )}
    {...props}
  />
);

/** Props for the auto-resizing textarea. */
export type PromptInputTextareaProps = ComponentProps<typeof Textarea> & {
  /** Minimum height in px. */
  minHeight?: number;
  /** Maximum height in px. */
  maxHeight?: number;
};

/**
 * Auto-resizing textarea with Enter/Shift+Enter behavior:
 * - Enter submits the form
 * - Shift+Enter inserts a newline
 */
export const PromptInputTextarea: React.FC<PromptInputTextareaProps> = ({
  onChange,
  className,
  placeholder = "What would you like to know?",
  minHeight = 48,
  maxHeight = 164,
  ...props
}) => {
  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return; // allow newline
      }
      e.preventDefault();
      const form = e.currentTarget.form;
      form?.requestSubmit();
    }
  };

  return (
    <Textarea
      className={cn(
        "w-full resize-none rounded-none border-none p-3 shadow-none outline-none ring-0",
        "field-sizing-content max-h-[6lh] bg-transparent dark:bg-transparent",
        "focus-visible:ring-0",
        className,
      )}
      name="message"
      onChange={(e) => onChange?.(e)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      style={{ minHeight, maxHeight }}
      {...props}
    />
  );
};

/** Toolbar row shown under the textarea. */
export type PromptInputToolbarProps = HTMLAttributes<HTMLDivElement>;
export const PromptInputToolbar: React.FC<PromptInputToolbarProps> = ({
  className,
  ...props
}) => <div className={cn("flex items-center justify-between p-1", className)} {...props} />;

/** Container for tool buttons on the left side of the toolbar. */
export type PromptInputToolsProps = HTMLAttributes<HTMLDivElement>;
export const PromptInputTools: React.FC<PromptInputToolsProps> = ({ className, ...props }) => (
  <div className={cn("flex items-center gap-1", "[&_button:first-child]:rounded-bl-xl", className)} {...props} />
);

/** Simple ghost button preset for toolbar actions. */
export type PromptInputButtonProps = ComponentProps<typeof Button>;
export const PromptInputButton: React.FC<PromptInputButtonProps> = ({
  variant = "ghost",
  className,
  size,
  ...props
}) => {
  const newSize = (size ?? Children.count(props.children) > 1) ? "default" : "icon";
  return (
    <Button
      className={cn("shrink-0 gap-1.5 rounded-lg", variant === "ghost" && "text-muted-foreground", newSize === "default" && "px-3", className)}
      size={newSize}
      type="button"
      variant={variant}
      {...props}
    />
  );
};

/** Submit button reflecting chat status (submitted/streaming/error). */
export type PromptInputSubmitProps = ComponentProps<typeof Button> & {
  status?: ChatStatus;
};
export const PromptInputSubmit: React.FC<PromptInputSubmitProps> = ({
  className,
  variant = "default",
  size = "icon",
  status,
  children,
  ...props
}) => {
  let Icon = <SendIcon className="size-4" />;
  if (status === "submitted") Icon = <Loader2Icon className="size-4 animate-spin" />;
  else if (status === "streaming") Icon = <SquareIcon className="size-4" />;
  else if (status === "error") Icon = <XIcon className="size-4" />;

  return (
    <Button className={cn("gap-1.5 rounded-lg", className)} size={size} type="submit" variant={variant} {...props}>
      {children ?? Icon}
    </Button>
  );
};

/** Controlled Select wrapper used as a “model picker” in the toolbar. */
export type PromptInputModelSelectProps = ComponentProps<typeof Select>;
export const PromptInputModelSelect: React.FC<PromptInputModelSelectProps> = (props) => <Select {...props} />;

/** Trigger for model select; styled to blend with toolbar. */
export type PromptInputModelSelectTriggerProps = ComponentProps<typeof SelectTrigger>;
export const PromptInputModelSelectTrigger: React.FC<PromptInputModelSelectTriggerProps> = ({
  className,
  ...props
}) => (
  <SelectTrigger
    className={cn(
      "border-none bg-transparent font-medium text-muted-foreground shadow-none transition-colors",
      'hover:bg-accent hover:text-foreground [&[aria-expanded="true"]]:bg-accent [&[aria-expanded="true"]]:text-foreground',
      className,
    )}
    {...props}
  />
);

/** Popover content for model select. */
export type PromptInputModelSelectContentProps = ComponentProps<typeof SelectContent>;
export const PromptInputModelSelectContent: React.FC<PromptInputModelSelectContentProps> = ({
  className,
  ...props
}) => <SelectContent className={cn(className)} {...props} />;

/** Single item in the model select. */
export type PromptInputModelSelectItemProps = ComponentProps<typeof SelectItem>;
export const PromptInputModelSelectItem: React.FC<PromptInputModelSelectItemProps> = ({
  className,
  ...props
}) => <SelectItem className={cn(className)} {...props} />;

/** Shows the currently selected model label. */
export type PromptInputModelSelectValueProps = ComponentProps<typeof SelectValue>;
export const PromptInputModelSelectValue: React.FC<PromptInputModelSelectValueProps> = ({
  className,
  ...props
}) => <SelectValue className={cn(className)} {...props} />;

