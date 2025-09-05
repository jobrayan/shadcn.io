"use client";

/**
 * @file AppSidebar — responsive nav with sections and active-route styling.
 * - Desktop: fixed left rail
 * - Mobile: rendered inside a <Sheet> (controlled by AppShell)
 */

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export type NavItem = {
  /** URL path (e.g., /dashboard). */
  href: string;
  /** Label shown in the sidebar. */
  label: string;
  /** Lucide icon element (e.g., <HomeIcon className="h-4 w-4" />). */
  icon?: React.ReactNode;
  /** Optional badge text (e.g., "New"). */
  badge?: string;
};

export type NavSection = {
  /** Section title (e.g., "Workspace"). Optional. */
  title?: string;
  /** Items in this section. */
  items: NavItem[];
};

export type AppSidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  /** App/product name/logo slot. */
  brand?: React.ReactNode;
  /** Sections to render. */
  sections: NavSection[];
  /** Optional footer content (e.g., workspace switcher). */
  footer?: React.ReactNode;
};

/**
 * Renders a vertical navigation rail. Does not include the mobile Sheet wrapper.
 * Use inside <AppShell> which handles mobile toggling.
 */
export const AppSidebar: React.FC<AppSidebarProps> = ({
  brand,
  sections,
  footer,
  className,
  ...props
}) => {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col border-r bg-card text-card-foreground",
        className
      )}
      {...props}
    >
      {/* Brand */}
      <div className="flex h-14 items-center gap-2 px-3">
        {brand ?? <div className="text-sm font-semibold">Your App</div>}
      </div>
      <Separator />

      {/* Nav */}
      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          {sections.map((sec, si) => (
            <div key={si} className="mb-3">
              {sec.title ? (
                <div className="px-2 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {sec.title}
                </div>
              ) : null}
              <div className="space-y-1">
                {sec.items.map((it, ii) => {
                  const active =
                    pathname === it.href ||
                    (it.href !== "/" && pathname?.startsWith(it.href + "/"));
                  return (
                    <Link
                      key={ii}
                      href={it.href}
                      className={cn(
                        "group flex items-center gap-2 rounded-md px-2 py-2 text-sm outline-none",
                        active
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      )}
                    >
                      {it.icon ? <span className="text-muted-foreground group-hover:text-foreground">{it.icon}</span> : null}
                      <span className="truncate">{it.label}</span>
                      {it.badge ? (
                        <Badge variant="secondary" className="ml-auto">
                          {it.badge}
                        </Badge>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      {footer ? (
        <>
          <Separator />
          <div className="p-2">{footer}</div>
        </>
      ) : null}
    </div>
  );
};

