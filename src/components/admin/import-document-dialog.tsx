"use client";

import { useCallback, useRef, useState } from "react";
import { AlertTriangle, FileText, FileUp, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { API_BASE } from "@/lib/admin/api";
import { cn } from "@/lib/utils";

export type ImportResult = {
  html: string;
  kind: "docx" | "pdf";
  fileName: string;
  warnings: { code: string; message: string }[];
  stats: { paragraphs: number; headings: number; lists: number; tables: number; images: number; imagesFailed: number; words: number; pages?: number };
};

const ACCEPT = ".docx,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf";
const MAX_MB = 20;

function uploadDocument(file: File, onProgress: (pct: number) => void, signal: AbortSignal) {
  return new Promise<ImportResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}/admin/articles/import/`);
    xhr.withCredentials = true;
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      let json: { ok?: boolean; data?: ImportResult; message?: string } = {};
      try {
        json = JSON.parse(xhr.responseText);
      } catch {
        /* non-JSON error page */
      }
      if (xhr.status >= 200 && xhr.status < 300 && json.data) resolve(json.data);
      else reject(new Error(json.message ?? (xhr.status === 413 ? `File is larger than ${MAX_MB} MB` : `Import failed (${xhr.status})`)));
    };
    xhr.onerror = () => reject(new Error("Network error while uploading"));
    xhr.onabort = () => reject(new DOMException("Aborted", "AbortError"));
    signal.addEventListener("abort", () => xhr.abort());
    const fd = new FormData();
    fd.append("file", file);
    xhr.send(fd);
  });
}

/**
 * "Import document" for the article editor: upload a Word (.docx) or PDF file, convert it
 * on the server to article HTML, then let the author replace or append the current body.
 * Title, slug and SEO fields stay manual on purpose.
 */
export function ImportDocumentDialog({
  open,
  onOpenChange,
  hasContent,
  onApply,
  localeLabel,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** Whether the editor already has text; decides if "Replace" needs a confirmation. */
  hasContent: boolean;
  onApply: (html: string, mode: "replace" | "append", result: ImportResult) => void;
  localeLabel: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setFile(null);
    setProgress(null);
    setConverting(false);
    setError(null);
    setResult(null);
  }, []);

  const close = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const pick = (f: File | undefined | null) => {
    setError(null);
    setResult(null);
    if (!f) return;
    const ext = f.name.toLowerCase().split(".").pop();
    if (ext === "doc") return setError("Legacy .doc files are not supported. Open the file in Word and save it as .docx first.");
    if (ext !== "docx" && ext !== "pdf") return setError("Choose a Word (.docx) or PDF file.");
    if (f.size > MAX_MB * 1024 * 1024) return setError(`File is larger than ${MAX_MB} MB.`);
    setFile(f);
  };

  const convert = async () => {
    if (!file) return;
    setError(null);
    setProgress(0);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const r = await uploadDocument(
        file,
        (p) => {
          setProgress(p);
          if (p >= 100) setConverting(true);
        },
        ctrl.signal,
      );
      setResult(r);
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError((e as Error).message);
    } finally {
      setProgress(null);
      setConverting(false);
      abortRef.current = null;
    }
  };

  const apply = (mode: "replace" | "append") => {
    if (!result) return;
    if (mode === "replace" && hasContent && !window.confirm(`Replace the current ${localeLabel} body with the imported content? You can undo this in the editor.`)) return;
    onApply(result.html, mode, result);
    close(false);
  };

  const busy = progress !== null;
  const empty = result && !result.html.trim();

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import document</DialogTitle>
          <DialogDescription>
            Fill the <b>{localeLabel}</b> body from a Word (.docx) or PDF file. Text, headings, lists, links, tables and images are
            imported; the title, slug and SEO fields stay as they are.
          </DialogDescription>
        </DialogHeader>

        {!result && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => !busy && inputRef.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !busy && inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              if (!busy) setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              if (!busy) pick(e.dataTransfer.files?.[0]);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center text-sm transition-colors",
              dragging ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
              busy && "pointer-events-none opacity-70",
            )}
          >
            <input ref={inputRef} type="file" accept={ACCEPT} className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
            {file ? (
              <>
                <FileText className="size-7 text-primary" />
                <div className="font-medium">{file.name}</div>
                <div className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB · click to choose another file</div>
              </>
            ) : (
              <>
                <FileUp className="size-7 text-muted-foreground" />
                <div className="font-medium">Drop a .docx or .pdf here, or click to browse</div>
                <div className="text-xs text-muted-foreground">Up to {MAX_MB} MB. Word files import best; PDFs are converted as well as possible.</div>
              </>
            )}
          </div>
        )}

        {busy && (
          <div className="space-y-1.5">
            <Progress value={progress ?? 0} />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              {converting ? "Converting document and uploading images to the Media Library…" : `Uploading… ${progress}%`}
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="rounded-md border bg-muted/40 p-3 text-sm">
              <div className="mb-2 flex items-center gap-2 font-medium">
                <FileText className="size-4" /> {result.fileName}
                <span className="ml-auto rounded bg-background px-1.5 py-0.5 font-mono text-[11px] uppercase text-muted-foreground">{result.kind}</span>
              </div>
              <dl className="grid grid-cols-3 gap-x-3 gap-y-1 text-xs sm:grid-cols-4">
                {(
                  [
                    ["Words", result.stats.words],
                    ["Paragraphs", result.stats.paragraphs],
                    ["Headings", result.stats.headings],
                    ["Lists", result.stats.lists],
                    ["Tables", result.stats.tables],
                    ["Images", result.stats.images],
                    ...(result.stats.pages ? [["Pages", result.stats.pages] as const] : []),
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-2 border-b border-border/60 py-0.5">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-mono">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            {empty && (
              <div className="flex items-start gap-2 rounded-md border border-chart-4/40 bg-chart-4/10 p-3 text-sm">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-chart-4" />
                <span>Nothing could be extracted from this file. If it is a scanned PDF, convert it with OCR first or paste the text manually.</span>
              </div>
            )}
            {result.warnings.length > 0 && (
              <ul className="space-y-1 text-xs text-muted-foreground">
                {result.warnings.map((w, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <AlertTriangle className="mt-0.5 size-3 shrink-0 text-chart-4" />
                    <span>{w.message}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-muted-foreground">
              After importing, review heading levels, image alt text and links in the editor. Use Undo if the result is not what you expected.
            </p>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          {!result ? (
            <>
              <Button type="button" variant="outline" onClick={() => (busy ? abortRef.current?.abort() : close(false))}>
                Cancel
              </Button>
              <Button type="button" onClick={convert} disabled={!file || busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} Convert
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="ghost" onClick={reset}>
                Choose another file
              </Button>
              {!empty && hasContent && (
                <Button type="button" variant="outline" onClick={() => apply("append")}>
                  Append to body
                </Button>
              )}
              {!empty && (
                <Button type="button" onClick={() => apply("replace")}>
                  {hasContent ? "Replace body" : "Insert into body"}
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
