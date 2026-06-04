import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, FileText, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { formatZar } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard/boq-request/$projectId")({
  component: BoqRequest,
  head: () => ({ meta: [{ title: "Request BOQ · Lum Tech Pro SA" }] }),
});

const NAV = [{ to: "/dashboard/client", label: "Overview", icon: ShieldCheck }];

const OPTIONS = [
  {
    type: "preliminary" as const,
    fee: 150_000, // cents
    title: "Preliminary BOQ Assessment",
    feeLabel: "R1,500",
    points: [
      "Initial project assessment",
      "AI-assisted quantity estimation",
      "Preliminary BOQ generation",
      "Scope validation & project classification",
      "Bid-ready project listing",
    ],
  },
  {
    type: "detailed" as const,
    fee: 750_000, // cents
    title: "Detailed BOQ & Planning Package",
    feeLabel: "R7,500",
    points: [
      "Detailed BOQ with quantity calculations",
      "Material + labour schedule",
      "Cost analysis & procurement plan",
      "Tender package + PDF reports",
      "Professional QS review",
    ],
  },
];

function BoqRequest() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<"preliminary" | "detailed" | null>(null);
  const [notes, setNotes] = useState("");

  const submit = useMutation({
    mutationFn: async () => {
      if (!selected) throw new Error("Pick a service");
      const opt = OPTIONS.find((o) => o.type === selected)!;
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const { error } = await supabase.from("boq_requests").insert({
        project_id: projectId,
        requested_by: u.user.id,
        service_type: selected,
        fee_cents: opt.fee,
        notes,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("BOQ request submitted. Fund the escrow to proceed.");
      navigate({ to: "/dashboard/client" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell role="client" nav={NAV}>
      <Link to="/dashboard/client" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <div className="mt-4 flex items-center gap-3">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="font-display text-3xl font-bold tracking-tight">Request BOQ Service</h1>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose preliminary or detailed BOQ. Fee is paid into escrow (non-refundable) and released on delivery.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {OPTIONS.map((o) => {
          const active = selected === o.type;
          return (
            <button
              key={o.type}
              type="button"
              onClick={() => setSelected(o.type)}
              className={`rounded-xl border p-6 text-left transition ${
                active ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className="text-xs uppercase tracking-wider text-primary">{o.feeLabel}</div>
              <div className="mt-1 font-display text-lg font-semibold">{o.title}</div>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {o.points.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
              <div className="mt-4 font-display text-2xl font-bold">{formatZar(o.fee / 100)}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-2">
        <label className="text-sm font-medium">Notes for the QS team (optional)</label>
        <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Site access, deadlines, special requirements…" />
      </div>

      <Button
        onClick={() => submit.mutate()}
        disabled={!selected || submit.isPending}
        size="lg"
        className="mt-6 bg-gradient-amber text-primary-foreground"
      >
        {submit.isPending ? "Submitting…" : "Submit request"}
      </Button>
    </AppShell>
  );
}
