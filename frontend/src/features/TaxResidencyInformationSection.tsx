import React from 'react';

export const TaxResidencyInformationSection: React.FC = () => {
  return (
    <div className="space-y-3 text-sm text-slate-700 dark:text-dark-text" id="tax-residency">
      <div className="space-y-3">
        <div>
          <h4 className="mb-1 font-semibold">What is tax residency?</h4>
          <p>
            Your tax residency status determines which tax rates and Medicare rules apply to you in Australia.
          </p>
          <p className="mt-2">
            At a high level, you may be classified as:
          </p>
          <ul className="ml-4 list-disc space-y-1 mt-2">
            <li>Australian resident for tax purposes</li>
            <li>Foreign or temporary resident</li>
            <li>Working Holiday Maker (WHM)</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-1 font-semibold">Why it matters</h4>
          <ul className="ml-4 list-disc space-y-1">
            <li>Residents may be eligible for the tax-free threshold</li>
            <li>Foreign residents are taxed from the first dollar at different rates</li>
            <li>Medicare levy and Medicare Levy Surcharge rules may differ</li>
            <li>Different rate tables apply depending on your status</li>
          </ul>
          <p className="mt-2">
            This calculator applies different tax rules based on the residency option you select.
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-dark-border">
          <h4 className="mb-1 font-semibold">More Information</h4>
          <ul className="space-y-1">
            <li>
              <a
                href="https://www.ato.gov.au/individuals-and-families/coming-to-australia-or-going-overseas/your-tax-residency"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold underline hover:text-slate-700 dark:hover:text-white"
              >
                Residency tests
              </a>
            </li>
            <li>
              <a
                href="https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold underline hover:text-slate-700 dark:hover:text-white"
              >
                Australian resident tax rates
              </a>
            </li>
            <li>
              <a
                href="https://www.ato.gov.au/tax-rates-and-codes/tax-rates-foreign-residents"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold underline hover:text-slate-700 dark:hover:text-white"
              >
                Foreign resident tax rates
              </a>
            </li>
            <li>
              <a
                href="https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-holiday-makers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold underline hover:text-slate-700 dark:hover:text-white"
              >
                Working Holiday Maker tax rates
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
