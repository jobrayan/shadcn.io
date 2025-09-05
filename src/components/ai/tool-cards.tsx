"use client";

/**
 * @file Tool result cards — table list, key–value, and JSON collapsible.
 * Use inside <Tool> or directly in assistant messages.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

/** Table card */
export function ResultTableCard({
  columns,
  rows,
  className,
}: {
  columns: { key: string; label: string }[];
  rows: Record<string, React.ReactNode>[];
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border bg-card p-2", className)}>
      <ScrollArea className="max-h-[380px]">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.key} className="whitespace-nowrap">
                  {c.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i}>
                {columns.map((c) => (
                  <TableCell key={c.key} className="align-top">
                    {r[c.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}

/** Key–value inspector */
export function KeyValueCard({
  items,
  className,
}: {
  items: Array<{ key: string; value: React.ReactNode }>;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border bg-card p-2 text-sm", className)}>
      <dl className="grid gap-1">
        {items.map((it) => (
          <div key={it.key} className="flex gap-3">
            <dt className="w-40 shrink-0 text-muted-foreground">{it.key}</dt>
            <dd className="min-w-0 flex-1">{it.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** JSON collapsible (pretty-printed) */
export function JsonCard({
  data,
  title = "JSON",
  defaultOpen = false,
  className,
}: {
  data: unknown;
  title?: string;
  defaultOpen?: boolean;
  className?: string;
}) {
  const pretty = React.useMemo(() => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }, [data]);

  return (
    <Collapsible defaultOpen={defaultOpen} className={cn("rounded-xl border bg-card", className)}>
      <div className="flex items-center justify-between px-2 py-1.5">
        <div className="text-sm font-medium">{title}</div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRightIcon className="h-4 w-4 data-[state=open]:hidden" />
            <ChevronDownIcon className="hidden h-4 w-4 data-[state=open]:block" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="px-2 pb-2">
        <ScrollArea className="max-h-[420px] rounded-lg border bg-muted/40 p-2 font-mono text-[12.5px]">
          <pre className="whitespace-pre-wrap break-words">{pretty}</pre>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
}

