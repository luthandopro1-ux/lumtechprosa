import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  beforeLoad: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw redirect({ to: "/login" });
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .limit(1)
      .maybeSingle();
    if (!roleRow) throw redirect({ to: "/onboarding" });
    switch (roleRow.role) {
      case "client":
        throw redirect({ to: "/dashboard/client" });
      case "builder":
        throw redirect({ to: "/dashboard/builder" });
      default:
        throw redirect({ to: "/dashboard/client" });
    }
  },
  component: () => null,
});
