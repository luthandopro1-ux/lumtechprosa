import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MarketingHeader, MarketingFooter } from "@/components/MarketingShell";
import {
  HardHat,
  ShieldCheck,
  Wallet,
  QrCode,
  Building2,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  ClipboardCheck,
  Landmark,
  Ticket,
} from "lucide-react";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LUM TECH PRO SA — Managed Construction Marketplace" },
      {
        name: "description",
        content:
          "South Africa's premier managed marketplace for building & renovations. Embedded QS + Engineers, milestone sign-off, and TradeSafe Escrow eliminate construction risk.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader />
      <Hero />
      <ProblemSection />
      <PillarsSection />
      <TiersSection />
      <HowItWorks />
      <RolesSection />
      <CTA />
      <MarketingFooter />
    </div>
  );
}


function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> TradeSafe Escrow · QS & Engineer oversight · SANS-aligned
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Build without the <span className="text-gradient-amber">risk</span>.
            <br /> Pay only on verified proof.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            South Africa's premier <strong className="text-foreground">managed marketplace</strong> for
            building, renovations and structural infrastructure. Embedded Quantity Surveyors and
            Engineers protect every milestone. TradeSafe Escrow protects every rand.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-amber text-primary-foreground shadow-glow">
              <Link to="/signup">
                Start a project <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/signup">Register as a contractor</Link>
            </Button>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-3">
            <Stat value="R0–R150k" label="Tier 1 · 10% split" />
            <Stat value="R150k–R1.5m" label="Tier 2 · 8% split" />
            <Stat value="R1.5m+" label="Tier 3 · 6% split" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const pains = [
    "Unvetted contractors who disappear with deposits",
    "Sudden cost escalations & untracked variations",
    "Half-finished work and abandoned sites",
    "Structural non-compliance that fails SANS inspections",
  ];
  return (
    <section className="border-b border-border/60 bg-card/30 py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
            <AlertTriangle className="h-3.5 w-3.5" /> The construction risk problem
          </div>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Other platforms hand you a list of numbers.
            <br />
            <span className="text-gradient-amber">We hand you a team.</span>
          </h2>
          <p className="mt-6 text-muted-foreground">
            Building and renovating in South Africa is notoriously high-risk. Lum Tech Pro SA
            eliminates that risk by embedding professional oversight and escrow into every project —
            so property owners and developers stay protected from start to handover.
          </p>
        </div>
        <ul className="space-y-3">
          {pains.map((p) => (
            <li key={p} className="flex items-start gap-3 rounded-lg border border-border bg-card/60 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <span className="text-sm text-muted-foreground">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const PILLARS = [
  {
    icon: Calculator,
    title: "Built-in QS & Engineers",
    body: "Integrated Quantity Surveyors verify your Bill of Quantities and market rates. Registered Engineers conduct phase inspections so every stage meets National Building Regulations.",
  },
  {
    icon: ClipboardCheck,
    title: "Milestone-driven project management",
    body: "Every build is broken into transparent phases — foundation, brickwork, roofing, finishes. Contractors submit proof; our professionals sign off digitally before money moves.",
  },
  {
    icon: Landmark,
    title: "TradeSafe Escrow protection",
    body: "Project funds sit in an audited TradeSafe Escrow account (backed by Standard Bank). Money releases only after a QS or Engineer certifies the milestone.",
  },
  {
    icon: Ticket,
    title: "Voucher & incentive ledger",
    body: "Corporate clients, housing funds and partners distribute pre-funded construction credits that streamline material procurement and subsidise verified local projects.",
  },
];

function PillarsSection() {
  return (
    <section id="pillars" className="border-b border-border/60 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Four pillars holding up every project.
          </h2>
          <p className="mt-4 text-muted-foreground">
            You don't just hire a contractor — you hire an ecosystem engineered to deliver compliant,
            on-budget, structurally sound work.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-xl border border-border bg-card p-6 transition hover:border-primary/40">
              <div className="grid h-11 w-11 place-items-center rounded-md bg-primary/15 text-primary">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l-2 border-primary/60 pl-4">
      <div className="font-display text-xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

const TIERS = [
  {
    name: "Tier 1",
    range: "R0 — R150 000",
    label: "Micro / Minor Works",
    split: "10% (5% client · 5% builder)",
    points: [
      "Builder supplies labour only",
      "Client purchases materials directly",
      "Lightweight milestone tracking",
    ],
  },
  {
    name: "Tier 2",
    range: "R150 001 — R1 500 000",
    label: "Standard Residential / Renovation",
    split: "8% (4% client · 4% builder)",
    featured: true,
    points: [
      "Full LUM TECH PRO SA project management",
      "Closed-loop supplier vouchers",
      "QS + Engineer milestone sign-off",
    ],
  },
  {
    name: "Tier 3",
    range: "R1 500 001+",
    label: "Premium / Major Construction",
    split: "6% (3% client · 3% builder)",
    points: [
      "Main contractor supplies materials by default",
      "Labour-Only Protection toggle for builders",
      "Optional in-house QS · Engineer · Surveyor (+5%)",
    ],
  },
];

function TiersSection() {
  return (
    <section id="tiers" className="border-b border-border/60 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Three tiers. One clear playbook.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every project is automatically classified by total value (ZAR). Commission,
            workflow and material handling adapt instantly.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`rounded-xl border p-6 transition ${
                t.featured
                  ? "border-primary/50 bg-card shadow-glow"
                  : "border-border bg-card/50 hover:border-primary/30"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-2xl font-bold">{t.name}</span>
                {t.featured && (
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                    Most common
                  </span>
                )}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {t.label}
              </div>
              <div className="mt-4 font-display text-xl">{t.range}</div>
              <div className="mt-1 text-sm text-primary">{t.split}</div>
              <ul className="mt-6 space-y-2 text-sm">
                {t.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    icon: Building2,
    title: "Client funds escrow",
    body: "TradeSafe holds the full project value plus client fee until milestones are approved.",
  },
  {
    icon: HardHat,
    title: "Builder works milestones",
    body: "Upload proof of work, request release. QS and Engineer sign off when ready.",
  },
  {
    icon: QrCode,
    title: "Suppliers redeem vouchers",
    body: "Builders pay KZN material suppliers with 12-digit vouchers — QR scan, instant settlement.",
  },
  {
    icon: Wallet,
    title: "Funds release on approval",
    body: "Only authorised milestones unlock payments. Full audit trail on every cent.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border/60 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          How it works
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative rounded-xl border border-border bg-card p-6">
              <div className="absolute -top-3 left-6 rounded-md bg-gradient-amber px-2 py-0.5 text-xs font-bold text-primary-foreground">
                STEP {i + 1}
              </div>
              <s.icon className="h-7 w-7 text-primary" />
              <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RolesSection() {
  const roles = [
    { title: "Property Owners & Renovators", body: "Homeowners extending, remodelling or building with total peace of mind that the money is safe and the structure won't crack." },
    { title: "Commercial Developers", body: "Businesses needing transparent, milestone-tracked contractor procurement with rigorous QS and engineering audit layers." },
    { title: "Vetted Contractors", body: "High-quality builders who want guaranteed payment security the moment they deliver compliant, professional work." },
    { title: "Suppliers & Partners", body: "Material suppliers and corporate voucher partners plugging into a closed-loop ledger with instant, audited settlement." },
  ];
  return (
    <section id="roles" className="border-b border-border/60 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Built for every party on site.
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r) => (
            <div key={r.title} className="rounded-xl border border-border bg-card/50 p-6">
              <div className="font-display text-lg font-semibold text-primary">{r.title}</div>
              <p className="mt-3 text-sm text-muted-foreground">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Ready to build the <span className="text-gradient-amber">KZN way</span>?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
          Join the marketplace protecting every rand on site — from Durban to Newcastle.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="bg-gradient-amber text-primary-foreground shadow-glow">
            <Link to="/signup">Create your account</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/login">I already have one</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Brand header */}
        <div className="border-b border-border/60 pb-6">
          <h3 className="font-display text-xl font-bold tracking-tight">LUM TECH PRO SA</h3>
          <p className="mt-1 text-sm text-muted-foreground">Professional Building & Construction Managed Marketplace</p>
        </div>

        {/* Link columns */}
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="text-sm font-semibold">Professional Services</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Quantity Surveying</li>
              <li>Structural Engineering</li>
              <li>Project Management</li>
              <li>Compliance & Permits</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Construction</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Residential Reno</li>
              <li>Commercial Builds</li>
              <li>Contractor Vetting</li>
              <li>Material Vouchers</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Terms of Service</li>
              <li>Privacy Policy (POPIA)</li>
              <li>Escrow Agreement</li>
              <li>SANS Compliance</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Support Desk</li>
              <li>Johannesburg</li>
              <li>Durban</li>
              <li>Cape Town</li>
            </ul>
          </div>
        </div>

        {/* Secure notice */}
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

        {/* Copyright */}
        <div className="mt-8 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Lum Tech Pro SA. Lum Tech Pro SA is a division of Lum Tech Solutions (Pty) Ltd.</div>
          <div className="mt-1">Reg No: 202X/XXXXXX/07 | Built for the South African Built Environment.</div>
        </div>
      </div>
    </footer>
  );
}
