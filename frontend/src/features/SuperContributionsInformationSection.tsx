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

          {/* Salary Sacrifice */}
          <div>
            <h4 className="mb-1 font-semibold">Salary Sacrifice Arrangements</h4>
            <p>
              Salary sacrifice is an arrangement where you redirect part of your pre-tax salary to benefits such as
              superannuation. This can reduce your taxable income.
            </p>
            <ul className="ml-4 list-disc space-y-1 mt-2">
              <li>Salary-sacrificed amounts may reduce your taxable income</li>
              <li>When sacrificed to super, amounts usually count toward your concessional contributions cap</li>
              <li>Employer Super Guarantee (SG) rules may interact with sacrifice arrangements</li>
              <li>Rules can vary by employer and agreement, so results are estimates only</li>
            </ul>
          </div>

          {/* Concessional Contributions - Claiming Deductions */}
          <div>
            <h4 className="mb-1 font-semibold">Concessional Contributions - Claiming Deductions</h4>
            <p>
              Concessional contributions include employer SG contributions, salary sacrifice contributions, and personal
              contributions claimed as a tax deduction. All concessional contributions are subject to an annual cap.
            </p>
            <p className="mt-2">
              Exceeding the cap can result in additional tax.
            </p>
            <div className="mt-2">
              <p className="font-semibold text-xs">Claiming a deduction</p>
              <p className="text-xs mt-1">
                If you intend to claim a deduction for personal contributions, you must submit a notice of intent to
                your super fund and receive confirmation before lodging your tax return.
              </p>
            </div>
          </div>

          {/* More info */}
          <div>
            <h4 className="mb-1 font-semibold">More Information</h4>
            <ul className="space-y-1">
              <li>
                <a
                  href="https://www.ato.gov.au/super"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold underline hover:text-slate-700 dark:hover:text-white"
                >
                  ATO Superannuation page
                </a>
              </li>
              <li>
                <a
                  href="https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/how-to-save-more-in-your-super/salary-sacrificing-super"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold underline hover:text-slate-700 dark:hover:text-white"
                >
                  Salary sacrificing super
                </a>
              </li>
              <li>
                <a
                  href="https://www.ato.gov.au/rates-and-codes/key-superannuation-rates-and-thresholds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold underline hover:text-slate-700 dark:hover:text-white"
                >
                  Concessional contributions cap
                </a>
              </li>
              <li>
                <a
                  href="https://www.ato.gov.au/forms-and-instructions/notice-of-intent-to-claim-or-vary-a-deduction-for-personal-super-contributions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold underline hover:text-slate-700 dark:hover:text-white"
                >
                  Notice of intent to claim or vary a deduction
                </a>
              </li>
            </ul>
          </div>
        </div>
    </div>
  );
};
