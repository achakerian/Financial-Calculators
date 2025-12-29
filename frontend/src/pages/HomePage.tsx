import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { FeatureAccordion, FeatureAccordionItem } from '../components/FeatureAccordion';

const futureFeatures: FeatureAccordionItem[] = [
  {
    badge: 'Roadmap',
    title: 'Coming Soon',
    content: (
      <div className="space-y-6">
        {/* Development Timeline */}
        <div>
          <h3 className="text-base font-semibold mb-4 text-slate-900 dark:text-white">
            Development Timeline
          </h3>
          <div className="space-y-4 text-sm">
            {/* Recently Completed */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Recently Completed ✓
              </h4>
              <ul className="ml-6 list-disc space-y-1 text-slate-700 dark:text-dark-text">
                <li>Tax residency selector (Resident / Non-resident / Working Holiday Maker)</li>
                <li>Medicare Levy Surcharge calculator with family logic</li>
                <li>Year-specific HECS/HELP repayment tables (legacy + marginal systems)</li>
                <li>Medicare low-income threshold phase-in calculations</li>
                <li>Comprehensive tax data consolidation (6 tax years: 2020-21 to 2025-26)</li>
                <li>Loan comparison calculator with fee integration and outcomes</li>
                <li>Dark mode with persistent preferences</li>
                <li>Information page with disclaimers and methodology</li>
                <li>HECS/HELP information banners and tooltips</li>
                <li>Currency and percentage formatting consistency</li>
              </ul>
            </div>

            {/* Next Up */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Next Up
              </h4>
              <ul className="ml-6 list-disc space-y-1 text-slate-700 dark:text-dark-text">
                <li>Enhanced sharing capabilities (copy/share calculator states via URL)</li>
                <li>Save and load scenarios for easy comparison</li>
                <li>Export results to CSV and PDF formats</li>
                <li>Sanity check warnings for unusual inputs</li>
                <li>Comprehensive inline tooltips and help content</li>
              </ul>
            </div>

            {/* Future Enhancements */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Future Enhancements
              </h4>
              <ul className="ml-6 list-disc space-y-1 text-slate-700 dark:text-dark-text">
                <li>Additional tax offsets (SAPTO for seniors, PHI rebate)</li>
                <li>Advanced loan features (extra repayments, offset accounts, comparison rates)</li>
                <li>Borrowing capacity enhancements (HEM benchmark, existing debts assessment)</li>
                <li>Side-by-side scenario comparison tools</li>
                <li>Enhanced accessibility features (WCAG AA compliance)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Status Note */}
        <div className="border-t border-slate-200 dark:border-dark-border pt-4">
          <p className="text-xs text-slate-600 dark:text-dark-muted italic">
            Development progress: 37% complete. Timelines are estimates and subject to change.
            See the full roadmap for detailed feature status.
          </p>
        </div>

        {/* Personalised Insights Panel */}
        <div className="border-t border-slate-200 dark:border-dark-border pt-6">
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Personalised Insights Panel
            </h3>
            <div className="space-y-3 text-sm text-slate-700 dark:text-dark-text">
              <p>
                We're currently developing a personalised insights panel that allows you to securely log
                in and upload financial information such as bank statements, loans and repayments,
                expenses, superannuation and HECS/HELP details. This will enable a more focused,
                tailored view of your overall financial position.
              </p>
              <p>
                While the platform will not provide personalised financial advice, it will present your
                information in a clear, structured way to help you better understand your finances and
                support more informed discussions with your accountant or financial adviser.
              </p>
              <p className="font-semibold text-slate-900 dark:text-white">
                Currently, we do not collect any personal data, as outlined in our Privacy Policy.
                Before this feature goes into production, we will revise our Privacy Policy to reflect
                the new data handling practices and provide full transparency about how your information
                will be stored and protected.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export const HomePage: React.FC = () => {
  return (
    <PageContainer borderColor="bg-orange-500">
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Welcome to AFC
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

        {/* Future Features - Collapsible */}
        <div className="border-t border-slate-200 dark:border-dark-border pt-6">
          <FeatureAccordion items={futureFeatures} initialOpen={null} />
        </div>
      </div>
    </PageContainer>
  );
};
