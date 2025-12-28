import React, { useState } from 'react';

type TaxYear = '2025-26' | '2024-25' | '2023-24' | '2014-23';

interface MLSThreshold {
  range: string;
  rate: string;
}

interface MLSData {
  single: MLSThreshold[];
  family: MLSThreshold[];
  familyNote: string;
}

const mlsData: Record<TaxYear, MLSData> = {
  '2025-26': {
    single: [
      { range: 'up to $101,000', rate: '0%' },
      { range: '$101,001–$118,000', rate: '1.0%' },
      { range: '$118,001–$158,000', rate: '1.25%' },
      { range: '$158,001+', rate: '1.5%' },
    ],
    family: [
      { range: 'up to $202,000', rate: '0%' },
      { range: '$202,001–$236,000', rate: '1.0%' },
      { range: '$236,001–$316,000', rate: '1.25%' },
      { range: '$316,001+', rate: '1.5%' },
    ],
    familyNote: 'Family thresholds increase by $1,500 per dependent child after the first.',
  },
  '2024-25': {
    single: [
      { range: 'up to $97,000', rate: '0%' },
      { range: '$97,001–$113,000', rate: '1.0%' },
      { range: '$113,001–$151,000', rate: '1.25%' },
      { range: '$151,001+', rate: '1.5%' },
    ],
    family: [
      { range: 'up to $194,000', rate: '0%' },
      { range: '$194,001–$226,000', rate: '1.0%' },
      { range: '$226,001–$302,000', rate: '1.25%' },
      { range: '$302,001+', rate: '1.5%' },
    ],
    familyNote: 'Family thresholds + $1,500 per dependent child after first.',
  },
  '2023-24': {
    single: [
      { range: 'up to $93,000', rate: '0%' },
      { range: '$93,001–$108,000', rate: '1.0%' },
      { range: '$108,001–$144,000', rate: '1.25%' },
      { range: '$144,001+', rate: '1.5%' },
    ],
    family: [
      { range: 'up to $186,000', rate: '0%' },
      { range: '$186,001–$216,000', rate: '1.0%' },
      { range: '$216,001–$288,000', rate: '1.25%' },
      { range: '$288,001+', rate: '1.5%' },
    ],
    familyNote: 'Family thresholds + $1,500 per dependent child after first.',
  },
  '2014-23': {
    single: [
      { range: 'up to $90,000', rate: '0%' },
      { range: '$90,001–$105,000', rate: '1.0%' },
      { range: '$105,001–$140,000', rate: '1.25%' },
      { range: '$140,001+', rate: '1.5%' },
    ],
    family: [
      { range: 'up to $180,000', rate: '0%' },
      { range: '$180,001–$210,000', rate: '1.0%' },
      { range: '$210,001–$280,000', rate: '1.25%' },
      { range: '$280,001+', rate: '1.5%' },
    ],
    familyNote: 'Family thresholds + $1,500 per dependent child after first.',
  },
};

const yearLabels: Record<TaxYear, string> = {
  '2025-26': '2025–26 (from 1 July 2025)',
  '2024-25': '2024–25',
  '2023-24': '2023–24',
  '2014-23': '2014–15 to 2022–23',
};

export const YearSpecificTaxInfo: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<TaxYear>('2024-25');

  const data = mlsData[selectedYear];

  return (
    <div className="space-y-4 py-4" id="year-specific-tax-info">
      {/* Year Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Tax Information Summary
        </h2>
        <div className="w-64">
          <label htmlFor="tax-year-select" className="sr-only">
            Select Financial Year
          </label>
          <select
            id="tax-year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value as TaxYear)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <option value="2025-26">2025–26 (from 1 July 2025)</option>
            <option value="2024-25">2024–25</option>
            <option value="2023-24">2023–24</option>
            <option value="2014-23">2014–15 to 2022–23</option>
          </select>
        </div>
      </div>

      {/* Medicare Levy Surcharge Card */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/30 dark:bg-blue-950/20">
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200">
            Medicare Levy Surcharge Thresholds & Rates
          </h3>
          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            {yearLabels[selectedYear]}
          </span>
        </div>

        <div className="space-y-6 text-sm text-blue-900 dark:text-blue-200">
          {/* Single Thresholds */}
          <div>
            <h4 className="mb-2 font-semibold">Single</h4>
            <div className="space-y-1">
              {data.single.map((threshold, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-white/50 px-3 py-2 dark:bg-blue-950/40"
                >
                  <span className="text-blue-800 dark:text-blue-300">{threshold.range}</span>
                  <span className="font-bold text-blue-900 dark:text-blue-100">{threshold.rate}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Family Thresholds */}
          <div>
            <h4 className="mb-2 font-semibold">Family</h4>
            <div className="space-y-1">
              {data.family.map((threshold, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-white/50 px-3 py-2 dark:bg-blue-950/40"
                >
                  <span className="text-blue-800 dark:text-blue-300">{threshold.range}</span>
                  <span className="font-bold text-blue-900 dark:text-blue-100">{threshold.rate}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs italic text-blue-700 dark:text-blue-400">
              {data.familyNote}
            </p>
          </div>

          {/* Special Note for 2014-23 */}
          {selectedYear === '2014-23' && (
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/40">
              <p className="text-xs">
                <strong>Note:</strong> For the period from 2014–15 through 2022–23, the MLS thresholds did not change.
                They were indexed and then effectively paused by the Government. This includes the 2019–20, 2020–21,
                2021–22, and 2022–23 income years.
              </p>
            </div>
          )}

          {/* Source */}
          <div className="border-t border-blue-300 pt-3 dark:border-blue-800">
            <p className="text-xs">
              <strong>Source:</strong>{' '}
              <a
                href="https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:text-blue-600 dark:hover:text-blue-400"
              >
                Australian Taxation Office
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
