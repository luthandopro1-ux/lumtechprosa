import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Returns whether the currently signed-in user has the `admin` role.
 * Cached for the session via react-query.
 */
export function useIsAdmin() {
  const { data, isLoading } = useQuery({
    queryKey: ["me", "is-admin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return false;
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id);
      return (roles ?? []).some((r) => r.role === "admin");
    },
    staleTime: 60_000,
  });
  return { isAdmin: !!data, loading: isLoading };
}
