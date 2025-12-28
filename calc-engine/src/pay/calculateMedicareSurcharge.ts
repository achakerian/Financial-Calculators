/**
 * Medicare Levy Surcharge (MLS) Calculation
 *
 * The MLS is a levy paid by Australian taxpayers who don't have private hospital cover
 * and earn above certain income thresholds. The surcharge is in addition to the
 * standard 2% Medicare levy.
 *
 * MLS Tiers for singles (2024-25, 2025-26):
 * - $0 - $97,000: No surcharge
 * - $97,001 - $113,000: 1%
 * - $113,001 - $151,000: 1.25%
 * - $151,001+: 1.5%
 *
 * Family thresholds:
 * - Couples/families: $194,000 base threshold
 * - Additional per dependent child (after first): $1,500
 * - Tier boundaries scale proportionally with effective threshold
 *
 * @see https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge
 */

import type { TaxYearId, FamilyStatus } from './types';
import { TAX_YEAR_MAP } from './taxYearData';

const clamp0 = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);

/**
 * Calculate Medicare Levy Surcharge
 *
 * @param taxYear - Tax year ID
 * @param taxableIncome - Annual taxable income
 * @param hasPrivateHealth - Whether taxpayer has private hospital cover
 * @param familyStatus - Family status (single or partnered)
 * @param dependents - Number of dependent children (applies to both single and partnered)
 * @returns MLS amount (always >= 0)
 *
 * @example
 * // Singles
 * calculateMedicareSurcharge('2024-25', 90000, false, 'single', 0)   // Returns 0 (below threshold)
 * calculateMedicareSurcharge('2024-25', 100000, false, 'single', 0)  // Returns 1000 (1% of income)
 * calculateMedicareSurcharge('2024-25', 100000, true, 'single', 0)   // Returns 0 (has private health)
 * calculateMedicareSurcharge('2024-25', 100000, false, 'single', 1)  // Returns 0 (single parent uses family threshold = $194k)
 *
 * // Partnered
 * calculateMedicareSurcharge('2024-25', 200000, false, 'partnered', 0)  // Returns 2000 (1% of income)
 * calculateMedicareSurcharge('2024-25', 205000, false, 'partnered', 2)  // Returns 2050 (1%, threshold = $200k)
 */
export function calculateMedicareSurcharge(
  taxYear: TaxYearId,
  taxableIncome: number,
  hasPrivateHealth: boolean,
  familyStatus: FamilyStatus = 'single',
  dependents: number = 0
): number {
  // No surcharge if has private health insurance
  if (hasPrivateHealth) {
    return 0;
  }

  // Handle Infinity: return highest tier rate * Infinity = Infinity
  if (taxableIncome === Infinity) {
    return Infinity;
  }

  const income = clamp0(taxableIncome);

  // Get MLS configuration for this tax year
  const mlsConfig = TAX_YEAR_MAP[taxYear].medicareSurcharge;

  // Calculate effective threshold based on family status and dependents
  // Singles with dependents use family threshold (they are single parents)
  // ATO rule: family threshold increased by $1,500 for each child AFTER the first
  const hasFamily = familyStatus === 'partnered' || dependents > 0;
  const baseThreshold = hasFamily ? mlsConfig.familyThreshold : mlsConfig.singleThreshold;
  const dependentAdjustment = hasFamily ? Math.max(0, dependents - 1) * mlsConfig.perDependentAmount : 0;
  const effectiveThreshold = baseThreshold + dependentAdjustment;

  // Check if below threshold (no surcharge)
  if (income <= effectiveThreshold) {
    return 0;
  }

  // Scale tier boundaries proportionally (only for tiers above threshold)
  const thresholdScaleFactor = effectiveThreshold / mlsConfig.singleThreshold;
  const scaledTiers = mlsConfig.tiers
    .filter(tier => tier.rate > 0) // Only scale tiers with actual surcharge
    .map(tier => ({
      from: tier.from * thresholdScaleFactor,
      to: tier.to ? tier.to * thresholdScaleFactor : undefined,
      rate: tier.rate
    }));

  // Find applicable tier
  const tier = scaledTiers.find(
    (t) => income >= t.from && (!t.to || income <= t.to)
  );

  return (tier?.rate ?? 0) * income;
}
