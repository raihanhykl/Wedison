import { describe, expect, it } from "vitest";
import { emailList, overlap, MAX_EMAILS } from "../src/lib/email-list.js";
import { hrSettingsSchema } from "../src/modules/hr/hr.settings.js";

describe("emailList", () => {
  const to = emailList({ min: 1, label: "To" });
  const cc = emailList({ label: "CC" });

  it("normalizes, de-duplicates and keeps order", () => {
    expect(to.parse([" HR@Wedison.co ", "recruitment@wedison.co", "hr@wedison.co"])).toEqual(["hr@wedison.co", "recruitment@wedison.co"]);
  });
  it("accepts a legacy single string or a separated list", () => {
    expect(cc.parse("a@x.co")).toEqual(["a@x.co"]);
    expect(cc.parse("a@x.co, b@x.co;c@x.co  d@x.co")).toEqual(["a@x.co", "b@x.co", "c@x.co", "d@x.co"]);
    expect(cc.parse(null)).toEqual([]);
    expect(cc.parse("")).toEqual([]);
    expect(cc.parse(undefined)).toEqual([]);
  });
  it("rejects invalid addresses, too many, and empty when required", () => {
    expect(cc.safeParse(["ok@x.co", "not-an-email"]).success).toBe(false);
    expect(cc.safeParse(["a@x.co;"]).success).toBe(false); // array items are not split
    expect(cc.safeParse(Array.from({ length: MAX_EMAILS + 1 }, (_, i) => `u${i}@x.co`)).success).toBe(false);
    expect(cc.safeParse(Array.from({ length: MAX_EMAILS }, (_, i) => `u${i}@x.co`)).success).toBe(true);
    expect(to.safeParse([]).success).toBe(false);
  });
  it("finds overlap between To and CC", () => {
    expect(overlap(["a@x.co", "b@x.co"], ["b@x.co", "c@x.co"])).toEqual(["b@x.co"]);
    expect(overlap([], ["a@x.co"])).toEqual([]);
  });
});

describe("hrSettingsSchema", () => {
  it("maps legacy single contactEmail / ccEmail to lists", () => {
    const s = hrSettingsSchema.parse({ contactEmail: "HR@wedison.co", ccEmail: "boss@wedison.co" });
    expect(s.contactEmails).toEqual(["hr@wedison.co"]);
    expect(s.ccEmails).toEqual(["boss@wedison.co"]);
    expect(s).not.toHaveProperty("contactEmail");
    expect(s).not.toHaveProperty("ccEmail");
  });
  it("prefers the new lists over legacy fields and applies defaults", () => {
    expect(hrSettingsSchema.parse({ contactEmails: ["a@x.co"], contactEmail: "old@x.co" }).contactEmails).toEqual(["a@x.co"]);
    expect(hrSettingsSchema.parse({}).contactEmails).toEqual(["hr@wedison.co"]);
    expect(hrSettingsSchema.parse({ ccEmail: "" }).ccEmails).toEqual([]);
  });
  it("rejects an address that is both To and CC, and an empty To list", () => {
    const r = hrSettingsSchema.safeParse({ contactEmails: ["a@x.co"], ccEmails: ["A@x.co"] });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].path).toEqual(["ccEmails"]);
    expect(hrSettingsSchema.safeParse({ contactEmails: [] }).success).toBe(false);
  });
});
