import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { formatZar, centsToZar } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard/projects/$projectId")({
  component: ProjectDetail,
});

function ProjectDetail() {
  const { projectId } = Route.useParams();
  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  return (
    <AppShell role={null} nav={[]}>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      {isLoading || !project ? (
        <div className="mt-8 text-sm text-muted-foreground">Loading project...</div>
      ) : (
        <div className="mt-4">
          <h1 className="font-display text-3xl font-bold">{project.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tier {project.tier} · {project.kzn_region} · {project.status}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat label="Project value" value={formatZar(centsToZar(project.budget_cents))} />
            <Stat label="Client fee" value={formatZar(centsToZar(project.client_fee_cents))} />
            <Stat label="Builder fee" value={formatZar(centsToZar(project.builder_fee_cents))} />
          </div>
          {project.description && (
            <div className="mt-8 rounded-xl border border-border bg-card p-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Scope</div>
              <p className="mt-2 text-sm">{project.description}</p>
            </div>
          )}
          <div className="mt-8 rounded-xl border border-dashed border-border bg-card/40 p-8 text-center text-sm text-muted-foreground">
            Milestones, vouchers and proof-of-work uploads land here in Phase 3.
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}
