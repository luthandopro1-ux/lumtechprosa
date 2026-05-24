import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Building2, HardHat, Hammer, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/hooks/use-auth";

export const Route = createFileRoute("/onboarding")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
  },
  component: OnboardingPage,
  head: () => ({ meta: [{ title: "Pick your role · Build Connect SA" }] }),
});

const ROLES: { id: Exclude<AppRole, "admin">; icon: typeof Building2; title: string; body: string }[] = [
  { id: "client", icon: Building2, title: "Client / Employer", body: "I'm funding a construction project and need transparency, escrow, and milestone control." },
  { id: "builder", icon: HardHat, title: "Main Contractor / Builder", body: "I want to win projects, manage milestones, and receive milestone-based escrow releases." },
  { id: "professional", icon: ShieldCheck, title: "Professional (QS / Engineer / Surveyor)", body: "I verify NHBRC-aligned work and authorise escrow releases on site." },
  { id: "supplier", icon: Truck, title: "Material Supplier", body: "I supply building materials in KZN and accept Build Connect SA vouchers at the counter." },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Exclude<AppRole, "admin"> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast.error("Session expired");
      navigate({ to: "/login" });
      return;
    }
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: userData.user.id, role: selected });
    if (error && !error.message.includes("duplicate")) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    toast.success("Role set!");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background py-12 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
            <Hammer className="h-3.5 w-3.5" /> One last step
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold">What brings you to Build Connect SA?</h1>
          <p className="mt-3 text-muted-foreground">Pick the role that fits — you can request additional roles later.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {ROLES.map((r) => {
            const active = selected === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelected(r.id)}
                className={`flex flex-col items-start gap-3 rounded-xl border p-6 text-left transition ${
                  active
                    ? "border-primary bg-primary/10 shadow-glow"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <r.icon className={`h-7 w-7 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <div className="font-display text-lg font-semibold">{r.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleContinue}
            disabled={!selected || loading}
            size="lg"
            className="bg-gradient-amber text-primary-foreground"
          >
            {loading ? "Setting up..." : "Continue to dashboard"}
          </Button>
        </div>
      </div>
    </div>
  );
}
