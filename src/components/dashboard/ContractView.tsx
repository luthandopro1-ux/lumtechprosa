import { useQuery } from "@tanstack/react-query";
import { FileText, CheckCircle2, Circle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const DOC_LABELS: Record<string, string> = {
  contract: "Contract",
  plan: "Plan",
  boq: "BOQ",
  permit: "Permit",
  proof: "Proof",
  invoice: "Invoice",
  other: "Document",
};

export function ContractView({ projectId }: { projectId: string }) {
  const { data: docs = [], isLoading } = useQuery({
    queryKey: ["project_documents", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_documents")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  async function downloadDoc(storage_path: string, title: string) {
    const { data, error } = await supabase.storage.from("project-files").createSignedUrl(storage_path, 60);
    if (error || !data) return;
    const a = document.createElement("a");
    a.href = data.signedUrl;
    a.download = title;
    a.click();
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary" />
        <h3 className="font-display text-lg font-semibold">Documents & contracts</h3>
      </div>
      <div className="mt-4 divide-y divide-border">
        {isLoading ? (
          <p className="py-4 text-sm text-muted-foreground">Loading…</p>
        ) : docs.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">No documents uploaded yet.</p>
        ) : (
          docs.map((d) => {
            const signatures = [
              { label: "Client", at: d.signed_by_client_at },
              { label: "Builder", at: d.signed_by_builder_at },
              { label: "Professional", at: d.signed_by_professional_at },
            ];
            return (
              <div key={d.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{DOC_LABELS[d.doc_type] ?? d.doc_type}</Badge>
                    <span className="font-medium">{d.title}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {signatures.map((s) => (
                      <span key={s.label} className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        {s.at ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <Circle className="h-3.5 w-3.5" />
                        )}
                        {s.label} {s.at ? "signed" : "pending"}
                      </span>
                    ))}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => downloadDoc(d.storage_path, d.title)}>
                  <Download className="mr-2 h-4 w-4" /> Open
                </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
