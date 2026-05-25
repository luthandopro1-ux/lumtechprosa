import { Link } from "@tanstack/react-router";
import { HardHat, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-gradient-amber shadow-glow">
            <HardHat className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            Lum Tech Pro <span className="text-primary">SA</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link to="/" hash="pillars" className="hover:text-foreground">Why us</Link>
          <Link to="/" hash="tiers" className="hover:text-foreground">Tiers</Link>
          <Link to="/" hash="how-it-works" className="hover:text-foreground">How it works</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/signup">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

const FOOTER_LINKS = {
  services: [
    { slug: "quantity-surveying", label: "Quantity Surveying" },
    { slug: "structural-engineering", label: "Structural Engineering" },
    { slug: "project-management", label: "Project Management" },
    { slug: "compliance-permits", label: "Compliance & Permits" },
  ],
  construction: [
    { slug: "residential", label: "Residential Reno" },
    { slug: "commercial", label: "Commercial Builds" },
    { slug: "contractor-vetting", label: "Contractor Vetting" },
    { slug: "material-vouchers", label: "Material Vouchers" },
  ],
  legal: [
    { slug: "terms", label: "Terms of Service" },
    { slug: "privacy", label: "Privacy Policy (POPIA)" },
    { slug: "escrow", label: "Escrow Agreement" },
    { slug: "sans-compliance", label: "SANS Compliance" },
  ],
};

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="border-b border-border/60 pb-6">
          <h3 className="font-display text-xl font-bold tracking-tight">Lum Tech Pro SA</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Professional Building & Construction Managed Marketplace
          </p>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <FooterCol heading="Professional Services" group="services" items={FOOTER_LINKS.services} />
          <FooterCol heading="Construction" group="construction" items={FOOTER_LINKS.construction} />
          <FooterCol heading="Legal" group="legal" items={FOOTER_LINKS.legal} />
          <div>
            <h4 className="text-sm font-semibold">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/contact" className="hover:text-foreground">Support Desk</Link>
              </li>
              <li>
                <Link to="/contact" hash="johannesburg" className="hover:text-foreground">Johannesburg</Link>
              </li>
              <li>
                <Link to="/contact" hash="durban" className="hover:text-foreground">Durban</Link>
              </li>
              <li>
                <Link to="/contact" hash="cape-town" className="hover:text-foreground">Cape Town</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-border/60 bg-card/50 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Secure Financial & Professional Protection
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            All construction funds are protected by TradeSafe (Pty) Ltd, an authorized Escrow Agent
            regulated by PASA. Funds are released only upon milestone verification by our integrated
            professional team. All trust accounts are securely held with Standard Bank of South Africa.
          </p>
        </div>

        <div className="mt-8 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Lum Tech Pro SA. Lum Tech Pro SA is a division of Lum Tech Solutions (Pty) Ltd.</div>
          <div className="mt-1">Reg No: 202X/XXXXXX/07 | Built for the South African Built Environment.</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  heading,
  group,
  items,
}: {
  heading: string;
  group: "services" | "construction" | "legal";
  items: { slug: string; label: string }[];
}) {
  const base = `/${group}` as const;
  return (
    <div>
      <h4 className="text-sm font-semibold">{heading}</h4>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i.slug}>
            <Link
              to={`${base}/$slug`}
              params={{ slug: i.slug }}
              className="hover:text-foreground"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
