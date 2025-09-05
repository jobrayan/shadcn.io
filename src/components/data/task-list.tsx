"use client";

/**
 * @file TaskList — accessible sortable (DnD) task list with inline editing.
 * Uses @dnd-kit for mouse/touch/keyboard drag-and-drop.
 */

import * as React from "react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GripVerticalIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
  FlagIcon,
  CalendarIcon,
} from "lucide-react";

export type Priority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  done?: boolean;
  priority?: Priority;
  due?: string;
};

export type TaskListHandlers = {
  onReorder?: (next: Task[]) => void;
  onToggle?: (id: string, done: boolean) => void;
  onRename?: (id: string, title: string) => void;
  onDelete?: (id: string) => void;
  onPriorityChange?: (id: string, p?: Priority) => void;
};

export type TaskListProps = React.HTMLAttributes<HTMLDivElement> &
  TaskListHandlers & {
    items: Task[];
    dense?: boolean;
  };

export const TaskList: React.FC<TaskListProps> = ({
  items,
  onReorder,
  onToggle,
  onRename,
  onDelete,
  onPriorityChange,
  dense,
  className,
  ...props
}) => {
  const [local, setLocal] = React.useState<Task[]>(items);
  React.useEffect(() => setLocal(items), [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = local.findIndex((t) => t.id === String(active.id));
    const newIndex = local.findIndex((t) => t.id === String(over.id));
    const next = arrayMove(local, oldIndex, newIndex);
    setLocal(next);
    onReorder?.(next);
  };

  return (
    <div className={cn("w-full space-y-1", className)} {...props}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext items={local.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {local.map((t) => (
            <SortableTaskRow
              key={t.id}
              task={t}
              dense={dense}
              onToggle={onToggle}
              onRename={onRename}
              onDelete={onDelete}
              onPriorityChange={onPriorityChange}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

type SortableTaskRowProps = {
  task: Task;
  dense?: boolean;
} & TaskListHandlers;

function SortableTaskRow({ task, dense, onToggle, onRename, onDelete, onPriorityChange }: SortableTaskRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-lg border bg-card text-card-foreground shadow-sm",
        dense ? "px-2 py-1.5" : "px-3 py-2",
        isDragging && "opacity-90 ring-2 ring-ring"
      )}
    >
      <TaskRow
        task={task}
        dense={dense}
        dragHandleProps={{ ...attributes, ...listeners }}
        onToggle={onToggle}
        onRename={onRename}
        onDelete={onDelete}
        onPriorityChange={onPriorityChange}
      />
    </div>
  );
}

type TaskRowProps = {
  task: Task;
  dense?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
} & TaskListHandlers;

function TaskRow({ task, dense, dragHandleProps, onToggle, onRename, onDelete, onPriorityChange }: TaskRowProps) {
  const [editing, setEditing] = React.useState(false);
  const [title, setTitle] = React.useState(task.title);
  React.useEffect(() => setTitle(task.title), [task.title]);

  const commitTitle = () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== task.title) onRename?.(task.id, trimmed);
    setEditing(false);
  };

  const priColor =
    task.priority === "high"
      ? "bg-red-500/15 text-red-600"
      : task.priority === "medium"
      ? "bg-amber-500/15 text-amber-600"
      : task.priority === "low"
      ? "bg-emerald-500/15 text-emerald-600"
      : "bg-muted text-muted-foreground";

  return (
    <div className={cn("flex items-center gap-2")}> 
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "h-7 w-7 shrink-0 cursor-grab text-muted-foreground hover:text-foreground",
          "active:cursor-grabbing"
        )}
        aria-label="Drag to reorder"
        {...dragHandleProps}
      >
        <GripVerticalIcon className="h-4 w-4" />
      </Button>

      <Checkbox
        checked={!!task.done}
        onCheckedChange={(v) => onToggle?.(task.id, Boolean(v))}
        aria-label={task.done ? "Mark as not done" : "Mark as done"}
      />

      <div className="min-w-0 flex-1">
        {editing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => e.key === "Enter" && commitTitle()}
            autoFocus
            className="h-8"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={cn(
              "block w-full text-left text-sm",
              task.done && "text-muted-foreground line-through"
            )}
            aria-label="Edit title"
          >
            <span className="line-clamp-2">{task.title}</span>
          </button>
        )}

        <div className={cn("mt-0.5 flex items-center gap-2", dense && "text-[11px]")}> 
          {task.priority ? (
            <Badge variant="secondary" className={cn("gap-1 border-0", priColor)}>
              <FlagIcon className="h-3 w-3" />
              <span className="capitalize">{task.priority}</span>
            </Badge>
          ) : (
            <span className="text-[11px] text-muted-foreground">No priority</span>
          )}
          {task.due ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <CalendarIcon className="h-3 w-3" />
              {task.due}
            </span>
          ) : null}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
            <MoreHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuItem onClick={() => setEditing(true)} className="gap-2">
            <PencilIcon className="h-4 w-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2" onClick={() => onPriorityChange?.(task.id, "low")}>
            <FlagIcon className="h-4 w-4 text-emerald-600" />
            Set priority: Low
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2" onClick={() => onPriorityChange?.(task.id, "medium")}>
            <FlagIcon className="h-4 w-4 text-amber-600" />
            Set priority: Medium
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2" onClick={() => onPriorityChange?.(task.id, "high")}>
            <FlagIcon className="h-4 w-4 text-red-600" />
            Set priority: High
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2" onClick={() => onPriorityChange?.(task.id, undefined)}>
            <FlagIcon className="h-4 w-4" />
            Clear priority
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 text-red-600 focus:text-red-600"
            onClick={() => onDelete?.(task.id)}
          >
            <Trash2Icon className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

