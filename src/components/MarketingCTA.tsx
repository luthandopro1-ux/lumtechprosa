import { Link } from "@tanstack/react-router";
import { ArrowRight, HardHat, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MarketingCTA({
  eyebrow = "Get started",
  title = "Build smarter. Pay securely.",
  body = "Whether you're funding a project or building one, Lum Tech Pro SA gives you escrow protection, verified professionals, and milestone-controlled payments.",
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-gradient-hero">
      <div className="absolute inset-0 bg-blueprint opacity-[0.45]" />
      <div className="pointer-events-none absolute -top-32 -right-20 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl animate-drift" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl animate-drift" />
      <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold-soft px-3 py-1 text-xs font-medium text-gold">
          {eyebrow}
        </div>
        <h2 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">{body}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="bg-gradient-amber text-primary-foreground">
            <Link to="/signup">
              <Building2 className="h-4 w-4" /> Start a Project <ArrowRight className="h-4 w-4" />
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
  );
}

export function PageHero({
  eyebrow,
  title,
  highlight,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-gradient-hero">
      <div className="absolute inset-0 bg-blueprint opacity-[0.5]" />
      <div className="pointer-events-none absolute -top-40 -right-20 h-[480px] w-[480px] rounded-full bg-primary/15 blur-3xl animate-drift" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-[440px] w-[440px] rounded-full bg-gold/10 blur-3xl animate-drift" />
      <div className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6 sm:py-32 animate-fade-in">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {eyebrow}
        </div>
        <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          {title}
          {highlight ? (
            <>
              {" "}
              <span className="text-gradient-gold">{highlight}</span>
            </>
          ) : null}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
      </div>
    </section>
  );
}
