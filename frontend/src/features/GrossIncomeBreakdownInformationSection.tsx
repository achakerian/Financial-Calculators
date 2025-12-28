import React from 'react';

export const GrossIncomeBreakdownInformationSection: React.FC = () => {
  return (
    <div className="space-y-3 text-sm text-slate-700 dark:text-dark-text" id="gross-income-breakdown">
      <div className="space-y-3">
        <div>
          <h4 className="mb-1 font-semibold">What this chart shows</h4>
          <p>
            This chart shows how your gross income is allocated across:
          </p>
          <ul className="ml-4 list-disc space-y-1 mt-2">
            <li>Net pay (take-home income)</li>
            <li>Income tax</li>
            <li>Medicare levy</li>
            <li>HELP repayments (if applicable)</li>
            <li>Employer superannuation</li>
          </ul>
          <p className="mt-2">
            Government levies are deducted from pay, while employer super is an additional contribution made on your
            behalf.
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-dark-border">
          <h4 className="mb-1 font-semibold">More Information</h4>
          <ul className="space-y-1">
            <li>
              <a
                href="https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold underline hover:text-slate-700 dark:hover:text-white"
              >
                Medicare levy
              </a>
            </li>
            <li>
              <a
                href="https://www.ato.gov.au/individuals-and-families/StudyTrainingLoan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold underline hover:text-slate-700 dark:hover:text-white"
              >
                Study and training support loans
              </a>
            </li>
            <li>
              <a
                href="https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold underline hover:text-slate-700 dark:hover:text-white"
              >
                Australian tax rates
              </a>
            </li>
            <li>
              <a
                href="https://www.ato.gov.au/super"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold underline hover:text-slate-700 dark:hover:text-white"
              >
                Superannuation
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
