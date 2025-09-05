"use client";

/**
 * @file MessageImageGallery — small grid of images within a chat message.
 * Click to open a dialog preview with zoom-to-fit image.
 */

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export type GalleryItem = {
  id: string;
  src: string;
  alt?: string;
  caption?: string;
  w?: number;
  h?: number;
};

export type MessageImageGalleryProps = React.HTMLAttributes<HTMLDivElement> & {
  items: GalleryItem[];
  cols?: 1 | 2 | 3;
};

export const MessageImageGallery: React.FC<MessageImageGalleryProps> = ({
  items,
  cols = 2,
  className,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<GalleryItem | null>(null);

  const openItem = (it: GalleryItem) => {
    setActive(it);
    setOpen(true);
  };

  return (
    <div
      className={cn(
        "grid gap-2",
        cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-2" : "grid-cols-3",
        className
      )}
      {...props}
    >
      {items.map((it) => (
        <button
          type="button"
          key={it.id}
          className="group relative overflow-hidden rounded-lg border bg-muted"
          onClick={() => openItem(it)}
        >
          <Image
            src={it.src}
            alt={it.alt ?? ""}
            width={it.w ?? 400}
            height={it.h ?? 300}
            className="h-32 w-full object-cover transition group-hover:scale-[1.02]"
          />
          {it.caption ? (
            <div className="absolute inset-x-0 bottom-0 bg-black/40 p-1 text-[11px] text-white backdrop-blur">
              {it.caption}
            </div>
          ) : null}
        </button>
      ))}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          {active ? (
            <div className="relative aspect-video w-full">
              <Image src={active.src} alt={active.alt ?? ""} fill className="object-contain" />
            </div>
          ) : null}
          {active?.caption ? (
            <div className="text-xs text-muted-foreground">{active.caption}</div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

