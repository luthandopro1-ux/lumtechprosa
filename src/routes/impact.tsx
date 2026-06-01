import { createFileRoute } from "@tanstack/react-router";
import { Lock, ClipboardCheck, Award, HardHat, ScrollText, TrendingUp } from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/MarketingShell";
import { MarketingCTA, PageHero } from "@/components/MarketingCTA";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Our Impact · Lum Tech Pro SA" },
      {
        name: "description",
        content:
          "How Lum Tech Pro SA is modernising South African construction through governance, escrow protection, and professional oversight.",
      },
      { property: "og:title", content: "Our Impact — Lum Tech Pro SA" },
      {
        property: "og:description",
        content:
          "Protecting project capital, improving accountability, supporting quality delivery, and empowering verified contractors.",
      },
    ],
  }),
  component: ImpactPage,
});

const STATS = [
  { value: "6", label: "Layers of project protection" },
  { value: "100%", label: "Milestone-based fund releases" },
  { value: "0", label: "Lead fees charged to verified contractors" },
  { value: "1", label: "Auditable record per project" },
];

const IMPACTS = [
  {
    icon: Lock,
    title: "Protecting Project Capital",
    body: "Escrow-secured payments reduce financial risk and increase stakeholder confidence.",
  },
  {
    icon: ClipboardCheck,
    title: "Improving Accountability",
    body: "Every milestone is independently verified before funds are released.",
  },
  {
    icon: Award,
    title: "Supporting Quality Delivery",
    body: "Professional oversight maintains standards throughout the project lifecycle.",
  },
  {
    icon: HardHat,
    title: "Empowering Contractors",
    body: "Verified contractors gain access to opportunities based on merit and performance.",
  },
  {
    icon: ScrollText,
    title: "Strengthening Industry Trust",
    body: "Every project creates a transparent, auditable record from procurement to completion.",
  },
  {
    icon: TrendingUp,
    title: "Scaling Across Africa",
    body: "Building the digital infrastructure for safer, smarter construction beyond South Africa.",
  },
];

function ImpactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader />
      <PageHero
        eyebrow="Our impact"
        title="Building the future of construction"
        highlight="governance."
        subtitle="Construction is one of the world's largest industries — yet many projects still rely on fragmented processes and limited oversight. Lum Tech Pro SA is helping modernise the built environment through a new standard of accountability."
      />

      <section className="border-b border-border/60 bg-card/30">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="glass-card rounded-2xl p-6 text-center transition hover:-translate-y-1"
            >
              <div className="font-display text-5xl font-bold text-gradient-gold">{s.value}</div>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            What we change
          </div>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight">
            Six dimensions of impact
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {IMPACTS.map((i) => (
            <div key={i.title} className="glass-card rounded-2xl p-6 transition hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold-soft text-gold">
                <i.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{i.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{i.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-gradient-hero">
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <div className="absolute inset-0 bg-blueprint opacity-[0.4]" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Every project protected. Every milestone verified.
              <br />
              <span className="text-gradient-gold">Every rand accounted for.</span>
            </h2>
          </div>
        </div>
      </section>

      <MarketingCTA eyebrow="Join the movement" title="Be part of a safer construction industry." />
      <MarketingFooter />
    </div>
  );
}
