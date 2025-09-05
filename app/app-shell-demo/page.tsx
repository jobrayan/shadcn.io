"use client";

/**
 * @file App Shell demo page — stitches AppShell + Sidebar + Header with sample nav.
 * Drop-in under /app/app-shell-demo to verify layout quickly.
 */

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell/app-shell";
import { AppSidebar, type NavSection } from "@/components/app-shell/app-sidebar";
import { AppHeader } from "@/components/app-shell/app-header";
import { Button } from "@/components/ui/button";
import {
  BotIcon,
  BarChart3Icon,
  LayoutDashboardIcon,
  SettingsIcon,
  FolderKanbanIcon,
} from "lucide-react";

const sections: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboardIcon className="h-4 w-4" /> },
      { href: "/analytics", label: "Analytics", icon: <BarChart3Icon className="h-4 w-4" /> },
      { href: "/projects", label: "Projects", icon: <FolderKanbanIcon className="h-4 w-4" />, badge: "3" },
    ],
  },
  {
    title: "AI",
    items: [
      { href: "/ai/chat", label: "Chat", icon: <BotIcon className="h-4 w-4" /> },
      { href: "/settings", label: "Settings", icon: <SettingsIcon className="h-4 w-4" /> },
    ],
  },
];

export default function Page() {
  return (
    <AppShell
      sidebar={
        <AppSidebar
          brand={<Link href="/" className="text-sm font-semibold">Jobrain</Link>}
          sections={sections}
          footer={
            <Button asChild className="w-full">
              <Link href="/new">New Project</Link>
            </Button>
          }
        />
      }
      header={(mobileBtn) => (
        <AppHeader
          leading={mobileBtn}
          showSearch
          onSearch={(q) => console.log("search:", q)}
          onToggleTheme={() => console.log("toggle theme")}
          isDark={false}
          actions={null}
        />
      )}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="text-sm font-medium">Welcome</h2>
          <p className="text-sm text-muted-foreground">
            This is a demo content area. Resize to test the responsive sidebar.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="text-sm font-medium">Next steps</h2>
          <ul className="list-disc pl-5 text-sm">
            <li>Wire your pages to the nav.</li>
            <li>Replace the brand slot with your logo.</li>
            <li>Add user/org logic to the header menu.</li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}

