import { describe, it, expect } from 'vitest';
import { TAX_YEAR_MAP, createTaxCalculators } from './taxConfig';
import type { TaxResidency, MedicareOption } from './payTypes';

// Use a specific year so tests remain stable even if the
// default year changes in the UI.
const currentConfig = TAX_YEAR_MAP['2023-24'];
const calcs = createTaxCalculators(currentConfig);

const asResident: TaxResidency = 'resident';
const asForeign: TaxResidency = 'foreign';
const fullMedicare: MedicareOption = 'full';
const reducedMedicare: MedicareOption = 'reduced';
const exemptMedicare: MedicareOption = 'exempt';

describe('taxConfig – income tax', () => {
  it('calculates resident tax for a mid-range income using brackets', () => {
    const income = 60000;

    const tax = calcs.calculateAnnualTax(income, asResident, true);

    // Manual 2024–25 style resident calculation:
    // 0 – 18,200: 0
    // 18,201 – 45,000 @ 19% => 26,800 * 0.19 = 5,092
    // 45,001 – 60,000 @ 32.5% => 15,000 * 0.325 = 4,875
    // Total ≈ 9,967
    const expected = 5092 + 15000 * 0.325;
    expect(tax).toBeCloseTo(expected, 2);
  });

  it('calculates non-resident tax with flat bands', () => {
    const income = 60000;

    const tax = calcs.calculateAnnualTax(income, asForeign, false);

    // Simple non-resident approximation: 32% up to 120k.
    const expected = income * 0.32;
    expect(tax).toBeCloseTo(expected, 2);
  });
});

describe('taxConfig – medicare levy', () => {
  it('applies full and reduced rates, and supports exemption', () => {
    const income = 80000;

    const full = calcs.calculateMedicare(income, fullMedicare);
    const reduced = calcs.calculateMedicare(income, reducedMedicare);
    const exempt = calcs.calculateMedicare(income, exemptMedicare);

    expect(full).toBeCloseTo(income * currentConfig.medicare.fullRate, 2);
    expect(reduced).toBeCloseTo(income * currentConfig.medicare.reducedRate, 2);
    expect(exempt).toBe(0);
  });
});

describe('taxConfig – HELP thresholds', () => {
  it('returns zero below the first threshold', () => {
    const belowFirst = currentConfig.helpThresholds[0].minIncome - 1000;
    const amount = calcs.calculateHelpRepayments(belowFirst);
    expect(amount).toBe(0);
  });

  it('applies the highest matching HELP rate for higher incomes', () => {
    const lastBand = currentConfig.helpThresholds[currentConfig.helpThresholds.length - 1];
    const income = lastBand.minIncome + 10000;

    const amount = calcs.calculateHelpRepayments(income);
    const expected = income * lastBand.rate;

    expect(amount).toBeCloseTo(expected, 2);
  });
});
