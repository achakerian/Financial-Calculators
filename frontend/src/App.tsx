import React, { useState } from 'react';
import { RepaymentCalculator } from './features/RepaymentCalculator';
import { AdvancedSimulator } from './features/AdvancedSimulator';
import { BorrowingCapacity } from './features/BorrowingCapacity';

type TabId = 'repayment' | 'simulator' | 'capacity';

export const App: React.FC = () => {
  const [tab, setTab] = useState<TabId>('repayment');
  const [navOpen, setNavOpen] = useState(false);

  const pageLabel: Record<TabId, string> = {
    repayment: 'Repayments',
    simulator: 'Repayments (adv)',
    capacity: 'Borrowing capacity'
  };

  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <header className="app-header">
        <div className="header-title">
          <h1
            style={{
              fontSize: '1.5rem',
              margin: 0
            }}
          >
            Home Loan Calculators
          </h1>
          <p className="header-subtitle">{pageLabel[tab]}</p>
        </div>
        <div>
          <nav
            aria-label="Main tools"
            className="nav-inline"
          >
            <NavPill
              label="Repayments"
              active={tab === 'repayment'}
              onClick={() => setTab('repayment')}
            />
            <NavPill
              label="Repayments (adv)"
              active={tab === 'simulator'}
              onClick={() => setTab('simulator')}
            />
            <NavPill
              label="Borrowing capacity"
              active={tab === 'capacity'}
              onClick={() => setTab('capacity')}
            />
          </nav>
          <button
            type="button"
            className="nav-toggle"
            onClick={() => setNavOpen((open) => !open)}
            aria-haspopup="true"
            aria-expanded={navOpen}
          >
            ☰
          </button>
          {navOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: '1.5rem',
                marginTop: '0.5rem',
                background: '#ffffff',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                zIndex: 20,
                minWidth: '220px'
              }}
              role="menu"
            >
              <NavItem
                label="Repayments"
                active={tab === 'repayment'}
                onClick={() => {
                  setTab('repayment');
                  setNavOpen(false);
                }}
              />
              <NavItem
                label="Repayments (adv)"
                active={tab === 'simulator'}
                onClick={() => {
                  setTab('simulator');
                  setNavOpen(false);
                }}
              />
              <NavItem
                label="Borrowing capacity"
                active={tab === 'capacity'}
                onClick={() => {
                  setTab('capacity');
                  setNavOpen(false);
                }}
              />
            </div>
          )}
        </div>
      </header>
      <main
        className="app-main"
        style={{
          flex: 1,
          padding: '1.5rem'
        }}
      >
        {tab === 'repayment' && <RepaymentCalculator />}
        {tab === 'simulator' && <AdvancedSimulator />}
        {tab === 'capacity' && <BorrowingCapacity />}
      </main>
    </div>
  );
};

interface NavPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavPill: React.FC<NavPillProps> = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      borderRadius: '9999px',
      border: '1px solid',
      borderColor: active ? '#2563eb' : '#d1d5db',
      padding: '0.35rem 0.75rem',
      fontSize: '0.9rem',
      backgroundColor: active ? '#2563eb' : '#ffffff',
      color: active ? '#ffffff' : '#111827',
      cursor: 'pointer'
    }}
  >
    {label}
  </button>
);

interface NavItemProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      display: 'block',
      width: '100%',
      textAlign: 'left',
      padding: '0.5rem 0.85rem',
      border: 'none',
      borderBottom: '1px solid #f3f4f6',
      backgroundColor: active ? '#eff6ff' : '#ffffff',
      fontSize: '0.9rem',
      cursor: 'pointer'
    }}
  >
    {label}
  </button>
);
