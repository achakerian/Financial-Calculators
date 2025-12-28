import React from 'react';

export const TakeHomePayInformationSection: React.FC = () => {
  return (
    <div className="space-y-3 text-sm text-slate-700 dark:text-dark-text" id="take-home-pay">
      <div className="space-y-3">
        <div>
          <h4 className="mb-1 font-semibold">What does this estimate include?</h4>
          <p>
            Your estimated take-home pay is calculated using the information you enter and current tax rules. It may
            include:
          </p>
          <ul className="ml-4 list-disc space-y-1 mt-2">
            <li>Selected tax year</li>
            <li>Tax residency</li>
            <li>Income tax</li>
            <li>Medicare levy and surcharge (if applicable)</li>
            <li>HELP repayments (if selected)</li>
            <li>Superannuation assumptions</li>
            <li>Rounding rules</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-1 font-semibold">What may not be included</h4>
          <ul className="ml-4 list-disc space-y-1">
            <li>Tax deductions or offsets</li>
            <li>Salary packaging outside what you enter</li>
            <li>Changes during the year</li>
            <li>Employer-specific payroll treatments</li>
          </ul>
          <p className="mt-2">
            Because individual circumstances vary, results should be used as a guide only. Always check your payslips
            or official ATO guidance for precise figures.
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
          </ul>
        </div>
      </div>
    </div>
  );
};
