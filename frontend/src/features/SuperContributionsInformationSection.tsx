import React from 'react';
import { InfoSectionHeader } from '../components/InfoSectionHeader';

export const SuperContributionsInformationSection: React.FC = () => {
  const years = ['FY2024-25', 'FY2025-26'];
  const [year, setYear] = React.useState<string>(years[0]);

  return (
    <div className="space-y-3 text-sm text-slate-700 dark:text-dark-text" id="super-contributions">
      <InfoSectionHeader
        title="Superannuation Contributions"
        years={years}
        year={year}
        onYearChange={setYear}
        showTitle={false}
      />

      <div className="space-y-3">
          {/* Concessional */}
          <div>
            <h4 className="mb-1 font-semibold">Concessional Contributions (Before-tax)</h4>
            <p>
              Concessional contributions are made from pre-tax income and receive a tax concession.
              This category includes employer SG contributions.
            </p>
            <table className="w-full text-xs">
              <tbody className="divide-y divide-slate-200 dark:divide-dark-border">
                <tr>
                  <td className="py-1">Employer SG contributions</td>
                  <td className="py-1 text-right">Included</td>
                </tr>
                <tr>
                  <td className="py-1">Salary sacrifice</td>
                  <td className="py-1 text-right">Included</td>
                </tr>
                <tr>
                  <td className="py-1">Personal deductible contributions</td>
                  <td className="py-1 text-right">Included</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-[11px] italic">
              Concessional contributions are taxed at 15% when they enter the fund (as at {year}).
            </p>
          </div>

          {/* Non-concessional */}
          <div>
            <h4 className="mb-1 font-semibold">Non-Concessional Contributions (After-tax)</h4>
            <p>
              Non-concessional contributions are made from after-tax income and do not receive a tax
              deduction.
            </p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Made from take-home pay</li>
              <li>No contributions tax when entering the fund</li>
              <li>Do <strong>not</strong> count toward the concessional cap</li>
              <li>Subject to annual and bring-forward caps</li>
            </ul>
          </div>

          {/* Summary */}
          <div>
            <h4 className="mb-1 font-semibold">Summary</h4>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-dark-border">
                  <th className="pb-1 text-left">Type</th>
                  <th className="pb-1 text-left">Paid By</th>
                  <th className="pb-1 text-right">Tax in Fund</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-dark-border">
                <tr>
                  <td className="py-1">Mandatory (SG)</td>
                  <td className="py-1">Employer</td>
                  <td className="py-1 text-right font-semibold">15%</td>
                </tr>
                <tr>
                  <td className="py-1">Concessional</td>
                  <td className="py-1">Employer / You</td>
                  <td className="py-1 text-right font-semibold">15%</td>
                </tr>
                <tr>
                  <td className="py-1">Non-concessional</td>
                  <td className="py-1">You</td>
                  <td className="py-1 text-right font-semibold">0%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* More info */}
          <div>
            <h4 className="mb-1 font-semibold">More Information</h4>
            <p>
              For official guidance, visit the{' '}
              <a
                href="https://www.ato.gov.au/super"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:text-slate-700 dark:hover:text-white"
              >
                ATO Superannuation page
              </a>
              .
            </p>
          </div>
        </div>
    </div>
  );
};
