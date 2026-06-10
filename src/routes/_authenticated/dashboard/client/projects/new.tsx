import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { computeBreakdown } from "@/lib/tiers";
import { SA_PROVINCES, SA_REGIONS, type SaProvince } from "@/lib/sa-regions";
import { formatZar, zarToCents } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard/client/projects/new")({
  component: NewProjectWizard,
  head: () => ({ meta: [{ title: "New project · Lum Tech Pro SA" }] }),
});

const NAV = [
  { to: "/dashboard/client", label: "Overview", icon: ShieldCheck },
];

function NewProjectWizard() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [useInhouse, setUseInhouse] = useState(false);

  const budgetNum = Number(budget) || 0;
  const breakdown = useMemo(
    () =>
      computeBreakdown({
        budgetZar: budgetNum,
        useInhouseProfessionals: useInhouse,
      }),
    [budgetNum, useInhouse],
  );

  const create = useMutation({
    mutationFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("projects")
        .insert({
          owner_id: userData.user.id,
          title,
          description,
          budget_cents: zarToCents(budgetNum),
          tier: breakdown.tier,
          contractor_supplies_material: breakdown.contractorSuppliesMaterial,
          use_inhouse_professionals: useInhouse,
          client_fee_cents: zarToCents(breakdown.clientFee),
          builder_fee_cents: zarToCents(breakdown.builderFee),
          professional_fee_cents: zarToCents(breakdown.professionalFee),
          kzn_region: region,
          status: "draft",
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Project created!");
      navigate({ to: "/dashboard/client" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const canSubmit = title && budgetNum > 0 && region;

  return (
    <AppShell role="client" nav={NAV}>
      <Link
        to="/dashboard/client"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">Create a project</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Tier, commission and escrow deposit calculate automatically as you type.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6 rounded-xl border border-border bg-card p-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project title</Label>
            <Input
              id="title"
              placeholder="3-bedroom extension, Umhlanga"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Scope description</Label>
            <Textarea
              id="desc"
              rows={4}
              placeholder="Brief description of works"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="budget">Total project value (ZAR)</Label>
              <Input
                id="budget"
                type="number"
                min={0}
                placeholder="500000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>KZN region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select municipality" />
                </SelectTrigger>
                <SelectContent>
                  {KZN_MUNICIPALITIES.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background p-4 transition hover:border-primary/40">
            <Checkbox
              checked={useInhouse}
              onCheckedChange={(v) => setUseInhouse(Boolean(v))}
              className="mt-0.5"
            />
            <div>
              <div className="text-sm font-semibold">In-House Professional Site Supervision</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Add Lum Tech Pro SA's Land Surveyor, Structural Engineer and Quantity
                Surveyor team for hands-on site management. Flat fee: <span className="text-primary">+5%</span> of project value, billed to client.
              </p>
            </div>
          </label>
          <Button
            disabled={!canSubmit || create.isPending}
            onClick={() => create.mutate()}
            className="w-full bg-gradient-amber text-primary-foreground"
            size="lg"
          >
            {create.isPending ? "Creating..." : "Create project"}
          </Button>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-primary/40 bg-card p-6 shadow-glow">
            <div className="text-xs uppercase tracking-wider text-primary">Calculated</div>
            <div className="mt-2 font-display text-xl font-bold">{breakdown.tierLabel}</div>
            <p className="mt-2 text-xs text-muted-foreground">{breakdown.workflow}</p>
            <div className="mt-6 space-y-3 border-t border-border pt-4 text-sm">
              <Row label="Project value" value={formatZar(budgetNum)} />
              <Row
                label={`Platform fee (${breakdown.builderPct}%) — deducted from contractor payout`}
                value={formatZar(breakdown.builderFee)}
                muted
              />
              {breakdown.professionalPct > 0 && (
                <Row
                  label={`In-house pros (${breakdown.professionalPct}%)`}
                  value={formatZar(breakdown.professionalFee)}
                />
              )}
              <div className="my-3 h-px bg-border" />
              <Row
                label="Total escrow deposit (client funds)"
                value={formatZar(breakdown.totalEscrow)}
                bold
              />
              <Row
                label="Contractor net payout"
                value={formatZar(breakdown.contractorNet)}
              />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card/50 p-4 text-xs text-muted-foreground">
            All commission splits follow Lum Tech Pro SA tier rules. Total escrow is
            what the client funds; builder fee is deducted at milestone payouts.
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Row({
  label,
  value,
  bold,
  muted,
}: {
  label: string;
  value: string;
  bold?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-muted-foreground" : ""}>{label}</span>
      <span className={`font-display ${bold ? "text-lg font-bold text-primary" : "font-semibold"}`}>
        {value}
      </span>
    </div>
  );
}
