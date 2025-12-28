import React from 'react';
import { FeatureAccordion, FeatureAccordionItem } from '../components/FeatureAccordion';
import { PageContainer } from '../components/PageContainer';
import { SuperComingSoonSection } from '../features/SuperComingSoonSection';

const items: FeatureAccordionItem[] = [
  {
    badge: 'Super',
    title: '🚧 Superannuation Calculator (in development)',
    content: <SuperComingSoonSection />,
  },
];

export const SuperPage: React.FC = () => {
  return (
    <PageContainer borderColor="bg-green-500">
      <FeatureAccordion items={items} initialOpen={null} />
    </PageContainer>
  );
};
