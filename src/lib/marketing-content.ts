export interface MarketingPage {
  title: string;
  kicker: string;
  intro: string;
  sections: { heading: string; body: string }[];
}

export const SERVICES: Record<string, MarketingPage> = {
  "quantity-surveying": {
    title: "Quantity Surveying",
    kicker: "Professional Services",
    intro:
      "Independent Quantity Surveyors verify your Bill of Quantities, market rates and milestone valuations on every Lum Tech Pro SA project.",
    sections: [
      {
        heading: "What our QS team delivers",
        body: "Detailed BoQ review, cost-plan benchmarking against current KZN market rates, variation control and signed milestone valuation certificates before any escrow release.",
      },
      {
        heading: "Why it matters",
        body: "Independent measurement protects clients from overpaying and protects honest contractors from being underpaid. Every certified milestone is fully auditable.",
      },
    ],
  },
  "structural-engineering": {
    title: "Structural Engineering",
    kicker: "Professional Services",
    intro:
      "Registered Engineers conduct phase inspections — foundations, slabs, roof structures — and certify compliance against the National Building Regulations and SANS 10400.",
    sections: [
      {
        heading: "Phase inspections",
        body: "Foundation sign-off, slab sign-off, roof sign-off and final structural compliance certificate, each issued by a Pr.Eng or PrTechEng registered with ECSA.",
      },
      {
        heading: "Compliance you can prove",
        body: "Inspection reports are attached to the project record and become part of the escrow release trail, giving you defensible documentation for resale and insurance.",
      },
    ],
  },
  "project-management": {
    title: "Project Management",
    kicker: "Professional Services",
    intro:
      "End-to-end milestone management — programme, procurement, valuations and stakeholder communication — handled by the Lum Tech Pro SA team.",
    sections: [
      {
        heading: "From kickoff to handover",
        body: "We split every build into transparent phases, track the programme, and coordinate professionals, contractors and suppliers in one workspace.",
      },
      {
        heading: "One source of truth",
        body: "Every photo, valuation, variation, voucher and escrow release lives on the project timeline, accessible to every authorised stakeholder.",
      },
    ],
  },
  "compliance-permits": {
    title: "Compliance & Permits",
    kicker: "Professional Services",
    intro:
      "Local-authority plan submissions, occupation certificates and SANS-aligned compliance documentation managed by our professional team.",
    sections: [
      {
        heading: "Plans & approvals",
        body: "We coordinate architectural plan submissions, council comments and approvals across KZN municipalities and major SA metros.",
      },
      {
        heading: "Occupation & sign-off",
        body: "We assemble the inspection trail required for a clean Occupation Certificate — engineer, electrical (CoC) and plumbing sign-offs included.",
      },
    ],
  },
};

export const CONSTRUCTION: Record<string, MarketingPage> = {
  "residential": {
    title: "Residential Renovations",
    kicker: "Construction",
    intro:
      "Extensions, remodels and new builds for homeowners — protected end-to-end by escrow, QS verification and engineer sign-off.",
    sections: [
      {
        heading: "Built for homeowners",
        body: "Most residential projects fall into Tier 2 (R150k–R1.5m) with full milestone management, voucher-based material procurement and a single fixed monthly view.",
      },
      {
        heading: "No surprises",
        body: "Variations are quoted, approved and tracked in the open. Money releases only after a professional certifies the milestone.",
      },
    ],
  },
  "commercial": {
    title: "Commercial Builds",
    kicker: "Construction",
    intro:
      "Transparent, milestone-tracked contractor procurement for developers and businesses — with rigorous QS and engineering audit layers.",
    sections: [
      {
        heading: "Tier 3 (R1.5m+)",
        body: "Main contractor supplies materials by default. Optional in-house QS, Engineer and Surveyor add-on (+5%) for the highest level of project assurance.",
      },
      {
        heading: "Procurement governance",
        body: "Contractor vetting, BBBEE-aware shortlisting, locked-in valuations and audit-ready records for boards and lenders.",
      },
    ],
  },
  "contractor-vetting": {
    title: "Contractor Vetting",
    kicker: "Construction",
    intro:
      "Every contractor on Lum Tech Pro SA is identity-verified, trade-checked and continuously rated against delivered milestones.",
    sections: [
      {
        heading: "Vetting checks",
        body: "CIPC verification, ID validation, tax compliance, NHBRC where applicable, trade references and prior project ratings on the platform.",
      },
      {
        heading: "Continuous reputation",
        body: "Performance on every milestone updates the contractor's rating — payment record, quality and on-time delivery are all reflected.",
      },
    ],
  },
  "material-vouchers": {
    title: "Material Vouchers",
    kicker: "Construction",
    intro:
      "Closed-loop 12-digit construction vouchers that builders redeem at KZN material suppliers via QR scan, with instant audited settlement.",
    sections: [
      {
        heading: "How vouchers work",
        body: "Clients (or corporate partners) pre-fund material allocations. Builders redeem at participating suppliers. Funds settle on scan, locked to construction materials only.",
      },
      {
        heading: "Corporate & partner programmes",
        body: "Housing funds, employers and B2B partners issue ring-fenced credits — ideal for staff housing benefits, ESG programmes or subsidised local builds.",
      },
    ],
  },
};

