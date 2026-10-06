"use client";

import Link from "next/link";
import { useMemo, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { openCookieSettings } from "@/lib/consent";
import { WERIGO_URL, whatsappUrl } from "@/lib/seo/site";
import { buildNav } from "@/components/nav/nav-config";

type FooterLink = {
  href: string;
  label: string;
  /** Tautan eksternal (buka tab baru) + keterangan kecil di bawahnya. */
  external?: boolean;
  hint?: string;
};

type FooterColumn = { key: string; title: string; links: FooterLink[] };

const SOCIALS = [
  { label: "Instagram", icon: "/icons/instagram.svg", href: "https://www.instagram.com/wedison.id/" },
  { label: "TikTok", icon: "/icons/tiktok.svg", href: "https://www.tiktok.com/@wedison.id" },
  {
    label: "YouTube",
    icon: "/icons/youtube.svg",
    href: "https://www.youtube.com/channel/UCePP1fIil61GyQF4XFWGB2g",
  },
  {
    label: "Facebook",
    icon: "/icons/facebook.svg",
    href: "https://www.facebook.com/people/wedisonid/61562726390879/",
  },
  { label: "WhatsApp", icon: "/icons/whatsapp.svg", href: whatsappUrl() },
  { label: "Email", icon: "/icons/mail.svg", href: "mailto:support@wedison.co" },
] as const;

/**
 * Footer — kolom tautan diturunkan dari struktur navbar (nav-config.ts) supaya keduanya
 * tidak pernah berbeda. Tambahan di luar navbar hanya Werigo (situs sewa terpisah).
 */
export default function Footer() {
  const { t, language } = useLanguage();
  const base = `/${language}`;

  const columns = useMemo<FooterColumn[]>(() => {
    const items = buildNav(t);
    return items.map((item) => {
      if (item.kind === "models") {
        return {
          key: item.key,
          title: item.label,
          links: [
            ...item.models.map((m) => ({ href: m.href, label: m.name })),
            { href: item.all.href, label: item.all.label },
            { href: item.compare.href, label: item.compare.label },
          ],
        };
      }
      const links: FooterLink[] = item.links.map((l) => ({ href: l.href, label: l.title }));
      if (item.key === "services") {
        // Werigo = layanan sewa motor listrik Wedison di Bali (situs terpisah).
        links.push({ href: WERIGO_URL, label: "Werigo", external: true, hint: t("footer.werigo") });
      }
      return { key: item.key, title: item.label, links };
    });
  }, [t]);

  return (
    <footer className="bg-forest-deep text-forest-foreground">
      <div className="main-container py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <h3 className="font-display text-xl font-bold tracking-tight text-white md:text-2xl">Wedison</h3>
            <p className="mt-3 max-w-[44ch] text-sm leading-relaxed text-forest-muted md:text-base">
              {t("footer.description")}
            </p>
            <p className="mt-3 max-w-[44ch] text-sm leading-relaxed text-forest-muted">
              {t("footer.werigoBridge")}{" "}
              <a
                href={WERIGO_URL}
                target="_blank"
                rel="noopener"
                className="font-medium text-on-forest-accent underline-offset-4 hover:underline"
              >
                {t("footer.werigoCta")}
              </a>
            </p>

            <h4 className="relative mt-8 inline-block font-display text-base font-semibold text-white">
              {t("footer.meetus")}
              <span className="absolute -bottom-1 left-0 h-0.5 w-10 bg-on-forest-accent" />
            </h4>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={s.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    aria-label={s.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-forest-muted transition-[color,border-color,background-color,transform] duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-0.5 hover:border-on-forest-accent/60 hover:bg-white/5 hover:text-on-forest-accent"
                  >
                    {/* Ikon dipakai sebagai mask: warna ikut currentColor, ukuran ikut kontainer. */}
                    <span
                      aria-hidden
                      className="block h-[22px] w-[22px] bg-current"
                      style={
                        {
                          maskImage: `url(${s.icon})`,
                          WebkitMaskImage: `url(${s.icon})`,
                          maskSize: "contain",
                          WebkitMaskSize: "contain",
                          maskRepeat: "no-repeat",
                          WebkitMaskRepeat: "no-repeat",
                          maskPosition: "center",
                          WebkitMaskPosition: "center",
                        } as CSSProperties
                      }
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom tautan = grup navbar */}
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-8"
          >
            {columns.map((col) => (
              <div key={col.key}>
                <h4 className="relative inline-block font-display text-base font-semibold text-white">
                  {col.title}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-10 bg-on-forest-accent" />
                </h4>
                <ul className="mt-5 space-y-2.5">
                  {col.links.map((l) =>
                    l.external ? (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener"
                          className="group block text-sm text-forest-muted transition-colors duration-300 hover:text-on-forest-accent md:text-[15px]"
                        >
                          <span className="inline-flex items-center gap-1">
                            {l.label}
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                          </span>
                          {l.hint ? (
                            <span className="block text-xs text-forest-muted/80 group-hover:text-on-forest-accent/80">
                              {l.hint}
                            </span>
                          ) : null}
                          <span className="sr-only">{t("footer.opensNewTab")}</span>
                        </a>
                      </li>
                    ) : (
                      <li key={l.href}>
                        <Link
                          href={`${base}${l.href}`}
                          className="text-sm text-forest-muted transition-colors duration-300 hover:text-on-forest-accent md:text-[15px]"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 md:mt-16 md:flex-row md:items-center md:justify-between md:pt-8">
          <div className="flex flex-col gap-1 text-xs text-forest-muted md:text-sm">
            <p>{t("footer.copyright")}</p>
            <p>{t("footer.tagline")}</p>
          </div>
          <div className="flex gap-6">
            <Link
              href={`${base}/cookie-policy/`}
              className="text-xs text-forest-muted transition-colors duration-300 hover:text-on-forest-accent md:text-sm"
            >
              {t("footer.cookiePolicy")}
            </Link>
            <button
              type="button"
              onClick={openCookieSettings}
              className="text-xs text-forest-muted transition-colors duration-300 hover:text-on-forest-accent md:text-sm"
            >
              {t("footer.cookieSettings")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
