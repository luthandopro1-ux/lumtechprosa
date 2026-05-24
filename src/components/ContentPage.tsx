import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingHeader, MarketingFooter } from "./MarketingShell";
import type { MarketingPage } from "@/lib/marketing-content";

export function ContentPage({ page }: { page: MarketingPage }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader />
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="text-xs font-medium uppercase tracking-wider text-primary">
            {page.kicker}
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {page.title}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">{page.intro}</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-4xl space-y-10 px-4 sm:px-6">
          {page.sections.map((s) => (
            <div key={s.heading}>
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                {s.heading}
              </h2>
              <p className="mt-3 text-muted-foreground">{s.body}</p>
            </div>
          ))}
          <div className="flex flex-wrap gap-3 pt-6">
            <Button asChild size="lg" className="bg-gradient-amber text-primary-foreground shadow-glow">
              <Link to="/signup">
                Start a project <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Talk to us</Link>
            </Button>
          </div>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
