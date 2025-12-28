import React from 'react';

export const LoanTermInformationSection: React.FC = () => {
  return (
    <div className="space-y-3 text-sm text-slate-700 dark:text-dark-text" id="loan-term">
      <div className="space-y-3">
        <div>
          <h4 className="mb-1 font-semibold">What is 'Term left'?</h4>
          <p>
            Loan repayments depend on both the remaining loan balance and the remaining loan term.
          </p>
          <p className="mt-2">
            If you're part-way through a loan, ensure the "term left" matches the remaining balance entered. Using the
            original loan term may produce misleading repayment estimates.
          </p>
        </div>

        <div>
          <h4 className="mb-1 font-semibold">Setting remaining term</h4>
          <p>
            Set the remaining term to reflect how many years you have left to repay the loan, not the original loan
            term when you first borrowed.
          </p>
          <p className="mt-2">
            For example, if you took out a 30-year loan 5 years ago, your remaining term is 25 years.
          </p>
        </div>
      </div>
    </div>
  );
};
