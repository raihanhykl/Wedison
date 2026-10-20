"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail,
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
          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
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
            </SidebarGroup>
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
