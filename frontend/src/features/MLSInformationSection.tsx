import React from 'react';
import { InfoSectionHeader } from '../components/InfoSectionHeader';
import { formatCurrency } from '../lib/formatters';

export const MLSInformationSection: React.FC = () => {
  const years = ['FY2025-26', 'FY2024-25', 'FY2023-24', 'FY2022-23', 'FY2021-22', 'FY2020-21'];
  const [year, setYear] = React.useState<string>(years[0]);

  const DATA: Record<string, {
    thresholds: { single: number; family: number; perDependent: number };
    brackets: { singleMax: number | null; familyMax: number | null; rate: number }[];
  }> = React.useMemo(() => ({
    'FY2025-26': {
      thresholds: { single: 101_000, family: 202_000, perDependent: 1_500 },
      brackets: [
        { singleMax: 101_000, familyMax: 202_000, rate: 0 },
        { singleMax: 118_000, familyMax: 236_000, rate: 0.01 },
        { singleMax: 158_000, familyMax: 316_000, rate: 0.0125 },
        { singleMax: null, familyMax: null, rate: 0.015 },
      ],
    },
    'FY2024-25': {
      thresholds: { single: 97_000, family: 194_000, perDependent: 1_500 },
      brackets: [
        { singleMax: 97_000, familyMax: 194_000, rate: 0 },
        { singleMax: 113_000, familyMax: 226_000, rate: 0.01 },
        { singleMax: 151_000, familyMax: 302_000, rate: 0.0125 },
        { singleMax: null, familyMax: null, rate: 0.015 },
      ],
    },
    'FY2023-24': {
      thresholds: { single: 93_000, family: 186_000, perDependent: 1_500 },
      brackets: [
        { singleMax: 93_000, familyMax: 186_000, rate: 0 },
        { singleMax: 108_000, familyMax: 216_000, rate: 0.01 },
        { singleMax: 144_000, familyMax: 288_000, rate: 0.0125 },
        { singleMax: null, familyMax: null, rate: 0.015 },
      ],
    },
    'FY2022-23': {
      thresholds: { single: 90_000, family: 180_000, perDependent: 1_500 },
      brackets: [
        { singleMax: 90_000, familyMax: 180_000, rate: 0 },
        { singleMax: 105_000, familyMax: 210_000, rate: 0.01 },
        { singleMax: 140_000, familyMax: 280_000, rate: 0.0125 },
        { singleMax: null, familyMax: null, rate: 0.015 },
      ],
    },
    'FY2021-22': {
      thresholds: { single: 90_000, family: 180_000, perDependent: 1_500 },
      brackets: [
        { singleMax: 90_000, familyMax: 180_000, rate: 0 },
        { singleMax: 105_000, familyMax: 210_000, rate: 0.01 },
        { singleMax: 140_000, familyMax: 280_000, rate: 0.0125 },
        { singleMax: null, familyMax: null, rate: 0.015 },
      ],
    },
    'FY2020-21': {
      thresholds: { single: 90_000, family: 180_000, perDependent: 1_500 },
      brackets: [
        { singleMax: 90_000, familyMax: 180_000, rate: 0 },
        { singleMax: 105_000, familyMax: 210_000, rate: 0.01 },
        { singleMax: 140_000, familyMax: 280_000, rate: 0.0125 },
        { singleMax: null, familyMax: null, rate: 0.015 },
      ],
    },
  }), []);

  const current = DATA[year];

  const findRateSingle = (income: number): number => {
    const b = current.brackets;
    if (income <= b[0].singleMax!) return 0;
    if (income <= (b[1].singleMax as number)) return b[1].rate;
    if (income <= (b[2].singleMax as number)) return b[2].rate;
    return b[3].rate;
  };

  const findRateFamily = (income: number, dependents: number): number => {
    const adjBase = current.thresholds.family + Math.max(0, dependents - 1) * current.thresholds.perDependent;
    const famIncome = income; // using combined family income as in examples
    if (famIncome <= adjBase) return 0;
    const b = current.brackets;
    if (famIncome <= (b[1].familyMax as number)) return b[1].rate;
    if (famIncome <= (b[2].familyMax as number)) return b[2].rate;
    return b[3].rate;
  };

  return (
    <div className="space-y-3 text-sm text-slate-700 dark:text-dark-text" id="medicare-levy-surcharge">
      <InfoSectionHeader
        title="Medicare Levy Surcharge (MLS)"
        years={years}
        year={year}
        onYearChange={setYear}
        showTitle={false}
      />

      <div className="space-y-3">
          <div>
            <h4 className="mb-1 font-semibold">What is the MLS?</h4>
            <p>
              The Medicare Levy Surcharge (MLS) is an additional levy on top of the standard 2% Medicare levy.
              It applies to Australian taxpayers who do not have private hospital cover and earn above certain
              income thresholds.
            </p>
          </div>

          <div>
            <h4 className="mb-1 font-semibold">Income Thresholds — {year}</h4>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-dark-border">
                  <th className="pb-1 text-left">Family Status</th>
                  <th className="pb-1 text-right">Base Threshold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-dark-border">
                <tr>
                  <td className="py-1">Single</td>
                  <td className="py-1 text-right font-semibold">{formatCurrency(current.thresholds.single)}</td>
                </tr>
                <tr>
                  <td className="py-1">Couple / Family</td>
                  <td className="py-1 text-right font-semibold">{formatCurrency(current.thresholds.family)}</td>
                </tr>
                <tr>
                  <td className="py-1">Per dependent child (after first)</td>
                  <td className="py-1 text-right font-semibold">+{formatCurrency(current.thresholds.perDependent)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h4 className="mb-1 font-semibold">Surcharge Rates — {year}</h4>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-dark-border">
                  <th className="pb-1 text-left">Income (Singles)</th>
                  <th className="pb-1 text-left">Income (Families)*</th>
                  <th className="pb-1 text-right">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-dark-border">
                {current.brackets.map((b, idx) => {
                  const prevSingleMax = idx === 0 ? 0 : (current.brackets[idx - 1].singleMax as number) + 1;
                  const prevFamilyMax = idx === 0 ? 0 : (current.brackets[idx - 1].familyMax as number) + 1;
                  const singleLabel = b.singleMax
                    ? `${formatCurrency(prevSingleMax)} – ${formatCurrency(b.singleMax)}`.replace('$0 – ', '$0 – ')
                    : `${formatCurrency((current.brackets[idx - 1].singleMax as number) + 1)}+`;
                  const familyLabel = b.familyMax
                    ? `${formatCurrency(prevFamilyMax)} – ${formatCurrency(b.familyMax)}`.replace('$0 – ', '$0 – ')
                    : `${formatCurrency((current.brackets[idx - 1].familyMax as number) + 1)}+`;
                  return (
                    <tr key={idx}>
                      <td className="py-1">{singleLabel}</td>
                      <td className="py-1">{familyLabel}</td>
                      <td className="py-1 text-right font-semibold">{(b.rate * 100).toFixed(2).replace(/\.00$/, '')}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-2 text-[11px] italic">
              *Family thresholds shown for couples with no dependents. Add {formatCurrency(current.thresholds.perDependent)} per dependent child after first.
            </p>
          </div>

          <div>
            <h4 className="mb-1 font-semibold">Examples</h4>
            <ul className="ml-4 list-disc space-y-1">
              <li>
                <strong>Single, $100,000 income, no PHI:</strong> Threshold = {formatCurrency(current.thresholds.single)}. Pays {(findRateSingle(100_000) * 100).toFixed(0)}% MLS = {formatCurrency(100_000 * findRateSingle(100_000))}
              </li>
              <li>
                <strong>Single with 1 child, {formatCurrency(current.thresholds.family)} income, no PHI:</strong> Threshold = {formatCurrency(current.thresholds.family)} (family threshold). No surcharge (at threshold)
              </li>
              <li>
                <strong>Couple with 2 children, $196,000 income, no PHI:</strong> Threshold = {formatCurrency(current.thresholds.family + current.thresholds.perDependent)}. Pays {(findRateFamily(196_000, 2) * 100).toFixed(0)}% MLS = {formatCurrency(196_000 * findRateFamily(196_000, 2))}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-1 font-semibold">More Information</h4>
            <p>
              For official guidance, visit the{' '}
              <a
                href="https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:text-slate-700 dark:hover:text-white"
              >
                ATO Medicare Levy Surcharge page
              </a>
              .
            </p>
          </div>
        </div>
    </div>
  );
};
