# calc-engine

Pure TypeScript calculation engine for Australian financial calculations.

## Overview

This package provides framework-agnostic calculation functions for:
- **Loan amortisation** - Mortgage/loan repayment schedules with support for:
  - Principal & Interest or Interest Only loans
  - Extra repayments and offset accounts
  - Rate changes over time
  - Weekly, fortnightly, or monthly frequencies
- **Borrowing capacity** - Estimate maximum borrowing power based on income, expenses, and debts
- **Pay calculations** - Australian PAYG tax, Medicare levy, and HELP/HECS repayments

## Design Principles

- **Zero dependencies** - Pure TypeScript with no runtime dependencies
- **Framework agnostic** - No React, Vue, or other framework coupling
- **Type safe** - Full TypeScript type definitions
- **Pure functions** - All calculations are deterministic and side-effect free
- **Tree shakeable** - Import only what you need

## Usage

### Loan Amortisation

```typescript
import { generateAmortisation, type LoanInputs } from 'calc-engine';

const inputs: LoanInputs = {
  amount: 650000,
  annualRate: 5.85,
  years: 30,
  frequency: 'monthly',
  repaymentType: 'principalAndInterest',
  repaymentStrategy: 'reduceTerm',
  startDate: '2024-01-01'
};

const result = generateAmortisation(inputs);
console.log(result.summary.regularPayment); // Monthly payment
console.log(result.summary.totalInterest); // Total interest over life of loan
console.log(result.schedule); // Array of period-by-period breakdown
```

### Borrowing Capacity

```typescript
import { estimateBorrowingCapacity, type BorrowingCapacityInputs } from 'calc-engine';

const inputs: BorrowingCapacityInputs = {
  incomes: [{ amountAnnual: 90000, shadingFactor: 1.0 }],
  livingExpensesMonthly: 3000,
  dependants: 0,
  creditCardLimits: 10000,
  personalLoans: [],
  carLoans: [],
  hasHECS: false,
  baseRate: 6.5,
  bufferRate: 3.0,
  termYears: 30,
  repaymentType: 'principalAndInterest'
};

const result = estimateBorrowingCapacity(inputs);
console.log(result.maxBorrowing); // Maximum loan amount
console.log(result.estimatedPurchasePrice); // Including deposit
```

### Pay Calculations

```typescript
import { calculatePaySummary, type PayCalculateRequest } from 'calc-engine';

const request: PayCalculateRequest = {
  taxYear: '2025-26',
  annualSalary: 90000,
  frequency: 'fortnightly',
  hasHELP: false,
  medicareExempt: false,
  deductions: 0,
  includeSuper: true,
  superRate: 0.115
};

const result = calculatePaySummary(request);
console.log(result.perPeriod.net); // Net pay per period
console.log(result.annual.incomeTax); // Annual income tax
console.log(result.effectiveTaxRate); // Effective tax rate
```

## API Reference

### Loan Functions

- `generateAmortisation(inputs: LoanInputs): AmortisationResult`
- `generateScenarioWithExtras(inputs: LoanInputs, extraRules: ExtraRule[]): ScenarioWithExtrasResult`

### Capacity Functions

- `estimateBorrowingCapacity(inputs: BorrowingCapacityInputs): BorrowingCapacityResult`

### Pay Functions

- `calculatePaySummary(request: PayCalculateRequest): PayCalculateResponse`

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build

# Lint
pnpm lint
```

## Type Exports

All TypeScript types and interfaces are exported for use in consuming applications:

```typescript
import type {
  LoanInputs,
  AmortisationResult,
  BorrowingCapacityInputs,
  BorrowingCapacityResult,
  PayCalculateRequest,
  PayCalculateResponse,
  // ... and many more
} from 'calc-engine';
```
