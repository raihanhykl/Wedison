import { sanitizeArticleHtml, stripHtml } from "../sanitize.js";
import { importDocx } from "./docx.js";
import { importPdf } from "./pdf.js";
import type { ImageSink, ImportResult } from "./types.js";

export type { ImageSink, ImportResult, ImportedImage, ImportWarning } from "./types.js";

export const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
export const PDF_MIME = "application/pdf";

export function detectKind(mime: string, name: string): "docx" | "pdf" | "doc" | null {
  const ext = name.toLowerCase().split(".").pop();
  if (mime === DOCX_MIME || ext === "docx") return "docx";
  if (mime === PDF_MIME || ext === "pdf") return "pdf";
  if (mime === "application/msword" || ext === "doc") return "doc";
  return null;
}

function stats(html: string) {
  const count = (re: RegExp) => (html.match(re) ?? []).length;
  return {
    paragraphs: count(/<p[\s>]/gi),
    headings: count(/<h[1-6][\s>]/gi),
    lists: count(/<(ul|ol)[\s>]/gi),
    tables: count(/<table[\s>]/gi),
    images: count(/<img[\s>]/gi),
    words: stripHtml(html).split(/\s+/).filter(Boolean).length,
  };
}

/** Convert a document to sanitized article HTML. Throws on unsupported formats. */
export async function importDocument(kind: "docx" | "pdf", buffer: Buffer, sink: ImageSink): Promise<ImportResult> {
  const r = kind === "docx" ? await importDocx(buffer, sink) : await importPdf(buffer, sink);
  // Normalise: Tiptap wants block content; mammoth sometimes emits bare text.
  let html = r.html.trim();
  if (html && !/^<(p|h[1-6]|ul|ol|table|blockquote|pre|img|figure|div)/i.test(html)) html = `<p>${html}</p>`;
  html = sanitizeArticleHtml(html)
    .replace(/<p>\s*(&nbsp;|\s)*<\/p>/g, "") // empty paragraphs
    .replace(/\n{3,}/g, "\n\n");
  return {
    html,
    warnings: r.warnings,
    stats: { ...stats(html), imagesFailed: r.imagesFailed, images: r.images - r.imagesFailed, ...("pages" in r ? { pages: r.pages as number } : {}) },
  };
}
