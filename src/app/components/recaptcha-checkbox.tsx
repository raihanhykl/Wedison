"use client";

import Script from "next/script";
import { useEffect, useImperativeHandle, useRef, useState } from "react";

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
 */
export function RecaptchaCheckbox({
  siteKey,
  onChange,
  ref,
}: RecaptchaCheckboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

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
    if (!scriptReady || widgetId.current !== null) return;
    const g = window.grecaptcha;
    if (!g || !containerRef.current) return;

    widgetId.current = g.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => onChangeRef.current(token),
      "expired-callback": () => onChangeRef.current(null),
      "error-callback": () => onChangeRef.current(null),
    });
  }, [scriptReady, siteKey]);

  return (
    <>
      <Script
        src="https://www.google.com/recaptcha/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={containerRef} />
    </>
  );
}
