import React from 'react';

export const PrivacyPolicyInformationSection: React.FC = () => {
  return (
    <div id="privacy" className="space-y-6 text-sm text-slate-700 dark:text-slate-300">
      {/* No Data Collection */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          No Data Collection
        </h3>
        <p>
          This website <strong>does not collect, store or process any personal information</strong>. All calculations are performed <strong>locally in your browser</strong> and no data is transmitted, saved or shared.
        </p>
      </div>

      {/* No Tracking */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          No Tracking Technologies
        </h3>
        <p>
          We <strong>do not use cookies, analytics, tracking technologies or third-party services</strong> that collect personal data.
        </p>
      </div>

      {/* Future Updates */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Future Changes
        </h3>
        <p>
          If this website is updated in the future to collect personal information, this privacy policy will be <strong>updated accordingly</strong> with clear notice to users.
        </p>
      </div>

      {/* Contact */}
      <div className="space-y-3 rounded-lg border-2 border-slate-300 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/50">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Questions or Concerns
        </h3>
        <p>
          If you have any questions about this policy, you may contact the site owner via the <strong>project repository</strong>.
        </p>
      </div>
    </div>
  );
};
