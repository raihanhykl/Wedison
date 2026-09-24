import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { prisma } from "../../lib/prisma.js";
import { validate, getValidated } from "../../middleware/validate.js";
import { requireAuth, signToken, setAuthCookie, clearAuthCookie } from "../../middleware/auth.js";
import { unauthorized, badRequest } from "../../lib/errors.js";
import { logActivity } from "../../lib/activity.js";

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { ok: false, code: "RATE_LIMIT", message: "Too many login attempts. Please try again later." },
});

const loginSchema = z.object({
  email: z.string().email().transform((s) => s.toLowerCase().trim()),
  password: z.string().min(1),
});

authRouter.post("/login", loginLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = getValidated<typeof loginSchema>(req);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) throw unauthorized("Incorrect email or password");
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw unauthorized("Incorrect email or password");

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const token = signToken(user);
    setAuthCookie(res, token);
    req.user = { id: user.id, email: user.email, name: user.name, role: user.role, avatarUrl: user.avatarUrl };
    logActivity(req, { action: "login", entity: "auth", entityId: user.id, summary: "Signed in" });
    res.json({
      ok: true,
      data: { id: user.id, email: user.email, name: user.name, role: user.role, avatarUrl: user.avatarUrl },
      token, // untuk klien non-browser (mobile/CLI); browser pakai cookie httpOnly
    });
  } catch (e) {
    next(e);
  }
});

authRouter.post("/logout", (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ ok: true, data: req.user });
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8, "Minimum 8 characters").max(128),
  });

authRouter.post("/change-password", requireAuth, validate(changePasswordSchema), async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = getValidated<typeof changePasswordSchema>(req);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.id } });
    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) throw badRequest("Current password is incorrect");
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await bcrypt.hash(newPassword, 12) },
    });
    logActivity(req, { action: "update", entity: "auth", entityId: user.id, summary: "Changed password" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  avatarUrl: z.string().url().nullable().optional(),
});

authRouter.patch("/profile", requireAuth, validate(profileSchema), async (req, res, next) => {
  try {
    const data = getValidated<typeof profileSchema>(req);
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data,
      select: { id: true, email: true, name: true, role: true, avatarUrl: true },
    });
    res.json({ ok: true, data: user });
  } catch (e) {
    next(e);
  }
});
