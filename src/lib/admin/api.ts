/**
 * Client HTTP untuk admin dashboard (browser). Semua request ke /api/v1 (di-rewrite Next ke
 * backend Express), cookie sesi httpOnly ikut otomatis (same-origin).
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code = "ERROR",
    public details?: { path: string; message: string }[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const API_BASE = "/api/v1";

type Query = Record<string, string | number | boolean | undefined | null>;

export function qs(query?: Query) {
  if (!query) return "";
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === "") continue;
    p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

export async function api<T = unknown>(
  path: string,
  opts: { method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; body?: unknown; query?: Query; signal?: AbortSignal } = {},
): Promise<T> {
  const isForm = typeof FormData !== "undefined" && opts.body instanceof FormData;
  // next.config `trailingSlash: true` me-redirect 308 path tanpa slash -> pakai slash langsung
  // (Express non-strict routing: /login/ == /login) agar tidak ada round-trip ekstra.
  const normalized = path.endsWith("/") ? path : `${path}/`;
  const res = await fetch(`${API_BASE}${normalized}${qs(opts.query)}`, {
    method: opts.method ?? "GET",
    credentials: "include",
    headers: {
      accept: "application/json",
      ...(opts.body && !isForm ? { "content-type": "application/json" } : {}),
    },
    body: isForm ? (opts.body as FormData) : opts.body ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
  });

  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const j = (json ?? {}) as { message?: string; code?: string; details?: { path: string; message: string }[] };
    if (res.status === 401 && typeof window !== "undefined" && !window.location.pathname.startsWith("/admin/login")) {
      window.location.assign(`/admin/login?next=${encodeURIComponent(window.location.pathname)}`);
    }
    throw new ApiError(res.status, j.message ?? `Request failed (${res.status})`, j.code, j.details);
  }
  return json as T;
}

/** Friendly error message for toasts. */
export function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.details?.length) return `${err.message}: ${err.details.map((d) => `${d.path} ${d.message}`).join(", ")}`;
    return err.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}
