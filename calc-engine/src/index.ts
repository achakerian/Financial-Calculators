export type RepaymentFrequency = 'weekly' | 'fortnightly' | 'monthly';

export type RepaymentType = 'principalAndInterest' | 'interestOnly';

export type RepaymentStrategy = 'reduceTerm' | 'reduceRepayment';

export interface RateChange {
  effectiveDate: string;
  annualRate: number;
}

export interface ExtraRepayment {
  effectiveDate: string;
  amount: number;
  recurring: boolean;
}

export interface OffsetConfig {
  startingBalance: number;
  monthlyContribution: number;
}

export interface FeeConfig {
  upfrontFee: number;
  monthlyFee: number;
  annualFee: number;
}

export interface LoanInputs {
  amount: number;
  annualRate: number;
  years: number;
  frequency: RepaymentFrequency;
  repaymentType: RepaymentType;
  repaymentStrategy: RepaymentStrategy;
  startDate: string;
  rateChanges?: RateChange[];
  offset?: OffsetConfig;
  extraRepayments?: ExtraRepayment[];
  fees?: FeeConfig;
}

export interface PeriodRow {
  date: string;
  periodIndex: number;
  openingBalance: number;
  interestCharged: number;
  principalPaid: number;
  extraRepayment: number;
  feesApplied: number;
  offsetBalance: number;
  closingBalance: number;
}

export interface AmortisationSummary {
  regularPayment: number;
  totalInterest: number;
  totalFees: number;
  totalPaid: number;
  payoffDate: string;
}

export interface AmortisationResult {
  summary: AmortisationSummary;
  schedule: PeriodRow[];
}

function frequencyToPeriodsPerYear(frequency: RepaymentFrequency): number {
  if (frequency === 'weekly') return 52;
  if (frequency === 'fortnightly') return 26;
  return 12;
}

function nextPeriodDate(current: Date, frequency: RepaymentFrequency): Date {
  const d = new Date(current.getTime());
  if (frequency === 'weekly') {
    d.setDate(d.getDate() + 7);
  } else if (frequency === 'fortnightly') {
    d.setDate(d.getDate() + 14);
  } else {
    d.setMonth(d.getMonth() + 1);
  }
  return d;
}

function findCurrentRate(
  baseRate: number,
  changes: RateChange[] | undefined,
  date: Date
): number {
  if (!changes || changes.length === 0) return baseRate;
  const sorted = [...changes].sort((a, b) =>
    a.effectiveDate.localeCompare(b.effectiveDate)
  );
  let rate = baseRate;
  for (const change of sorted) {
    const changeDate = new Date(change.effectiveDate);
    if (changeDate <= date) {
      rate = change.annualRate;
    } else {
      break;
    }
  }
  return rate;
}

function isSameOrAfter(a: Date, b: Date): boolean {
  return a.getTime() >= b.getTime();
}

function calculateBasePayment(
  amount: number,
  annualRate: number,
  years: number,
  frequency: RepaymentFrequency
): number {
  const paymentsPerYear = frequencyToPeriodsPerYear(frequency);
  const n = years * paymentsPerYear;
  const r = annualRate / 100 / paymentsPerYear;
  if (r === 0) {
    return amount / n;
  }
  return (amount * r) / (1 - Math.pow(1 + r, -n));
}

export function generateAmortisation(inputs: LoanInputs): AmortisationResult {
  const {
    amount,
    annualRate,
    years,
    frequency,
    repaymentType,
    repaymentStrategy,
    startDate,
    rateChanges,
    offset,
    extraRepayments,
    fees
  } = inputs;

  const paymentsPerYear = frequencyToPeriodsPerYear(frequency);
  const maxPeriods = years * paymentsPerYear;
  const start = new Date(startDate);

  let balance = amount;
  let offsetBalance = offset?.startingBalance ?? 0;
  let currentDate = new Date(start.getTime());

  const schedule: PeriodRow[] = [];
  let totalInterest = 0;
  let totalFees = fees?.upfrontFee ?? 0;
  let totalPaid = fees?.upfrontFee ?? 0;

  let regularPayment = calculateBasePayment(
    amount,
    annualRate,
    years,
    frequency
  );

  for (let i = 0; i < maxPeriods && balance > 0; i += 1) {
    const periodIndex = i + 1;
    const currentRate = findCurrentRate(annualRate, rateChanges, currentDate);
    const periodRate = currentRate / 100 / paymentsPerYear;

    const effectiveBalance = Math.max(0, balance - offsetBalance);
    const interestCharged = effectiveBalance * periodRate;

    let periodPayment = regularPayment;
    if (repaymentType === 'interestOnly') {
      periodPayment = interestCharged;
    }

    let extra = 0;
    if (extraRepayments && extraRepayments.length > 0) {
      for (const er of extraRepayments) {
        const erDate = new Date(er.effectiveDate);
        if (er.recurring) {
          if (isSameOrAfter(currentDate, erDate)) {
            extra += er.amount;
          }
        } else if (
          currentDate.getFullYear() === erDate.getFullYear() &&
          currentDate.getMonth() === erDate.getMonth() &&
          currentDate.getDate() === erDate.getDate()
        ) {
          extra += er.amount;
        }
      }
    }

    let periodFees = 0;
    if (fees) {
      periodFees += fees.monthlyFee;
      if (paymentsPerYear === 52) {
        periodFees = (fees.monthlyFee * 12) / 52;
      } else if (paymentsPerYear === 26) {
        periodFees = (fees.monthlyFee * 12) / 26;
      }
      if (periodIndex % paymentsPerYear === 1) {
        periodFees += fees.annualFee;
      }
    }

    if (offset && frequency === 'monthly') {
      offsetBalance += offset.monthlyContribution;
    }

    const principalPaid = Math.min(
      Math.max(periodPayment - interestCharged, 0) + extra,
      balance
    );
    const closingBalance = balance - principalPaid;

    totalInterest += interestCharged;
    totalFees += periodFees;
    totalPaid += periodPayment + extra + periodFees;

    schedule.push({
      date: currentDate.toISOString(),
      periodIndex,
      openingBalance: balance,
      interestCharged,
      principalPaid,
      extraRepayment: extra,
      feesApplied: periodFees,
      offsetBalance,
      closingBalance
    });

    balance = closingBalance;

    if (repaymentStrategy === 'reduceRepayment' && repaymentType === 'principalAndInterest') {
      const remainingYears = (maxPeriods - periodIndex) / paymentsPerYear;
      if (remainingYears > 0) {
        const newBaseRate = findCurrentRate(annualRate, rateChanges, currentDate);
        regularPayment = calculateBasePayment(
          balance,
          newBaseRate,
          remainingYears,
          frequency
        );
      }
    }

    currentDate = nextPeriodDate(currentDate, frequency);
  }

  const payoffDate = schedule.length
    ? schedule[schedule.length - 1].date
    : start.toISOString();

  return {
    summary: {
      regularPayment,
      totalInterest,
      totalFees,
      totalPaid,
      payoffDate
    },
    schedule
  };
}

