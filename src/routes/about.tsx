import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldCheck,
  Eye,
  Award,
  CheckCircle2,
  Users,
  ScrollText,
  Target,
  Compass,
} from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/MarketingShell";
import { MarketingCTA, PageHero } from "@/components/MarketingCTA";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us · Lum Tech Pro SA" },
      {
        name: "description",
        content:
          "Lum Tech Pro SA is South Africa's construction fintech and procurement governance platform — escrow-protected, BOQ-reviewed, specialist-approved.",
      },
      { property: "og:title", content: "About Lum Tech Pro SA" },
      {
        property: "og:description",
        content:
          "Building trust into every construction project through escrow, contractor verification, BOQ review and milestone governance.",
      },
    ],
  }),
  component: AboutPage,
});

const PRINCIPLES = [
  { icon: Eye, title: "Transparency", body: "Every transaction visible and auditable." },
  { icon: ShieldCheck, title: "Protection", body: "Project funds are secured, not assumed safe." },
  { icon: Award, title: "Accountability", body: "Professionals stand behind their sign-off." },
  { icon: CheckCircle2, title: "Verified Delivery", body: "Milestones approved before funds move." },
  { icon: Users, title: "Fair Opportunity", body: "Compliant contractors compete on merit." },
  { icon: ScrollText, title: "Digital Governance", body: "Auditable from procurement to handover." },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader />
      <PageHero
        eyebrow="About Lum Tech Pro SA"
        title="Building trust into every"
        highlight="construction project."
        subtitle="A South African construction fintech and procurement governance platform — combining escrow-secured payments, independent BOQ verification, contractor vetting, professional oversight, and milestone-based fund release."
      />

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 animate-fade-in">
        <div className="prose prose-invert max-w-none text-lg leading-relaxed text-muted-foreground">
          <p>
            Lum Tech Pro SA was created to address some of the construction industry's most
            persistent challenges: fraud, project abandonment, payment disputes, cost overruns,
            material misuse, and lack of accountability.
          </p>
          <p className="mt-6">
            By combining financial protection, construction governance, and digital project
            management into a single ecosystem, we help clients, contractors, developers, suppliers,
            and professionals work together with greater confidence and transparency.
          </p>
          <p className="mt-6">
            Every project follows a governed workflow that ensures funds are protected, contractors
            are verified, Bills of Quantities are independently reviewed, and milestone payments are
            released only once approved by qualified professionals.
          </p>
        </div>
      </section>

      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-20 sm:px-6 md:grid-cols-2">
          <div className="glass-card rounded-2xl p-8 animate-fade-in">
            <Compass className="h-8 w-8 text-gold" />
            <h3 className="mt-4 font-display text-2xl font-bold">Our Vision</h3>
            <p className="mt-3 text-muted-foreground">
              To become Africa's most trusted construction governance and escrow infrastructure
              platform.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-8 animate-fade-in">
            <Target className="h-8 w-8 text-primary" />
            <h3 className="mt-4 font-display text-2xl font-bold">Our Mission</h3>
            <p className="mt-3 text-muted-foreground">
              To transform construction procurement through technology, financial protection,
              professional accountability, and transparent project governance.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold-soft px-3 py-1 text-xs font-medium text-gold">
            Core principles
          </div>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight">
            What we stand for
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="glass-card rounded-xl p-6 transition hover:-translate-y-1">
              <p.icon className="h-7 w-7 text-primary" />
              <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Why we exist</h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Construction projects often fail because trust alone is expected to manage large
            financial commitments. Lum Tech Pro SA introduces a governed framework where trust is
            supported by verification, professional oversight, compliance controls, and escrow
            protection.
          </p>
          <p className="mt-8 font-display text-2xl font-semibold text-gradient-gold">
            Build Smarter. Pay Securely.
          </p>
        </div>
      </section>

      <MarketingCTA />
      <MarketingFooter />
    </div>
  );
}
