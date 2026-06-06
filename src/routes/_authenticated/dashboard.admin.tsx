import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, Briefcase, Ticket, ShieldCheck, Truck, FileText } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatZar, centsToZar } from "@/lib/format";
import { ADMIN_NAV } from "@/lib/admin-nav";

export const Route = createFileRoute("/_authenticated/dashboard/admin")({
  component: AdminDashboard,
  head: () => ({ meta: [{ title: "Admin · Lum Tech Pro SA" }] }),
});

const NAV = ADMIN_NAV;

function AdminDashboard() {
  const { data } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const [projects, vouchers, profiles, milestones] = await Promise.all([
        supabase.from("projects").select("*").order("created_at", { ascending: false }),
        supabase.from("vouchers").select("*"),
        supabase.from("profiles").select("*"),
        supabase.from("milestones").select("*"),
      ]);
      return {
        projects: projects.data ?? [],
        vouchers: vouchers.data ?? [],
        profiles: profiles.data ?? [],
        milestones: milestones.data ?? [],
      };
    },
  });

  const projects = data?.projects ?? [];
  const vouchers = data?.vouchers ?? [];
  const profiles = data?.profiles ?? [];
  const milestones = data?.milestones ?? [];

  const gmv = projects.reduce((s, p) => s + centsToZar(p.budget_cents), 0);
  const commission = projects.reduce(
    (s, p) => s + centsToZar(p.client_fee_cents) + centsToZar(p.builder_fee_cents) + centsToZar(p.professional_fee_cents),
    0,
  );
  const voucherValue = vouchers.reduce((s, v) => s + centsToZar(v.value_cents), 0);
  const unverified = profiles.filter((p) => !p.is_verified).length;

  return (
    <AppShell role="admin" nav={NAV}>
      <h1 className="font-display text-3xl font-bold tracking-tight">Admin Console</h1>
      <p className="mt-1 text-sm text-muted-foreground">Platform health across KZN.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card icon={Briefcase} label="GMV" value={formatZar(gmv)} hint={`${projects.length} projects`} />
        <Card icon={ShieldCheck} label="Commission earned" value={formatZar(commission)} />
        <Card icon={Ticket} label="Voucher volume" value={formatZar(voucherValue)} hint={`${vouchers.length} issued`} />
        <Card icon={Users} label="Pending verifications" value={String(unverified)} hint={`${profiles.length} total users`} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-xl font-semibold">Recent projects</h2>
          <div className="mt-4 rounded-xl border border-border bg-card">
            {projects.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">No projects yet.</div>
            ) : (
              <div className="divide-y divide-border">
                {projects.slice(0, 8).map((p) => (
                  <Link key={p.id} to="/dashboard/projects/$projectId" params={{ projectId: p.id }}
                    className="flex items-center justify-between p-4 transition hover:bg-accent/40">
                    <div>
                      <div className="font-display font-semibold">{p.title}</div>
                      <div className="text-xs text-muted-foreground">Tier {p.tier} · {p.kzn_region}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{p.status}</Badge>
                      <div className="font-display">{formatZar(centsToZar(p.budget_cents))}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">Verification queue</h2>
          <div className="mt-4 rounded-xl border border-border bg-card">
            {profiles.filter((p) => !p.is_verified).length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">All accounts verified.</div>
            ) : (
              <div className="divide-y divide-border">
                {profiles.filter((p) => !p.is_verified).slice(0, 8).map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-display font-semibold">{p.full_name ?? p.email ?? "Unnamed"}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.company_name ?? "—"}{p.nhbrc_number ? ` · NHBRC ${p.nhbrc_number}` : ""}
                      </div>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">Milestone activity</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          {(["pending", "active", "awaiting_signoff", "approved"] as const).map((s) => (
            <div key={s} className="rounded-xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.replace("_", " ")}</div>
              <div className="mt-2 font-display text-2xl font-bold">
                {milestones.filter((m) => m.status === s).length}
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function Card({ icon: Icon, label, value, hint }: { icon: typeof ShieldCheck; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" /> {label}
      </div>
      <div className="mt-3 font-display text-2xl font-bold">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
