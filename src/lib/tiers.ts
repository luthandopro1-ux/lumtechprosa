export type Tier = 1 | 2 | 3;

export interface TierBreakdown {
  tier: Tier;
  tierLabel: string;
  workflow: string;
  /** Total platform fee % (charged to contractor on payout) */
  commissionPct: number;
  /** Always 0 under new model — client funds project value only. */
  clientPct: number;
  /** Platform fee % deducted from contractor payout. */
  builderPct: number;
  clientFee: number;
  builderFee: number;
  professionalFee: number;
  professionalPct: number;
  /** Total amount client must deposit into escrow (project value + optional in-house pros). */
  totalEscrow: number;
  /** Net amount contractor receives after platform fee. */
  contractorNet: number;
  contractorSuppliesMaterial: boolean;
}

// New Smart Revenue Distribution Engine breakpoints
export const TIER_BREAKPOINTS = {
  tier2Min: 250_001,
  tier3Min: 1_500_001,
} as const;

export function calculateTier(budgetZar: number): Tier {
  if (budgetZar <= 250_000) return 1;
  if (budgetZar <= 1_500_000) return 2;
  return 3;
}

export interface TierInput {
  budgetZar: number;
  useInhouseProfessionals: boolean;
  /** Tier 3 only: builder opts into Labour Only Protection */
  labourOnlyProtection?: boolean;
}

export function computeBreakdown({
  budgetZar,
  useInhouseProfessionals,
  labourOnlyProtection = false,
}: TierInput): TierBreakdown {
  const tier = calculateTier(budgetZar);
  let platformPct = 0;
  let workflow = "";
  let contractorSuppliesMaterial = true;
  let tierLabel = "";

  if (tier === 1) {
    platformPct = 10;
    workflow = "Builder supplies labour only. Client purchases materials directly.";
    contractorSuppliesMaterial = false;
    tierLabel = "Tier 1 · Micro / Minor Works (R0 – R250,000)";
  } else if (tier === 2) {
    platformPct = 8;
    workflow =
      "Lum Tech Pro SA full Project Management. Materials secured via closed-loop Supplier Vouchers.";
    contractorSuppliesMaterial = false;
    tierLabel = "Tier 2 · Standard Residential / Renovation (R250,001 – R1,500,000)";
  } else {
    platformPct = 6;
    if (labourOnlyProtection) {
      workflow =
        "Labour Only Protection active. Materials routed through Supplier Voucher network.";
      contractorSuppliesMaterial = false;
    } else {
      workflow = "Main Contractor supplies all material and labour.";
      contractorSuppliesMaterial = true;
    }
    tierLabel = "Tier 3 · Premium / Major Construction (R1,500,001+)";
  }

  // New model: contractor pays the platform fee out of payout. Client funds project value.
  const clientPct = 0;
  const builderPct = platformPct;
  const clientFee = 0;
  const builderFee = Math.round(budgetZar * (builderPct / 100));
  const professionalPct = useInhouseProfessionals ? 5 : 0;
  const professionalFee = Math.round(budgetZar * (professionalPct / 100));

  const totalEscrow = budgetZar + professionalFee;
  const contractorNet = budgetZar - builderFee;

  return {
    tier,
    tierLabel,
    workflow,
    commissionPct: platformPct,
    clientPct,
    builderPct,
    clientFee,
    builderFee,
    professionalFee,
    professionalPct,
    totalEscrow,
    contractorNet,
    contractorSuppliesMaterial,
  };
}
