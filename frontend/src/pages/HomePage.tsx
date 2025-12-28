import React from 'react';
import { PageContainer } from '../components/PageContainer';

export const HomePage: React.FC = () => {
  return (
    <PageContainer borderColor="bg-orange-500">
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Welcome to Australian Financial Calculators
          </h1>
          <div className="space-y-4 text-sm text-slate-700 dark:text-dark-text">
            <p>
              This site exists to help you make sense of your personal finances before the ATO,
              your bank, or your future self asks uncomfortable questions. It's designed to help
              you project your finances, make informed decisions, and—when needed—ask smarter
              questions of your accountant instead of just nodding politely.
            </p>
            <p>
              The goal is simple: put you back in charge of your money. Financial success rarely
              comes from surprise; it usually comes from planning, spreadsheets, and a mild sense
              of dread handled early.
            </p>
          </div>
        </div>

        {/* Calculator Areas */}
        <div className="border-t border-slate-200 dark:border-dark-border pt-6">
          <p className="text-sm text-slate-700 dark:text-dark-text mb-4">
            The calculators are grouped into three broad areas:
          </p>
          <ul className="ml-6 list-disc space-y-2 text-sm text-slate-700 dark:text-dark-text">
            <li>
              Your obligations to the government (tax, documentation, and the bits you definitely can't ignore)
            </li>
            <li>
              Your obligations to your future self (superannuation, investments, and not eating cat food in retirement)
            </li>
            <li>
              Your investment in financial education (understanding what all of this actually means)
            </li>
          </ul>
        </div>

        {/* Site Features */}
        <div className="border-t border-slate-200 dark:border-dark-border pt-6">
          <p className="text-sm text-slate-700 dark:text-dark-text">
            The site is intentionally fast and intuitive. Most calculators take less time to
            complete than a train stop, and provide clear insights without requiring an accounting
            degree or a strong emotional support coffee.
          </p>
        </div>
      </div>
    </PageContainer>
  );
};
