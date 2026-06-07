import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useIsAdmin } from "@/hooks/use-is-admin";

export const Route = createFileRoute("/_authenticated/dashboard/admin-disputes")({
  component: AdminDisputes,
  head: () => ({ meta: [{ title: "Admin · Disputes" }] }),
});

const STATUSES = ["open", "investigating", "resolved", "rejected"] as const;
type DisputeStatus = (typeof STATUSES)[number];

const updateSchema = z.object({
  status: z.enum(STATUSES),
  resolution: z.string().trim().max(2000).optional(),
});

function AdminDisputes() {
  const { isAdmin, loading } = useIsAdmin();
  const qc = useQueryClient();

  const { data: disputes = [] } = useQuery({
    queryKey: ["admin", "disputes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("disputes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: isAdmin,
  });

  if (loading) {
    return (
      <AppShell role="admin" nav={ADMIN_NAV}>
        <div className="text-sm text-muted-foreground">Loading…</div>
      </AppShell>
    );
  }
  if (!isAdmin) {
    return (
      <AppShell role="admin" nav={ADMIN_NAV}>
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Admin role required.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role="admin" nav={ADMIN_NAV}>
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="font-display text-3xl font-bold tracking-tight">Disputes</h1>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage project and milestone disputes raised by users.
      </p>

      <div className="mt-8 rounded-xl border border-border bg-card">
        {disputes.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No disputes raised.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {disputes.map((d) => (
              <DisputeRow
                key={d.id}
                dispute={d}
                onSaved={() => qc.invalidateQueries({ queryKey: ["admin", "disputes"] })}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

interface DisputeRecord {
  id: string;
  subject: string;
  description: string;
  status: DisputeStatus;
  resolution: string | null;
  project_id: string | null;
  created_at: string;
}

function DisputeRow({
  dispute,
  onSaved,
}: {
  dispute: DisputeRecord;
  onSaved: () => void;
}) {
  const [status, setStatus] = useState<DisputeStatus>(dispute.status);
  const [resolution, setResolution] = useState(dispute.resolution ?? "");

  const mut = useMutation({
    mutationFn: async () => {
      const parsed = updateSchema.parse({ status, resolution });
      const { data: u } = await supabase.auth.getUser();
      const isResolved = parsed.status === "resolved" || parsed.status === "rejected";
      const { error } = await supabase
        .from("disputes")
        .update({
          status: parsed.status,
          resolution: parsed.resolution || null,
          resolved_by: isResolved ? u.user?.id ?? null : null,
          resolved_at: isResolved ? new Date().toISOString() : null,
        })
        .eq("id", dispute.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Dispute updated");
      onSaved();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-display font-semibold">{dispute.subject}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {new Date(dispute.created_at).toLocaleString()}
            {dispute.project_id && ` · Project ${dispute.project_id.slice(0, 8)}`}
          </div>
        </div>
        <Badge variant="outline">{dispute.status}</Badge>
      </div>
      <p className="text-sm">{dispute.description}</p>

      <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as DisputeStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Resolution notes</Label>
          <Textarea
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="Outcome, refund, escalation…"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => mut.mutate()}
          disabled={mut.isPending}
          className="bg-gradient-amber text-primary-foreground"
        >
          {mut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </div>
    </div>
  );
}
