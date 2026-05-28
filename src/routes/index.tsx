import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MarketingHeader, MarketingFooter } from "@/components/MarketingShell";
import {
  ShieldCheck,
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  UserCheck,
  Ticket,
  Lock,
  FileSearch,
  Banknote,
  Hammer,
  Wallet,
  QrCode,
  Receipt,
  TrendingUp,
  Award,
  Briefcase,
  Eye,
  Building2,
  HardHat,
  CheckCircle2,
  ScrollText,
  Gavel,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lum Tech Pro SA — Build Smarter. Pay Securely." },
      {
        name: "description",
        content:
          "Secure construction procurement with verified contractors, BOQ management, escrow protection, and milestone-controlled payments.",
      },
      { property: "og:title", content: "Lum Tech Pro SA — Build Smarter. Pay Securely." },
      {
        property: "og:description",
        content:
          "Verified contractors, BOQ-reviewed bidding, TradeSafe escrow and specialist-approved milestone releases.",
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
      <TrustSection />
      <HowItWorks />
      <ClientBenefits />
      <ContractorBenefits />
      <CTA />
      <MarketingFooter />
    </div>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-gradient-hero">
      <div className="absolute inset-0 bg-blueprint opacity-[0.55]" />
      <div className="pointer-events-none absolute -top-40 -right-20 h-[520px] w-[520px] rounded-full bg-primary/15 blur-3xl animate-drift" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-[480px] w-[480px] rounded-full bg-gold/10 blur-3xl animate-drift" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold-soft px-3 py-1 text-xs font-medium text-gold">
            <ShieldCheck className="h-3.5 w-3.5" /> Escrow-protected · BOQ-reviewed · Specialist-approved
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Build Smarter.
            <br />
            Pay <span className="text-gradient-gold">Securely.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Secure construction procurement with verified contractors, BOQ management, escrow
            protection, and milestone-controlled payments — purpose-built for the South African
            built environment.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-amber text-primary-foreground shadow-glow">
              <Link to="/signup">
                Start a Project <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gold/50 text-foreground hover:bg-gold-soft">
              <Link to="/signup">Become a Contractor</Link>
            </Button>
          </div>

          {/* Live trust strip */}
          <div className="mt-12 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { k: "TradeSafe", v: "Escrow Agent" },
              { k: "Standard Bank", v: "Trust Account" },
              { k: "ECSA", v: "Engineer Sign-off" },
              { k: "SANS 10400", v: "Compliance" },
            ].map((s) => (
              <div key={s.k} className="rounded-md border border-border/60 bg-card/40 px-3 py-2 backdrop-blur">
                <div className="font-display text-sm font-semibold">{s.k}</div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating dashboard preview card */}
        <div className="pointer-events-none absolute right-6 top-28 hidden w-[360px] lg:block">
          <div className="glass-card rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Escrow Wallet</div>
              <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">Secured</span>
            </div>
            <div className="mt-2 font-display text-3xl font-bold">R 1 240 000</div>
            <div className="mt-1 text-xs text-muted-foreground">Held in TradeSafe trust · Standard Bank</div>
            <div className="mt-4 space-y-3">
              {[
                { t: "Foundation", p: 100, c: "success" },
                { t: "Brickwork", p: 64, c: "primary" },
                { t: "Roofing", p: 12, c: "gold" },
              ].map((m) => (
                <div key={m.t}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{m.t}</span>
                    <span className="font-medium">{m.p}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/60">
                    <div
                      className={
                        m.c === "success"
                          ? "h-full bg-success"
                          : m.c === "gold"
                          ? "h-full bg-gold"
                          : "h-full bg-primary"
                      }
                      style={{ width: `${m.p}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2 rounded-md border border-gold/40 bg-gold-soft px-3 py-2 text-xs">
              <BadgeCheck className="h-4 w-4 text-gold" />
              <span className="text-foreground">Milestone 2 awaiting Engineer sign-off</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- TRUST ---------- */
const TRUST = [
  { icon: Lock, title: "Escrow Protected", body: "Funds held in TradeSafe trust until milestones clear." },
  { icon: BadgeCheck, title: "Verified Contractors", body: "CIPC, tax & trade-checked. Continuous reputation." },
  { icon: ClipboardCheck, title: "BOQ Reviewed", body: "Independent QS verifies every Bill of Quantities." },
  { icon: UserCheck, title: "Specialist Approved", body: "ECSA-registered engineers sign each phase." },
  { icon: Ticket, title: "Voucher-Controlled Supply", body: "Material spend ring-fenced via redeemable vouchers." },
  { icon: ShieldCheck, title: "Milestone Secured", body: "No release without proof, sign-off and audit trail." },
];

function TrustSection() {
  return (
    <section className="border-b border-border/60 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Why Lum Tech Pro SA
          </div>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Six layers of protection on every project.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Each layer is independently enforced before a single rand moves.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST.map((t) => (
            <div
              key={t.title}
              className="glass-card group rounded-xl p-6 transition hover:-translate-y-0.5 hover:shadow-gold"
            >
              <div className="grid h-11 w-11 place-items-center rounded-md bg-primary/15 text-primary transition group-hover:bg-gold-soft group-hover:text-gold">
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{t.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- HOW IT WORKS — animated timeline ---------- */
const STEPS = [
  { icon: Building2, title: "Client Posts Project", body: "Scope, drawings, budget and timeline captured in one structured brief." },
  { icon: ClipboardCheck, title: "BOQ Verification", body: "Independent QS validates the Bill of Quantities and market rates." },
  { icon: Hammer, title: "Up to 3 Contractors Bid", body: "Curated, verified contractors submit sealed milestone bids." },
  { icon: UserCheck, title: "Client Selects Contractor", body: "Side-by-side comparison of price, programme and reputation." },
  { icon: Lock, title: "Funds Secured in Escrow", body: "TradeSafe holds the full project value in a Standard Bank trust." },
  { icon: HardHat, title: "Milestone-Based Construction", body: "Work executes against pre-agreed phases with structured evidence." },
  { icon: Ticket, title: "Supplier Voucher Issued", body: "Material allocations released as redeemable vouchers, locked to scope." },
  { icon: FileSearch, title: "Specialist Inspection & Approval", body: "ECSA-registered engineers and QS certify each milestone." },
  { icon: Banknote, title: "Progressive Fund Release", body: "Only certified milestones unlock escrow drawdowns." },
  { icon: BadgeCheck, title: "Project Completion", body: "Final sign-off, compliance pack, occupation-ready handover." },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="relative border-b border-border/60 py-20">
      <div className="absolute inset-0 bg-blueprint opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold-soft px-3 py-1 text-xs font-medium text-gold">
            <ScrollText className="h-3.5 w-3.5" /> The Lum Tech Pro SA workflow
          </div>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Ten governed steps from brief to handover.
          </h2>
          <p className="mt-4 text-muted-foreground">
            A single auditable trail — every approval, every payment, every certificate.
          </p>
        </div>

        <ol className="mt-14 relative">
          {/* Vertical connector line */}
          <div className="pointer-events-none absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-primary/50 via-gold/40 to-transparent sm:block" />
          <div className="grid gap-5 sm:grid-cols-2">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                className="glass-card group relative rounded-xl p-5 transition hover:-translate-y-0.5 hover:shadow-gold sm:pl-16"
              >
                <div className="absolute left-5 top-5 hidden h-9 w-9 items-center justify-center rounded-full border border-gold/60 bg-background font-display text-xs font-bold text-gold sm:flex">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/15 text-primary transition group-hover:bg-gold-soft group-hover:text-gold sm:hidden">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <s.icon className="hidden h-4 w-4 text-gold sm:block" />
                      <h3 className="font-display text-base font-semibold">{s.title}</h3>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </div>
        </ol>
      </div>
    </section>
  );
}

/* ---------- CLIENT BENEFITS ---------- */
const CLIENT_BENEFITS = [
  { icon: Eye, title: "Transparent Bidding", body: "Sealed bids, structured comparison, zero quote-game." },
  { icon: Lock, title: "Escrow Protection", body: "Funds protected end-to-end by TradeSafe." },
  { icon: ClipboardCheck, title: "Verified BOQ System", body: "Independent measurement before money moves." },
  { icon: UserCheck, title: "Specialist Oversight", body: "Phase inspections by registered professionals." },
  { icon: ShieldCheck, title: "Fraud Prevention", body: "Identity, compliance and continuous reputation checks." },
  { icon: Gavel, title: "Controlled Procurement", body: "Voucher-locked material spend with audit trail." },
];

function ClientBenefits() {
  return (
    <section className="border-b border-border/60 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            For Clients & Developers
          </div>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Procurement governance, built in.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CLIENT_BENEFITS.map((b) => (
            <div key={b.title} className="glass-card rounded-xl p-6 transition hover:-translate-y-0.5 hover:shadow-gold">
              <b.icon className="h-6 w-6 text-gold" />
              <h3 className="mt-4 font-display text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CONTRACTOR BENEFITS — no public tiers/pricing ---------- */
const CONTRACTOR_BENEFITS = [
  { icon: Briefcase, title: "Access Verified Projects", body: "Bid only on real, funded, BOQ-reviewed jobs." },
  { icon: Wallet, title: "Secure Milestone Payments", body: "Guaranteed payout the moment specialists certify your work." },
  { icon: QrCode, title: "Supplier Voucher Support", body: "Redeem materials at partner suppliers via QR scan." },
  { icon: Award, title: "Build Reputation", body: "Every certified milestone strengthens your rating." },
  { icon: Hammer, title: "Bid on Real Construction Jobs", body: "Curated pipeline of compliant, scoped projects." },
  { icon: TrendingUp, title: "Growth Opportunities", body: "Unlock larger projects as your track record grows." },
];

function ContractorBenefits() {
  return (
    <section className="border-b border-border/60 bg-card/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold-soft px-3 py-1 text-xs font-medium text-gold">
              For Contractors
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Win work. Get paid. Build a track record.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Membership details, compliance requirements and tier benefits are shared inside the
              contractor portal after verification.
            </p>
          </div>
          <Button asChild size="lg" className="bg-gradient-amber text-primary-foreground shadow-glow">
            <Link to="/signup">
              Apply to join <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CONTRACTOR_BENEFITS.map((b) => (
            <div key={b.title} className="glass-card rounded-xl p-6 transition hover:-translate-y-0.5 hover:shadow-gold">
              <b.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-display text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-start gap-3 rounded-xl border border-border/60 bg-card/60 p-5 text-sm text-muted-foreground">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <p>
            <span className="font-medium text-foreground">Membership tiers and pricing are private.</span>{" "}
            They become visible after contractor registration, compliance submission and admin approval.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA ---------- */
function CTA() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-blueprint opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px animate-shimmer" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold-soft px-3 py-1 text-xs font-medium text-gold">
          <Receipt className="h-3.5 w-3.5" /> Every rand. Every milestone. Audited.
        </div>
        <h2 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Build Smarter. <span className="text-gradient-gold">Pay Securely.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
          Join the construction fintech ecosystem protecting projects across South Africa.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="bg-gradient-amber text-primary-foreground shadow-glow">
            <Link to="/signup">Start a Project</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-gold/50 hover:bg-gold-soft">
            <Link to="/signup">Become a Contractor</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link to="/login">
              <CheckCircle2 className="mr-2 h-4 w-4" /> I already have an account
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
