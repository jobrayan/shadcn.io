"use client";

/**
 * @file AttachmentPreview — shows image/file preview grid before sending.
 * For images: shows thumbnails; for others: a generic file card.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DownloadIcon, XIcon, FileIcon, ImageIcon } from "lucide-react";
import type { AttachmentMeta } from "./attachment-pill";

export type AttachmentPreviewProps = React.HTMLAttributes<HTMLDivElement> & {
  files: AttachmentMeta[];
  onRemove?: (id: string) => void;
  onDownload?: (id: string) => void;
};

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  files,
  onRemove,
  onDownload,
  className,
  ...props
}) => {
  if (!files?.length) return null;

  return (
    <div className={cn("rounded-xl border bg-card p-2", className)} {...props}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {files.map((f) => {
          const isImg = f.mime?.startsWith("image/") && f.previewUrl;
          return (
            <div key={f.id} className="group relative overflow-hidden rounded-lg border bg-muted">
              {isImg ? (
                <img src={f.previewUrl} alt={f.name} className="h-32 w-full object-cover" />
              ) : (
                <div className="flex h-32 w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  {f.mime?.startsWith("image/") ? <ImageIcon /> : <FileIcon />}
                  <div className="line-clamp-2 px-2 text-center text-xs">{f.name}</div>
                </div>
              )}

              <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                {onDownload ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onDownload?.(f.id)}
                  >
                    <DownloadIcon className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                ) : null}
                {onRemove ? (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onRemove?.(f.id)}
                  >
                    <XIcon className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
