import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  beforeLoad: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw redirect({ to: "/login" });
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id);
    if (!roles || roles.length === 0) throw redirect({ to: "/onboarding" });
    const set = new Set(roles.map((r) => r.role));
    if (set.has("admin")) throw redirect({ to: "/dashboard/admin" });
    if (set.has("client")) throw redirect({ to: "/dashboard/client" });
    if (set.has("builder")) throw redirect({ to: "/dashboard/builder" });
    if (set.has("professional")) throw redirect({ to: "/dashboard/professional" });
    if (set.has("supplier")) throw redirect({ to: "/dashboard/supplier" });
    throw redirect({ to: "/onboarding" });
  },
  component: () => null,
});
