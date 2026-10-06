"use client";

import { ShieldCheck, Zap, Plug, BadgeCheck, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/lib/language-context";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

const ITEMS = [
  { n: 1, Icon: ShieldCheck, hero: true },
  { n: 2, Icon: Zap },
  { n: 3, Icon: Plug },
  { n: 4, Icon: BadgeCheck },
  { n: 5, Icon: KeyRound },
] as const;

/**
 * Yang didapat — bento: garansi baterai seumur hidup (pesan #1) sebagai kartu forest besar,
 * empat manfaat lain sebagai kartu putih. Servis gratis sengaja TIDAK disebut (belum ditetapkan).
 */
export default function BaasIncluded() {
  const { t } = useLanguage();

  return (
    <section className="bg-muted py-16 sm:py-24">
      <div className="main-container">
        <Reveal className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            {t("baas.included.kicker")}
          </p>
          <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("baas.included.title")}
          </h2>
        </Reveal>

        <Stagger className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {ITEMS.map(({ n, Icon, ...rest }) => {
            const hero = "hero" in rest && rest.hero;
            return (
              <StaggerItem
                key={n}
                className={cn(hero && "sm:col-span-2 lg:row-span-2")}
              >
                <article
                  className={cn(
                    "group flex h-full flex-col rounded-2xl p-6 transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] sm:p-7",
                    hero
                      ? "justify-between bg-forest-deep text-forest-foreground shadow-[var(--shadow-md)]"
                      : "border border-border bg-card shadow-[var(--shadow-sm)]",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-11 w-11 items-center justify-center rounded-full",
                      hero ? "bg-white/10 text-on-forest-accent" : "bg-muted text-primary",
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className={cn(hero ? "mt-16 sm:mt-24" : "mt-5")}>
                    <h3
                      className={cn(
                        "font-display font-bold tracking-tight",
                        hero ? "text-3xl text-white sm:text-4xl" : "text-lg text-foreground",
                      )}
                    >
                      {t(`baas.included.${n}.title`)}
                    </h3>
                    <p
                      className={cn(
                        "mt-2 text-pretty leading-relaxed",
                        hero ? "max-w-[40ch] text-forest-foreground/85 sm:text-lg" : "text-sm text-muted-foreground",
                      )}
                    >
                      {t(`baas.included.${n}.desc`)}
                    </p>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
