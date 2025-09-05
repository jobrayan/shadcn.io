"use client";

/**
 * @file AppShell — layout scaffold with responsive sidebar + header.
 * - Provides a Sheet for mobile sidebar
 * - Fixed desktop sidebar (w-64) + scrollable main content
 * - Accepts arbitrary sidebar/header slots
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

export type AppShellProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Sidebar content (usually <AppSidebar />). */
  sidebar: React.ReactNode;
  /** Header content (usually <AppHeader />). */
  header: (mobileButton: React.ReactNode) => React.ReactNode;
};

/**
 * Renders:
 * - Mobile: header with burger -> opens <Sheet> that renders `sidebar`
 * - Desktop ≥ md: fixed left sidebar + header in main area
 * - Main content scrolls; header stays at top
 */
export const AppShell: React.FC<AppShellProps> = ({
  sidebar,
  header,
  children,
  className,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);

  const mobileButton = (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="mr-1 h-9 w-9 md:hidden"
          aria-label="Open navigation"
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        {sidebar}
      </SheetContent>
    </Sheet>
  );

  return (
    <div className={cn("flex min-h-dvh w-full bg-background", className)} {...props}>
      {/* Desktop rail */}
      <div className="hidden md:block">{sidebar}</div>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header (receives mobile burger) */}
        {header(mobileButton)}

        {/* Content */}
        <main className="min-h-0 flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
};

