import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard, Wallet, HardHat, FolderOpen } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { formatZar, centsToZar } from "@/lib/format";
import { EscrowBalanceWidget } from "@/components/dashboard/EscrowBalanceWidget";
import { VoucherWallet } from "@/components/dashboard/VoucherWallet";
import { MilestoneTracker } from "@/components/dashboard/MilestoneTracker";
import { useAuth } from "@/hooks/use-auth";


export const Route = createFileRoute("/_authenticated/dashboard/builder")({
  component: BuilderDashboard,
  head: () => ({ meta: [{ title: "Builder Dashboard · Lum Tech Pro SA" }] }),
});

const NAV = [
  { to: "/dashboard/builder", label: "Overview", icon: LayoutDashboard },
];

function BuilderDashboard() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", "builder"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const assigned = projects.filter((p) => p.builder_id);
  const open = projects.filter((p) => !p.builder_id);

  return (
    <AppShell role="builder" nav={NAV}>
      <h1 className="font-display text-3xl font-bold tracking-tight">Builder Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Active builds and open opportunities across KZN.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Metric icon={HardHat} label="Active builds" value={String(assigned.length)} />
        <Metric icon={FolderOpen} label="Open opportunities" value={String(open.length)} />
        <Metric icon={Wallet} label="Voucher wallet" value={formatZar(0)} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <EscrowBalanceWidget />
        {assigned[0] && <MilestoneTracker projectId={assigned[0].id} />}
      </div>

      <div className="mt-6">
        <BuilderVoucherWallet />
      </div>

      <Section title="My active projects" projects={assigned} isLoading={isLoading} empty="No assigned projects yet." />
      <Section title="Open opportunities in KZN" projects={open} isLoading={isLoading} empty="No open projects right now." />
    </AppShell>
  );
}

function BuilderVoucherWallet() {
  const { user } = useAuth();
  if (!user) return null;
  return <VoucherWallet userId={user.id} />;
}

function Metric({ icon: Icon, label, value }: { icon: typeof HardHat; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" /> {label}
      </div>
      <div className="mt-3 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}

function Section({
  title,
  projects,
  isLoading,
  empty,
}: {
  title: string;
  projects: Array<{ id: string; title: string; tier: number; kzn_region: string; status: string; budget_cents: number }>;
  isLoading: boolean;
  empty: string;
}) {
  return (
    <div className="mt-10">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="mt-4 rounded-xl border border-border bg-card">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">{empty}</div>
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
