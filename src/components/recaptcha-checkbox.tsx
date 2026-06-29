"use client";

import Script from "next/script";
import { useEffect, useImperativeHandle, useRef } from "react";

export interface RecaptchaHandle {
  reset: () => void;
}

interface RecaptchaCheckboxProps {
  siteKey: string;
  onChange: (token: string | null) => void;
  /** React 19: ref diterima sebagai prop biasa */
  ref?: React.Ref<RecaptchaHandle>;
}

// Tipe minimal untuk grecaptcha v2 (explicit render)
interface Grecaptcha {
  render: (
    container: HTMLElement,
    params: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    }
  ) => number;
  reset: (widgetId?: number) => void;
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

/**
 * Widget reCAPTCHA v2 ("I'm not a robot") yang aman untuk static export:
 * render hanya terjadi di client (di dalam useEffect), jadi tidak ada akses
 * `window` saat build. Token dikirim ke parent lewat `onChange`.
 *
 * Catatan penting: setelah api.js termuat, `grecaptcha` bisa muncul lebih dulu
 * daripada method `grecaptcha.render` (race condition umum reCAPTCHA). Karena
 * itu kita TIDAK bergantung pada event onLoad, melainkan polling sampai
 * `grecaptcha.render` benar-benar tersedia baru memanggilnya.
 */
export function RecaptchaCheckbox({
  siteKey,
  onChange,
  ref,
}: RecaptchaCheckboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);

  // Hindari stale closure: callback grecaptcha selalu memakai onChange terbaru
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        if (widgetId.current !== null) {
          window.grecaptcha?.reset(widgetId.current);
        }
      },
    }),
    []
  );

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;

    const tryRender = () => {
      if (cancelled || widgetId.current !== null) return;
      const g = window.grecaptcha;

      if (g && typeof g.render === "function" && containerRef.current) {
        widgetId.current = g.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => onChangeRef.current(token),
          "expired-callback": () => onChangeRef.current(null),
          "error-callback": () => onChangeRef.current(null),
        });
      } else if (attempts < 100) {
        // Tunggu sampai grecaptcha.render siap (maks ~10 dtk)
        attempts += 1;
        timer = setTimeout(tryRender, 100);
      }
    };

    tryRender();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [siteKey]);

  return (
    <>
      <Script
        src="https://www.google.com/recaptcha/api.js?render=explicit"
        strategy="afterInteractive"
      />
      <div ref={containerRef} />
    </>
  );
}
