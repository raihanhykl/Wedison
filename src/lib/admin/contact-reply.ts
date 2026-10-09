import type { ContactSubmission } from "./types";

/** Longest quoted message we put in a mailto body (URL length limits in mail clients). */
const MAX_QUOTE = 1500;

/**
 * Prefilled "Reply by email" link for a contact message: the body greets the sender, names
 * the topic, leaves a slot for the reply, and quotes the original message underneath so the
 * customer knows which enquiry this answers. Language follows the form locale.
 */
export function contactReplyMailto(c: ContactSubmission, site = "Wedison") {
  const en = c.locale === "en";
  const firstName = c.name.trim().split(/\s+/)[0] || c.name;
  const date = new Date(c.createdAt).toLocaleString(en ? "en-GB" : "id-ID", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Jakarta" });
  const trimmed = c.message.trim();
  const quoted = (trimmed.length > MAX_QUOTE ? `${trimmed.slice(0, MAX_QUOTE)}…` : trimmed).split(/\r?\n/).map((l) => `> ${l}`).join("\n");
  const subject = `Re: ${c.topic} — ${site}`;
  const body = en
    ? `Hi ${firstName},\n\nThank you for contacting ${site} regarding "${c.topic}".\n\n[Write your reply here]\n\nKind regards,\n${site} Team\n\n\n——————————\nOn ${date} (WIB), ${c.name} <${c.email}> wrote:\n${quoted}\n\nPhone: ${c.phone}`
    : `Halo ${firstName},\n\nTerima kasih telah menghubungi ${site} mengenai "${c.topic}".\n\n[Tulis balasan Anda di sini]\n\nSalam hangat,\nTim ${site}\n\n\n——————————\nPada ${date} WIB, ${c.name} <${c.email}> menulis:\n${quoted}\n\nTelepon: ${c.phone}`;
  return `mailto:${encodeURIComponent(c.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
