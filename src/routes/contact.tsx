import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/MarketingShell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact · Lum Tech Pro SA" },
      {
        name: "description",
        content:
          "Get in touch with the Lum Tech Pro SA support desk and regional offices in Johannesburg, Durban and Cape Town.",
      },
    ],
  }),
  component: ContactPage,
});

const OFFICES = [
  {
    id: "johannesburg",
    city: "Johannesburg",
    address: "Sandton Central, Gauteng",
    phone: "+27 11 000 0000",
  },
  {
    id: "durban",
    city: "Durban",
    address: "Umhlanga Ridge, KwaZulu-Natal",
    phone: "+27 31 000 0000",
  },
  {
    id: "cape-town",
    city: "Cape Town",
    address: "Century City, Western Cape",
    phone: "+27 21 000 0000",
  },
];

function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader />
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="text-xs font-medium uppercase tracking-wider text-primary">
            Contact
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Talk to the Lum Tech Pro SA team
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Reach the support desk or your nearest regional office. We typically respond within one
            business day.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-5">
              <Mail className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <div className="text-sm font-semibold">Support desk</div>
                <a
                  href="mailto:support@lumtechpro.co.za"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  support@lumtechpro.co.za
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-5">
              <Phone className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <div className="text-sm font-semibold">National line</div>
                <a
                  href="tel:+27860000000"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  +27 86 000 0000
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Regional offices</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {OFFICES.map((o) => (
              <div
                key={o.id}
                id={o.id}
                className="scroll-mt-24 rounded-xl border border-border bg-card p-6"
              >
                <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/15 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{o.city}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{o.address}</p>
                <a
                  href={`tel:${o.phone.replace(/\s/g, "")}`}
                  className="mt-3 inline-block text-sm text-primary hover:underline"
                >
                  {o.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
