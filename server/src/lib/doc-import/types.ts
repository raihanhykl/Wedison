export type ImportWarning = { code: string; message: string };

export type ImportedImage = {
  /** Raw image bytes as extracted from the document. */
  buffer: Buffer;
  mime: string;
  /** Suggested file name (without extension). */
  name: string;
  alt?: string;
};

/** Called for every extracted image; returns the public URL to put in the HTML, or null to drop it. */
export type ImageSink = (img: ImportedImage) => Promise<string | null>;

export type ImportResult = {
  html: string;
  warnings: ImportWarning[];
  stats: { paragraphs: number; headings: number; lists: number; tables: number; images: number; imagesFailed: number; words: number; pages?: number };
};
