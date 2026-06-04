import { useQuery } from "@tanstack/react-query";
import { Ticket, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatZar, centsToZar } from "@/lib/format";
import { formatVoucherCode } from "@/lib/voucher";

export function VoucherWallet({ userId }: { userId?: string }) {
  const { data: vouchers = [], isLoading } = useQuery({
    queryKey: ["voucher_wallet", userId ?? "me"],
    queryFn: async () => {
      let q = supabase
        .from("vouchers")
        .select("id, voucher_code, value_cents, is_redeemed, redeemed_at, created_at, supplier_id, project_id")
        .order("created_at", { ascending: false });
      if (userId) q = q.eq("supplier_id", userId);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  const available = vouchers.filter((v) => !v.is_redeemed);
  const totalValue = available.reduce((s, v) => s + centsToZar(v.value_cents), 0);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ticket className="h-4 w-4 text-primary" />
          <h3 className="font-display text-lg font-semibold">Voucher wallet</h3>
        </div>
        <div className="text-right">
          <div className="font-display text-xl font-bold">{formatZar(totalValue)}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{available.length} available</div>
        </div>
      </div>

      {isLoading ? (
        <p className="mt-4 text-sm text-muted-foreground">Loading vouchers…</p>
      ) : vouchers.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No vouchers yet.</p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {vouchers.map((v) => (
            <VoucherCard key={v.id} voucher={v} />
          ))}
        </div>
      )}
    </div>
  );
}

function VoucherCard({ voucher }: { voucher: { id: string; voucher_code: string; value_cents: number; is_redeemed: boolean; redeemed_at: string | null; created_at: string } }) {
  const [copied, setCopied] = useState(false);
  const formatted = formatVoucherCode(voucher.voucher_code);

  async function copy() {
    await navigator.clipboard.writeText(voucher.voucher_code);
    setCopied(true);
    toast.success("Voucher code copied");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={`rounded-lg border border-border p-4 ${voucher.is_redeemed ? "bg-muted/30 opacity-70" : "bg-background"}`}>
      <div className="flex items-center justify-between">
        <span className="font-display text-lg font-bold">{formatZar(centsToZar(voucher.value_cents))}</span>
        {voucher.is_redeemed ? (
          <Badge variant="secondary">Redeemed</Badge>
        ) : (
          <Badge>Available</Badge>
        )}
      </div>
      <div className="mt-3 font-mono text-sm tracking-wider">{formatted}</div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {voucher.is_redeemed && voucher.redeemed_at
            ? `Redeemed ${new Date(voucher.redeemed_at).toLocaleDateString()}`
            : `Issued ${new Date(voucher.created_at).toLocaleDateString()}`}
        </span>
        {!voucher.is_redeemed && (
          <Button variant="ghost" size="sm" onClick={copy} className="h-7 px-2">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        )}
      </div>
    </div>
  );
}
