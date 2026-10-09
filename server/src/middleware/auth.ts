import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { unauthorized, forbidden } from "../lib/errors.js";
import { canAccess, canDelete, canHr, canWrite, has, type HrAction, type Module } from "../lib/permissions.js";

export type AuthRole = { id: string; key: string; name: string; color: string | null; isSystem: boolean };
export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: AuthRole;
  /** Effective permission keys of the user's role ("*" for the super admin role). */
  permissions: string[];
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

type JwtPayload = { sub: string };

export function signToken(user: { id: string }) {
  return jwt.sign({ sub: user.id } satisfies JwtPayload, env.JWT_SECRET, {
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

export const authUserSelect = {
  id: true,
  email: true,
  name: true,
  avatarUrl: true,
  isActive: true,
  role: { select: { id: true, key: true, name: true, color: true, isSystem: true, permissions: true } },
} as const;

export function toAuthUser(u: {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: { id: string; key: string; name: string; color: string | null; isSystem: boolean; permissions: string[] };
}): AuthUser {
  const { permissions, ...role } = u.role;
  return { id: u.id, email: u.email, name: u.name, avatarUrl: u.avatarUrl, role, permissions };
}

/**
 * Wajib login. Memuat user + role dari DB pada setiap request sehingga perubahan izin role,
 * ganti role, atau nonaktif langsung berlaku tanpa login ulang.
 */
export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) return next(unauthorized());
  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    return next(unauthorized("Session is invalid or has expired"));
  }
  const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: authUserSelect });
  if (!user || !user.isActive) return next(unauthorized("Account is inactive"));
  req.user = toAuthUser(user);
  next();
}

/** Guard by one permission key (see lib/permissions.ts). */
export function requirePermission(permission: string, message = "You do not have permission for this action") {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(unauthorized());
    if (has(req.user, permission)) return next();
    next(forbidden(message));
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

/** Router-level guard: the user's role must be able to open the module. */
export function requireModule(module: Module) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(unauthorized());
    if (canAccess(req.user, module)) return next();
    next(forbidden("Your role does not have access to this module"));
  };
}

/** Fine-grained HR permission (approval workflow). */
export function requireHr(action: HrAction) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(unauthorized());
    if (canHr(req.user, action)) return next();
    next(forbidden("Your role does not allow this HR action"));
  };
}

/** Create / edit inside a module. */
export function requireWrite(module: Module) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(unauthorized());
    if (canWrite(req.user, module)) return next();
    next(forbidden("Your role cannot make changes in this module"));
  };
}

/** Permanent delete inside a module. */
export function requireDelete(module: Module) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(unauthorized());
    if (canDelete(req.user, module)) return next();
    next(forbidden("Your role cannot delete items in this module"));
  };
}
