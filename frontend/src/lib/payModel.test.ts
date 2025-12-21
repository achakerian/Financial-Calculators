import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { buildPayModel, FREQUENCY_LABEL, PER_FACTOR } from './payModel';
import { TAX_YEAR_MAP, createTaxCalculators, DEFAULT_TAX_YEAR_ID } from './taxConfig';
import type { PayModelInputs } from './payModel';
import type { PayFrequency, TaxResidency, MedicareOption, SuperMode } from './payTypes';

const taxConfig = TAX_YEAR_MAP[DEFAULT_TAX_YEAR_ID];
const taxCalcs = createTaxCalculators(taxConfig);

const asResident: TaxResidency = 'resident';
const fullMedicare: MedicareOption = 'full';
const superOntop: SuperMode = 'ontop';

const buildInputs = (overrides: Partial<PayModelInputs> = {}): PayModelInputs => ({
  viewMode: 'simple',
  grossAnnual: 100000,
  grossFytd: null,
  frequency: 'weekly' as PayFrequency,
  residency: asResident,
  claimTaxFree: true,
  medicare: fullMedicare,
  hasHelp: false,
  superMode: superOntop,
  superRate: 11.5,
  salarySacrifice: 0,
  ...overrides
});

const deps = {
  calculateAnnualTax: taxCalcs.calculateAnnualTax,
  calculateMedicare: taxCalcs.calculateMedicare,
  calculateHelpRepayments: taxCalcs.calculateHelpRepayments,
  splitGrossIntoSalaryAndSuper: (gross: number, superRate: number) => {
    if (superRate <= 0) {
      return { employerSuper: 0, salaryPortionAnnual: gross };
    }
    const salaryPortionAnnual = gross / (1 + superRate);
    const employerSuper = gross - salaryPortionAnnual;
    return { employerSuper, salaryPortionAnnual };
  }
};

describe('payModel – basic properties', () => {
  it('uses grossAnnual directly when not in FYTD mode', () => {
    const model = buildPayModel(buildInputs(), deps);

    expect(model.useFytd).toBe(false);
    expect(model.effectiveGrossAnnual).toBe(100000);
    expect(model.netAnnual).toBeGreaterThan(0);
    expect(model.totalTax).toBeGreaterThan(0);
  });

  it('derives per-frequency factors consistently', () => {
    // Sanity check that frequency labels and factors line up with expectations.
    expect(FREQUENCY_LABEL.weekly).toBe('Weekly');
    expect(PER_FACTOR.weekly).toBe(52);
    expect(PER_FACTOR.annual).toBe(1);
  });
});

describe('payModel – FYTD projection', () => {
  const fixedNow = new Date('2025-01-01T12:00:00Z');

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('projects FYTD income to an annual equivalent when frequency is fytd', () => {
    const fytdIncome = 50000;

    const model = buildPayModel(
      buildInputs({
        frequency: 'fytd' as PayFrequency,
        grossFytd: fytdIncome
      }),
      deps
    );

    expect(model.useFytd).toBe(true);
    expect(model.financialYearProgress).toBeGreaterThan(0);
    expect(model.financialYearProgress).toBeLessThanOrEqual(1);

    const expectedAnnual = fytdIncome / model.financialYearProgress;
    expect(model.effectiveGrossAnnual).toBeCloseTo(expectedAnnual, 2);
  });
});

