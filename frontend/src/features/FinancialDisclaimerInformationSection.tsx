import React from 'react';

export const FinancialDisclaimerInformationSection: React.FC = () => {
  return (
    <div id="disclaimer" className="space-y-6 text-sm text-slate-700 dark:text-slate-300">
      {/* Introduction */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Purpose & Limitations
        </h3>
        <p>
          The financial calculators and tools provided on this website are for <strong>educational and illustrative purposes only</strong> and <strong>do not constitute financial, tax, investment or legal advice</strong>.
        </p>
      </div>

      {/* No Warranties */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          No Warranties
        </h3>
        <p>
          While we endeavour to ensure the information and calculations presented are accurate and useful, we make <strong>no warranties or representations</strong> regarding the completeness, accuracy, reliability, suitability or availability of the results.
        </p>
      </div>

      {/* Individual Circumstances */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Your Unique Financial Situation
        </h3>
        <p>
          Your individual financial situation is unique. Calculations may not reflect your specific circumstances, and results <strong>do not guarantee any particular financial outcome</strong>. You should not rely solely on the results from these tools when making decisions about borrowing, lending or other financial commitments.
        </p>
      </div>

      {/* Professional Advice */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Seek Professional Advice
        </h3>
        <p>
          Before making any financial decisions, we <strong>strongly recommend</strong> you seek professional advice from a qualified financial adviser, accountant or other relevant professional.
        </p>
      </div>

      {/* Limitation of Liability */}
      <div className="space-y-3 rounded-lg border-2 border-slate-300 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/50">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Limitation of Liability
        </h3>
        <p className="font-semibold">
          By using these calculators, you acknowledge and agree that neither the author nor the website is responsible or liable for any loss or damage you may incur as a result of your use of, or reliance on, the information provided.
        </p>
      </div>
    </div>
  );
};
