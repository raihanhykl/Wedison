import type { ImageSink, ImportResult, ImportWarning } from "./types.js";

/**
 * PDF -> best-effort HTML. PDFs carry positioned glyph runs, not document structure, so this
 * rebuilds paragraphs from line spacing, guesses headings from relative font size, bold/italic
 * from font names, list items from leading bullets/numbers, and extracts embedded raster images.
 * Running headers/footers and page numbers are dropped by position + repetition heuristics.
 */
type Run = { str: string; x: number; y: number; w: number; h: number; size: number; font: string; bold: boolean; italic: boolean; page: number };
type Line = { runs: Run[]; y: number; x: number; size: number; page: number; text: string; bold: boolean; italic: boolean };
type Block = { kind: "p" | "h1" | "h2" | "h3" | "li" | "oli" | "img"; lines: Line[]; src?: string };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const BULLET = /^[•●◦‣⁃▪■\-–—*]\s+/;
const ORDERED = /^(\d{1,2}[.)]|[a-z][.)]|[ivx]{1,4}[.)])\s+/i;

function fontFlags(font: string) {
  const f = font.toLowerCase();
  return { bold: /bold|black|heavy|semibold|demibold/.test(f) || /[,-]b[io]?$/.test(f), italic: /italic|oblique/.test(f) || /[,-]b?i$/.test(f) };
}

