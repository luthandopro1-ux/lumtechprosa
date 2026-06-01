import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  ShieldOff,
  Banknote,
  FileX,
  PackageX,
  UserX,
  ShieldCheck,
  BadgeCheck,
  FileSearch,
  HardHat,
  Ticket,
  Lock,
} from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/MarketingShell";
import { MarketingCTA, PageHero } from "@/components/MarketingCTA";

export const Route = createFileRoute("/problem")({
  head: () => ({
    meta: [
      { title: "The Problem We Solve · Lum Tech Pro SA" },
      {
        name: "description",
        content:
          "Construction shouldn't be a gamble. Lum Tech Pro SA brings six layers of protection to South African construction projects.",
      },
      { property: "og:title", content: "The Problem We Solve" },
      {
        property: "og:description",
        content:
          "Fraud, abandonment, cost overruns, payment disputes — and the governed platform that fixes them.",
      },
    ],
  }),
  component: ProblemPage,
});

const CHALLENGES = [
  { icon: UserX, title: "Contractor fraud" },
  { icon: ShieldOff, title: "Project abandonment" },
  { icon: Banknote, title: "Cost overruns" },
  { icon: FileX, title: "Inflated quotations" },
  { icon: AlertTriangle, title: "Payment disputes" },
  { icon: PackageX, title: "Material theft & misuse" },
  { icon: UserX, title: "Unverified contractors" },
  { icon: ShieldOff, title: "Limited accountability" },
];

const SOLUTIONS = [
  {
    icon: Lock,
    title: "Escrow Protection",
    body: "Project funds remain protected until approved milestones are achieved.",
  },
  {
    icon: BadgeCheck,
    title: "Contractor Verification",
    body: "All contractors undergo compliance and reputation checks before participation.",
  },
  {
    icon: FileSearch,
    title: "Independent BOQ Review",
    body: "Bills of Quantities are reviewed by qualified Quantity Surveyors.",
  },
  {
    icon: ShieldCheck,
    title: "Professional Oversight",
    body: "Registered specialists verify project progress and quality standards.",
  },
  {
    icon: Ticket,
    title: "Voucher-Controlled Procurement",
    body: "Material allocations are tracked through secure voucher systems.",
  },
  {
    icon: HardHat,
    title: "Milestone-Based Payments",
    body: "Funds are released only once work is independently approved.",
  },
];

function ProblemPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader />
      <PageHero
        eyebrow="The problem we solve"
        title="Construction shouldn't be a"
        highlight="gamble."
        subtitle="Property owners, developers, contractors, and suppliers across South Africa face significant risk at every stage of the construction lifecycle. Lum Tech Pro SA replaces blind trust with a governed framework."
      />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
            Industry challenges
          </div>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight">
            What's going wrong on site
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            These risks create uncertainty, delays, and financial losses for every party involved.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHALLENGES.map((c) => (
            <div
              key={c.title}
              className="rounded-xl border border-border/60 bg-card/60 p-5 transition hover:border-destructive/40"
            >
              <c.icon className="h-6 w-6 text-destructive" />
              <p className="mt-3 font-display text-base font-semibold">{c.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold-soft px-3 py-1 text-xs font-medium text-gold">
              Our solution
            </div>
            <h2 className="mt-5 font-display text-4xl font-bold tracking-tight">
              Six layers of protection
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              A governed platform that protects every stakeholder, from procurement to handover.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((s, i) => (
              <div
                key={s.title}
                className="glass-card rounded-2xl p-6 transition hover:-translate-y-1"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    LAYER {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">The result</h2>
        <p className="mt-6 text-lg text-muted-foreground">
          Greater trust, reduced risk, improved accountability, and better project outcomes — for
          every party at the table.
        </p>
      </section>

      <MarketingCTA
        title="Stop gambling with your project."
        body="Post a project on a governed platform, or join the verified contractor network."
      />
      <MarketingFooter />
    </div>
  );
}
