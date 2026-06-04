import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatZar, centsToZar } from "@/lib/format";

export function EscrowBalanceWidget({ projectId }: { projectId?: string }) {
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["escrow_ledger", projectId ?? "all"],
    queryFn: async () => {
      let q = supabase
        .from("escrow_ledger")
        .select("id, project_id, entry_type, amount_cents, memo, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      if (projectId) q = q.eq("project_id", projectId);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  const balance = entries.reduce((sum, e) => {
    const sign = e.entry_type === "deposit" ? 1 : -1;
    return sum + sign * centsToZar(e.amount_cents);
  }, 0);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-primary" /> Escrow balance
      </div>
      <div className="mt-3 font-display text-3xl font-bold">{formatZar(balance)}</div>
      <p className="mt-1 text-xs text-muted-foreground">
        {projectId ? "This project" : "Across all your projects"}
      </p>

      <div className="mt-5 space-y-2">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Recent activity</div>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No escrow movements yet.</p>
        ) : (
          entries.slice(0, 5).map((e) => {
            const isDeposit = e.entry_type === "deposit";
            const Icon = isDeposit ? ArrowDownCircle : ArrowUpCircle;
            return (
              <div key={e.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2 truncate">
                  <Icon className={`h-4 w-4 ${isDeposit ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="truncate">{e.memo ?? e.entry_type}</span>
                </div>
                <span className="tabular-nums">
                  {isDeposit ? "+" : "−"}
                  {formatZar(centsToZar(e.amount_cents))}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
