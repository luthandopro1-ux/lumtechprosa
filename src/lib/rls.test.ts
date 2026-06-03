/**
 * Integration tests against the live Lovable Cloud (Supabase) project.
 *
 * Verifies, for every non-admin role (client, builder, professional, supplier):
 *   1. A new user can sign in after registration.
 *   2. RLS lets them self-assign their role via the onboarding upsert.
 *   3. The upsert is idempotent (no 409 on re-submit).
 *   4. The dashboard router resolves them to /dashboard/<role>.
 *   5. RLS forbids self-assigning the admin role.
 *   6. Unauthenticated clients cannot write to user_roles or projects.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (used only to create + delete
 * throwaway auth users — never imported by the app).
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { resolveDashboardTarget } from "./role-routing";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? "https://ipjhmzkehxtrdvtpafxn.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwamhtemtlaHh0cmR2dHBhZnhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1ODI3NDEsImV4cCI6MjA5NTE1ODc0MX0.UZt-kRDKkIs84BSC8Kpzs5rb0PlpKOGeCJrv4WD4f2A";
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

const hasService = Boolean(SERVICE_ROLE);
const describeIfService = hasService ? describe : describe.skip;

type Role = "client" | "builder" | "professional" | "supplier";
const NON_ADMIN_ROLES: Role[] = ["client", "builder", "professional", "supplier"];

const anonClient = () =>
  createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

let admin: SupabaseClient<Database>;
const createdUserIds: string[] = [];

beforeAll(() => {
  if (!hasService) return;
  admin = createClient<Database>(SUPABASE_URL, SERVICE_ROLE!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
});

afterAll(async () => {
  if (!hasService || !admin) return;
  await Promise.allSettled(
    createdUserIds.map((id) => admin.auth.admin.deleteUser(id)),
  );
}, 30_000);

async function provisionUser(tag: string) {
  const email = `test+${tag}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}@lumtest.dev`;
  const password = "TestPass!" + Math.random().toString(36).slice(2, 10);
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) throw error ?? new Error("createUser returned no user");
  createdUserIds.push(data.user.id);
  return { email, password, userId: data.user.id };
}

describe("RLS — unauthenticated access", () => {
  it("rejects user_roles insert from an anonymous client", async () => {
    const { error } = await anonClient()
      .from("user_roles")
      .insert({
        user_id: "00000000-0000-0000-0000-000000000000",
        role: "client",
      });
    expect(error).toBeTruthy();
  });

  it("rejects projects insert from an anonymous client", async () => {
    const { error } = await anonClient().from("projects").insert({
      title: "rls-test",
      owner_id: "00000000-0000-0000-0000-000000000000",
      budget_cents: 1,
      kzn_region: "Durban",
      tier: 1,
    });
    expect(error).toBeTruthy();
  });
});

describeIfService.each(NON_ADMIN_ROLES)(
  "Registration + onboarding flow — %s",
  (role) => {
    it(
      `signs in, self-assigns ${role}, routes to /dashboard/${role}, and is idempotent`,
      async () => {
        const { email, password, userId } = await provisionUser(role);
        const c = anonClient();

        const { data: signIn, error: signInErr } =
          await c.auth.signInWithPassword({ email, password });
        expect(signInErr).toBeNull();
        expect(signIn.session?.access_token).toBeTruthy();
        expect(signIn.user?.id).toBe(userId);

        // First onboarding upsert (mirrors src/routes/onboarding.tsx).
        const { error: r1 } = await c
          .from("user_roles")
          .upsert(
            { user_id: userId, role },
            { onConflict: "user_id,role", ignoreDuplicates: true },
          );
        expect(r1).toBeNull();

        // Re-submit must not 409.
        const { error: r2 } = await c
          .from("user_roles")
          .upsert(
            { user_id: userId, role },
            { onConflict: "user_id,role", ignoreDuplicates: true },
          );
        expect(r2).toBeNull();

        // Read back as the authenticated user.
        const { data: rows, error: readErr } = await c
          .from("user_roles")
          .select("role")
          .eq("user_id", userId);
        expect(readErr).toBeNull();
        expect(rows?.filter((r) => r.role === role).length).toBe(1);

        // Dashboard router resolution.
        expect(resolveDashboardTarget(rows)).toBe(`/dashboard/${role}`);

        await c.auth.signOut();
      },
      30_000,
    );

    it(
      `forbids self-assigning admin while authenticated as a ${role}-eligible user`,
      async () => {
        const { email, password, userId } = await provisionUser(`${role}-noadm`);
        const c = anonClient();
        await c.auth.signInWithPassword({ email, password });

        const { error } = await c
          .from("user_roles")
          .insert({ user_id: userId, role: "admin" });
        expect(error).toBeTruthy();

        await c.auth.signOut();
      },
      30_000,
    );
  },
);
