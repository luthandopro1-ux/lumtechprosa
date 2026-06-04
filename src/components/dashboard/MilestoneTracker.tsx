import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Circle, AlertTriangle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const STATUS_META: Record<string, { label: string; icon: typeof Circle; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  not_started: { label: "Not started", icon: Circle, variant: "outline" },
  in_progress: { label: "In progress", icon: Clock, variant: "secondary" },
  completed: { label: "Completed", icon: CheckCircle2, variant: "default" },
  blocked: { label: "Blocked", icon: AlertTriangle, variant: "destructive" },
};

export function MilestoneTracker({ projectId }: { projectId: string }) {
  const { data: milestones = [], isLoading } = useQuery({
    queryKey: ["project_milestones", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_milestones")
        .select("*")
        .eq("project_id", projectId)
        .order("ordinal");
      if (error) throw error;
      return data ?? [];
    },
  });

  const overall =
    milestones.length === 0
      ? 0
      : Math.round(milestones.reduce((s, m) => s + (m.progress_pct ?? 0), 0) / milestones.length);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Project progress</h3>
        <span className="text-sm text-muted-foreground">{overall}% overall</span>
      </div>
      <Progress value={overall} className="mt-3" />
      <div className="mt-5 space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading milestones…</p>
        ) : milestones.length === 0 ? (
          <p className="text-sm text-muted-foreground">No milestones tracked yet.</p>
        ) : (
          milestones.map((m) => {
            const meta = STATUS_META[m.status] ?? STATUS_META.not_started;
            const Icon = meta.icon;
            return (
              <div key={m.id}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="font-medium">{m.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={meta.variant}>{meta.label}</Badge>
                    <span className="text-xs tabular-nums text-muted-foreground">{m.progress_pct}%</span>
                  </div>
                </div>
                <Progress value={m.progress_pct ?? 0} className="mt-2 h-1.5" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
