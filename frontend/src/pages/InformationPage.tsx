import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { FeatureAccordion, FeatureAccordionItem } from '../components/FeatureAccordion';
import { TaxResidencyInformationSection } from '../features/TaxResidencyInformationSection';
import { HECSHELPInformationSection } from '../features/HECSHELPInformationSection';
import { TakeHomePayInformationSection } from '../features/TakeHomePayInformationSection';
import { AdditionalIncomeInformationSection } from '../features/AdditionalIncomeInformationSection';
import { GrossIncomeBreakdownInformationSection } from '../features/GrossIncomeBreakdownInformationSection';
import { LoanTermInformationSection } from '../features/LoanTermInformationSection';
import { MLSInformationSection } from '../features/MLSInformationSection';
import { SuperContributionsInformationSection } from '../features/SuperContributionsInformationSection';
import { FinancialDisclaimerInformationSection } from '../features/FinancialDisclaimerInformationSection';
import { PrivacyPolicyInformationSection } from '../features/PrivacyPolicyInformationSection';

export const InformationPage: React.FC = () => {
  // Check if we need to open a specific section based on URL hash
  const hash = window.location.hash.slice(1); // Remove the # symbol

  // Map hash IDs to accordion indices
  const hashToIndex: Record<string, number> = {
    'tax-residency': 0,
    'hecs-help': 1,
    'take-home-pay': 2,
    'additional-income': 3,
    'gross-income-breakdown': 4,
    'loan-term': 5,
    'medicare-levy-surcharge': 6,
    'super-contributions': 7,
    'disclaimer': 8,
    'privacy': 9,
  };

  const initialOpen = hash ? hashToIndex[hash] ?? null : null;

  React.useEffect(() => {
    if (hash) {
      // Give the accordion time to render and expand
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <PageContainer borderColor="bg-blue-500">
      <FeatureAccordion items={infoItems} initialOpen={initialOpen} />
    </PageContainer>
  );
};

const infoItems: FeatureAccordionItem[] = [
  {
    badge: 'Tax',
    title: 'Tax Residency',
    content: <TaxResidencyInformationSection />,
  },
  {
    badge: 'Tax',
    title: 'HECS / HELP Repayments',
    content: <HECSHELPInformationSection />,
  },
  {
    badge: 'Tax',
    title: 'Take-Home Pay Estimates',
    content: <TakeHomePayInformationSection />,
  },
  {
    badge: 'Tax',
    title: 'Additional Income',
    content: <AdditionalIncomeInformationSection />,
  },
  {
    badge: 'Pay',
    title: 'Gross Income Breakdown',
    content: <GrossIncomeBreakdownInformationSection />,
  },
  {
    badge: 'Loans',
    title: 'Loan Term Calculations',
    content: <LoanTermInformationSection />,
  },
  {
    badge: 'Tax',
    title: 'Medicare Levy Surcharge (MLS)',
    content: <MLSInformationSection />,
  },
  {
    badge: 'Super',
    title: 'Superannuation Contributions',
    content: <SuperContributionsInformationSection />,
  },
  {
    badge: 'Legal',
    title: 'Financial Disclaimer',
    content: <FinancialDisclaimerInformationSection />,
  },
  {
    badge: 'Privacy',
    title: 'Privacy Policy',
    content: <PrivacyPolicyInformationSection />,
  },
];
