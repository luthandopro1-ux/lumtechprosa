import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, FileText, ShieldCheck, Truck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatZar, centsToZar } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard/admin-boq")({
  component: AdminBoq,
  head: () => ({ meta: [{ title: "BOQ Queue · Admin" }] }),
});

import { ADMIN_NAV } from "@/lib/admin-nav";
const NAV = ADMIN_NAV;

type Boq = Record<string, unknown> & { id: string };

const NEXT_STATUS: Record<string, string> = {
  pending_payment: "paid",
  paid: "in_review",
  in_review: "delivered",
};

function AdminBoq() {
  const qc = useQueryClient();

  const { data: rows = [] } = useQuery({
    queryKey: ["admin", "boq"],
    queryFn: async () => {
      const { data } = await supabase
        .from("boq_requests")
        .select("*")
        .order("created_at", { ascending: false });
      return (data ?? []) as unknown as Boq[];
    },
  });

  const advance = useMutation({
    mutationFn: async (row: Boq) => {
      const next = NEXT_STATUS[row.status as string] as "paid" | "in_review" | "delivered" | undefined;
      if (!next) return;
      const patch: {
        status: "paid" | "in_review" | "delivered";
        paid_at?: string;
        delivered_at?: string;
      } = { status: next };
      if (next === "paid") patch.paid_at = new Date().toISOString();
      if (next === "delivered") patch.delivered_at = new Date().toISOString();
      const { error } = await supabase.from("boq_requests").update(patch).eq("id", row.id);
      if (error) throw error;

      if (next === "paid" && typeof row.project_id === "string") {
        await supabase.from("escrow_ledger").insert({
          project_id: row.project_id,
          boq_request_id: row.id,
          entry_type: "boq_fee",
          amount_cents: row.fee_cents as number,
          memo: `BOQ ${row.service_type as string} fee paid`,
        });
      }
    },
    onSuccess: () => {
      toast.success("Updated");
      qc.invalidateQueries({ queryKey: ["admin", "boq"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell role="admin" nav={NAV}>
      <Link to="/dashboard/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to overview
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">BOQ Service Queue</h1>
      <p className="mt-1 text-sm text-muted-foreground">Preliminary (R1,500) and Detailed (R7,500) BOQ requests.</p>

      <div className="mt-6 space-y-3">
        {rows.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No BOQ requests yet.
          </div>
        )}
        {rows.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="font-display text-lg font-semibold">
                  {(r.service_type as string) === "detailed" ? "Detailed BOQ & Planning" : "Preliminary BOQ Assessment"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Project {(r.project_id as string).slice(0, 8)} · Fee {formatZar(centsToZar(r.fee_cents as number))}
                </div>
                {r.notes != null && <p className="mt-2 text-sm">{r.notes as string}</p>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="outline">{(r.status as string).replace("_", " ")}</Badge>
                {NEXT_STATUS[r.status as string] && (
                  <Button size="sm" onClick={() => advance.mutate(r)} disabled={advance.isPending}>
                    Advance → {NEXT_STATUS[r.status as string].replace("_", " ")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
