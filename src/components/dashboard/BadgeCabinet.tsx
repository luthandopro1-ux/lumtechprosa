import { useQuery } from "@tanstack/react-query";
import { Award, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export function BadgeCabinet({ userId }: { userId: string }) {
  const { data: badges = [], isLoading } = useQuery({
    queryKey: ["artisan_badges", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artisan_badges")
        .select("*")
        .eq("user_id", userId)
        .order("issued_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Award className="h-4 w-4 text-primary" />
        <h3 className="font-display text-lg font-semibold">Badge cabinet</h3>
      </div>
      {isLoading ? (
        <p className="mt-4 text-sm text-muted-foreground">Loading badges…</p>
      ) : badges.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No badges earned yet.</p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((b) => (
            <div key={b.id} className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {b.icon_url ? (
                    <img src={b.icon_url} alt={b.title} className="h-8 w-8 rounded" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium leading-tight">{b.title}</div>
                    {b.issuer && <div className="text-xs text-muted-foreground">{b.issuer}</div>}
                  </div>
                </div>
                {b.verified && (
                  <Badge className="gap-1">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </Badge>
                )}
              </div>
              {b.description && <p className="mt-2 text-xs text-muted-foreground">{b.description}</p>}
              <div className="mt-3 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                {b.issued_at && <span>Issued {b.issued_at}</span>}
                {b.expires_at && <span>Expires {b.expires_at}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
