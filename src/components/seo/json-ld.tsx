import type { JsonLdObject } from "@/lib/seo/schema";

/**
 * Sisipkan JSON-LD ke HTML (Server Component). `<` di-escape agar string dari CMS/kamus
 * tidak bisa menutup tag <script> (XSS). Satu komponen = satu blok <script>.
 */
export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
