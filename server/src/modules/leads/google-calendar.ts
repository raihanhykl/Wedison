// Google Calendar via SERVICE ACCOUNT tanpa library: JWT RS256 (node:crypto) -> access token ->
// REST calendar/v3. Setup di docs/BOOKING-FORM.md. Service account tidak bisa mengundang attendee
// tanpa domain-wide delegation, jadi data customer ditaruh di deskripsi event.
import { createSign } from "node:crypto";
import { env } from "../../config/env.js";
import { logger } from "../../lib/logger.js";
import { SHOWROOMS, SLOT_DURATION_MIN, minutesToTime, timeToMinutes, waPhone, type ShowroomId } from "./booking-rules.js";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/calendar.events";
const API = "https://www.googleapis.com/calendar/v3";

type ServiceAccount = { email: string; privateKey: string };

function readServiceAccount(): ServiceAccount | null {
  const b64 = env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64;
  if (b64) {
    try {
      const j = JSON.parse(Buffer.from(b64, "base64").toString("utf8")) as { client_email?: string; private_key?: string };
      if (j.client_email && j.private_key) return { email: j.client_email, privateKey: j.private_key };
    } catch (err) {
      logger.warn({ err }, "GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 tidak valid");
    }
  }
  const email = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !key) return null;
  return { email, privateKey: key.replace(/\\n/g, "\n").replace(/^"|"$/g, "") };
}

export function calendarIdFor(showroom: ShowroomId): string | null {
  const per: Record<ShowroomId, string | undefined> = {
    jakarta: env.GOOGLE_CALENDAR_ID_JAKARTA,
    bekasi: env.GOOGLE_CALENDAR_ID_BEKASI,
    bandung: env.GOOGLE_CALENDAR_ID_BANDUNG,
    bali: env.GOOGLE_CALENDAR_ID_BALI,
  };
  return per[showroom] || env.GOOGLE_CALENDAR_ID || null;
}

export function isCalendarConfigured(showroom: ShowroomId): boolean {
  return readServiceAccount() !== null && calendarIdFor(showroom) !== null;
}

const b64url = (input: Buffer | string) => Buffer.from(input).toString("base64url");
let cachedToken: { value: string; expiresAt: number } | null = null;

async function accessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt - 60 > now) return cachedToken.value;
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(JSON.stringify({ iss: sa.email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }));
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const assertion = `${header}.${claims}.${b64url(signer.sign(sa.privateKey))}`;
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  if (!res.ok) throw new Error(`Google token exchange failed (${res.status}): ${await res.text()}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: data.access_token, expiresAt: now + data.expires_in };
  return data.access_token;
}

export type CalendarEventInput = {
  showroom: ShowroomId;
  purposeLabel: string;
  name: string;
  phone: string; // kanonik 08…
  email?: string | null;
  date: string;
  time: string;
  note?: string | null;
  locale?: string | null;
  source?: string | null;
  bookingId: string;
};

export async function createBookingEvent(input: CalendarEventInput): Promise<{ id: string; htmlLink?: string }> {
  const sa = readServiceAccount();
  const calendarId = calendarIdFor(input.showroom);
  if (!sa || !calendarId) throw new Error("Google Calendar is not configured");
  const s = SHOWROOMS[input.showroom];
  const endTime = minutesToTime(timeToMinutes(input.time) + SLOT_DURATION_MIN);
  const description = [
    `Tujuan   : ${input.purposeLabel}`,
    `Showroom : ${s.name}`,
    `Nama     : ${input.name}`,
    `No. HP   : ${input.phone}`,
    `Email    : ${input.email || "-"}`,
    `Catatan  : ${input.note || "-"}`,
    "",
    `WhatsApp : https://wa.me/${waPhone(input.phone)}`,
    `Admin    : ${env.FRONTEND_URL}/admin/leads/bookings?q=${encodeURIComponent(input.phone)}`,
    `Sumber   : form booking wedison.co (${input.source ?? "-"}, ${input.locale ?? "-"}) · ID ${input.bookingId}`,
  ].join("\n");
  const token = await accessToken(sa);
  const res = await fetch(`${API}/calendars/${encodeURIComponent(calendarId)}/events`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      summary: `[${input.purposeLabel}] ${input.name} — ${s.name}`,
      description,
      location: s.address,
      start: { dateTime: `${input.date}T${input.time}:00`, timeZone: s.timeZone },
      end: { dateTime: `${input.date}T${endTime}:00`, timeZone: s.timeZone },
      reminders: { useDefault: false, overrides: [{ method: "popup", minutes: 60 }] },
      extendedProperties: { private: { wedison_booking_id: input.bookingId, wedison_showroom: input.showroom, wedison_phone: input.phone } },
    }),
  });
  if (!res.ok) throw new Error(`Google Calendar insert failed (${res.status}): ${await res.text()}`);
  const data = (await res.json()) as { id: string; htmlLink?: string };
  return { id: data.id, htmlLink: data.htmlLink };
}

export async function deleteBookingEvent(showroom: ShowroomId, eventId: string): Promise<void> {
  const sa = readServiceAccount();
  const calendarId = calendarIdFor(showroom);
  if (!sa || !calendarId) return;
  const token = await accessToken(sa);
  const res = await fetch(`${API}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  // 404/410 = sudah tidak ada, anggap sukses
  if (!res.ok && res.status !== 404 && res.status !== 410) {
    throw new Error(`Google Calendar delete failed (${res.status}): ${await res.text()}`);
  }
}
