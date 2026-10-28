"use client";

import { useEffect, useState } from "react";

type Labels = { label: string; days: string; hours: string; minutes: string; seconds: string; open: string };

const pad = (n: number) => String(n).padStart(2, "0");

function remaining(target: number, now: number) {
  const ms = Math.max(0, target - now);
  const s = Math.floor(ms / 1000);
  return { done: ms === 0, days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}

/**
 * Hitung mundur ke pembukaan. Server merender "--" (waktu server ≠ waktu pengunjung, hindari
 * hydration mismatch); angka diisi setelah mount dan diperbarui tiap detik.
 */
export function Countdown({ target, labels }: { target: string; labels: Labels }) {
  const targetMs = new Date(target).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const r = now === null ? null : remaining(targetMs, now);

  if (r?.done) {
    return (
      <p id="teaser-countdown-open" className="text-base font-semibold text-white sm:text-lg">
        {labels.open}
      </p>
    );
  }

  const units = [
    { key: "days", label: labels.days, value: r ? String(r.days) : "--" },
    { key: "hours", label: labels.hours, value: r ? pad(r.hours) : "--" },
    { key: "minutes", label: labels.minutes, value: r ? pad(r.minutes) : "--" },
    { key: "seconds", label: labels.seconds, value: r ? pad(r.seconds) : "--" },
  ];

  return (
    // role="timer" tanpa aria-live: pembaca layar tidak dibanjiri pembaruan tiap detik.
    <div id="teaser-countdown" role="timer" aria-label={labels.label}>
      <ol id="teaser-countdown-units" className="grid grid-cols-4 gap-2 sm:flex sm:gap-8">
        {units.map((u) => (
          <li key={u.key} id={`teaser-countdown-${u.key}`} className="flex flex-col">
            <span
              id={`teaser-countdown-${u.key}-value`}
              className="font-mono text-3xl font-medium tabular-nums leading-none text-white sm:text-5xl"
            >
              {u.value}
            </span>
            <span
              id={`teaser-countdown-${u.key}-label`}
              className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/70"
            >
              {u.label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
