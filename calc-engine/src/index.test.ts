import { describe, it, expect } from 'vitest';
import { generateAmortisation, estimateBorrowingCapacity } from './index';

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
