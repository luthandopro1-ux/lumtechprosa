import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Truck, ShieldCheck, Check, X, Pause } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { categoryLabel } from "@/lib/supplier-categories";

export const Route = createFileRoute("/_authenticated/dashboard/admin-suppliers")({
  component: AdminSuppliers,
  head: () => ({ meta: [{ title: "Supplier Approvals · Admin" }] }),
});

const NAV = [
  { to: "/dashboard/admin", label: "Overview", icon: ShieldCheck },
  { to: "/dashboard/admin-suppliers", label: "Suppliers", icon: Truck },
];

type Supplier = Record<string, unknown> & { id: string };

function AdminSuppliers() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"pending" | "approved" | "suspended" | "rejected" | "all">("pending");

  const { data: suppliers = [] } = useQuery({
    queryKey: ["admin", "suppliers", filter],
    queryFn: async () => {
      let q = supabase.from("suppliers" as never).select("*").order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as Supplier[];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: string; reason?: string }) => {
      const { data: u } = await supabase.auth.getUser();
      const patch: Record<string, unknown> = { status };
      if (status === "approved") patch.approved_by = u.user?.id;
      if (reason) patch.rejection_reason = reason;
      const { error } = await supabase.from("suppliers" as never).update(patch).eq("id", id);
      if (error) throw error;
      // audit log
      await supabase.from("admin_audit_log" as never).insert({
        actor_id: u.user?.id,
        action: `supplier:${status}`,
        target_table: "suppliers",
        target_id: id,
        payload: { reason: reason ?? null },
      });
    },
    onSuccess: () => {
      toast.success("Updated");
      qc.invalidateQueries({ queryKey: ["admin", "suppliers"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell role="admin" nav={NAV}>
      <Link to="/dashboard/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to overview
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">Supplier Approvals</h1>
      <p className="mt-1 text-sm text-muted-foreground">Review onboarded suppliers and issue vouchers.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["pending", "approved", "suspended", "rejected", "all"] as const).map((f) => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
            {f}
          </Button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {suppliers.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No suppliers in this state.
          </div>
        )}
        {suppliers.map((s) => {
          const cats = (s.categories as string[]) ?? [];
          return (
            <div key={s.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="font-display text-lg font-semibold">{s.company_name as string}</div>
                  <div className="text-xs text-muted-foreground">
                    Reg {(s.registration_no as string) || "—"} · Tax {(s.tax_no as string) || "—"} · {(s.contact_email as string) || "—"}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {cats.map((c) => (
                      <Badge key={c} variant="outline" className="text-xs">{categoryLabel(c)}</Badge>
                    ))}
                  </div>
                  {s.voucher_code != null && (
                    <div className="mt-2 font-mono text-xs text-primary">{s.voucher_code as string}</div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={s.status === "approved" ? "default" : "outline"}>{s.status as string}</Badge>
                  <div className="flex gap-2">
                    {s.status !== "approved" && (
                      <Button size="sm" onClick={() => update.mutate({ id: s.id, status: "approved" })}>
                        <Check className="mr-1 h-3.5 w-3.5" /> Approve
                      </Button>
                    )}
                    {s.status !== "suspended" && (
                      <Button size="sm" variant="outline" onClick={() => update.mutate({ id: s.id, status: "suspended" })}>
                        <Pause className="mr-1 h-3.5 w-3.5" /> Suspend
                      </Button>
                    )}
                    {s.status !== "rejected" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          const reason = window.prompt("Rejection reason?") ?? "";
                          if (reason) update.mutate({ id: s.id, status: "rejected", reason });
                        }}
                      >
                        <X className="mr-1 h-3.5 w-3.5" /> Reject
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
