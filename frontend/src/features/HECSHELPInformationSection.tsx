import React from 'react';

export const HECSHELPInformationSection: React.FC = () => {
  return (
    <div className="space-y-3 text-sm text-slate-700 dark:text-dark-text" id="hecs-help">
      <div className="space-y-3">
        <div>
          <h4 className="mb-1 font-semibold">What is HECS / HELP?</h4>
          <p>
            HECS-HELP and other HELP loans are Australian Government study and training loans. If you have an
            outstanding HELP balance, you may be required to make compulsory repayments once your income exceeds the
            repayment threshold.
          </p>
        </div>

        <div>
          <h4 className="mb-1 font-semibold">How repayments work</h4>
          <ul className="ml-4 list-disc space-y-1">
            <li>Repayments are based on your repayment income, not just salary</li>
            <li>Repayment income includes taxable income plus certain adjustments</li>
            <li>Repayments are usually collected through withholding during the year or when you lodge your tax return</li>
            <li>Voluntary repayments can be made directly to reduce your balance but do not replace compulsory repayments</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-1 font-semibold">Impact on take-home pay</h4>
          <p>
            HELP repayments reduce your net (take-home) pay, which can affect affordability calculations and borrowing
            capacity estimates shown in this calculator.
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-dark-border">
          <h4 className="mb-1 font-semibold">More Information</h4>
          <ul className="space-y-1">
            <li>
              <a
                href="https://www.ato.gov.au/individuals-and-families/StudyTrainingLoan/HELP-repayments"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold underline hover:text-slate-700 dark:hover:text-white"
              >
                Compulsory repayments
              </a>
            </li>
            <li>
              <a
                href="https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold underline hover:text-slate-700 dark:hover:text-white"
              >
                HELP repayment thresholds and rates
              </a>
            </li>
            <li>
              <a
                href="https://www.ato.gov.au/individuals-and-families/StudyTrainingLoan/HELP-repayments/tell-your-employer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold underline hover:text-slate-700 dark:hover:text-white"
              >
                Telling your employer about your loan
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
