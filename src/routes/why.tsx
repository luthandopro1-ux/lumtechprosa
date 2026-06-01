import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  BadgeCheck,
  FileSearch,
  HardHat,
  Ticket,
  ClipboardCheck,
  Building2,
  Truck,
  Award,
  Eye,
  ArrowRight,
  Banknote,
  Receipt,
  ScrollText,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingHeader, MarketingFooter } from "@/components/MarketingShell";
import { MarketingCTA, PageHero } from "@/components/MarketingCTA";

export const Route = createFileRoute("/why")({
  head: () => ({
    meta: [
      { title: "Why Lum Tech Pro SA · Construction Fintech & Procurement Governance" },
      {
        name: "description",
        content:
          "An investor-ready deck for Lum Tech Pro SA — South Africa's construction fintech and procurement governance platform.",
      },
      { property: "og:title", content: "Why Lum Tech Pro SA" },
      {
        property: "og:description",
        content:
          "Escrow governance, BOQ validation, professional sign-off, voucher procurement, milestone fund release.",
      },
    ],
  }),
  component: WhyPage,
});

const PROBLEMS = [
  "Contractor fraud",
  "Project abandonment",
  "Payment disputes",
  "Cost overruns",
  "Material misuse",
  "Unverified contractors",
  "Poor procurement governance",
  "Lack of accountability",
];

const LAYERS = [
  { icon: Lock, title: "Escrow Protected", body: "Project funds secured before construction begins." },
  { icon: BadgeCheck, title: "Verified Contractors", body: "Compliance and reputation verification." },
  { icon: FileSearch, title: "BOQ Reviewed", body: "Independent Quantity Surveyor validation." },
  { icon: ShieldCheck, title: "Specialist Approved", body: "ECSA-registered professionals verify work." },
  { icon: Ticket, title: "Voucher-Controlled Supply", body: "Material spending stays aligned to scope." },
  { icon: HardHat, title: "Milestone Secured", body: "Funds released only after approval." },
];

const FLOW = [
  "Client posts project",
  "BOQ verification",
  "Verified contractors bid",
  "Client selects contractor",
  "Funds secured in escrow",
  "Construction begins",
  "Material vouchers issued",
  "Specialist inspection",
  "Milestone fund release",
  "Final project handover",
];

const CLIENTS = [
  "Protected project funds",
  "Transparent contractor selection",
  "Professional oversight",
  "Reduced fraud exposure",
  "Controlled procurement",
  "Independent quality verification",
  "Complete project audit trail",
];

const CONTRACTORS_NO = ["No lead purchases", "No bidding credits", "No pay-per-contact fees"];
const CONTRACTORS_YES = [
  "Lifetime access to project opportunities",
  "BOQ-reviewed projects",
  "Escrow-backed payments",
  "Reputation building",
  "Growth opportunities",
];

const SUPPLIERS = [
  "Verified projects",
  "Controlled procurement",
  "Voucher-based material allocation",
  "Reduced payment uncertainty",
  "Transparent material tracking",
];

const COMPETITORS = ["Contractor listings", "Lead generation", "Job boards"];
const US = [
  "Escrow governance",
  "BOQ validation",
  "Professional sign-off",
  "Voucher procurement controls",
  "Milestone fund release",
  "Digital audit trail",
  "Contractor reputation framework",
];

