import React from 'react';

export const PayTaxPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Pay & Tax</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Pay Calculator
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Calculate your take-home pay after tax
        </p>
        <div className="text-center py-8 text-gray-500">
          Calculator coming soon...
        </div>
      </div>
    </div>
  );
};
