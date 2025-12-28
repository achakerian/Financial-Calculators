import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { FeatureAccordion, FeatureAccordionItem } from '../components/FeatureAccordion';
import { MLSInformationSection } from '../features/MLSInformationSection';
import { SuperContributionsInformationSection } from '../features/SuperContributionsInformationSection';

export const InformationPage: React.FC = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageContainer borderColor="bg-blue-500">
      <FeatureAccordion items={infoItems} initialOpen={null} />
    </PageContainer>
  );
};

const infoItems: FeatureAccordionItem[] = [
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
];
