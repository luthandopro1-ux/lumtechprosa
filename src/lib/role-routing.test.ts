import { describe, it, expect } from "vitest";
import { resolveDashboardTarget, ROLE_PRIORITY } from "./role-routing";
import { Constants } from "@/integrations/supabase/types";

describe("resolveDashboardTarget", () => {
  it("returns /onboarding for null / empty roles", () => {
    expect(resolveDashboardTarget(null)).toBe("/onboarding");
    expect(resolveDashboardTarget(undefined)).toBe("/onboarding");
    expect(resolveDashboardTarget([])).toBe("/onboarding");
  });

  it.each([
    ["client", "/dashboard/client"],
    ["builder", "/dashboard/builder"],
    ["professional", "/dashboard/professional"],
    ["supplier", "/dashboard/supplier"],
    ["admin", "/dashboard/admin"],
  ] as const)("routes single role %s -> %s", (role, target) => {
    expect(resolveDashboardTarget([{ role }])).toBe(target);
    expect(resolveDashboardTarget([role])).toBe(target);
  });

  it("admin trumps every other role", () => {
    expect(
      resolveDashboardTarget([
        { role: "client" },
        { role: "builder" },
        { role: "admin" },
      ]),
    ).toBe("/dashboard/admin");
  });

  it("follows priority: client > builder > professional > supplier", () => {
    expect(
      resolveDashboardTarget([{ role: "supplier" }, { role: "builder" }]),
    ).toBe("/dashboard/builder");
    expect(
      resolveDashboardTarget([{ role: "professional" }, { role: "client" }]),
    ).toBe("/dashboard/client");
    expect(
      resolveDashboardTarget([
        { role: "supplier" },
        { role: "professional" },
      ]),
    ).toBe("/dashboard/professional");
  });

  it("priority list covers every app_role in the database enum", () => {
    const dbRoles = [...Constants.public.Enums.app_role].sort();
    const coveredRoles = [...ROLE_PRIORITY].sort();
    expect(coveredRoles).toEqual(dbRoles);
  });
});
