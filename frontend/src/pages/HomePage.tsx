import React from 'react';
import { FeatureAccordion, FeatureAccordionItem } from '../components/FeatureAccordion';
import { PageContainer } from '../components/PageContainer';

const items: FeatureAccordionItem[] = [
  {
    badge: 'Home',
    title: '🚧 Coming Soon',
    content: (
      <div className="space-y-4 p-4">
        <p className="text-slate-700 dark:text-dark-text">
          New features coming soon to the home page.
        </p>
        <p className="text-sm text-slate-600 dark:text-dark-muted">
          In the meantime, check out the other sections for financial calculators and tools.
        </p>
      </div>
    ),
  },
];

export const HomePage: React.FC = () => {
  return (
    <PageContainer borderColor="bg-orange-500">
      <FeatureAccordion items={items} initialOpen={null} />
    </PageContainer>
  );
};
