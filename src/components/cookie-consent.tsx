"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  applyConsent,
  getConsentSnapshot,
  getServerConsentSnapshot,
  onOpenCookieSettings,
  openCookieSettings,
  saveConsent,
  subscribeConsent,
  type ConsentAction,
  type ConsentChoice,
} from "@/lib/consent";

type Category = "necessary" | "analytics" | "marketing";
const CATEGORIES: Category[] = ["necessary", "analytics", "marketing"];

/**
 * Banner persetujuan cookie + dialog preferensi.
 * "Terima semua" dan "Tolak" sengaja setara bobot visualnya (tanpa dark pattern);
 * banner tidak menutup konten dan tidak bisa ditutup tanpa memilih.
 */
export default function CookieConsent() {
  const { t, language } = useLanguage();
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ConsentChoice>({
    analytics: false,
    marketing: false,
  });

  // Kunjungan berikutnya: pilihan tersimpan -> terapkan (muat Pixel bila diizinkan).
  // Consent Mode GTM sudah disetel oleh script inline sebelum hydration.
  useEffect(() => {
    const c = getConsentSnapshot();
    if (c) applyConsent(c);
  }, []);

  useEffect(
    () =>
      onOpenCookieSettings(() => {
        const c = getConsentSnapshot();
        setDraft({ analytics: !!c?.analytics, marketing: !!c?.marketing });
        setOpen(true);
      }),
    [],
  );

  const decide = (choice: ConsentChoice, action: ConsentAction) => {
    saveConsent(choice, action, language);
    setOpen(false);
  };
  const acceptAll = () => decide({ analytics: true, marketing: true }, "ACCEPT_ALL");
  const rejectAll = () => decide({ analytics: false, marketing: false }, "REJECT_ALL");
  const saveDraft = () => {
    const action: ConsentAction =
      draft.analytics && draft.marketing
        ? "ACCEPT_ALL"
        : !draft.analytics && !draft.marketing
          ? "REJECT_ALL"
          : "CUSTOM";
    decide(draft, action);
  };

  // undefined = SSR / belum hydrate -> jangan render apa pun (hindari kedip banner).
  const showBanner = consent === null && !open;

  return (
    <>
      {showBanner && (
        <div
          role="region"
          aria-label={t("consent.title")}
          className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 sm:left-6 sm:right-auto sm:mx-0"
        >
          <div className="rounded-2xl border border-border bg-background p-5 shadow-[0_24px_60px_-20px_rgba(10,40,25,0.35)] sm:p-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-primary">
                <Cookie className="h-4 w-4" />
              </span>
              <p className="font-display text-base font-semibold tracking-[-0.01em] text-foreground">
                {t("consent.title")}
              </p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("consent.body")}{" "}
              <Link
                href={`/${language}/cookie-policy/`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {t("consent.policyLink")}
              </Link>
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={rejectAll}>
                {t("consent.rejectAll")}
              </Button>
              <Button onClick={acceptAll}>{t("consent.acceptAll")}</Button>
            </div>
            <button
              type="button"
              onClick={() => {
                setDraft({ analytics: false, marketing: false });
                setOpen(true);
              }}
              className="mt-3 w-full text-center text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {t("consent.customize")}
            </button>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl tracking-[-0.01em]">
              {t("consent.prefs.title")}
            </DialogTitle>
            <DialogDescription>{t("consent.prefs.description")}</DialogDescription>
          </DialogHeader>

          <ul className="divide-y divide-border rounded-xl border border-border">
            {CATEGORIES.map((cat) => {
              const locked = cat === "necessary";
              const checked = locked ? true : draft[cat];
              const id = `consent-${cat}`;
              return (
                <li key={cat} className="flex items-start justify-between gap-4 p-4">
                  <label htmlFor={id} className="cursor-pointer">
                    <span className="block font-display text-sm font-semibold text-foreground">
                      {t(`consent.cat.${cat}.title`)}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {t(`consent.cat.${cat}.desc`)}
                    </span>
                    {locked && (
                      <span className="mt-1.5 inline-block font-mono text-[11px] uppercase tracking-wider text-primary">
                        {t("consent.alwaysOn")}
                      </span>
                    )}
                  </label>
                  <Switch
                    id={id}
                    checked={checked}
                    disabled={locked}
                    onCheckedChange={(v) =>
                      !locked && setDraft((d) => ({ ...d, [cat]: v }))
                    }
                    className="mt-0.5"
                  />
                </li>
              );
            })}
          </ul>

          <DialogFooter className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:space-x-0">
            <Button variant="outline" onClick={rejectAll}>
              {t("consent.rejectAll")}
            </Button>
            <Button variant="outline" onClick={saveDraft}>
              {t("consent.save")}
            </Button>
            <Button onClick={acceptAll}>{t("consent.acceptAll")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Tombol pembuka dialog preferensi, untuk dipakai di Server Component (mis. halaman kebijakan). */
export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <Button onClick={() => openCookieSettings()} className="mt-2">
      <Cookie />
      {label}
    </Button>
  );
}
