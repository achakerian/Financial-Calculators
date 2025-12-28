import React from 'react';
import { FeatureAccordion, FeatureAccordionItem } from '../components/FeatureAccordion';
import { PageContainer } from '../components/PageContainer';
import { LoanCalculatorCard } from '../features/LoanCalculatorCard';
import { BorrowingPowerSection } from '../features/BorrowingPowerSection';
import { LoanComparisonCard } from '../features/LoanComparisonCard';

const items: FeatureAccordionItem[] = [
  {
    badge: 'Mortgage',
    title: 'Loan Calculator',
    content: <LoanCalculatorCard />,
  },
  {
    badge: 'Compare',
    title: 'Mortgage vs Personal Loan',
    content: <LoanComparisonCard />,
  },
  {
    badge: 'Capacity',
    title: 'Borrowing Power',
    content: <BorrowingPowerSection />,
  },
];

export const HomePage: React.FC = () => {
  return (
    <PageContainer borderColor="bg-orange-500">
      <FeatureAccordion items={items} initialOpen={null} />
    </PageContainer>
  );
};