export interface IncomeInput {
  amountAnnual: number;
  shadingFactor: number;
}

export interface LiabilityInput {
  monthlyRepayment: number;
}

export interface BorrowingCapacityInputs {
  incomes: IncomeInput[];
  livingExpensesMonthly: number;
  dependants: number;
  creditCardLimits: number;
  personalLoans: LiabilityInput[];
  carLoans: LiabilityInput[];
  hasHECS: boolean;
  baseRate: number;
  bufferRate: number;
  termYears: number;
  repaymentType: RepaymentType;
  expenseFloorMonthly?: number;
  depositPercent?: number;
}

export interface BorrowingCapacityResult {
  maxBorrowing: number;
  estimatedPurchasePrice: number;
  assessmentRate: number;
  limitingFactors: string[];
  capacityByRate: { rate: number; capacity: number }[];
}

export function estimateBorrowingCapacity(
  inputs: BorrowingCapacityInputs
): BorrowingCapacityResult {
  const {
    incomes,
    livingExpensesMonthly,
    dependants,
    creditCardLimits,
    personalLoans,
    carLoans,
    hasHECS,
    baseRate,
    bufferRate,
    termYears,
    expenseFloorMonthly,
    depositPercent
  } = inputs;

  const shadedIncomeMonthly =
    incomes.reduce(
      (sum, income) => sum + (income.amountAnnual * income.shadingFactor) / 12,
      0
    );

  const minExpenses = expenseFloorMonthly ?? 2000 + dependants * 400;
  const expensesMonthly = Math.max(livingExpensesMonthly, minExpenses);

  const personalDebt = personalLoans.reduce(
    (sum, l) => sum + l.monthlyRepayment,
    0
  );
  const carDebt = carLoans.reduce((sum, l) => sum + l.monthlyRepayment, 0);

  const cardDebt = (creditCardLimits * 0.0375) || 0;
  const hecsDebt = hasHECS ? shadedIncomeMonthly * 0.07 : 0;

  const totalOtherDebt = personalDebt + carDebt + cardDebt + hecsDebt;

  const assessmentRate = baseRate + bufferRate;
  const paymentsPerYear = 12;
  const n = termYears * paymentsPerYear;
  const r = assessmentRate / 100 / paymentsPerYear;

  const availableForMortgage = shadedIncomeMonthly - expensesMonthly - totalOtherDebt;

  let paymentFactor = 0;
  if (r === 0) {
    paymentFactor = 1 / n;
  } else {
    paymentFactor = r / (1 - Math.pow(1 + r, -n));
  }

  const maxBorrowingRaw = availableForMortgage > 0 ? availableForMortgage / paymentFactor : 0;
  const maxBorrowing = Math.max(maxBorrowingRaw, 0);

  const lvr = 1 - (depositPercent ?? 0.2);
  const estimatedPurchasePrice = lvr > 0 ? maxBorrowing / lvr : maxBorrowing;

  const limitingFactors: string[] = [];
  if (availableForMortgage <= 0) {
    limitingFactors.push('Expenses and existing debts exceed shaded income.');
  } else {
    if (expensesMonthly > shadedIncomeMonthly * 0.5) {
      limitingFactors.push('High living expenses relative to income.');
    }
    if (creditCardLimits > 0) {
      limitingFactors.push('Credit card limits reduce borrowing capacity.');
    }
    if (hasHECS) {
      limitingFactors.push('HECS/HELP reduces net income available.');
    }
  }

  const capacityByRate: { rate: number; capacity: number }[] = [];
  for (let delta = -1; delta <= 3; delta += 1) {
    const rate = assessmentRate + delta;
    const rr = rate / 100 / paymentsPerYear;
    let pf = 0;
    if (rr === 0) {
      pf = 1 / n;
    } else {
      pf = rr / (1 - Math.pow(1 + rr, -n));
    }
    const capacity = availableForMortgage > 0 ? availableForMortgage / pf : 0;
    capacityByRate.push({ rate, capacity: Math.max(capacity, 0) });
  }

  return {
    maxBorrowing,
    estimatedPurchasePrice,
    assessmentRate,
    limitingFactors,
    capacityByRate
  };
}
