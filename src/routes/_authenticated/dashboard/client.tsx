import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard, FolderPlus, Wallet, ShieldCheck, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatZar, centsToZar } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard/client")({
  component: ClientDashboard,
  head: () => ({ meta: [{ title: "Client Dashboard · LUM TECH PRO SA" }] }),
});

const NAV = [
  { to: "/dashboard/client", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/client/projects/new", label: "New project", icon: FolderPlus },
];

function ClientDashboard() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", "client"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const totalEscrow = projects.reduce(
    (sum, p) => sum + centsToZar(p.budget_cents) + centsToZar(p.client_fee_cents) + centsToZar(p.professional_fee_cents),
    0,
  );

  return (
    <AppShell role="client" nav={NAV}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Client Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your KZN construction portfolio.</p>
        </div>
        <Button asChild className="bg-gradient-amber text-primary-foreground">
          <Link to="/dashboard/client/projects/new">
            <Plus className="mr-2 h-4 w-4" /> New project
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <MetricCard
          icon={ShieldCheck}
          label="Total locked in TradeSafe"
          value={formatZar(totalEscrow)}
        />
        <MetricCard icon={Wallet} label="Funds disbursed" value={formatZar(0)} hint="Pending milestone approvals" />
        <MetricCard icon={Wallet} label="Voucher balance" value={formatZar(0)} hint="Across all active projects" />
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold">Active projects</h2>
        <div className="mt-4 rounded-xl border border-border bg-card">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center">
              <div className="font-display text-lg">No projects yet</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Kick off your first KZN build in under two minutes.
              </p>
              <Button asChild className="mt-6 bg-gradient-amber text-primary-foreground">
                <Link to="/dashboard/client/projects/new">Start a project</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  to="/dashboard/projects/$projectId"
                  params={{ projectId: p.id }}
                  className="flex items-center justify-between p-5 transition hover:bg-accent/40"
                >
                  <div>
                    <div className="font-display text-base font-semibold">{p.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Tier {p.tier} · {p.kzn_region} · {p.status}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-base">
                      {formatZar(centsToZar(p.budget_cents))}
                    </div>
                    <div className="text-xs text-muted-foreground">Project budget</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>
      <div className="mt-3 font-display text-2xl font-bold">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
