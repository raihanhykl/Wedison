"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { SEGMENT_LABEL } from "./nav-config";

export function AdminHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean); // ["admin","cms","articles","abc"]
  const crumbs = segments.map((seg, i) => ({
    href: "/" + segments.slice(0, i + 1).join("/"),
    label: SEGMENT_LABEL[seg] ?? (seg.length > 16 ? "Detail" : seg),
    last: i === segments.length - 1,
  }));

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/85 backdrop-blur px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 !h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((c) => (
            <Fragment key={c.href}>
              <BreadcrumbItem className={c.last ? "" : "hidden md:block"}>
                {c.last ? (
                  <BreadcrumbPage>{c.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={c.href}>{c.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!c.last && <BreadcrumbSeparator className="hidden md:block" />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto">
        <Button variant="ghost" size="sm" asChild>
          <a href="/id/media-center/" target="_blank" rel="noreferrer">
            <ExternalLink /> <span className="hidden sm:inline">Lihat situs</span>
          </a>
        </Button>
      </div>
    </header>
  );
}
