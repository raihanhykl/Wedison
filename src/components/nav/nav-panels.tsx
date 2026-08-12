"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "./nav-config";

type PanelProps = {
  item: NavItem;
  /** Prefix locale untuk href, mis. "/id". */
  base: string;
  /** Path halaman aktif, sudah tanpa locale. */
  current: string;
  onNavigate: () => void;
};

export function NavPanelBody({ item, base, current, onNavigate }: PanelProps) {
  if (item.kind === "models") {
    return (
      <div>
        <div className="grid grid-cols-4 gap-1 p-3">
          {item.models.map((model) => {
            const active = current === model.href;
            return (
              <Link
                key={model.href}
                href={`${base}${model.href}`}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex flex-col items-center rounded-lg px-3 pb-4 pt-2 text-center transition-colors duration-200",
                  active ? "bg-muted" : "hover:bg-muted",
                )}
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={model.image}
                    alt=""
                    fill
                    sizes="260px"
                    className="object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  />
                </div>
                <span
                  className={cn(
                    "mt-2 font-display text-base font-semibold tracking-[-0.01em] transition-colors duration-200",
                    active
                      ? "text-primary"
                      : "text-foreground group-hover:text-primary",
                  )}
                >
                  {model.name}
                </span>
                <span className="mt-0.5 text-sm text-muted-foreground">
                  {model.tagline}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-6 border-t border-border px-6 py-3.5">
          <p className="text-sm text-muted-foreground">{item.hint}</p>
          <Link
            href={`${base}${item.compare.href}`}
            onClick={onNavigate}
            className="group inline-flex shrink-0 items-center gap-1.5 font-display text-sm font-semibold text-primary"
          >
            {item.compare.label}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[1.35fr_1fr] gap-4 p-3">
      <div className="flex flex-col justify-center py-2">
        {item.links.map((link) => {
          const active = current === link.href;
          return (
            <Link
              key={link.href}
              href={`${base}${link.href}`}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-start justify-between gap-6 rounded-lg px-4 py-3 transition-colors duration-200",
                active ? "bg-muted" : "hover:bg-muted",
              )}
            >
              <span className="min-w-0">
                <span
                  className={cn(
                    "block font-display text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-200",
                    active
                      ? "text-primary"
                      : "text-foreground group-hover:text-primary",
                  )}
                >
                  {link.title}
                </span>
                <span className="mt-1 block max-w-[46ch] text-sm leading-snug text-muted-foreground">
                  {link.desc}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden
                className="mt-1 h-4 w-4 shrink-0 -translate-x-1 text-primary opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:opacity-100"
              />
            </Link>
          );
        })}
      </div>

      <div className="relative min-h-[204px] overflow-hidden rounded-lg bg-forest">
        <Image
          src={item.feature.image}
          alt={item.feature.alt}
          fill
          sizes="420px"
          className="object-cover"
        />
        {/* Scrim, bukan dekorasi: menjamin caption tetap ≥4.5:1 di atas foto apa pun. */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/60 to-forest-deep/10" />
        <div className="relative flex h-full flex-col justify-end p-5">
          {item.feature.metric ? (
            <span className="font-mono text-[2rem] leading-none text-on-forest-accent">
              {item.feature.metric}
            </span>
          ) : null}
          <p className="mt-2 max-w-[26ch] text-sm leading-snug text-forest-foreground">
            {item.feature.caption}
          </p>
        </div>
      </div>
    </div>
  );
}
