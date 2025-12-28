import React from 'react';

export const MLSInformationSection: React.FC = () => {
  return (
    <div className="space-y-4 py-4" id="medicare-levy-surcharge">
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 text-xs text-blue-900 dark:border-blue-900/30 dark:bg-blue-950/20 dark:text-blue-200">
        <h3 className="mb-3 text-sm font-semibold">Medicare Levy Surcharge (MLS)</h3>

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
            <h4 className="mb-1 font-semibold">Income Thresholds (2024-25, 2025-26)</h4>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-blue-300 dark:border-blue-800">
                  <th className="pb-1 text-left">Family Status</th>
                  <th className="pb-1 text-right">Base Threshold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-200 dark:divide-blue-900">
                <tr>
                  <td className="py-1">Single</td>
                  <td className="py-1 text-right font-semibold">$97,000</td>
                </tr>
                <tr>
                  <td className="py-1">Couple / Family</td>
                  <td className="py-1 text-right font-semibold">$194,000</td>
                </tr>
                <tr>
                  <td className="py-1">Per dependent child (after first)</td>
                  <td className="py-1 text-right font-semibold">+$1,500</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h4 className="mb-1 font-semibold">Surcharge Rates</h4>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-blue-300 dark:border-blue-800">
                  <th className="pb-1 text-left">Income (Singles)</th>
                  <th className="pb-1 text-left">Income (Families)*</th>
                  <th className="pb-1 text-right">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-200 dark:divide-blue-900">
                <tr>
                  <td className="py-1">$0 – $97,000</td>
                  <td className="py-1">$0 – $194,000</td>
                  <td className="py-1 text-right font-semibold">0%</td>
                </tr>
                <tr>
                  <td className="py-1">$97,001 – $113,000</td>
                  <td className="py-1">$194,001 – $226,000</td>
                  <td className="py-1 text-right font-semibold">1.0%</td>
                </tr>
                <tr>
                  <td className="py-1">$113,001 – $151,000</td>
                  <td className="py-1">$226,001 – $302,000</td>
                  <td className="py-1 text-right font-semibold">1.25%</td>
                </tr>
                <tr>
                  <td className="py-1">$151,001+</td>
                  <td className="py-1">$302,001+</td>
                  <td className="py-1 text-right font-semibold">1.5%</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-[11px] italic">
              *Family thresholds shown for couples with no dependents. Add $3,000 per dependent child.
            </p>
          </div>

          <div>
            <h4 className="mb-1 font-semibold">Examples</h4>
            <ul className="ml-4 list-disc space-y-1">
              <li>
                <strong>Single, $100,000 income, no PHI:</strong> Threshold = $97,000. Pays 1% MLS = $1,000
              </li>
              <li>
                <strong>Single with 1 child, $194,000 income, no PHI:</strong> Threshold = $194,000
                (family threshold). No surcharge (at threshold)
              </li>
              <li>
                <strong>Couple with 2 children, $196,000 income, no PHI:</strong> Threshold = $195,500
                ($194,000 + $1,500). Pays 1% MLS = $1,960
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
                className="font-semibold underline hover:text-blue-600 dark:hover:text-blue-400"
              >
                ATO Medicare Levy Surcharge page
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
