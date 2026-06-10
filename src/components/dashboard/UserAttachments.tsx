import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Paperclip, Upload, Trash2, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

/**
 * Per-user private file storage. Files live in the `user-uploads` bucket
 * under `<user_id>/<filename>` so RLS policies match.
 */
export function UserAttachments({ title = "Attachments" }: { title?: string }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const folder = user?.id;
  const { data: files = [], isLoading } = useQuery({
    queryKey: ["user-uploads", folder],
    enabled: !!folder,
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from("user-uploads")
        .list(folder!, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
      if (error) throw error;
      return (data ?? []).filter((f) => f.name && !f.name.startsWith("."));
    },
  });

  const onFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || !folder) return;
      setUploading(true);
      try {
        for (const file of Array.from(fileList)) {
          const safe = file.name.replace(/[^\w.\-]+/g, "_");
          const path = `${folder}/${Date.now()}-${safe}`;
          const { error } = await supabase.storage
            .from("user-uploads")
            .upload(path, file, { upsert: false, contentType: file.type });
          if (error) throw error;
        }
        toast.success("Uploaded");
        qc.invalidateQueries({ queryKey: ["user-uploads", folder] });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [folder, qc],
  );

  const remove = async (name: string) => {
    if (!folder) return;
    const { error } = await supabase.storage.from("user-uploads").remove([`${folder}/${name}`]);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    qc.invalidateQueries({ queryKey: ["user-uploads", folder] });
  };

  const open = async (name: string) => {
    if (!folder) return;
    const { data, error } = await supabase.storage
      .from("user-uploads")
      .createSignedUrl(`${folder}/${name}`, 60 * 10);
    if (error || !data) return toast.error(error?.message ?? "Failed to open");
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <Paperclip className="h-4 w-4 text-primary" /> {title}
        </div>
        <label>
          <input
            type="file"
            multiple
            className="hidden"
            disabled={uploading || !user}
            onChange={(e) => {
              onFiles(e.target.files);
              e.currentTarget.value = "";
            }}
          />
          <Button
            asChild
            size="sm"
            variant="outline"
            disabled={uploading || !user}
          >
            <span className="cursor-pointer">
              {uploading ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="mr-2 h-3.5 w-3.5" />
              )}
              {uploading ? "Uploading…" : "Upload"}
            </span>
          </Button>
        </label>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Loading…</p>
        ) : files.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No attachments yet. Upload contracts, photos, certificates, or job documents.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {files.map((f) => (
              <li key={f.name} className="flex items-center justify-between gap-3 py-2.5">
                <button
                  type="button"
                  onClick={() => open(f.name)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm hover:text-primary"
                >
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{f.name.replace(/^\d+-/, "")}</span>
                </button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(f.name)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
