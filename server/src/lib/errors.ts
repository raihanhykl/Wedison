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

export const badRequest = (msg = "Invalid request", details?: unknown) =>
  new HttpError(400, msg, "BAD_REQUEST", details);
export const unauthorized = (msg = "You are not signed in") => new HttpError(401, msg, "UNAUTHORIZED");
export const forbidden = (msg = "You do not have permission") => new HttpError(403, msg, "FORBIDDEN");
export const notFound = (msg = "Not found") => new HttpError(404, msg, "NOT_FOUND");
export const conflict = (msg = "Already exists") => new HttpError(409, msg, "CONFLICT");
