import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Settings as SettingsIcon, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { AppShell } from "@/components/AppShell";
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
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useIsAdmin } from "@/hooks/use-is-admin";

export const Route = createFileRoute("/_authenticated/dashboard/admin-settings")({
  component: AdminSettings,
  head: () => ({ meta: [{ title: "Admin · Platform Settings" }] }),
});

const keySchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-zA-Z0-9_.-]+$/, "Use letters, numbers, _, -, .");

interface SettingRow {
  key: string;
  value: unknown;
  description: string | null;
  updated_at: string;
}

function AdminSettings() {
  const { isAdmin, loading } = useIsAdmin();
  const qc = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("*")
        .order("key");
      if (error) throw error;
      return (data ?? []) as SettingRow[];
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

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin", "settings"] });

  return (
    <AppShell role="admin" nav={ADMIN_NAV}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-primary" />
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Platform settings
          </h1>
        </div>
        <NewSettingDialog onSaved={refresh} />
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Key/value configuration. Values are stored as JSON.
      </p>

      <div className="mt-8 space-y-4">
        {settings.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-12 text-center text-sm text-muted-foreground">
            No settings yet.
          </div>
        )}
        {settings.map((s) => (
          <SettingRowEditor key={s.key} row={s} onSaved={refresh} />
        ))}
      </div>
    </AppShell>
  );
}

function SettingRowEditor({
  row,
  onSaved,
}: {
  row: SettingRow;
  onSaved: () => void;
}) {
  const [value, setValue] = useState(JSON.stringify(row.value, null, 2));
  const [description, setDescription] = useState(row.description ?? "");

  const save = useMutation({
    mutationFn: async () => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(value);
      } catch {
        throw new Error("Value must be valid JSON");
      }
      const { error } = await supabase
        .from("platform_settings")
        .update({ value: parsed, description: description || null })
        .eq("key", row.key);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`Saved ${row.key}`);
      onSaved();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("platform_settings")
        .delete()
        .eq("key", row.key);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`Deleted ${row.key}`);
      onSaved();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="font-mono text-sm font-semibold">{row.key}</div>
        <div className="text-xs text-muted-foreground">
          Updated {new Date(row.updated_at).toLocaleString()}
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Value (JSON)</Label>
          <Textarea
            className="font-mono text-xs"
            rows={4}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (confirm(`Delete setting "${row.key}"?`)) remove.mutate();
          }}
          disabled={remove.isPending}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
        <Button
          size="sm"
          className="bg-gradient-amber text-primary-foreground"
          onClick={() => save.mutate()}
          disabled={save.isPending}
        >
          {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </div>
    </div>
  );
}

function NewSettingDialog({ onSaved }: { onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");
  const [value, setValue] = useState('""');
  const [description, setDescription] = useState("");

  const mut = useMutation({
    mutationFn: async () => {
      const parsedKey = keySchema.parse(key);
      let parsedValue: unknown;
      try {
        parsedValue = JSON.parse(value);
      } catch {
        throw new Error("Value must be valid JSON");
      }
      const { error } = await supabase.from("platform_settings").insert({
        key: parsedKey,
        value: parsedValue,
        description: description || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Setting created");
      setOpen(false);
      setKey("");
      setValue('""');
      setDescription("");
      onSaved();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-gradient-amber text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> New setting
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New platform setting</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Key</Label>
            <Input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="feature_x_enabled"
            />
          </div>
          <div>
            <Label>Value (JSON)</Label>
            <Textarea
              className="font-mono text-xs"
              rows={3}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='true, 42, "text", {"a":1}'
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => mut.mutate()}
            disabled={mut.isPending}
            className="bg-gradient-amber text-primary-foreground"
          >
            {mut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