export async function importPdf(buffer: Buffer, sink: ImageSink): Promise<Omit<ImportResult, "stats"> & { imagesFailed: number; images: number; pages: number }> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer), useSystemFonts: true, disableFontFace: true }).promise;
  const warnings: ImportWarning[] = [];
  const runs: Run[] = [];
  const pageImages: { page: number; y: number; src: string }[] = [];
  let images = 0;
  let imagesFailed = 0;
  const pages = doc.numPages;
  if (pages > 60) warnings.push({ code: "pages", message: `Only the first 60 of ${pages} pages were imported.` });

  for (let p = 1; p <= Math.min(pages, 60); p++) {
    const page = await doc.getPage(p);
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    for (const item of content.items as { str: string; transform: number[]; width: number; height: number; fontName: string }[]) {
      if (!("str" in item) || !item.str.trim()) continue;
      const [a, b, , , x, y] = item.transform;
      const size = Math.hypot(a, b) || item.height || 10;
      const fontName = (content.styles as Record<string, { fontFamily?: string }>)[item.fontName]?.fontFamily ?? item.fontName;
      const { bold, italic } = fontFlags(fontName);
      // Convert to top-down coordinates (y grows downward) for simpler reading order.
      runs.push({ str: item.str, x, y: viewport.height - y, w: item.width, h: item.height, size, font: fontName, bold, italic, page: p });
    }

    // Images: walk the operator list for XObject image paints and read their decoded pixels.
    try {
      const ops = await page.getOperatorList();
      const seen = new Set<string>();
      for (let i = 0; i < ops.fnArray.length; i++) {
        if (ops.fnArray[i] !== pdfjs.OPS.paintImageXObject) continue;
        const name = ops.argsArray[i][0] as string;
        if (seen.has(name)) continue;
        seen.add(name);
        images++;
        try {
          const img = await new Promise<{ width: number; height: number; data: Uint8ClampedArray; kind: number } | null>((resolve) => {
            try {
              page.objs.get(name, (obj: { width: number; height: number; data: Uint8ClampedArray; kind: number } | null) => resolve(obj));
            } catch {
              resolve(null);
            }
          });
          if (!img || !img.data || img.width < 24 || img.height < 24) throw new Error("too small or unreadable");
          const channels = img.kind === 1 ? 1 : img.kind === 2 ? 3 : 4;
          const { default: sharp } = await import("sharp");
          const png = await sharp(Buffer.from(img.data.buffer, img.data.byteOffset, img.data.byteLength), { raw: { width: img.width, height: img.height, channels } }).png().toBuffer();
          const url = await sink({ buffer: png, mime: "image/png", name: `pdf-p${p}-image-${images}` });
          if (!url) throw new Error("rejected");
          // Position: approximate from the transform preceding the paint (y of current transform matrix)
          let y = 0;
          for (let k = i - 1; k >= 0 && k > i - 6; k--) if (ops.fnArray[k] === pdfjs.OPS.transform) { y = viewport.height - (ops.argsArray[k][5] as number); break; }
          pageImages.push({ page: p, y, src: url });
        } catch (err) {
          imagesFailed++;
          warnings.push({ code: "image", message: `Image on page ${p} could not be imported (${(err as Error).message}).` });
        }
      }
    } catch {
      warnings.push({ code: "image", message: `Images on page ${p} could not be read.` });
    }
    page.cleanup();
  }
  await doc.cleanup();

  if (!runs.length) {
    warnings.push({ code: "text", message: "No selectable text found. The PDF is probably scanned; OCR is not supported." });
    return { html: "", warnings, images, imagesFailed, pages };
  }

  // ── Group runs into lines ──
  runs.sort((a, b) => a.page - b.page || a.y - b.y || a.x - b.x);
  const lines: Line[] = [];
  for (const r of runs) {
    const last = lines[lines.length - 1];
    if (last && last.page === r.page && Math.abs(last.y - r.y) < Math.max(2, r.size * 0.4)) {
      const prev = last.runs[last.runs.length - 1];
      const gap = r.x - (prev.x + prev.w);
      last.text += (gap > r.size * 0.2 && !last.text.endsWith(" ") && !r.str.startsWith(" ") ? " " : "") + r.str;
      last.runs.push(r);
      last.size = Math.max(last.size, r.size);
      last.bold = last.bold && r.bold;
      last.italic = last.italic && r.italic;
    } else {
      lines.push({ runs: [r], y: r.y, x: r.x, size: r.size, page: r.page, text: r.str, bold: r.bold, italic: r.italic });
    }
  }

  // ── Drop running headers/footers: same text at top/bottom on >= 3 pages, or bare page numbers ──
  const pageHeights = new Map<number, number>();
  for (const l of lines) pageHeights.set(l.page, Math.max(pageHeights.get(l.page) ?? 0, l.y));
  const edgeTexts = new Map<string, number>();
  for (const l of lines) {
    const h = pageHeights.get(l.page) ?? 800;
    if (l.y < h * 0.08 || l.y > h * 0.92) edgeTexts.set(l.text.trim(), (edgeTexts.get(l.text.trim()) ?? 0) + 1);
  }
  const body = lines.filter((l) => {
    const t = l.text.trim();
    const h = pageHeights.get(l.page) ?? 800;
    const edge = l.y < h * 0.08 || l.y > h * 0.92;
    if (edge && /^(page\s*)?\d{1,4}(\s*(of|\/|dari)\s*\d{1,4})?$/i.test(t)) return false;
    if (edge && pages >= 3 && (edgeTexts.get(t) ?? 0) >= 3) return false;
    return true;
  });

  // ── Body font size = most common size (weighted by characters) ──
  const sizeWeight = new Map<number, number>();
  for (const l of body) {
    const s = Math.round(l.size * 2) / 2;
    sizeWeight.set(s, (sizeWeight.get(s) ?? 0) + l.text.length);
  }
  const bodySize = [...sizeWeight.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 10;

  // ── Lines -> blocks (paragraph/heading/list) ──
  const blocks: Block[] = [];
  let cur: Block | null = null;
  const flush = () => { if (cur) blocks.push(cur); cur = null; };
  let prev: Line | null = null;
  for (const l of body) {
    const t = l.text.trim();
    if (!t) continue;
    const ratio = l.size / bodySize;
    let kind: Block["kind"] = "p";
    if (ratio >= 1.6) kind = "h1";
    else if (ratio >= 1.3) kind = "h2";
    else if (ratio >= 1.12 || (l.bold && ratio >= 1.02 && t.length < 90 && !/[.:;,]$/.test(t))) kind = "h3";
    else if (BULLET.test(t)) kind = "li";
    else if (ORDERED.test(t)) kind = "oli";

    const newBlock =
      !cur || !prev || prev.page !== l.page || kind !== (cur.kind === "li" || cur.kind === "oli" ? "p" : cur.kind) && kind !== cur.kind ||
      kind === "li" || kind === "oli" || kind.startsWith("h") ||
      l.y - prev.y > l.size * 1.9 || // blank line gap
      (cur.kind === "p" && prev.runs[prev.runs.length - 1] && /[.!?:]$/.test(prev.text.trim()) && l.x > cur.lines[0].x + l.size * 1.2); // indent after sentence end

    // Continuation lines of a list item (indented, not starting a new marker) stay in the item.
    const continuesList = cur && (cur.kind === "li" || cur.kind === "oli") && kind === "p" && prev && prev.page === l.page && l.y - prev.y <= l.size * 1.6 && l.x > cur.lines[0].x + l.size * 0.5;
    if (continuesList) {
      cur!.lines.push(l);
    } else if (newBlock) {
      flush();
      cur = { kind, lines: [l] };
    } else {
      cur!.lines.push(l);
    }
    prev = l;
  }
  flush();

  // ── Insert images at their page position ──
  for (const im of pageImages) {
    let idx = blocks.findIndex((b) => b.lines.length && b.lines[0].page === im.page && b.lines[0].y > im.y);
    if (idx === -1) idx = blocks.findIndex((b) => b.lines.length && b.lines[0].page > im.page);
    const block: Block = { kind: "img", lines: [], src: im.src };
    if (idx === -1) blocks.push(block);
    else blocks.splice(idx, 0, block);
  }

  // ── Render ──
  const renderLine = (l: Line) => {
    let out = "";
    for (const r of l.runs) {
      let s = esc(r.str);
      if (r.bold && !l.bold) s = `<strong>${s}</strong>`;
      if (r.italic && !l.italic) s = `<em>${s}</em>`;
      out += (out && !out.endsWith(" ") && !s.startsWith(" ") ? " " : "") + s;
    }
    return out.replace(/\s+/g, " ").trim();
  };
  const joinLines = (ls: Line[]) =>
    ls.map(renderLine).join(" ").replace(/(\w)- (\w)/g, "$1$2"); // de-hyphenate line breaks
  const wrapMarks = (b: Block, inner: string) => {
    const all = b.lines.every((l) => l.bold);
    const allI = b.lines.every((l) => l.italic);
    let s = inner;
    if (all && !b.kind.startsWith("h")) s = `<strong>${s}</strong>`;
    if (allI) s = `<em>${s}</em>`;
    return s;
  };
  const html: string[] = [];
  let listOpen: "ul" | "ol" | null = null;
  const closeList = () => { if (listOpen) { html.push(`</${listOpen}>`); listOpen = null; } };
  for (const b of blocks) {
    if (b.kind === "img") { closeList(); html.push(`<img src="${b.src}" alt="">`); continue; }
    const text = joinLines(b.lines);
    if (!text) continue;
    if (b.kind === "li" || b.kind === "oli") {
      const tag = b.kind === "li" ? "ul" : "ol";
      if (listOpen !== tag) { closeList(); html.push(`<${tag}>`); listOpen = tag; }
      html.push(`<li>${wrapMarks(b, text.replace(BULLET, "").replace(ORDERED, ""))}</li>`);
      continue;
    }
    closeList();
    if (b.kind.startsWith("h")) html.push(`<${b.kind}>${text.replace(/<\/?(strong|em)>/g, "")}</${b.kind}>`);
    else html.push(`<p>${wrapMarks(b, text)}</p>`);
  }
  closeList();

  if (blocks.some((b) => b.kind.startsWith("h"))) warnings.push({ code: "headings", message: "Headings were guessed from font size. Check the levels (H2/H3) before publishing." });
  warnings.push({ code: "format", message: "PDF import keeps text, paragraphs, lists and images. Tables and columns become plain paragraphs." });
  return { html: html.join("\n"), warnings, images, imagesFailed, pages };
}
