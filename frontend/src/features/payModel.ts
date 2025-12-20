import type {
  PayFrequency,
  TaxResidency,
  MedicareOption,
  SuperMode
} from './payTypes';

export const FREQUENCY_LABEL: Record<PayFrequency, string> = {
  weekly: 'Weekly',
  fortnightly: 'Fortnightly',
  monthly: 'Monthly',
  annual: 'Annual',
  fytd: 'FYTD'
};

export const PER_FACTOR: Record<PayFrequency, number> = {
  weekly: 52,
  fortnightly: 26,
  monthly: 12,
  annual: 1,
  fytd: 1
};

const getFinancialYearProgress = (): number => {
  const today = new Date();
  const year = today.getFullYear();
  const julyFirstThisYear = new Date(year, 6, 1);

  const isCurrentFy = today >= julyFirstThisYear;
  const fyStart = isCurrentFy
    ? julyFirstThisYear
    : new Date(year - 1, 6, 1);
  const fyEnd = isCurrentFy
    ? new Date(year + 1, 5, 30, 23, 59, 59, 999)
    : new Date(year, 5, 30, 23, 59, 59, 999);

  const elapsedMs = today.getTime() - fyStart.getTime();
  const totalMs = fyEnd.getTime() - fyStart.getTime();

  if (elapsedMs <= 0 || totalMs <= 0) {
    return 1;
  }

  const ratio = elapsedMs / totalMs;
  return Math.min(Math.max(ratio, 0), 1);
};

export interface PayModelInputs {
  viewMode: 'simple' | 'advanced';
  grossAnnual: number;
  grossFytd: number | null;
  frequency: PayFrequency;
  residency: TaxResidency;
  claimTaxFree: boolean;
  medicare: MedicareOption;
  hasHelp: boolean;
  superMode: SuperMode;
  superRate: number;
  salarySacrifice: number;
}

export interface PayModelOutputs {
  useFytd: boolean;
  financialYearProgress: number;
  effectiveGrossAnnual: number;
  effectiveSalarySacrifice: number;
  taxableIncome: number;
  annualTax: number;
  medicareAmount: number;
  helpAmount: number;
  totalTax: number;
  netAnnual: number;
  employerSuper: number;
  salaryPortionAnnual: number;
  packageTotal: number;
}

export interface PayModelDependencies {
  calculateAnnualTax: (
    taxableIncome: number,
    residency: TaxResidency,
    claimTaxFree: boolean
  ) => number;
  calculateMedicare: (
    taxableIncome: number,
    medicare: MedicareOption
  ) => number;
  calculateHelpRepayments: (taxableIncome: number) => number;
  splitGrossIntoSalaryAndSuper: (
    gross: number,
    superRate: number
  ) => { employerSuper: number; salaryPortionAnnual: number };
}

export const buildPayModel = (
  inputs: PayModelInputs,
  deps: PayModelDependencies
): PayModelOutputs => {
  const {
    viewMode,
    grossAnnual,
    grossFytd,
    frequency,
    residency,
    claimTaxFree,
    medicare,
    hasHelp,
    superMode,
    superRate,
    salarySacrifice
  } = inputs;

  const {
    calculateAnnualTax,
    calculateMedicare,
    calculateHelpRepayments,
    splitGrossIntoSalaryAndSuper
  } = deps;

  const financialYearProgress = getFinancialYearProgress();
  const useFytd = frequency === 'fytd';

  const effectiveGrossAnnual = (() => {
    if (!useFytd) {
      return grossAnnual;
    }

    if (financialYearProgress <= 0 || !Number.isFinite(financialYearProgress)) {
      return grossAnnual;
    }

    const baseFytd =
      grossFytd !== null && Number.isFinite(grossFytd)
        ? grossFytd
        : grossAnnual * financialYearProgress;

    if (baseFytd <= 0) {
      return 0;
    }

    return baseFytd / financialYearProgress;
  })();

  const effectiveSalarySacrifice =
    viewMode === 'advanced' ? salarySacrifice : 0;

  const taxableIncome = Math.max(
    effectiveGrossAnnual - effectiveSalarySacrifice,
    0
  );

  const annualTax = calculateAnnualTax(taxableIncome, residency, claimTaxFree);
  const medicareAmount = calculateMedicare(taxableIncome, medicare);
  const helpAmount = hasHelp ? calculateHelpRepayments(taxableIncome) : 0;

  const totalTax = annualTax + medicareAmount + helpAmount;

  const netAnnual = Math.max(
    effectiveGrossAnnual - totalTax - effectiveSalarySacrifice,
    0
  );

  const superRateDecimal = Math.max(superRate, 0) / 100;
  const { employerSuper, salaryPortionAnnual } =
    superMode === 'ontop'
      ? {
          employerSuper: effectiveGrossAnnual * superRateDecimal,
          salaryPortionAnnual: effectiveGrossAnnual
        }
      : splitGrossIntoSalaryAndSuper(effectiveGrossAnnual, superRateDecimal);

  const packageTotal = salaryPortionAnnual + employerSuper;

  return {
    useFytd,
    financialYearProgress,
    effectiveGrossAnnual,
    effectiveSalarySacrifice,
    taxableIncome,
    annualTax,
    medicareAmount,
    helpAmount,
    totalTax,
    netAnnual,
    employerSuper,
    salaryPortionAnnual,
    packageTotal
  };
};
