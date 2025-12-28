import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { MLSInformationSection } from '../features/MLSInformationSection';

export const InformationPage: React.FC = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageContainer borderColor="bg-blue-500">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-slate-800 dark:text-white">
          Tax Information
        </h1>
        <MLSInformationSection />
      </div>
    </PageContainer>
  );
};
