import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { resolveDashboardTarget } from "@/lib/role-routing";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  beforeLoad: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw redirect({ to: "/login" });
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id);
    throw redirect({ to: resolveDashboardTarget(roles) });
  },
  component: () => null,
});
