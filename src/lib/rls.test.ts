/**
 * Integration tests against the live Lovable Cloud (Supabase) project.
 * Uses the public anon key only — verifies RLS denies unauthenticated writes
 * and that the registration / onboarding flow works for every non-admin role.
 *
 * Each run creates throwaway auth users with random emails. Email confirmation
 * is disabled for this project, so signUp returns a session immediately.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { resolveDashboardTarget } from "./role-routing";

const SUPABASE_URL = "https://ipjhmzkehxtrdvtpafxn.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwamhtemtlaHh0cmR2dHBhZnhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1ODI3NDEsImV4cCI6MjA5NTE1ODc0MX0.UZt-kRDKkIs84BSC8Kpzs5rb0PlpKOGeCJrv4WD4f2A";

type Role = "client" | "builder" | "professional" | "supplier";
const NON_ADMIN_ROLES: Role[] = ["client", "builder", "professional", "supplier"];

const makeClient = () =>
  createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

const randomEmail = (tag: string) =>
  `test+${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@lumtest.dev`;

// Reachability — skip RLS suite cleanly when offline.
let online = false;
beforeAll(async () => {
  try {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
      headers: { apikey: SUPABASE_ANON_KEY },
    });
    online = r.ok;
  } catch {
    online = false;
  }
}, 10_000);

describe("RLS — unauthenticated access", () => {
  it("rejects user_roles insert from an anonymous client", async () => {
    if (!online) return;
    const c = makeClient();
    const { error } = await c
      .from("user_roles")
      .insert({
        user_id: "00000000-0000-0000-0000-000000000000",
        role: "client",
      });
    expect(error).toBeTruthy();
  });

  it("rejects projects insert from an anonymous client", async () => {
    if (!online) return;
    const c = makeClient();
    const { error } = await c.from("projects").insert({
      title: "rls-test",
      owner_id: "00000000-0000-0000-0000-000000000000",
      budget_cents: 1,
      kzn_region: "Durban",
      tier: 1,
    });
    expect(error).toBeTruthy();
  });
});

describe.each(NON_ADMIN_ROLES)(
  "Registration + onboarding flow — %s",
  (role) => {
    it(
      `signs up, self-assigns ${role} role, and routes to /dashboard/${role}`,
      async () => {
        if (!online) return;
        const c = makeClient();
        const email = randomEmail(role);
        const password = "TestPass!" + Math.random().toString(36).slice(2, 10);

        const { data: signUp, error: signUpErr } = await c.auth.signUp({
          email,
          password,
          options: { data: { full_name: `Test ${role}` } },
        });
        expect(signUpErr).toBeNull();
        expect(signUp.user?.id).toBeTruthy();
        // Email confirmation is off — we should have a session immediately.
        expect(signUp.session?.access_token).toBeTruthy();

        // Onboarding upsert (mirrors src/routes/onboarding.tsx).
        const { error: roleErr } = await c
          .from("user_roles")
          .upsert(
            { user_id: signUp.user!.id, role },
            { onConflict: "user_id,role", ignoreDuplicates: true },
          );
        expect(roleErr).toBeNull();

        // Re-running the upsert must not 409 (idempotency).
        const { error: roleErr2 } = await c
          .from("user_roles")
          .upsert(
            { user_id: signUp.user!.id, role },
            { onConflict: "user_id,role", ignoreDuplicates: true },
          );
        expect(roleErr2).toBeNull();

        // Read back via the same authed session — RLS must allow it.
        const { data: rows, error: readErr } = await c
          .from("user_roles")
          .select("role")
          .eq("user_id", signUp.user!.id);
        expect(readErr).toBeNull();
        expect(rows?.some((r) => r.role === role)).toBe(true);

        // Dashboard router resolution.
        expect(resolveDashboardTarget(rows)).toBe(`/dashboard/${role}`);

        await c.auth.signOut();
      },
      30_000,
    );

    it(`forbids self-assigning admin while signed in as a ${role}-eligible user`, async () => {
      if (!online) return;
      const c = makeClient();
      const email = randomEmail(`${role}-noadmin`);
      const password = "TestPass!" + Math.random().toString(36).slice(2, 10);
      const { data: signUp, error } = await c.auth.signUp({ email, password });
      expect(error).toBeNull();

      const { error: adminErr } = await c
        .from("user_roles")
        .insert({ user_id: signUp.user!.id, role: "admin" });
      expect(adminErr).toBeTruthy();

      await c.auth.signOut();
    }, 30_000);
  },
);
