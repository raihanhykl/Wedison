import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { unauthorized, forbidden } from "../lib/errors.js";
import type { UserRole } from "../generated/prisma/enums.js";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl: string | null;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

type JwtPayload = { sub: string; role: UserRole };

export function signToken(user: { id: string; role: UserRole }) {
  return jwt.sign({ sub: user.id, role: user.role } satisfies JwtPayload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

function extractToken(req: Request): string | null {
  const cookie = req.cookies?.[env.COOKIE_NAME];
  if (cookie) return cookie;
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return null;
}

/** Wajib login. Memuat user dari DB agar perubahan role/nonaktif langsung berlaku. */
export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) return next(unauthorized());
  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    return next(unauthorized("Session is invalid or has expired"));
  }
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true, role: true, avatarUrl: true, isActive: true },
  });
  if (!user || !user.isActive) return next(unauthorized("Account is inactive"));
  const { isActive: _ignored, ...rest } = user;
  req.user = rest;
  next();
}

/** Batasi ke role tertentu. SUPER_ADMIN selalu lolos. */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(unauthorized());
    if (req.user.role === "SUPER_ADMIN" || roles.includes(req.user.role)) return next();
    next(forbidden());
  };
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie(env.COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.COOKIE_SECURE,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(env.COOKIE_NAME, { path: "/" });
}
