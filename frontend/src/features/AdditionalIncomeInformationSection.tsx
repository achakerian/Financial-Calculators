import React from 'react';

export const AdditionalIncomeInformationSection: React.FC = () => {
  return (
    <div className="space-y-3 text-sm text-slate-700 dark:text-dark-text" id="additional-income">
      <div className="space-y-3">
        <div>
          <h4 className="mb-1 font-semibold">What counts as additional income?</h4>
          <p>
            Additional income may include:
          </p>
          <ul className="ml-4 list-disc space-y-1 mt-2">
            <li>A second job</li>
            <li>Allowances, bonuses or commissions</li>
            <li>Overtime</li>
            <li>Interest or dividends</li>
            <li>Other taxable payments</li>
          </ul>
          <p className="mt-2">
            Most additional income increases your total taxable income, which can affect tax, Medicare, HELP
            repayments and surcharges.
          </p>
        </div>

        <div>
          <h4 className="mb-1 font-semibold">How to enter it</h4>
          <p>
            For best results, enter additional income as annual amounts and apply the same timing assumptions as your
            main income.
          </p>
          <p className="mt-2">
            Some income types may receive different tax treatment, so results are indicative only.
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-dark-border">
          <h4 className="mb-1 font-semibold">More Information</h4>
          <ul className="space-y-1">
            <li>
              <a
                href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/income-you-must-declare"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold underline hover:text-slate-700 dark:hover:text-white"
              >
                Income you must declare
              </a>
            </li>
            <li>
              <a
                href="https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-as-an-employee/income-from-more-than-one-job"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold underline hover:text-slate-700 dark:hover:text-white"
              >
                Employment income
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
