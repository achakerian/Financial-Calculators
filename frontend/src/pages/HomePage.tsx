import React from 'react';
import { PageContainer } from '../components/PageContainer';
import {
  HomeIcon,
  CalculatorIcon,
  PiggyBankIcon,
  InfoIcon,
} from '../components/icons';

export const HomePage: React.FC = () => {
  return (
    <PageContainer borderColor="bg-orange-500">
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Australian Financial Calculator
          </h1>
          <p className="text-sm text-slate-600 dark:text-dark-muted">
            Free, accurate financial insights for Australian residents
          </p>
        </div>

        {/* Purpose Section */}
        <div className="border-t border-slate-200 dark:border-dark-border pt-6">
          <h2 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
            What This Site Does
          </h2>
          <div className="space-y-3 text-sm text-slate-700 dark:text-dark-text">
            <p>
              This free, open-source calculator provides tailored financial insights for Australian residents. Calculate your take-home pay, manage investments, explore borrowing capacity, and access detailed tax information—all in one place.
            </p>
            <p>
              Designed for simplicity and accuracy, our calculators use current Australian tax rates and rules to give you a real-world view of your financial position. All calculations happen locally in your browser—no data is collected, stored, or shared.
            </p>
          </div>
        </div>

        {/* Navigation Guide */}
        <div className="border-t border-slate-200 dark:border-dark-border pt-6">
          <h2 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
            Explore Our Sections
          </h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {/* Home Card */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-dark-border dark:bg-dark-surface">
              <div className="flex flex-col items-center text-center">
                <HomeIcon className="h-8 w-8 mb-2 text-orange-500" />
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 mb-1">
                  Home
                </h3>
                <p className="text-xs text-slate-600 dark:text-dark-muted">
                  Get quick access to all features and frequently used calculators
                </p>
              </div>
            </div>

            {/* Pay & Tax Card */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-dark-border dark:bg-dark-surface">
              <div className="flex flex-col items-center text-center">
                <CalculatorIcon className="h-8 w-8 mb-2 text-violet-500" />
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 mb-1">
                  Pay & Tax
                </h3>
                <p className="text-xs text-slate-600 dark:text-dark-muted">
                  Calculate take-home pay, tax liability, HECS repayments, and super contributions
                </p>
              </div>
            </div>

            {/* Investments Card */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-dark-border dark:bg-dark-surface">
              <div className="flex flex-col items-center text-center">
                <PiggyBankIcon className="h-8 w-8 mb-2 text-green-500" />
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 mb-1">
                  Investments
                </h3>
                <p className="text-xs text-slate-600 dark:text-dark-muted">
                  Estimate borrowing capacity, compare loan scenarios, and plan investments
                </p>
              </div>
            </div>

            {/* Information Card */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-dark-border dark:bg-dark-surface">
              <div className="flex flex-col items-center text-center">
                <InfoIcon className="h-8 w-8 mb-2 text-blue-500" />
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 mb-1">
                  Information
                </h3>
                <p className="text-xs text-slate-600 dark:text-dark-muted">
                  Learn about tax residency, HECS/HELP, Medicare levies, and our privacy policy
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Best Use Tips */}
        <div className="border-t border-slate-200 dark:border-dark-border pt-6">
          <h2 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
            Get the Most Out of Our Calculators
          </h2>
          <ul className="ml-4 list-disc space-y-1 text-sm text-slate-700 dark:text-dark-text">
            <li>Enter annual figures for consistent calculations across all tools</li>
            <li>Review the Information section to understand how each calculator works</li>
            <li>Adjust assumptions to match your specific financial situation</li>
            <li>Bookmark pages you visit frequently for quick access</li>
            <li>Remember: results are estimates—consult a financial advisor for detailed advice</li>
          </ul>
        </div>
      </div>
    </PageContainer>
  );
};
