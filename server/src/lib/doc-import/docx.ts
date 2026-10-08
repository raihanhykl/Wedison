import mammoth from "mammoth";
import type { ImageSink, ImportResult, ImportWarning } from "./types.js";

/**
 * Word (.docx) -> semantic HTML via mammoth. Keeps headings (Word styles Heading 1-6 and
 * their Indonesian names), lists, tables, inline marks, links and inline images. Images are
 * handed to `sink` (uploaded to the Media Library) and replaced by their public URL.
 */
const STYLE_MAP = [
  "p[style-name='Title'] => h1:fresh",
  "p[style-name='Judul'] => h1:fresh",
  "p[style-name='Subtitle'] => p.lead:fresh",
  "p[style-name='Heading 1'] => h1:fresh",
  "p[style-name='Heading 2'] => h2:fresh",
  "p[style-name='Heading 3'] => h3:fresh",
  "p[style-name='Heading 4'] => h4:fresh",
  "p[style-name='Heading 5'] => h5:fresh",
  "p[style-name='Heading 6'] => h6:fresh",
  "p[style-name='Quote'] => blockquote:fresh",
  "p[style-name='Intense Quote'] => blockquote:fresh",
  "p[style-name='Kutipan'] => blockquote:fresh",
  "r[style-name='Strong'] => strong",
  "r[style-name='Emphasis'] => em",
  "u => u",
  "strike => s",
  "comment-reference => ",
];

export async function importDocx(buffer: Buffer, sink: ImageSink): Promise<Omit<ImportResult, "stats"> & { imagesFailed: number; images: number }> {
  const warnings: ImportWarning[] = [];
  let images = 0;
  let imagesFailed = 0;

  const result = await mammoth.convertToHtml(
    { buffer },
    {
      styleMap: STYLE_MAP,
      convertImage: mammoth.images.imgElement(async (image) => {
        images++;
        try {
          const buf = Buffer.from(await image.readAsBase64String(), "base64");
          const url = await sink({ buffer: buf, mime: image.contentType, name: `docx-image-${images}` });
          if (!url) throw new Error("rejected");
          return { src: url, alt: "" };
        } catch (err) {
          imagesFailed++;
          warnings.push({ code: "image", message: `Image ${images} could not be imported (${(err as Error).message}).` });
          // mammoth needs a src; return an empty data URI that the sanitizer/cleaner removes below
          return { src: "", alt: "" };
        }
      }),
    },
  );

  for (const m of result.messages) {
    if (m.type === "warning" && !/Unrecognised (paragraph|run) style/i.test(m.message)) warnings.push({ code: "mammoth", message: m.message });
  }
  // Drop images that failed (empty src)
  const html = result.value.replace(/<img\b[^>]*src=""[^>]*>/g, "");
  return { html, warnings, images, imagesFailed };
}