function Section({
  id,
  eyebrow,
  title,
  children,
  tone = "default",
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  children: React.ReactNode;
  tone?: "default" | "muted" | "hero";
}) {
  const bg =
    tone === "hero"
      ? "bg-gradient-hero"
      : tone === "muted"
        ? "bg-card/30"
        : "bg-background";
  return (
    <section id={id} className={`relative border-b border-border/60 ${bg}`}>
      {tone === "hero" && <div className="absolute inset-0 bg-blueprint opacity-[0.4]" />}
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 animate-fade-in">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold-soft px-3 py-1 text-xs font-medium text-gold">
          {eyebrow}
        </div>
        <h2 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl">{title}</h2>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function WhyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader />

      <PageHero
        eyebrow="Construction Fintech & Procurement Governance"
        title="Why Lum Tech Pro SA."
        highlight="Build smarter. Pay securely."
        subtitle="South Africa's governed construction ecosystem combining escrow protection, contractor verification, BOQ management, specialist approvals, and milestone-controlled payments."
      />

      {/* Problem */}
      <Section id="problem" eyebrow="The problem" title="Construction remains one of the highest-risk industries." tone="muted">
        <p className="max-w-3xl text-lg text-muted-foreground">
          Across South Africa, projects face an array of risks that expose billions of rand to
          unnecessary loss every year.
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map((p) => (
            <div
              key={p}
              className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 p-4"
            >
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span className="text-sm font-medium">{p}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Gap */}
      <Section id="gap" eyebrow="The industry gap" title="Procurement still relies on trust alone.">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="glass-card rounded-2xl p-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today</div>
            <div className="mt-4 flex items-center justify-between text-sm font-medium">
              <span className="rounded-md bg-card/80 px-3 py-2">Client</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <span className="rounded-md bg-card/80 px-3 py-2">Contractor</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <span className="rounded-md bg-card/80 px-3 py-2">Payment</span>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {["Financial risk", "Limited oversight", "No payment protection", "No milestone governance", "No independent verification", "Dispute-prone projects"].map(
                (x) => (
                  <li key={x} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive" />
                    {x}
                  </li>
                ),
              )}
            </ul>
          </div>
          <div className="glass-card rounded-2xl border-gold/40 p-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-gold">
              With Lum Tech Pro SA
            </div>
            <p className="mt-4 text-lg">
              A trusted governance layer sits between every party — financial, professional, and
              procedural.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              {["Escrow", "BOQ Review", "Verification", "Specialist Sign-off", "Vouchers", "Audit Trail"].map(
                (x) => (
                  <div key={x} className="rounded-md border border-gold/30 bg-gold-soft px-3 py-2 text-center font-medium text-gold">
                    {x}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* Six Layers */}
      <Section id="layers" eyebrow="Our solution" title="Six layers of protection." tone="muted">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LAYERS.map((l, i) => (
            <div key={l.title} className="glass-card rounded-2xl p-6 transition hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <l.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  LAYER {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{l.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{l.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* How it works timeline */}
      <Section id="how" eyebrow="How it works" title="A fully auditable construction journey." tone="hero">
        <ol className="relative space-y-6 border-l border-gold/40 pl-8">
          {FLOW.map((step, i) => (
            <li key={step} className="relative">
              <span className="absolute -left-[42px] flex h-8 w-8 items-center justify-center rounded-full border border-gold/50 bg-background text-xs font-bold text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="rounded-lg border border-border/60 bg-card/70 p-4 font-display text-lg font-semibold">
                {step}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Clients */}
      <Section id="clients" eyebrow="Benefits · Clients" title={<><Building2 className="mr-2 inline-block h-9 w-9 text-primary" /> Why clients choose us</>}>
        <div className="grid gap-3 sm:grid-cols-2">
          {CLIENTS.map((b) => (
            <div key={b} className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/60 p-4">
              <ClipboardCheck className="mt-0.5 h-5 w-5 text-primary" />
              <span className="font-medium">{b}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Contractors */}
      <Section id="contractors" eyebrow="Benefits · Contractors" title={<><HardHat className="mr-2 inline-block h-9 w-9 text-gold" /> Why contractors choose us</>} tone="muted">
        <p className="text-lg text-muted-foreground">Unlike traditional lead platforms:</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {CONTRACTORS_NO.map((b) => (
            <div key={b} className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-center font-semibold text-destructive">
              ✕ {b}
            </div>
          ))}
        </div>
        <p className="mt-10 text-lg">Verified contractors receive:</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CONTRACTORS_YES.map((b) => (
            <div key={b} className="glass-card rounded-lg p-4 font-medium">
              ✓ {b}
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-gold/40 bg-gold-soft p-6 text-center">
          <p className="font-display text-2xl font-bold text-gold">We do not sell leads.</p>
          <p className="mt-1 text-gold/80">We build contractor reputations.</p>
        </div>
      </Section>

      {/* Suppliers */}
      <Section id="suppliers" eyebrow="Benefits · Suppliers" title={<><Truck className="mr-2 inline-block h-9 w-9 text-primary" /> Why suppliers benefit</>}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SUPPLIERS.map((b) => (
            <div key={b} className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/60 p-4">
              <Receipt className="mt-0.5 h-5 w-5 text-primary" />
              <span className="font-medium">{b}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Market */}
      <Section id="market" eyebrow="Market opportunity" title="Target sectors across the built environment." tone="muted">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {["Residential", "Property Development", "Commercial", "Renovations", "Civil Infrastructure", "Government", "Housing Programmes", "Mixed-Use"].map((s) => (
            <div key={s} className="rounded-lg border border-border/60 bg-card/60 p-4 text-center font-medium">
              {s}
            </div>
          ))}
        </div>
      </Section>

      {/* Competitive */}
      <Section id="competitive" eyebrow="Competitive advantage" title="We are not a marketplace. We are infrastructure.">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Most platforms</div>
            <ul className="mt-4 space-y-3">
              {COMPETITORS.map((c) => (
                <li key={c} className="flex items-center gap-3 text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" /> {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card rounded-2xl border-gold/40 p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-gold">Lum Tech Pro SA</div>
            <ul className="mt-4 space-y-3">
              {US.map((c) => (
                <li key={c} className="flex items-center gap-3 font-medium">
                  <Award className="h-4 w-4 text-gold" /> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Vision */}
      <Section id="vision" eyebrow="Our vision" title="Africa's most trusted construction governance platform." tone="hero">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: ShieldCheck, t: "Construction fraud reduced" },
            { icon: Banknote, t: "Projects financially protected" },
            { icon: Award, t: "Contractors rewarded fairly" },
            { icon: Eye, t: "Procurement transparency" },
            { icon: ScrollText, t: "Every project auditable" },
            { icon: Globe2, t: "Scaling across Africa" },
          ].map((v) => (
            <div key={v.t} className="glass-card rounded-2xl p-6">
              <v.icon className="h-7 w-7 text-gold" />
              <p className="mt-3 font-display text-lg font-semibold">{v.t}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-blueprint opacity-[0.5]" />
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <h2 className="font-display text-4xl font-bold sm:text-6xl">
            Every project protected.
            <br />
            Every milestone verified.
            <br />
            <span className="text-gradient-gold">Every rand accounted for.</span>
          </h2>
          <p className="mt-6 font-display text-2xl font-semibold">Build Smarter. Pay Securely.</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-gradient-amber text-primary-foreground">
              <Link to="/signup">
                <Building2 className="h-4 w-4" /> Start a Project
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/signup">
                <HardHat className="h-4 w-4" /> Become a Contractor
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
