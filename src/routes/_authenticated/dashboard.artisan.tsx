import { createFileRoute } from "@tanstack/react-router";
import { Award, Ticket, LayoutDashboard } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BadgeCabinet } from "@/components/dashboard/BadgeCabinet";
import { VoucherWallet } from "@/components/dashboard/VoucherWallet";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/artisan")({
  component: ArtisanDashboard,
  head: () => ({ meta: [{ title: "Artisan Dashboard · Lum Tech Pro SA" }] }),
});

const NAV = [
  { to: "/dashboard/artisan", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/artisan", label: "Badges", icon: Award },
  { to: "/dashboard/artisan", label: "Vouchers", icon: Ticket },
];

function ArtisanDashboard() {
  const { user } = useAuth();

  return (
    <AppShell role="builder" nav={NAV}>
      <h1 className="font-display text-3xl font-bold tracking-tight">Artisan Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Your verified skills and active vouchers.</p>

      {user ? (
        <div className="mt-8 space-y-6">
          <BadgeCabinet userId={user.id} />
          <VoucherWallet userId={user.id} />
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">Sign in to view your badges and vouchers.</p>
      )}
    </AppShell>
  );
}
