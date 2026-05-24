import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, CheckCircle2, Circle, Ticket, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatZar, centsToZar, zarToCents } from "@/lib/format";
import { generateVoucherCode, formatVoucherCode } from "@/lib/voucher";

export const Route = createFileRoute("/_authenticated/dashboard/projects/$projectId")({
  component: ProjectDetail,
});

function ProjectDetail() {
  const { projectId } = Route.useParams();
  const qc = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects").select("*").eq("id", projectId).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: milestones = [] } = useQuery({
    queryKey: ["milestones", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("milestones").select("*")
        .eq("project_id", projectId).order("ordinal");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: vouchers = [] } = useQuery({
    queryKey: ["vouchers", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vouchers").select("*")
        .eq("project_id", projectId).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return null;
      const { data: roles } = await supabase
        .from("user_roles").select("role").eq("user_id", data.user.id);
      return { userId: data.user.id, roles: (roles ?? []).map((r) => r.role) };
    },
  });

  const isOwner = !!project && !!me && project.owner_id === me.userId;
  const isBuilder = !!project && !!me && project.builder_id === me.userId;
  const isProfessional = !!me && me.roles.includes("professional");
  const isAdmin = !!me && me.roles.includes("admin");

  const approveMilestone = useMutation({
    mutationFn: async (args: { milestoneId: string; field: "qs_approved" | "engineer_approved" }) => {
      const m = milestones.find((x) => x.id === args.milestoneId);
      if (!m) throw new Error("Not found");
      const qs = args.field === "qs_approved" ? true : m.qs_approved;
      const eng = args.field === "engineer_approved" ? true : m.engineer_approved;
      const status: "approved" | "awaiting_signoff" = qs && eng ? "approved" : "awaiting_signoff";
      const { error } = await supabase
        .from("milestones")
        .update({ [args.field]: true, status })
        .eq("id", args.milestoneId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["milestones", projectId] });
      toast.success("Milestone updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell role={null} nav={[]}>
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      {isLoading || !project ? (
        <div className="mt-8 text-sm text-muted-foreground">Loading project...</div>
      ) : (
        <div className="mt-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold">{project.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Tier {project.tier} · {project.kzn_region} · <span className="uppercase">{project.status}</span>
              </p>
            </div>
            <Badge variant="outline" className="border-primary/40 text-primary">
              TradeSafe ID: {project.tradesafe_id ?? "mock-pending"}
            </Badge>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat label="Project value" value={formatZar(centsToZar(project.budget_cents))} />
            <Stat label="Client fee" value={formatZar(centsToZar(project.client_fee_cents))} />
            <Stat label="Builder fee" value={formatZar(centsToZar(project.builder_fee_cents))} />
          </div>

          {project.description && (
            <div className="mt-6 rounded-xl border border-border bg-card p-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Scope</div>
              <p className="mt-2 text-sm">{project.description}</p>
            </div>
          )}

          {/* MILESTONES */}
          <section className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Milestones</h2>
              {isOwner && (
                <NewMilestoneDialog projectId={projectId} nextOrdinal={(milestones.at(-1)?.ordinal ?? 0) + 1} />
              )}
            </div>
            <div className="mt-4 rounded-xl border border-border bg-card">
              {milestones.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No milestones yet. {isOwner && "Add the first one to lock funds in TradeSafe escrow."}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {milestones.map((m) => (
                    <div key={m.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                      <div className="flex items-start gap-3">
                        {m.status === "approved" ? (
                          <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                        ) : (
                          <Circle className="mt-1 h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <div className="font-display font-semibold">
                            {m.ordinal}. {m.title}
                          </div>
                          {m.description && (
                            <div className="mt-1 text-xs text-muted-foreground">{m.description}</div>
                          )}
                          <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase">
                            <Badge variant={m.qs_approved ? "default" : "outline"}>
                              QS {m.qs_approved ? "✓" : "pending"}
                            </Badge>
                            <Badge variant={m.engineer_approved ? "default" : "outline"}>
                              Engineer {m.engineer_approved ? "✓" : "pending"}
                            </Badge>
                            <Badge variant="outline">{m.status}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="font-display text-lg">
                          {formatZar(centsToZar(m.payout_amount_cents))}
                        </div>
                        {(isProfessional || isAdmin) && m.status !== "approved" && (
                          <div className="flex gap-2">
                            {!m.qs_approved && (
                              <Button size="sm" variant="outline"
                                onClick={() => approveMilestone.mutate({ milestoneId: m.id, field: "qs_approved" })}>
                                Sign as QS
                              </Button>
                            )}
                            {!m.engineer_approved && (
                              <Button size="sm" variant="outline"
                                onClick={() => approveMilestone.mutate({ milestoneId: m.id, field: "engineer_approved" })}>
                                Sign as Engineer
                              </Button>
                            )}
                          </div>
                        )}
                        {isBuilder && m.status === "pending" && (
                          <Button size="sm" variant="outline"
                            onClick={async () => {
                              await supabase.from("milestones")
                                .update({ status: "awaiting_signoff" }).eq("id", m.id);
                              qc.invalidateQueries({ queryKey: ["milestones", projectId] });
                              toast.success("Submitted for sign-off");
                            }}>
                            Submit for sign-off
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* VOUCHERS */}
          {project.contractor_supplies_material === false && (
            <section className="mt-10">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Supplier vouchers</h2>
                {(isOwner || isBuilder) && (
                  <NewVoucherDialog projectId={projectId} />
                )}
              </div>
              <div className="mt-4 rounded-xl border border-border bg-card">
                {vouchers.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No vouchers issued. Issue closed-loop vouchers redeemable at KZN suppliers.
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {vouchers.map((v) => (
                      <div key={v.id} className="flex items-center justify-between p-5">
                        <div className="flex items-center gap-3">
                          <Ticket className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-mono text-sm font-semibold">
                              {formatVoucherCode(v.voucher_code)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {v.is_redeemed ? `Redeemed ${new Date(v.redeemed_at!).toLocaleDateString()}` : "Active"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-display text-lg">{formatZar(centsToZar(v.value_cents))}</div>
                          <Badge variant={v.is_redeemed ? "outline" : "default"}>
                            {v.is_redeemed ? "Redeemed" : "Active"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      )}
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}

function NewMilestoneDialog({ projectId, nextOrdinal }: { projectId: string; nextOrdinal: number }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const m = useMutation({
    mutationFn: async () => {
      const cents = zarToCents(parseFloat(amount));
      if (!title || !cents) throw new Error("Title and amount required");
      const { error } = await supabase.from("milestones").insert({
        project_id: projectId,
        title, description: description || null,
        payout_amount_cents: cents,
        ordinal: nextOrdinal,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["milestones", projectId] });
      toast.success("Milestone added");
      setOpen(false); setTitle(""); setDescription(""); setAmount("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-gradient-amber text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Add milestone
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>New milestone</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Foundation slab" /></div>
          <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div><Label>Payout amount (ZAR)</Label><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="50000" /></div>
        </div>
        <DialogFooter>
          <Button onClick={() => m.mutate()} disabled={m.isPending} className="bg-gradient-amber text-primary-foreground">
            {m.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Lock in escrow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewVoucherDialog({ projectId }: { projectId: string }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const m = useMutation({
    mutationFn: async () => {
      const cents = zarToCents(parseFloat(amount));
      if (!cents) throw new Error("Amount required");
      const { error } = await supabase.from("vouchers").insert({
        project_id: projectId,
        value_cents: cents,
        voucher_code: generateVoucherCode(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vouchers", projectId] });
      toast.success("Voucher issued");
      setOpen(false); setAmount("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-gradient-amber text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Issue voucher
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Issue supplier voucher</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Value (ZAR)</Label><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="10000" /></div>
          <p className="text-xs text-muted-foreground">
            Generates a unique 12-character code redeemable only at registered KZN suppliers.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={() => m.mutate()} disabled={m.isPending} className="bg-gradient-amber text-primary-foreground">
            {m.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
