import type { AppRole } from "@/hooks/use-auth";

export type DashboardTarget =
  | "/dashboard/admin"
  | "/dashboard/client"
  | "/dashboard/builder"
  | "/dashboard/professional"
  | "/dashboard/supplier"
  | "/onboarding";

// Priority order — first match wins. Admin always trumps everything.
export const ROLE_PRIORITY: AppRole[] = [
  "admin",
  "client",
  "builder",
  "professional",
  "supplier",
];

export function resolveDashboardTarget(
  roles: ReadonlyArray<{ role: AppRole } | AppRole> | null | undefined,
): DashboardTarget {
  if (!roles || roles.length === 0) return "/onboarding";
  const set = new Set(
    roles.map((r) => (typeof r === "string" ? r : r.role)),
  );
  for (const role of ROLE_PRIORITY) {
    if (set.has(role)) return `/dashboard/${role}` as DashboardTarget;
  }
  return "/onboarding";
}
