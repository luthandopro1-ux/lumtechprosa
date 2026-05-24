import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { HardHat, LogOut, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/hooks/use-auth";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export function AppShell({
  role,
  nav,
  children,
}: {
  role: AppRole | null;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-amber">
            <HardHat className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-sm font-bold">Build Connect SA</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  active
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          {role && (
            <div className="mb-2 px-3 py-2 text-xs uppercase tracking-wider text-muted-foreground">
              Signed in as <span className="text-primary">{role}</span>
            </div>
          )}
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-7xl p-6 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
