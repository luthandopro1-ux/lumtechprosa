import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard, ClipboardCheck, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatZar, centsToZar } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard/professional")({
  component: ProfessionalDashboard,
  head: () => ({ meta: [{ title: "Professional Dashboard · Build Connect SA" }] }),
});

const NAV = [{ to: "/dashboard/professional", label: "Sign-off queue", icon: ClipboardCheck }];

function ProfessionalDashboard() {
  const { data: pending = [] } = useQuery({
    queryKey: ["milestones", "professional", "queue"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("milestones")
        .select("id, title, payout_amount_cents, status, qs_approved, engineer_approved, project_id, projects(title, kzn_region, tier)")
        .in("status", ["awaiting_signoff", "active"])
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const totalQueued = pending.reduce((s, m) => s + centsToZar(m.payout_amount_cents), 0);

  return (
    <AppShell role="professional" nav={NAV}>
      <h1 className="font-display text-3xl font-bold tracking-tight">Professional Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Independent QS and engineering sign-offs.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card icon={ClipboardCheck} label="Items awaiting sign-off" value={String(pending.length)} />
        <Card icon={ShieldCheck} label="Total value queued" value={formatZar(totalQueued)} />
        <Card icon={LayoutDashboard} label="Regions covered" value="KZN" />
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold">Sign-off queue</h2>
      <div className="mt-4 rounded-xl border border-border bg-card">
        {pending.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">All clear — nothing awaiting your sign-off.</div>
        ) : (
          <div className="divide-y divide-border">
            {pending.map((m) => (
              <Link key={m.id} to="/dashboard/projects/$projectId" params={{ projectId: m.project_id }}
                className="flex items-center justify-between p-5 transition hover:bg-accent/40">
                <div>
                  <div className="font-display font-semibold">{m.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {m.projects?.title} · Tier {m.projects?.tier} · {m.projects?.kzn_region}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Badge variant={m.qs_approved ? "default" : "outline"}>QS {m.qs_approved ? "✓" : "pending"}</Badge>
                    <Badge variant={m.engineer_approved ? "default" : "outline"}>Eng {m.engineer_approved ? "✓" : "pending"}</Badge>
                  </div>
                </div>
                <div className="font-display text-lg">{formatZar(centsToZar(m.payout_amount_cents))}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Card({ icon: Icon, label, value }: { icon: typeof ShieldCheck; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" /> {label}
      </div>
      <div className="mt-3 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}
