import sanitizeHtml from "sanitize-html";

// HTML artikel berasal dari editor Tiptap milik admin (tepercaya), tapi tetap disanitasi
// agar tidak ada script/iframe liar bila akun admin bocor. Daftar tag mengikuti
// extension yang dipakai editor (heading, list, task list, image, highlight, align, dll).
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "hr", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "pre", "code",
      "ul", "ol", "li", "strong", "b", "em", "i", "u", "s", "sub", "sup", "mark", "span",
      "a", "img", "figure", "figcaption", "label", "input", "div", "table", "thead",
      "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      "*": ["class", "style", "data-type", "data-checked", "data-align"],
      a: ["href", "target", "rel", "title"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      input: ["type", "checked", "disabled"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https", "data"] },
    allowedStyles: {
      "*": {
        "text-align": [/^(left|right|center|justify)$/],
        "background-color": [/^#[0-9a-f]{3,8}$/i, /^var\(--[\w-]+\)$/, /^rgba?\([\d\s.,%]+\)$/],
        color: [/^#[0-9a-f]{3,8}$/i, /^var\(--[\w-]+\)$/, /^rgba?\([\d\s.,%]+\)$/],
      },
    },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: attribs.target === "_blank" ? "noopener noreferrer" : (attribs.rel ?? ""),
        },
      }),
    },
  });
}

export function stripHtml(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}

export function readingTimeMinutes(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
