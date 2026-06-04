import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Truck, ShieldCheck, Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { SUPPLIER_CATEGORIES, type SupplierCategoryValue } from "@/lib/supplier-categories";

export const Route = createFileRoute("/_authenticated/dashboard/supplier-onboarding")({
  component: SupplierOnboarding,
  head: () => ({ meta: [{ title: "Supplier Onboarding · Lum Tech Pro SA" }] }),
});

const NAV = [
  { to: "/dashboard/supplier", label: "Voucher portal", icon: ShieldCheck },
  { to: "/dashboard/supplier-onboarding", label: "Onboarding", icon: Truck },
];

function SupplierOnboarding() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company_name: "",
    registration_no: "",
    tax_no: "",
    contact_phone: "",
    contact_email: "",
    physical_address: "",
    banking_account_holder: "",
    banking_bank: "",
    banking_account_no: "",
    banking_branch_code: "",
    categories: [] as SupplierCategoryValue[],
    agreement_signed: false,
  });

  const { data: existing, isLoading } = useQuery({
    queryKey: ["supplier", "me"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase
        .from("suppliers")
        .select("*")
        .eq("user_id", u.user.id)
        .maybeSingle();
      return data as Record<string, unknown> | null;
    },
  });

  useEffect(() => {
    if (existing) {
      setForm((f) => ({
        ...f,
        company_name: (existing.company_name as string) ?? "",
        registration_no: (existing.registration_no as string) ?? "",
        tax_no: (existing.tax_no as string) ?? "",
        contact_phone: (existing.contact_phone as string) ?? "",
        contact_email: (existing.contact_email as string) ?? "",
        physical_address: (existing.physical_address as string) ?? "",
        banking_account_holder: (existing.banking_account_holder as string) ?? "",
        banking_bank: (existing.banking_bank as string) ?? "",
        banking_account_no: (existing.banking_account_no as string) ?? "",
        banking_branch_code: (existing.banking_branch_code as string) ?? "",
        categories: ((existing.categories as SupplierCategoryValue[]) ?? []) as SupplierCategoryValue[],
        agreement_signed: Boolean(existing.agreement_signed),
      }));
    }
  }, [existing]);

  const save = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const payload = { ...form, user_id: u.user.id };
      const { error } = existing
        ? await supabase.from("suppliers").update(payload).eq("user_id", u.user.id)
        : await supabase.from("suppliers").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Supplier profile submitted for review");
      qc.invalidateQueries({ queryKey: ["supplier"] });
      navigate({ to: "/dashboard/supplier" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleCat = (v: SupplierCategoryValue) =>
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(v) ? f.categories.filter((c) => c !== v) : [...f.categories, v],
    }));

  const canSubmit =
    form.company_name &&
    form.contact_email &&
    form.banking_account_no &&
    form.categories.length > 0 &&
    form.agreement_signed;

  const status = existing?.status as string | undefined;

  return (
    <AppShell role="supplier" nav={NAV}>
      <Link
        to="/dashboard/supplier"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to portal
      </Link>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Supplier Onboarding</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete this once to receive your Lum Tech Pro SA Supplier Voucher.
          </p>
        </div>
        {status && <StatusBadge status={status} />}
      </div>

      {existing?.voucher_code && (
        <div className="mt-6 rounded-xl border border-primary/40 bg-card p-6 shadow-glow">
          <div className="text-xs uppercase tracking-wider text-primary">Issued voucher</div>
          <div className="mt-2 font-mono text-2xl font-bold tracking-wider">
            {existing.voucher_code as string}
          </div>
          {existing.voucher_expires_at != null && (
            <div className="mt-1 text-xs text-muted-foreground">
              Expires {new Date(existing.voucher_expires_at as string).toLocaleDateString()}
            </div>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="mt-8 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : (
        <div className="mt-8 space-y-8 rounded-xl border border-border bg-card p-6">
          <Section title="Company">
            <Field label="Company name" value={form.company_name} onChange={(v) => setForm((f) => ({ ...f, company_name: v }))} />
            <Field label="Company registration no." value={form.registration_no} onChange={(v) => setForm((f) => ({ ...f, registration_no: v }))} />
            <Field label="Tax / VAT no." value={form.tax_no} onChange={(v) => setForm((f) => ({ ...f, tax_no: v }))} />
            <Field label="Contact phone" value={form.contact_phone} onChange={(v) => setForm((f) => ({ ...f, contact_phone: v }))} />
            <Field label="Contact email" type="email" value={form.contact_email} onChange={(v) => setForm((f) => ({ ...f, contact_email: v }))} />
            <div className="space-y-2 md:col-span-2">
              <Label>Physical address</Label>
              <Textarea value={form.physical_address} onChange={(e) => setForm((f) => ({ ...f, physical_address: e.target.value }))} rows={2} />
            </div>
          </Section>

          <Section title="Banking">
            <Field label="Account holder" value={form.banking_account_holder} onChange={(v) => setForm((f) => ({ ...f, banking_account_holder: v }))} />
            <Field label="Bank" value={form.banking_bank} onChange={(v) => setForm((f) => ({ ...f, banking_bank: v }))} />
            <Field label="Account number" value={form.banking_account_no} onChange={(v) => setForm((f) => ({ ...f, banking_account_no: v }))} />
            <Field label="Branch code" value={form.banking_branch_code} onChange={(v) => setForm((f) => ({ ...f, banking_branch_code: v }))} />
          </Section>

          <Section title="Categories (select all that apply)" cols={1}>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {SUPPLIER_CATEGORIES.map((c) => (
                <label key={c.value} className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background p-2 text-sm">
                  <Checkbox checked={form.categories.includes(c.value)} onCheckedChange={() => toggleCat(c.value)} />
                  {c.label}
                </label>
              ))}
            </div>
          </Section>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background p-4">
            <Checkbox checked={form.agreement_signed} onCheckedChange={(v) => setForm((f) => ({ ...f, agreement_signed: Boolean(v) }))} className="mt-0.5" />
            <div className="text-sm">
              <div className="font-semibold">I agree to the Lum Tech Pro SA Supplier Agreement</div>
              <p className="mt-1 text-xs text-muted-foreground">
                I confirm my company will accept Lum Tech Pro SA closed-loop vouchers at the counter and abide by
                platform compliance, pricing transparency and delivery commitments.
              </p>
            </div>
          </label>

          <Button
            onClick={() => save.mutate()}
            disabled={!canSubmit || save.isPending}
            size="lg"
            className="w-full bg-gradient-amber text-primary-foreground"
          >
            {save.isPending ? "Submitting…" : existing ? "Update profile" : "Submit for review"}
          </Button>
        </div>
      )}
    </AppShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: "default" | "outline" | "destructive" | "secondary" }> = {
    pending: { label: "Pending review", variant: "outline" },
    approved: { label: "Approved", variant: "default" },
    suspended: { label: "Suspended", variant: "destructive" },
    rejected: { label: "Rejected", variant: "destructive" },
  };
  const cfg = map[status] ?? { label: status, variant: "outline" as const };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

function Section({ title, children, cols = 2 }: { title: string; children: React.ReactNode; cols?: 1 | 2 }) {
  return (
    <div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <div className={`mt-4 grid gap-4 ${cols === 2 ? "md:grid-cols-2" : ""}`}>{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
