export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public code: string = "ERROR",
    public details?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const badRequest = (msg = "Permintaan tidak valid", details?: unknown) =>
  new HttpError(400, msg, "BAD_REQUEST", details);
export const unauthorized = (msg = "Anda belum login") => new HttpError(401, msg, "UNAUTHORIZED");
export const forbidden = (msg = "Anda tidak punya akses") => new HttpError(403, msg, "FORBIDDEN");
export const notFound = (msg = "Data tidak ditemukan") => new HttpError(404, msg, "NOT_FOUND");
export const conflict = (msg = "Data sudah ada") => new HttpError(409, msg, "CONFLICT");
