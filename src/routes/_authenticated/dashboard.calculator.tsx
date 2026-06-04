import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { computeBreakdown } from "@/lib/tiers";
import { formatZar } from "@/lib/format";
import { ShieldCheck, HardHat, Calculator } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/calculator")({
  head: () => ({
    meta: [
      { title: "Fee & Escrow Calculator · Lum Tech Pro SA" },
      { name: "description", content: "Internal tier & fee calculation engine." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: CalculatorPage,
});

function CalculatorPage() {
  const [budgetInput, setBudgetInput] = useState("250000");
  const [useInhouse, setUseInhouse] = useState(true);
  const [labourOnly, setLabourOnly] = useState(false);
  const [submitted, setSubmitted] = useState<number | null>(250_000);

  const breakdown = useMemo(() => {
    if (submitted == null || submitted <= 0) return null;
    return computeBreakdown({
      budgetZar: submitted,
      useInhouseProfessionals: useInhouse,
      labourOnlyProtection: labourOnly,
    });
  }, [submitted, useInhouse, labourOnly]);

  function onCalculate() {
    const n = parseFloat(budgetInput);
    if (!Number.isFinite(n) || n <= 0) {
      setSubmitted(null);
      return;
    }
    setSubmitted(n);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-gradient-amber shadow-glow">
          <Calculator className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Internal Fee & Escrow Engine</h1>
          <p className="text-sm text-muted-foreground">
            Tier 1 R0–R250k (10%) · Tier 2 R250k–R1.5M (8%) · Tier 3 R1.5M+ (6%). Platform fee
            deducted from contractor payout. Client funds project value into TradeSafe escrow.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project input</CardTitle>
          <CardDescription>Enter the base contractor project cost in ZAR.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="basePrice">Base contractor cost (R)</Label>
            <Input
              id="basePrice"
              type="number"
              min={1}
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="e.g. 250000"
            />
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={useInhouse} onCheckedChange={setUseInhouse} />
              In-house QS / Engineer (+5%)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={labourOnly} onCheckedChange={setLabourOnly} />
              Labour-Only Protection (Tier 3 only)
            </label>
          </div>
          <Button onClick={onCalculate}>Calculate dynamic split</Button>
        </CardContent>
      </Card>

      {breakdown && submitted != null && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <CardTitle>Client private view</CardTitle>
              </div>
              <CardDescription>{breakdown.tierLabel}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Base quote" value={formatZar(submitted)} />
              <Row
                label={`TradeSafe & PM protection (${breakdown.clientPct}%)`}
                value={formatZar(breakdown.clientFee)}
                emphasis="fee"
              />
              {breakdown.professionalPct > 0 && (
                <Row
                  label={`In-house QS / Engineer (${breakdown.professionalPct}%)`}
                  value={formatZar(breakdown.professionalFee)}
                  emphasis="fee"
                />
              )}
              <Separator className="my-2" />
              <Row
                label="Total escrow deposit required"
                value={formatZar(breakdown.totalEscrow)}
                strong
              />
              <p className="mt-3 rounded-md bg-muted p-3 text-xs text-muted-foreground">
                Funds locked in TradeSafe escrow. Released only on in-house QS milestone sign-off.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <HardHat className="h-5 w-5 text-amber-500" />
                <CardTitle>Contractor private view</CardTitle>
              </div>
              <CardDescription>{breakdown.tierLabel}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Submitted bid" value={formatZar(submitted)} />
              <Row
                label={`Platform service deduction (${breakdown.builderPct}%)`}
                value={`- ${formatZar(breakdown.builderFee)}`}
                emphasis="fee"
              />
              <Separator className="my-2" />
              <Row
                label="Guaranteed net payout"
                value={formatZar(submitted - breakdown.builderFee)}
                emphasis="payout"
                strong
              />
              <p className="mt-3 rounded-md bg-muted p-3 text-xs text-muted-foreground">
                Payout legally guaranteed by TradeSafe escrow upon independent QS milestone approval.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                <strong>Workflow:</strong> {breakdown.workflow}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {submitted == null && (
        <p className="text-sm text-destructive">Please enter a valid project cost.</p>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  emphasis,
  strong,
}: {
  label: string;
  value: string;
  emphasis?: "fee" | "payout";
  strong?: boolean;
}) {
  const valueClass =
    emphasis === "fee"
      ? "text-destructive font-semibold"
      : emphasis === "payout"
        ? "text-emerald-500 font-semibold"
        : strong
          ? "font-semibold"
          : "";
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={strong ? "font-medium" : "text-muted-foreground"}>{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
