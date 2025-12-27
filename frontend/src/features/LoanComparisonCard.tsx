import React from 'react';
import { compareMortgageVsPersonalLoan } from 'calc-engine';
import {
  CumulativeInterestChart,
  CumulativeInterestWithDifferenceLine,
  CumulativeInterestPercentageDifference,
  CumulativeInterestWithMilestones
} from '../graphs/RepaymentCharts';
import { CurrencyInput, NumberInput, PercentInput } from '../components/inputs';
import { formatCurrency } from '../lib/formatters';

export const LoanComparisonCard: React.FC = () => {
  // Inputs
  const [mortgageAmount, setMortgageAmount] = React.useState(440_000);
  const [personalAmount, setPersonalAmount] = React.useState(40_000);

  const [mortgageRate, setMortgageRate] = React.useState(5.85); // % p.a.
  const [mortgageTermYrs, setMortgageTermYrs] = React.useState(30);

  const [carRate, setCarRate] = React.useState(8.5); // % p.a. (personal loan)
  const [carTermYrs, setCarTermYrs] = React.useState(5);

  const startDate = React.useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Calculate comparison using calc-engine
  const comparison = React.useMemo(() => {
    return compareMortgageVsPersonalLoan({
      fullMortgageAmount: mortgageAmount,
      mortgageRate: mortgageRate,
      mortgageTermYears: mortgageTermYrs,
      personalLoanAmount: personalAmount,
      personalLoanRate: carRate,
      personalLoanTermYears: carTermYrs,
      frequency: 'monthly',
      repaymentType: 'principalAndInterest',
      repaymentStrategy: 'reduceTerm',
      startDate
    });
  }, [mortgageAmount, mortgageRate, mortgageTermYrs, personalAmount, carRate, carTermYrs, startDate]);

  // Extract values for display
  const monthlyA = Math.round(comparison.summary.fullMortgagePayment);
  const monthlyB_mortgage = Math.round(comparison.summary.splitMortgagePayment);
  const monthlyB_car = Math.round(comparison.summary.splitPersonalPayment);
  const monthlyB_initial = Math.round(comparison.summary.splitCombinedPaymentInitial);

  const totalInterestA = comparison.summary.fullMortgageTotalInterest;
  const totalInterestB = comparison.summary.splitCombinedTotalInterest;
  const totalPaidA = comparison.summary.fullMortgageTotalPaid;
  const totalPaidB = comparison.summary.splitCombinedTotalPaid;

  return (
    <div className="space-y-5">
      {/* Comparison Objective */}
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900 shadow-sm dark:border-indigo-900/30 dark:bg-indigo-950/20 dark:text-indigo-100">
        <p className="font-semibold">Comparison objective</p>
        <div className="mt-1 text-xs text-indigo-800 dark:text-indigo-200">
          <p>
            This tool compares two ways of funding the same purchase: taking the full amount as a mortgage, or splitting it between a mortgage and a personal loan.
          </p>
          <p className="mt-1">
            It shows how each option affects your monthly repayments and total interest over time, helping you see the true cost of convenience versus long-term borrowing.
          </p>
        </div>
      </div>

      

      {/* Unified container: inputs (split by vertical line) + scenarios below a horizontal line */}
      <div className="relative rounded-2xl border border-slate-200 p-4 dark:border-dark-border">
        {/* Inputs two columns with vertical divider on larger screens */}
        <div className="relative grid grid-cols-2 gap-4">
          <div className="pointer-events-none absolute inset-y-2 left-1/2 border-l border-slate-200 dark:border-dark-border" />

          {/* LHS: Mortgage */}
          <div className="space-y-3">
            <CurrencyInput label="Mortgage Amount" value={mortgageAmount} onChange={setMortgageAmount} />
            <PercentInput label="Mortgage Interest %" value={mortgageRate} onChange={setMortgageRate} asPercentage step={0.05} />
            <NumberInput label="Mortgage Term Left (yrs)" value={mortgageTermYrs} onChange={setMortgageTermYrs} />
          </div>

          {/* RHS: Personal loan */}
          <div className="space-y-3">
            <CurrencyInput label="Personal Loan Amount" value={personalAmount} onChange={setPersonalAmount} />
            <PercentInput label="Personal Loan Interest %" value={carRate} onChange={setCarRate} asPercentage step={0.1} />
            <NumberInput label="Personal Loan Term (yrs)" value={carTermYrs} onChange={setCarTermYrs} />
          </div>
        </div>

        {/* Scenarios within same container */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-dark-border">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Mortgage {formatCurrency(comparison.summary.totalAmount)}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Scenario A</p>
            <div className="mt-3 space-y-3">
              <Row label="Monthly Repayments" value={formatCurrency(monthlyA)} />
              <Row label="Total Principle" sub="(mortgage)" value={formatCurrency(comparison.summary.totalAmount)} />
              <Row label="Total interest" value={formatCurrency(totalInterestA)} />
              <div className="border-t border-slate-200 dark:border-dark-border" />
              <Row label="Total" value={formatCurrency(totalPaidA)} />
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-dark-border">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Mortgage {formatCurrency(comparison.summary.splitMortgageAmount)} +
                <br />
                Personal Loan {formatCurrency(comparison.summary.splitPersonalAmount)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Scenario B</p>
              <div className="mt-3 space-y-3">
                <Row
                  label={`Monthly Repayments\n(first ${carTermYrs} years)`}
                  value={formatCurrency(monthlyB_initial)}
                  sub="(mortgage + personal)"
                  subValue={`(${formatCurrency(monthlyB_mortgage)} + ${formatCurrency(monthlyB_car)})`}
                />
                <Row
                  label={`Monthly Repayments\n(after ${carTermYrs} years)`}
                  value={formatCurrency(monthlyB_mortgage)}
                  sub="(mortgage only)"
                />
                <Row
                  label="Total Principle"
                  value={formatCurrency(comparison.summary.totalAmount)}
                  sub="(mortgage + personal)"
                  subValue={`(${formatCurrency(comparison.summary.splitMortgageAmount)} + ${formatCurrency(comparison.summary.splitPersonalAmount)})`}
                />
                <Row label="Total interest" value={formatCurrency(totalInterestB)} />
                <div className="border-t border-slate-200 dark:border-dark-border" />
                <Row label="Total" value={formatCurrency(totalPaidB)} />
              </div>
            </div>
            {/* Outcome container */}
            <div className="rounded-2xl border border-orange-300 bg-orange-100 p-4 dark:border-orange-800/60 dark:bg-orange-950/60">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {totalPaidA < totalPaidB ? 'Scenario A Wins' : 'Scenario B Wins'}
              </h3>
              {totalPaidA < totalPaidB ? (
                <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  <p className="mb-2">
                    Rolling everything into the mortgage results in a lower total cost overall.
                  </p>
                  <p className="mb-2">
                    The lower interest rate, applied over the full loan term, outweighs the benefit of paying part of the debt down faster.
                  </p>
                  <p className="font-medium">
                    In short:
                  </p>
                  <p className="font-medium italic">
                    "slower, cheaper, and very patient money."
                  </p>
                </div>
              ) : (
                <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  <p className="mb-2">
                    Splitting the loan results in a lower total cost overall, despite higher repayments upfront.
                  </p>
                  <p className="mb-2">
                    The personal loan is cleared much sooner, which stops interest on that portion early and reduces total interest paid.
                  </p>
                  <p className="font-medium">
                    In short:
                  </p>
                  <p className="font-medium italic">
                    "more pain now, less pain later — maths approves."
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RowProps {
  label: string;
  value?: string;
  sub?: string;
  labelSuffix?: string;
  subValue?: string;
  subSuffix?: string;
  valueClassName?: string;
}

const Row: React.FC<RowProps> = ({ label, value, sub, labelSuffix, subValue, subSuffix, valueClassName }) => (
  <div className="flex items-start justify-between">
    <div className="leading-tight">
      <span className="whitespace-pre-line text-sm font-medium text-slate-600 dark:text-dark-muted">
        {label} {labelSuffix && <span className="font-semibold text-slate-700 dark:text-white">{labelSuffix}</span>}
      </span>
      {sub && (
        <div className="text-[11px] text-slate-400 dark:text-dark-muted">
          {sub} {subSuffix && <span className="ml-1">{subSuffix}</span>}
        </div>
      )}
    </div>
    <div className="ml-3 text-right">
      {value && (
        <div className={`text-base font-semibold ${valueClassName ?? 'text-slate-900 dark:text-white'}`}>{value}</div>
      )}
      {subValue && (
        <div className="text-[11px] text-slate-400 dark:text-dark-muted">{subValue}</div>
      )}
    </div>
  </div>
);

function formatDelta(delta: number): string {
  const sign = delta >= 0 ? '+' : '−';
  const abs = Math.abs(delta);
  return `${sign}${formatCurrency(abs)}`;
}

function deltaTone(delta: number): string {
  return delta >= 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400';
}
