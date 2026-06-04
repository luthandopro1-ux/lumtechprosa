import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ticket, Loader2, QrCode, Truck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatZar, centsToZar } from "@/lib/format";
import { formatVoucherCode } from "@/lib/voucher";

export const Route = createFileRoute("/_authenticated/dashboard/supplier")({
  component: SupplierDashboard,
  head: () => ({ meta: [{ title: "Supplier Portal · Lum Tech Pro SA" }] }),
});

const NAV = [
  { to: "/dashboard/supplier", label: "Voucher portal", icon: QrCode },
  { to: "/dashboard/supplier-onboarding", label: "Onboarding", icon: Truck },
];

function SupplierDashboard() {
  const qc = useQueryClient();
  const [code, setCode] = useState("");

  const { data: redeemed = [] } = useQuery({
    queryKey: ["vouchers", "supplier", "redeemed"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data } = await supabase
        .from("vouchers").select("*")
        .eq("supplier_id", u.user.id)
        .order("redeemed_at", { ascending: false });
      return data ?? [];
    },
  });

  const redeem = useMutation({
    mutationFn: async () => {
      const clean = code.replace(/-/g, "").toUpperCase();
      if (clean.length !== 12) throw new Error("Voucher must be 12 characters");
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const { data: voucher, error: fetchErr } = await supabase
        .from("vouchers").select("*").eq("voucher_code", clean).maybeSingle();
      if (fetchErr) throw fetchErr;
      if (!voucher) throw new Error("Voucher not found");
      if (voucher.is_redeemed) throw new Error("Voucher already redeemed");
      const { error } = await supabase.from("vouchers")
        .update({ is_redeemed: true, redeemed_at: new Date().toISOString(), supplier_id: u.user.id })
        .eq("id", voucher.id);
      if (error) throw error;
      return voucher;
    },
    onSuccess: (v) => {
      toast.success(`Redeemed ${formatZar(centsToZar(v.value_cents))}`);
      qc.invalidateQueries({ queryKey: ["vouchers"] });
      setCode("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const total = redeemed.reduce((s, v) => s + centsToZar(v.value_cents), 0);

  return (
    <AppShell role="supplier" nav={NAV}>
      <h1 className="font-display text-3xl font-bold tracking-tight">Supplier Portal</h1>
      <p className="mt-1 text-sm text-muted-foreground">Redeem closed-loop construction vouchers.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <QrCode className="h-4 w-4 text-primary" /> Redeem voucher
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <Label>12-character voucher code</Label>
              <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ABCD-EFGH-JKLM" className="font-mono uppercase tracking-wider" />
            </div>
            <Button onClick={() => redeem.mutate()} disabled={redeem.isPending}
              className="w-full bg-gradient-amber text-primary-foreground">
              {redeem.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Redeem
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Total redeemed</div>
          <div className="mt-3 font-display text-4xl font-bold">{formatZar(total)}</div>
          <div className="mt-1 text-xs text-muted-foreground">{redeemed.length} vouchers</div>
        </div>
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold">Redemption history</h2>
      <div className="mt-4 rounded-xl border border-border bg-card">
        {redeemed.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No vouchers redeemed yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {redeemed.map((v) => (
              <div key={v.id} className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <Ticket className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-mono text-sm font-semibold">{formatVoucherCode(v.voucher_code)}</div>
                    <div className="text-xs text-muted-foreground">
                      Redeemed {v.redeemed_at ? new Date(v.redeemed_at).toLocaleString() : "—"}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg">{formatZar(centsToZar(v.value_cents))}</div>
                  <Badge variant="outline">Redeemed</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