export const LEGAL: Record<string, MarketingPage> = {
  "terms": {
    title: "Terms of Service",
    kicker: "Legal",
    intro:
      "These terms govern use of the Lum Tech Pro SA managed marketplace by clients, contractors, professionals and suppliers.",
    sections: [
      {
        heading: "Marketplace role",
        body: "Lum Tech Pro SA operates as a managed marketplace and project-management platform. We are not the main contractor — construction work is delivered by independent vetted contractors.",
      },
      {
        heading: "Acceptable use",
        body: "Users may not circumvent escrow, falsify milestone evidence, or use the platform for fraudulent procurement. Violations result in account suspension and may be reported to authorities.",
      },
      {
        heading: "Limitation of liability",
        body: "Liability is limited to platform fees paid in the preceding 12 months, except for matters that may not be limited under South African law.",
      },
    ],
  },
  "privacy": {
    title: "Privacy Policy (POPIA)",
    kicker: "Legal",
    intro:
      "We process personal information in line with the Protection of Personal Information Act, 2013 (POPIA).",
    sections: [
      {
        heading: "Information we collect",
        body: "Account details, identity-verification data, project information, milestone evidence, payment routing details and platform usage telemetry.",
      },
      {
        heading: "How we use it",
        body: "To verify users, manage projects, release escrow, prevent fraud, comply with legal obligations and improve the platform. We do not sell personal information.",
      },
      {
        heading: "Your rights",
        body: "You may access, correct or request deletion of your personal information by contacting our Information Officer via the support desk.",
      },
    ],
  },
  "escrow": {
    title: "Escrow Agreement",
    kicker: "Legal",
    intro:
      "Project funds are held by TradeSafe (Pty) Ltd, an authorised Escrow Agent, in trust accounts at Standard Bank of South Africa.",
    sections: [
      {
        heading: "Trust account safeguards",
        body: "Funds are ring-fenced from operational accounts of Lum Tech Pro SA, TradeSafe and the contractor. They cannot be accessed without milestone certification.",
      },
      {
        heading: "Release conditions",
        body: "A release requires (a) contractor proof of completion, (b) professional sign-off by a QS or Engineer, and (c) no open dispute on the milestone.",
      },
      {
        heading: "Disputes",
        body: "Disputed milestones trigger a hold and structured resolution process, escalating to independent adjudication where required.",
      },
    ],
  },
  "sans-compliance": {
    title: "SANS Compliance",
    kicker: "Legal",
    intro:
      "All construction work coordinated through Lum Tech Pro SA is required to comply with the National Building Regulations and the relevant SANS 10400 standards.",
    sections: [
      {
        heading: "Standards we enforce",
        body: "SANS 10400 (general requirements), SANS 10400-B (foundations), SANS 10400-K (walls), SANS 10400-L (roofs) and other applicable parts depending on scope.",
      },
      {
        heading: "Evidence of compliance",
        body: "Engineer phase sign-offs, electrical Certificate of Compliance (CoC), plumbing CoC and gas CoC where applicable are attached to the project record.",
      },
    ],
  },
};

export const CONTENT_GROUPS = {
  services: SERVICES,
  construction: CONSTRUCTION,
  legal: LEGAL,
} as const;
