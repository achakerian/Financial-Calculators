import React from 'react';

export const BorrowingCapacity: React.FC = () => {
  return (
    <div
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '1rem 0'
      }}
    >
      <h2 style={{ marginTop: 0 }}>Borrowing capacity</h2>
      <p
        style={{
          fontSize: '0.95rem',
          color: '#4b5563',
          marginBottom: '0.75rem'
        }}
      >
        This section is currently under construction.
      </p>
      <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
        We&apos;re working on an interactive borrowing capacity
        estimator that will let you model income, expenses, and lender
        assumptions. Check back soon for updates.
      </p>
    </div>
  );
};

