import React from 'react';

export const LoansPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Loans</h1>
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Repayment Calculator
          </h2>
          <p className="text-sm text-gray-600">
            Calculate your loan repayments
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Borrowing Capacity
          </h2>
          <p className="text-sm text-gray-600">
            Find out how much you can borrow
          </p>
        </div>
      </div>
    </div>
  );
};
