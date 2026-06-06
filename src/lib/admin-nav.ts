import {
  ShieldCheck,
  Truck,
  FileText,
  LayoutDashboard,
  HardHat,
  Briefcase,
  Package,
  Hammer,
} from "lucide-react";
import type { NavItem } from "@/components/AppShell";

// Admin-only nav: gives super-admin one-click access to every role dashboard.
export const ADMIN_NAV: NavItem[] = [
  { to: "/dashboard/admin", label: "Overview", icon: ShieldCheck },
  { to: "/dashboard/admin-suppliers", label: "Suppliers", icon: Truck },
  { to: "/dashboard/admin-boq", label: "BOQ Queue", icon: FileText },
  { to: "/dashboard/client", label: "Client view", icon: LayoutDashboard },
  { to: "/dashboard/builder", label: "Builder view", icon: HardHat },
  { to: "/dashboard/professional", label: "Professional view", icon: Briefcase },
  { to: "/dashboard/supplier", label: "Supplier view", icon: Package },
  { to: "/dashboard/artisan", label: "Artisan view", icon: Hammer },
];
