"use client";

/**
 * @file AppHeader — top bar with breadcrumb, search, and actions.
 * - Left: mobile sidebar button (injected by AppShell), breadcrumb
 * - Middle: optional search input
 * - Right: actions (new, theme, user menu)
 */

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PlusIcon, SunIcon, MoonIcon, ChevronRightIcon } from "lucide-react";

export type AppHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Placeholder/actions for the left edge (e.g., MobileNavButton). */
  leading?: React.ReactNode;
  /** Show a search input in the header. */
  showSearch?: boolean;
  /** Called when user hits Enter in the search box. */
  onSearch?: (query: string) => void;
  /** Right-side custom actions (before user menu). */
  actions?: React.ReactNode;
  /** Light/Dark toggle; if omitted, button is hidden. */
  onToggleTheme?: () => void;
  /** isDark controls icon; optional if you wire your own theme state. */
  isDark?: boolean;
};

/**
 * Small util: builds crumbs from pathname (/a/b -> ["a","b"]).
 */
function useBreadcrumb() {
  const pathname = usePathname() || "/";
  const parts = pathname.split("/").filter(Boolean);
  const items = parts.map((p, i) => ({
    name: decodeURIComponent(p),
    href: "/" + parts.slice(0, i + 1).join("/"),
  }));
  return { items, pathname };
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  leading,
  showSearch = true,
  onSearch,
  actions,
  onToggleTheme,
  isDark,
  className,
  ...props
}) => {
  const { items } = useBreadcrumb();
  const [q, setQ] = React.useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) onSearch?.(q.trim());
  };

  return (
    <div
      className={cn(
        "flex h-14 items-center gap-2 border-b bg-background px-3",
        className
      )}
      {...props}
    >
      {/* Leading: mobile burger gets injected here */}
      {leading}

      {/* Breadcrumbs */}
      <nav className="hidden md:flex items-center text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        {items.map((it, i) => (
          <React.Fragment key={i}>
            <ChevronRightIcon className="mx-1 h-4 w-4" />
            <Link
              href={it.href}
              className={cn(
                "hover:text-foreground",
                i === items.length - 1 && "text-foreground"
              )}
            >
              {it.name}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      {/* Search */}
      {showSearch ? (
        <form onSubmit={submit} className="ml-auto flex min-w-0 flex-1 items-center md:ml-4 md:max-w-sm">
          <Input
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
            placeholder="Search…"
            className="h-9"
          />
        </form>
      ) : (
        <div className="ml-auto" />
      )}

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <Button variant="outline" className="h-9" asChild>
          <Link href="/new">
            <PlusIcon className="mr-1 h-4 w-4" />
            New
          </Link>
        </Button>

        {onToggleTheme ? (
          <Button
            type="button"
            variant="ghost"
            className="h-9 w-9"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>
        ) : null}

        {actions}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 px-2">
              <Avatar className="mr-2 size-6">
                <AvatarFallback>JB</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline">You</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-48">
            <DropdownMenuItem asChild>
              <Link href="/account">Account</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/logout">Log out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

