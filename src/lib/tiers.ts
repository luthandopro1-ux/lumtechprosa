export type Tier = 1 | 2 | 3;

export interface TierBreakdown {
  tier: Tier;
  tierLabel: string;
  workflow: string;
  commissionPct: number;
  clientPct: number;
  builderPct: number;
  clientFee: number;
  builderFee: number;
  professionalFee: number;
  professionalPct: number;
  totalEscrow: number;
  contractorSuppliesMaterial: boolean;
}

export const TIER_BREAKPOINTS = {
  tier2Min: 150_001,
  tier3Min: 1_500_001,
} as const;

export function calculateTier(budgetZar: number): Tier {
  if (budgetZar <= 150_000) return 1;
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
  let clientPct = 0;
  let builderPct = 0;
  let workflow = "";
  let contractorSuppliesMaterial = true;
  let tierLabel = "";

  if (tier === 1) {
    clientPct = 5;
    builderPct = 5;
    workflow = "Builder supplies labour only. Client purchases materials directly.";
    contractorSuppliesMaterial = false;
    tierLabel = "Tier 1 · Micro / Minor Works";
  } else if (tier === 2) {
    clientPct = 4;
    builderPct = 4;
    workflow =
      "LUM TECH PRO SA full Project Management. Materials secured via closed-loop Supplier Vouchers.";
    contractorSuppliesMaterial = false;
    tierLabel = "Tier 2 · Standard Residential / Renovation";
  } else {
    clientPct = 3;
    builderPct = 3;
    if (labourOnlyProtection) {
      workflow =
        "Labour Only Protection active. Materials routed through Supplier Voucher network.";
      contractorSuppliesMaterial = false;
    } else {
      workflow = "Main Contractor supplies all material and labour.";
      contractorSuppliesMaterial = true;
    }
    tierLabel = "Tier 3 · Premium / Major Construction";
  }

  const clientFee = Math.round(budgetZar * (clientPct / 100));
  const builderFee = Math.round(budgetZar * (builderPct / 100));
  const professionalPct = useInhouseProfessionals ? 5 : 0;
  const professionalFee = Math.round(budgetZar * (professionalPct / 100));

  const totalEscrow = budgetZar + clientFee + professionalFee;

  return {
    tier,
    tierLabel,
    workflow,
    commissionPct: clientPct + builderPct,
    clientPct,
    builderPct,
    clientFee,
    builderFee,
    professionalFee,
    professionalPct,
    totalEscrow,
    contractorSuppliesMaterial,
  };
}
