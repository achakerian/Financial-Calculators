import React from 'react';

export const SuperPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Superannuation</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Super Contributions Calculator
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Plan your superannuation contributions
        </p>
        <div className="text-center py-8 text-gray-500">
          Calculator coming soon...
        </div>
      </div>
    </div>
  );
};
