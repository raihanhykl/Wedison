// Persetujuan cookie — satu sumber kebenaran untuk banner, GTM (Consent Mode v2),
// Meta Pixel, dan log bukti persetujuan di backend.
//
// Alur:
//  1. Script inline di <body> (lihat ConsentModeDefault di gtm.tsx) menyetel default
//     Consent Mode = denied SEBELUM GTM dimuat, atau langsung granted bila cookie
//     wd_consent yang valid sudah ada.
//  2. Pengunjung memilih di banner -> saveConsent(): tulis cookie, update Consent Mode,
//     muat/cabut Meta Pixel, kirim log ke /api/v1/consent.
//  3. Versi kebijakan naik (CONSENT_VERSION) -> cookie lama dianggap tidak berlaku,
//     banner muncul lagi.

export const CONSENT_COOKIE = "wd_consent";
/** Naikkan bila kategori/daftar cookie berubah material -> semua pengunjung ditanya ulang. */
export const CONSENT_VERSION = 1;
/** Pengunjung ditanya ulang setelah 6 bulan. */
const MAX_AGE_SECONDS = 60 * 60 * 24 * 182;

export type ConsentChoice = { analytics: boolean; marketing: boolean };
export type ConsentAction = "ACCEPT_ALL" | "REJECT_ALL" | "CUSTOM";
export type StoredConsent = ConsentChoice & {
  /** UUID acak, bukan identitas; menghubungkan perubahan pilihan di log. */
  id: string;
  v: number;
  /** epoch ms saat keputusan diambil */
  t: number;
};

type Gtag = (...args: unknown[]) => void;
type Fbq = ((...args: unknown[]) => void) & { callMethod?: unknown };
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    fbq?: Fbq;
  }
}

// ───────────────────────── Cookie ─────────────────────────

export function readConsent(): StoredConsent | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`))
    ?.slice(CONSENT_COOKIE.length + 1);
  if (!raw) return null;
  try {
    const c = JSON.parse(decodeURIComponent(raw)) as Partial<StoredConsent>;
    if (c.v !== CONSENT_VERSION || typeof c.id !== "string") return null;
    return {
      id: c.id,
      v: c.v,
      t: Number(c.t) || 0,
      analytics: c.analytics === true,
      marketing: c.marketing === true,
    };
  } catch {
    return null;
  }
}

function writeConsent(c: StoredConsent) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(c))}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

/** Hapus cookie pihak ketiga yang ditanam di domain kita (mis. _ga, _fbp) saat izin dicabut. */
function deleteCookies(match: (name: string) => boolean) {
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const cookie of document.cookie.split("; ")) {
    const name = cookie.split("=")[0];
    if (!match(name)) continue;
    for (const d of domains) {
      document.cookie = `${name}=; Path=/; Max-Age=0${d ? `; Domain=${d}` : ""}`;
    }
  }
}

// ───────────────────────── Store (untuk useSyncExternalStore) ─────────────────────────

const listeners = new Set<() => void>();
let snapshot: StoredConsent | null | undefined;

export function subscribeConsent(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
export function getConsentSnapshot() {
  if (snapshot === undefined) snapshot = readConsent();
  return snapshot;
}
/** Di server belum ada keputusan yang diketahui -> banner tidak dirender di HTML SSR. */
export function getServerConsentSnapshot(): StoredConsent | null | undefined {
  return undefined;
}

// Buka dialog preferensi dari mana saja (mis. link "Pengaturan Cookie" di footer).
const OPEN_EVENT = "wd:open-cookie-settings";
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}
export function onOpenCookieSettings(cb: () => void) {
  window.addEventListener(OPEN_EVENT, cb);
  return () => window.removeEventListener(OPEN_EVENT, cb);
}

// ───────────────────────── Penerapan ke tag ─────────────────────────

function consentModeState(c: ConsentChoice) {
  const g = (on: boolean) => (on ? "granted" : "denied");
  return {
    analytics_storage: g(c.analytics),
    ad_storage: g(c.marketing),
    ad_user_data: g(c.marketing),
    ad_personalization: g(c.marketing),
  };
}

/** Terapkan pilihan ke Consent Mode, dataLayer, dan Meta Pixel. Aman dipanggil berulang. */
export function applyConsent(c: ConsentChoice) {
  window.dataLayer = window.dataLayer || [];
  window.gtag?.("consent", "update", consentModeState(c));
  // Event untuk trigger di GTM (mis. tag non-Google yang digate manual).
  window.dataLayer.push({
    event: "consent_update",
    consent_analytics: c.analytics,
    consent_marketing: c.marketing,
  });

  if (c.marketing) {
    loadMetaPixel();
    window.fbq?.("consent", "grant");
  } else {
    window.fbq?.("consent", "revoke");
  }
}

let pixelLoaded = false;
/** Meta Pixel baru dimuat SETELAH izin marketing — tidak ada request ke Meta sebelumnya. */
function loadMetaPixel() {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!id || pixelLoaded) return;
  pixelLoaded = true;
  /* eslint-disable */
  // Snippet resmi Meta (fbevents.js), ditulis ulang tanpa minify.
  const w = window as Window & { _fbq?: Fbq };
  if (!w.fbq) {
    const n: any = function (...args: unknown[]) {
      n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
    };
    if (!w._fbq) w._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    w.fbq = n;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
  }
  /* eslint-enable */
  window.fbq!("init", id);
  window.fbq!("track", "PageView");
}

// ───────────────────────── Simpan keputusan ─────────────────────────

function newId() {
  return crypto.randomUUID?.() ?? "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (ch) =>
    (Number(ch) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(ch) / 4)))).toString(16),
  );
}

export function saveConsent(choice: ConsentChoice, action: ConsentAction, locale?: string) {
  const prev = readConsent();
  const next: StoredConsent = {
    id: prev?.id ?? newId(),
    v: CONSENT_VERSION,
    t: Date.now(),
    analytics: choice.analytics,
    marketing: choice.marketing,
  };
  writeConsent(next);

  // Izin dicabut -> bersihkan cookie yang sudah telanjur ditanam.
  if (prev?.analytics && !next.analytics) deleteCookies((n) => n === "_ga" || n.startsWith("_ga_") || n === "_gid");
  if (prev?.marketing && !next.marketing) deleteCookies((n) => n === "_fbp" || n === "_fbc");

  applyConsent(next);
  snapshot = next;
  listeners.forEach((l) => l());

  // Bukti persetujuan (fire-and-forget; gagal kirim tidak memblokir pengunjung).
  const body = JSON.stringify({
    consentId: next.id,
    version: next.v,
    action,
    analytics: next.analytics,
    marketing: next.marketing,
    locale,
    path: location.pathname.slice(0, 300),
  });
  try {
    fetch("/api/v1/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* abaikan */
  }
}

/**
 * Script inline untuk <body>, dijalankan sebelum GTM: default Consent Mode v2.
 * Bila cookie valid sudah ada, default langsung mengikuti pilihan itu (tanpa kedip denied->granted).
 */
export function consentModeDefaultScript() {
  return `(function(){window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
var s={analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};
try{var m=document.cookie.match(/(?:^|; )${CONSENT_COOKIE}=([^;]*)/);if(m){var c=JSON.parse(decodeURIComponent(m[1]));
if(c&&c.v===${CONSENT_VERSION}){if(c.analytics===true)s.analytics_storage='granted';if(c.marketing===true){s.ad_storage='granted';s.ad_user_data='granted';s.ad_personalization='granted';}}}}catch(e){}
s.wait_for_update=500;gtag('consent','default',s);gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',false);})();`;
}
