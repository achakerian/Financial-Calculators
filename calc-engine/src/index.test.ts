import { describe, it, expect } from 'vitest';
import { generateAmortisation, estimateBorrowingCapacity, compareMortgageVsPersonalLoan } from './index';

describe('generateAmortisation', () => {
  it('computes a finite schedule with positive payment', () => {
    const result = generateAmortisation({
      amount: 500000,
      annualRate: 5,
      years: 30,
      frequency: 'monthly',
      repaymentType: 'principalAndInterest',
      repaymentStrategy: 'reduceTerm',
      startDate: '2024-01-01'
    });

    expect(result.summary.regularPayment).toBeGreaterThan(0);
    expect(result.schedule.length).toBeGreaterThan(0);
  });
});

describe('estimateBorrowingCapacity', () => {
  it('returns non-negative capacity', () => {
    const result = estimateBorrowingCapacity({
      incomes: [{ amountAnnual: 120000, shadingFactor: 0.9 }],
      livingExpensesMonthly: 3000,
      dependants: 0,
      creditCardLimits: 10000,
      personalLoans: [],
      carLoans: [],
      hasHECS: false,
      baseRate: 6,
      bufferRate: 3,
      termYears: 30,
      repaymentType: 'principalAndInterest',
      expenseFloorMonthly: 2000,
      depositPercent: 0.2
    });

    expect(result.maxBorrowing).toBeGreaterThanOrEqual(0);
    expect(result.capacityByRate.length).toBeGreaterThan(0);
  });
});

describe('compareMortgageVsPersonalLoan', () => {
  const testInputs = {
    fullMortgageAmount: 440000,
    mortgageRate: 5.85,
    mortgageTermYears: 30,
    personalLoanAmount: 40000,
    personalLoanRate: 8.5,
    personalLoanTermYears: 5,
    frequency: 'monthly' as const,
    repaymentType: 'principalAndInterest' as const,
    repaymentStrategy: 'reduceTerm' as const,
    startDate: '2025-01-01'
  };

  it('calculates both scenarios correctly', () => {
    const result = compareMortgageVsPersonalLoan(testInputs);

    // Verify scenario amounts
    expect(result.summary.totalAmount).toBe(480000);
    expect(result.summary.splitMortgageAmount).toBe(440000);
    expect(result.summary.splitPersonalAmount).toBe(40000);

    // Verify payments are positive
    expect(result.summary.fullMortgagePayment).toBeGreaterThan(0);
    expect(result.summary.splitCombinedPaymentInitial).toBeGreaterThan(0);

    // Verify Scenario A uses TOTAL amount (should have higher total paid)
    expect(result.fullMortgage.summary.totalPaid).toBeGreaterThan(result.splitMortgage.summary.totalPaid);
  });

  it('merges schedules correctly', () => {
    const result = compareMortgageVsPersonalLoan(testInputs);
    expect(result.splitCombinedSchedule.length).toBeGreaterThan(0);

    // Verify first period has combined balances (440k + 40k = 480k)
    const firstPeriod = result.splitCombinedSchedule[0];
    expect(firstPeriod.openingBalance).toBe(480000);
  });

  it('calculates differences correctly', () => {
    const result = compareMortgageVsPersonalLoan(testInputs);

    // Differences should be Scenario B - Scenario A
    const manualMonthlyDiff = result.summary.splitCombinedPaymentInitial - result.summary.fullMortgagePayment;
    expect(result.summary.monthlyPaymentDifferenceInitial).toBeCloseTo(manualMonthlyDiff, 2);

    const manualInterestDiff = result.summary.splitCombinedTotalInterest - result.summary.fullMortgageTotalInterest;
    expect(result.summary.totalInterestDifference).toBeCloseTo(manualInterestDiff, 2);
  });

  it('calculates payment after personal loan ends', () => {
    const result = compareMortgageVsPersonalLoan(testInputs);

    // After personal loan ends, only mortgage payment remains
    expect(result.summary.splitMortgageOnlyPayment).toBe(result.summary.splitMortgagePayment);

    // Difference after personal should be mortgage only - full mortgage
    const expectedDiff = result.summary.splitMortgagePayment - result.summary.fullMortgagePayment;
    expect(result.summary.monthlyPaymentDifferenceAfterPersonal).toBeCloseTo(expectedDiff, 2);
  });
});
