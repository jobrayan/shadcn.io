"use client";

/**
 * @file HistoryActionsMenu — attach to tiles to rename/duplicate/export.
 * Works alongside ConversationTile or any item; uses a small Dialog prompt.
 */

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MoreHorizontalIcon, CopyIcon, FileDownIcon, PencilIcon } from "lucide-react";

export type HistoryActionsMenuProps = {
  id: string;
  title: string;
  onRename?: (id: string, title: string) => void;
  onDuplicate?: (id: string) => void;
  onExport?: (id: string) => void;
};

export const HistoryActionsMenu: React.FC<HistoryActionsMenuProps> = ({
  id,
  title,
  onRename,
  onDuplicate,
  onExport,
}) => {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(title);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && name.trim() !== title) onRename?.(id, name.trim());
    setOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
            <MoreHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuItem onClick={() => setOpen(true)} className="gap-2">
            <PencilIcon className="h-4 w-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDuplicate?.(id)} className="gap-2">
            <CopyIcon className="h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport?.(id)} className="gap-2">
            <FileDownIcon className="h-4 w-4" />
            Export
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename chat</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit}>
            <Input value={name} onChange={(e) => setName(e.currentTarget.value)} autoFocus />
            <DialogFooter className="mt-3">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

