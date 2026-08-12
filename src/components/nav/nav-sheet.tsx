"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "./nav-config";

type Props = {
  open: boolean;
  items: NavItem[];
  base: string;
  current: string;
  activeKey: string | null;
  ctaLabel: string;
  ctaHref: string;
  onNavigate: () => void;
};

/**
 * Mobile: satu lembar penuh di bawah bar, bukan dropdown mungil. Tiap grup
 * dibuka lewat accordion (grid-template-rows 0fr -> 1fr, jadi tak perlu ukur
 * tinggi), dan grup yang cocok dengan halaman aktif terbuka duluan.
 */
export default function NavSheet({
  open,
  items,
  base,
  current,
  activeKey,
  ctaLabel,
  ctaHref,
  onNavigate,
}: Props) {
  // Selalu ada satu grup terbuka: yang cocok dengan halaman aktif, kalau tidak
  // ada ya grup pertama. Sheet yang seluruhnya tertutup terasa kosong dan
  // menyembunyikan bahwa baris-baris ini bisa dibuka.
  const defaultKey = activeKey ?? items[0]?.key ?? null;
  const [expanded, setExpanded] = useState<string | null>(defaultKey);

  useEffect(() => {
    if (open) setExpanded(defaultKey);
  }, [open, defaultKey]);

  return (
    <div
      id="nav-sheet"
      data-open={open}
      inert={!open}
      className="nav-sheet fixed inset-x-0 z-40 flex flex-col bg-card lg:hidden"
    >
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-2">
        <div className="nav-stagger">
          {items.map((item, index) => {
            const isOpen = expanded === item.key;
            return (
              <div
                key={item.key}
                style={{ "--i": index } as CSSProperties}
                className="border-b border-border"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`nav-sheet-${item.key}`}
                  onClick={() => setExpanded(isOpen ? null : item.key)}
                  className="flex w-full items-center justify-between gap-4 py-[18px] text-left"
                >
                  <span
                    className={cn(
                      "font-display text-lg font-semibold tracking-[-0.015em] transition-colors duration-200",
                      activeKey === item.key ? "text-primary" : "text-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                  {/* Plus yang menutup jadi minus — dua garis, tanpa ikon. */}
                  <span
                    aria-hidden
                    className="relative block h-4 w-4 shrink-0 text-muted-foreground"
                  >
                    <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                    <span
                      className={cn(
                        "absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current transition-transform duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                        isOpen ? "scale-y-0" : "scale-y-100",
                      )}
                    />
                  </span>
                </button>

                <div className="nav-acc" data-open={isOpen} id={`nav-sheet-${item.key}`}>
                  <div>
                    {item.kind === "models" ? (
                      <div className="pb-4">
                        <div className="grid grid-cols-2 gap-2">
                          {item.models.map((model) => (
                            <Link
                              key={model.href}
                              href={`${base}${model.href}`}
                              onClick={onNavigate}
                              aria-current={
                                current === model.href ? "page" : undefined
                              }
                              className={cn(
                                "flex flex-col items-center rounded-lg border border-border px-3 pb-3 pt-2 text-center transition-colors duration-200",
                                current === model.href
                                  ? "border-primary/40 bg-muted"
                                  : "bg-background active:bg-muted",
                              )}
                            >
                              <div className="relative aspect-[4/3] w-full">
                                <Image
                                  src={model.image}
                                  alt=""
                                  fill
                                  sizes="180px"
                                  className="object-contain"
                                />
                              </div>
                              <span className="mt-1 font-display text-sm font-semibold text-foreground">
                                {model.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {model.tagline}
                              </span>
                            </Link>
                          ))}
                        </div>
                        <Link
                          href={`${base}${item.compare.href}`}
                          onClick={onNavigate}
                          className="mt-3 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-primary"
                        >
                          {item.compare.label}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    ) : (
                      <ul className="pb-3">
                        {item.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={`${base}${link.href}`}
                              onClick={onNavigate}
                              aria-current={
                                current === link.href ? "page" : undefined
                              }
                              className="flex items-start justify-between gap-4 rounded-lg px-1 py-2.5"
                            >
                              <span>
                                <span
                                  className={cn(
                                    "block text-[15px] font-medium",
                                    current === link.href
                                      ? "text-primary"
                                      : "text-foreground",
                                  )}
                                >
                                  {link.title}
                                </span>
                                <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">
                                  {link.desc}
                                </span>
                              </span>
                              <ArrowUpRight
                                aria-hidden
                                className="mt-1 h-4 w-4 shrink-0 text-muted-foreground"
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border bg-card px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
        <Link
          href={`${base}${ctaHref}`}
          onClick={onNavigate}
          className="nav-cta flex h-12 w-full items-center justify-center gap-2 rounded-md font-display text-[15px] font-semibold tracking-[-0.01em]"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
