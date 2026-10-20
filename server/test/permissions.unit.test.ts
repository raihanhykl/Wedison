import { describe, expect, it } from "vitest";
import {
  ALL_PERMISSIONS, PERMISSION_CATALOG, canAccess, canDelete, canHr, canManageUsers, canWrite, has, isKnownPermission,
  normalizePermissions, unknownPermissions,
} from "../src/lib/permissions.js";
import { slugifyRoleKey, preparePermissions, ROLE_KEY_RE, assertKeyAllowed } from "../src/lib/roles.js";

describe("permission catalog", () => {
  it("has unique keys and every implied key exists", () => {
    expect(new Set(ALL_PERMISSIONS).size).toBe(ALL_PERMISSIONS.length);
    for (const m of PERMISSION_CATALOG) for (const p of m.permissions) {
      expect(p.key.startsWith(`${m.key}.`)).toBe(true);
      for (const i of p.implies ?? []) expect(isKnownPermission(i)).toBe(true);
    }
  });

  it("normalizes implied permissions transitively and drops unknown keys", () => {
    expect(normalizePermissions(["cms.delete"])).toEqual(["cms.view", "cms.write", "cms.delete"]);
    expect(normalizePermissions(["hr.jobs.publish"])).toEqual(["hr.view", "hr.jobs.write", "hr.jobs.publish"]);
    expect(normalizePermissions(["bogus.key", "dashboard.view", "dashboard.view"])).toEqual(["dashboard.view"]);
    expect(normalizePermissions([])).toEqual([]);
    expect(unknownPermissions(["cms.view", "nope", "*"])).toEqual(["nope"]);
  });

  it("evaluates module helpers from permission keys", () => {
    const editor = { permissions: ["dashboard.view", "cms.view", "cms.write"] };
    expect(canAccess(editor, "cms")).toBe(true);
    expect(canWrite(editor, "cms")).toBe(true);
    expect(canDelete(editor, "cms")).toBe(false);
    expect(canAccess(editor, "hr")).toBe(false);
    expect(canAccess(editor, "users")).toBe(false);
    expect(canManageUsers(editor)).toBe(false);

    const hr = { permissions: ["hr.view", "hr.jobs.write"] };
    expect(canHr(hr, "jobs.read")).toBe(true);
    expect(canHr(hr, "jobs.write")).toBe(true);
    expect(canHr(hr, "jobs.publish")).toBe(false);
    expect(canHr({ permissions: [] }, "jobs.read")).toBe(false);
  });

  it("treats the wildcard as everything", () => {
    const su = { permissions: ["*"] };
    for (const k of ALL_PERMISSIONS) expect(has(su, k)).toBe(true);
    expect(canManageUsers(su)).toBe(true);
    expect(canHr(su, "jobs.delete")).toBe(true);
    expect(has({ permissions: [] }, "dashboard.view")).toBe(false);
  });
});

describe("role helpers", () => {
  it("slugifies names into stable keys", () => {
    expect(slugifyRoleKey("Finance Team")).toBe("finance_team");
    expect(slugifyRoleKey("  Tim  Média – Sosial! ")).toBe("tim_media_sosial");
    expect(slugifyRoleKey("123 Ops")).toBe("ops");
    expect(slugifyRoleKey("x".repeat(80))).toHaveLength(40);
    expect(ROLE_KEY_RE.test(slugifyRoleKey("Marketing & PR"))).toBe(true);
    expect(slugifyRoleKey("!!!")).toBe("");
  });

  it("rejects reserved / malformed keys", () => {
    expect(() => assertKeyAllowed("super_admin")).toThrow(/reserved/);
    expect(() => assertKeyAllowed("Admin")).toThrow(/Key must/);
    expect(() => assertKeyAllowed("a")).toThrow(/Key must/);
    expect(() => assertKeyAllowed("_x")).toThrow(/Key must/);
    expect(() => assertKeyAllowed("ops_team2")).not.toThrow();
  });

  it("validates permission lists", () => {
    expect(() => preparePermissions(["*"])).toThrow(/reserved/);
    expect(() => preparePermissions(["cms.view", "made.up"])).toThrow(/Unknown permission: made.up/);
    expect(preparePermissions(["leads.delete"])).toEqual(["leads.view", "leads.write", "leads.delete"]);
  });
});
