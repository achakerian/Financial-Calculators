import React from 'react';
import { FeatureAccordion, FeatureAccordionItem } from '../components/FeatureAccordion';
import { PageContainer } from '../components/PageContainer';

const items: FeatureAccordionItem[] = [
  {
    badge: 'Income',
    title: 'Pay calculator',
    content: 'Calculate net income with instant PAYG, Medicare and HELP adjustments.',
  },
  {
    badge: 'Bonuses',
    title: 'Irregular income',
    content: 'Simulate contracting gigs, overtime spikes and bonus-heavy structures.',
  },
  {
    badge: 'Insights',
    title: 'Tax year progress',
    content: 'Visualise where you are in the financial year and upcoming obligations.',
  },
  {
    badge: 'Future',
    title: 'Roadmap banner',
    content: 'Peek at the calculations landing next across pay and tax journeys.',
  },
];

export const PayTaxPage: React.FC = () => {
  return (
    <PageContainer>
      <FeatureAccordion items={items} />
    </PageContainer>
  );
};
