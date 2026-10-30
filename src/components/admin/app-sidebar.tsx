"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar,
} from "@/components/ui/sidebar";
import { NAV } from "./nav-config";
import { NavUser } from "./nav-user";
import { useAdminUser } from "./providers";
import { canAccess, homeFor } from "@/lib/admin/permissions";

export function AppSidebar() {
  const pathname = usePathname().replace(/\/+$/, "") || "/";
  const user = useAdminUser();

  // Item aktif = href TERPANJANG yang cocok dengan path, supaya "Overview" (/admin/leads)
  // tidak ikut menyala saat membuka /admin/leads/bookings.
  const matches = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`));
  const activeHref = NAV.flatMap((g) => g.items.map((i) => i.href)).filter(matches).sort((a, b) => b.length - a.length)[0];
  const isActive = (href: string) => href === activeHref;
  const { collapsed, toggle } = useCollapsedGroups();
  const { state, isMobile } = useSidebar();
  const iconOnly = state === "collapsed" && !isMobile;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Wedison Admin">
              <Link href={homeFor(user)}>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Image src="/logo/wedison-logogram.svg" alt="" width={18} height={18} className="size-4 brightness-0 invert" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="font-display font-bold tracking-tight">Wedison</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Admin</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAV.map((group) => {
          const items = group.items.filter((i) => !i.module || canAccess(user, i.module));
          if (!items.length) return null;
          const hasActive = items.some((i) => isActive(i.href));
          // The group holding the current page is always open; in icon-only mode every item shows.
          const open = iconOnly || hasActive || !collapsed.has(group.label);
          return (
            <Collapsible key={group.label} open={open} onOpenChange={() => toggle(group.label)} className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger
                    disabled={hasActive}
                    className="w-full justify-between rounded-md transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:cursor-default disabled:hover:bg-transparent"
                    aria-label={`${open ? "Collapse" : "Expand"} ${group.label}`}
                  >
                    {group.label}
                    <ChevronRight className="ml-auto size-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {items.map((item) => (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.title}>
                            <Link href={item.href}>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

const STORAGE_KEY = "wd-admin-nav-collapsed";

/** Collapsed sidebar groups, remembered per browser (all open by default). */
function useCollapsedGroups() {
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setCollapsed(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* storage blocked: keep everything open */
    }
  }, []);
  const toggle = useCallback((label: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);
  return { collapsed, toggle };
}
