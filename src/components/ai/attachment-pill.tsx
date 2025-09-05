"use client";

/**
 * @file AttachmentPill — small file chip with icon, name, size, remove button.
 * Use inside PromptInputTools or above the textarea to show queued files.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PaperclipIcon, ImageIcon, FileIcon, XIcon } from "lucide-react";

export type AttachmentMeta = {
  id: string;
  name: string;
  size?: string;
  mime?: string;
  previewUrl?: string;
};

export type AttachmentPillProps = React.HTMLAttributes<HTMLDivElement> & {
  file: AttachmentMeta;
  error?: string;
  onRemove?: (id: string) => void;
};

export const AttachmentPill: React.FC<AttachmentPillProps> = ({
  file,
  error,
  onRemove,
  className,
  ...props
}) => {
  const icon =
    file.mime?.startsWith("image/") ? (
      <ImageIcon className="h-3.5 w-3.5" />
    ) : (
      <FileIcon className="h-3.5 w-3.5" />
    );

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs",
        error
          ? "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300"
          : "bg-muted/60",
        className
      )}
      {...props}
    >
      <span className="text-muted-foreground">
        <PaperclipIcon className="h-3.5 w-3.5" />
      </span>
      <span className="text-muted-foreground">{icon}</span>
      <span className="max-w-[12rem] truncate">{file.name}</span>
      {file.size ? <span className="text-muted-foreground">{file.size}</span> : null}
      {onRemove ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground"
          onClick={() => onRemove(file.id)}
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Remove</span>
        </Button>
      ) : null}
    </div>
  );
};
