import React from 'react';

export const SuperComingSoonSection: React.FC = () => {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-900 shadow-sm dark:border-green-900/30 dark:bg-green-950/20 dark:text-green-100">
        <p className="font-semibold">Superannuation tools are under development</p>
        <p className="mt-1 text-xs text-green-800 dark:text-green-200">
          We're building comprehensive superannuation calculators including contribution strategies, salary sacrifice optimization, and retirement projections.
        </p>
      </div>

      <div className="rounded-3xl border-2 border-dashed border-slate-400 bg-white/80 p-8 text-center text-slate-700 shadow-lg backdrop-blur dark:border-dark-border dark:bg-dark-surfaceAlt/80 dark:text-dark-text">
        <p className="text-sm font-semibold text-slate-500 dark:text-dark-muted">🚧 (Under Construction)</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-dark-text">Superannuation tools coming soon</h1>
      </div>
    </div>
  );
};
