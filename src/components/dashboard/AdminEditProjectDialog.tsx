import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { centsToZar, zarToCents } from "@/lib/format";
import { KZN_MUNICIPALITIES } from "@/lib/kzn";

const STATUSES = [
  "draft",
  "funded",
  "active",
  "completed",
  "disputed",
  "cancelled",
] as const;
type ProjectStatus = (typeof STATUSES)[number];

const schema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional().nullable(),
  tier: z.number().int().min(1).max(3),
  kzn_region: z.string().min(1).max(120),
  status: z.enum(STATUSES),
  budget_zar: z.number().min(0).max(1_000_000_000),
  client_fee_zar: z.number().min(0).max(1_000_000_000),
  builder_fee_zar: z.number().min(0).max(1_000_000_000),
  professional_fee_zar: z.number().min(0).max(1_000_000_000),
});

interface ProjectLike {
  id: string;
  title: string;
  description: string | null;
  tier: number;
  kzn_region: string;
  status: string;
  budget_cents: number;
  client_fee_cents: number;
  builder_fee_cents: number;
  professional_fee_cents: number;
}

export function AdminEditProjectDialog({ project }: { project: ProjectLike }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: project.title,
    description: project.description ?? "",
    tier: project.tier,
    kzn_region: project.kzn_region,
    status: project.status,
    budget_zar: centsToZar(project.budget_cents),
    client_fee_zar: centsToZar(project.client_fee_cents),
    builder_fee_zar: centsToZar(project.builder_fee_cents),
    professional_fee_zar: centsToZar(project.professional_fee_cents),
  });

  const mut = useMutation({
    mutationFn: async () => {
      const parsed = schema.parse(form);
      const { error } = await supabase
        .from("projects")
        .update({
          title: parsed.title,
          description: parsed.description || null,
          tier: parsed.tier,
          kzn_region: parsed.kzn_region,
          status: parsed.status as ProjectStatus,
          budget_cents: zarToCents(parsed.budget_zar),
          client_fee_cents: zarToCents(parsed.client_fee_zar),
          builder_fee_cents: zarToCents(parsed.builder_fee_zar),
          professional_fee_cents: zarToCents(parsed.professional_fee_zar),
        })
        .eq("id", project.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Project updated");
      qc.invalidateQueries({ queryKey: ["project", project.id] });
      qc.invalidateQueries({ queryKey: ["admin", "overview"] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Pencil className="mr-2 h-4 w-4" /> Admin edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit project (admin)</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm({ ...form, status: v })}
            >
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
            <Label>Tier</Label>
            <Select
              value={String(form.tier)}
              onValueChange={(v) => setForm({ ...form, tier: Number(v) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3].map((t) => (
                  <SelectItem key={t} value={String(t)}>
                    Tier {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label>KZN region</Label>
            <Select
              value={form.kzn_region}
              onValueChange={(v) => setForm({ ...form, kzn_region: v })}
            >
              <SelectTrigger>
                <SelectValue />
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
          <div>
            <Label>Budget (ZAR)</Label>
            <Input
              type="number"
              value={form.budget_zar}
              onChange={(e) =>
                setForm({ ...form, budget_zar: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <Label>Client fee (ZAR)</Label>
            <Input
              type="number"
              value={form.client_fee_zar}
              onChange={(e) =>
                setForm({ ...form, client_fee_zar: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <Label>Builder fee (ZAR)</Label>
            <Input
              type="number"
              value={form.builder_fee_zar}
              onChange={(e) =>
                setForm({ ...form, builder_fee_zar: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <Label>Professional fee (ZAR)</Label>
            <Input
              type="number"
              value={form.professional_fee_zar}
              onChange={(e) =>
                setForm({
                  ...form,
                  professional_fee_zar: Number(e.target.value),
                })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => mut.mutate()}
            disabled={mut.isPending}
            className="bg-gradient-amber text-primary-foreground"
          >
            {mut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
