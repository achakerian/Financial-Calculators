import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

type PayFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'annual';
type TaxResidency = 'resident' | 'foreign' | 'whm';
type MedicareOption = 'full' | 'reduced' | 'exempt';
type SuperMode = 'ontop' | 'included';

export const PayCalculator: React.FC = () => {
  const [viewMode, setViewMode] = useState<'simple' | 'advanced'>('simple');
  const [grossAnnual, setGrossAnnual] = useState<number>(90000);
  const [frequency, setFrequency] = useState<PayFrequency>('weekly');
  const [residency, setResidency] = useState<TaxResidency>('resident');
  const [claimTaxFree, setClaimTaxFree] = useState<boolean>(true);
  const [medicare, setMedicare] = useState<MedicareOption>('full');
  const [hasHelp, setHasHelp] = useState<boolean>(false);
  const [superMode, setSuperMode] = useState<SuperMode>('ontop');
  const [superRate, setSuperRate] = useState<number>(11.5); // %
  const [salarySacrifice, setSalarySacrifice] = useState<number>(0);

  const effectiveSalarySacrifice =
    viewMode === 'advanced' ? salarySacrifice : 0;

  const taxableIncome = Math.max(grossAnnual - effectiveSalarySacrifice, 0);

  const annualTax = useMemo(
    () => calculateAnnualTax(taxableIncome, residency, claimTaxFree),
    [taxableIncome, residency, claimTaxFree]
  );

  const medicareAmount = useMemo(
    () => calculateMedicare(taxableIncome, medicare),
    [taxableIncome, medicare]
  );

  const helpAmount = useMemo(
    () => (hasHelp ? calculateHelpRepayments(taxableIncome) : 0),
    [taxableIncome, hasHelp]
  );

  const totalTax = annualTax + medicareAmount + helpAmount;

  const netAnnual = Math.max(
    grossAnnual - totalTax - effectiveSalarySacrifice,
    0
  );

  const superRateDecimal = Math.max(superRate, 0) / 100;
  const { employerSuper, salaryPortionAnnual } =
    superMode === 'ontop'
      ? {
          employerSuper: grossAnnual * superRateDecimal,
          salaryPortionAnnual: grossAnnual
        }
      : splitGrossIntoSalaryAndSuper(grossAnnual, superRateDecimal);

  const packageTotal = salaryPortionAnnual + employerSuper;

  const frequencyLabel: Record<PayFrequency, string> = {
    weekly: 'Weekly',
    fortnightly: 'Fortnightly',
    monthly: 'Monthly',
    annual: 'Annual'
  };

  const perFactor: Record<PayFrequency, number> = {
    weekly: 52,
    fortnightly: 26,
    monthly: 12,
    annual: 1
  };

  const divisor = perFactor[frequency];
  const netPerPeriod = netAnnual / divisor;
  const taxPerPeriod = totalTax / divisor;
  const superPerPeriod = employerSuper / divisor;

  const freqOrder: PayFrequency[] = [
    'weekly',
    'fortnightly',
    'monthly',
    'annual'
  ];

  const donutDataBase = [
    { key: 'Net pay', value: netAnnual, color: '#60a5fa' },
    { key: 'Income tax', value: annualTax, color: '#fb923c' },
    { key: 'Medicare levy', value: medicareAmount, color: '#f97316' },
    { key: 'Super', value: employerSuper, color: '#22c55e' }
  ];

  const donutData =
    hasHelp && helpAmount > 0
      ? [
          donutDataBase[0],
          donutDataBase[1],
          { key: 'HELP repayments', value: helpAmount, color: '#a855f7' },
          donutDataBase[2],
          donutDataBase[3]
        ]
      : donutDataBase;

  return (
    <div className="two-column-layout">
      <section aria-label="Pay & Tax inputs" className="inputs-pane">
        <header
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0.3rem'
          }}
        >
          <h2 className="page-heading" style={{ marginBottom: 0 }}>
            Pay &amp; Tax Calculator
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: '0.9rem',
              color: 'var(--text-muted)'
            }}
          >
            Estimate Australian take-home pay, tax and super from your gross
            salary.
          </p>
        </header>

        <form
          style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}
          aria-label="Pay & Tax assumptions"
        >
          <div>
            <label>Pay frequency</label>
            <div
              style={{
                display: 'inline-flex',
                borderRadius: '999px',
                border: '1px solid var(--control-border)',
                padding: '2px',
                backgroundColor: 'var(--control-bg)',
                gap: '2px'
              }}
            >
              {(['weekly', 'fortnightly', 'monthly', 'annual'] as PayFrequency[]).map(
                (freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequency(freq)}
                    style={{
                      padding: '0.15rem 0.7rem',
                      borderRadius: '999px',
                      border: 'none',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      backgroundColor:
                        frequency === freq ? '#2563eb' : 'transparent',
                      color:
                        frequency === freq
                          ? '#ffffff'
                          : 'var(--text-main)'
                    }}
                  >
                    {frequencyLabel[freq]}
                  </button>
                )
              )}
            </div>
          </div>

          {(() => {
            const unitLabel =
              frequency === 'annual'
                ? 'annual'
                : frequencyLabel[frequency].toLowerCase();
            const label = `Gross income (${unitLabel})`;
            const factor = frequency === 'annual' ? 1 : divisor;
            const displayValue = grossAnnual / factor;
            return (
              <LabeledCurrencyPC
                id="pc-gross-income"
                label={label}
                varSymbol="G"
                value={displayValue}
                min={0}
                onChange={(val) => setGrossAnnual(val * factor)}
              />
            );
          })()}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '0.5rem'
            }}
          >
            <label style={{ marginBottom: 0 }}>HECS / HELP debt</label>
            <button
              type="button"
              onClick={() => setHasHelp((v) => !v)}
              style={{
                padding: '0.15rem 0.7rem',
                borderRadius: '999px',
                border: '1px solid var(--control-border)',
                backgroundColor: hasHelp ? '#2563eb' : 'var(--control-bg)',
                color: hasHelp ? '#ffffff' : 'var(--text-main)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {hasHelp ? 'Yes' : 'No'}
            </button>
          </div>

          {/* Simple / Advanced toggle below core (simple) inputs */}
          <div
            style={{
              marginTop: '0.75rem',
              marginBottom: viewMode === 'advanced' ? '0.25rem' : 0
            }}
          >
            <h3
              style={{
                margin: 0,
                marginBottom: '0.35rem',
                fontSize: '0.9rem'
              }}
            >
              Additional Details
            </h3>
            <div
              style={{
                display: 'inline-flex',
                borderRadius: '999px',
                border: '1px solid var(--control-border)',
                padding: '2px',
                backgroundColor: 'var(--control-bg)',
                gap: '2px'
              }}
              aria-label="Pay & Tax view mode"
            >
              <button
                type="button"
                onClick={() => setViewMode('simple')}
                style={{
                  padding: '0.15rem 0.7rem',
                  borderRadius: '999px',
                  border: 'none',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  backgroundColor:
                    viewMode === 'simple' ? '#2563eb' : 'transparent',
                  color:
                    viewMode === 'simple' ? '#ffffff' : 'var(--text-main)'
                }}
              >
                Simple
              </button>
              <button
                type="button"
                onClick={() => setViewMode('advanced')}
                style={{
                  padding: '0.15rem 0.7rem',
                  borderRadius: '999px',
                  border: 'none',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  backgroundColor:
                    viewMode === 'advanced' ? '#2563eb' : 'transparent',
                  color:
                    viewMode === 'advanced' ? '#ffffff' : 'var(--text-main)'
                }}
              >
                Advanced
              </button>
            </div>
          </div>

          {viewMode === 'advanced' && (
            <>
              {/* Advanced options appear below toggle so simple layout stays fixed */}
              <div>
                <label htmlFor="pay-year">Financial year</label>
                <select
                  id="pay-year"
                  style={{
                    width: '100%',
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.9rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--control-border)',
                    backgroundColor: 'var(--control-bg)',
                    color: 'var(--text-main)'
                  }}
                  defaultValue="2024-25"
                >
                  <option value="2024-25">2024–25 (current)</option>
                  <option value="2023-24">2023–24</option>
                </select>
              </div>

              <div>
                <label htmlFor="pc-residency">Tax residency</label>
                <select
                  id="pc-residency"
                  value={residency}
                  onChange={(e) =>
                    setResidency(e.target.value as TaxResidency)
                  }
                  style={{
                    width: '100%',
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.9rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--control-border)',
                    backgroundColor: 'var(--control-bg)',
                    color: 'var(--text-main)'
                  }}
                >
                  <option value="resident">Australian resident</option>
                  <option value="foreign">Foreign resident</option>
                  <option value="whm">Working holiday maker</option>
                </select>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <label>Tax-free threshold</label>
                  <button
                    type="button"
                    onClick={() => setClaimTaxFree((v) => !v)}
                    style={{
                      marginTop: '0.25rem',
                      width: '100%',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '999px',
                      border: '1px solid var(--control-border)',
                      backgroundColor: claimTaxFree
                        ? '#2563eb'
                        : 'var(--control-bg)',
                      color: claimTaxFree ? '#ffffff' : 'var(--text-main)',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    {claimTaxFree ? 'Claimed' : 'Not claimed'}
                  </button>
                </div>
                <div>
                  <label htmlFor="pc-medicare">Medicare levy</label>
                  <select
                    id="pc-medicare"
                    value={medicare}
                    onChange={(e) =>
                      setMedicare(e.target.value as MedicareOption)
                    }
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.9rem',
                      borderRadius: '0.375rem',
                      border: '1px solid var(--control-border)',
                      backgroundColor: 'var(--control-bg)',
                      color: 'var(--text-main)'
                    }}
                  >
                    <option value="full">Full (2%)</option>
                    <option value="reduced">Reduced</option>
                    <option value="exempt">Exempt</option>
                  </select>
                </div>
              </div>

              <div>
                <label>Super treatment</label>
                <div
                  style={{
                    display: 'inline-flex',
                    borderRadius: '999px',
                    border: '1px solid var(--control-border)',
                    padding: '2px',
                    backgroundColor: 'var(--control-bg)',
                    gap: '2px'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setSuperMode('ontop')}
                    style={{
                      padding: '0.15rem 0.7rem',
                      borderRadius: '999px',
                      border: 'none',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      backgroundColor:
                        superMode === 'ontop' ? '#2563eb' : 'transparent',
                      color:
                        superMode === 'ontop'
                          ? '#ffffff'
                          : 'var(--text-main)'
                    }}
                  >
                    + Super on top
                  </button>
                  <button
                    type="button"
                    onClick={() => setSuperMode('included')}
                    style={{
                      padding: '0.15rem 0.7rem',
                      borderRadius: '999px',
                      border: 'none',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      backgroundColor:
                        superMode === 'included' ? '#2563eb' : 'transparent',
                      color:
                        superMode === 'included'
                          ? '#ffffff'
                          : 'var(--text-main)'
                    }}
                  >
                    Included in G
                  </button>
                </div>
              </div>

              <LabeledNumberPC
                id="pc-super-rate"
                label="Super rate"
                varSymbol="s"
                suffix="%"
                value={superRate}
                min={0}
                max={30}
                step={0.1}
                onChange={setSuperRate}
              />

              <LabeledCurrencyPC
                id="pc-salary-sacrifice"
                label="Salary sacrifice (pre‑tax, annual)"
                varSymbol="SS"
                value={salarySacrifice}
                min={0}
                onChange={setSalarySacrifice}
              />
            </>
          )}
        </form>
      </section>

      <section aria-label="Pay & Tax results">
        {/* Summary row (annual figures) */}
        <div
          style={{
            marginBottom: '0.9rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.25rem'
          }}
        >
          <SummaryCardPC
            label="Gross income (annual)"
            value={currencyFormatter0.format(grossAnnual)}
          />
          <SummaryCardPC
            label="Net pay (annual)"
            value={currencyFormatter0.format(netAnnual)}
          />
          <SummaryCardPC
            label="Total tax (annual)"
            value={currencyFormatter0.format(totalTax)}
          />
          <SummaryCardPC
            label="Employer super (annual)"
            value={currencyFormatter0.format(employerSuper)}
          />
        </div>

        {/* Pay summary grid (all frequencies) + donut chart */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
            gap: '1rem',
            alignItems: 'stretch',
            marginBottom: '1rem'
          }}
        >
          <div
            style={{
              borderRadius: '0.75rem',
              border: '1px solid var(--border-subtle)',
              padding: '0.9rem 1rem'
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Pay summary</div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'minmax(0, 1.2fr) repeat(4, minmax(0, 1fr))',
                fontSize: '0.85rem',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '0.25rem',
                marginBottom: '0.25rem',
                columnGap: '0.75rem'
              }}
            >
              <div></div>
              {freqOrder.map((f) => (
                <div
                  key={f}
                  style={{
                    textAlign: 'right',
                    fontWeight: 500,
                    color: 'var(--text-muted)'
                  }}
                >
                  {frequencyLabel[f]}
                </div>
              ))}
            </div>

            <PaySummaryRow
              label="Income (gross)"
              values={freqOrder.map((f) => grossAnnual / perFactor[f])}
            />
            <PaySummaryRow
              label="Income (net)"
              values={freqOrder.map((f) => netAnnual / perFactor[f])}
            />
            <PaySummaryRow
              label="Superannuation"
              values={freqOrder.map((f) => employerSuper / perFactor[f])}
            />
            <PaySummaryRow
              label="Tax"
              values={freqOrder.map((f) => totalTax / perFactor[f])}
              isNegative
            />
          </div>

          <div
            style={{
              borderRadius: '0.75rem',
              border: '1px solid var(--border-subtle)',
              padding: '0.9rem 1rem'
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              Cash Breakdown
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'stretch',
                gap: '0.75rem'
              }}
            >
              <div style={{ flex: '0 0 50%' }}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      nameKey="key"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {donutData.map((entry) => (
                        <Cell key={entry.key} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        currencyFormatter0.format(value as number),
                        name
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Persistent breakdown for each part of the pie */}
              <div
                style={{
                  flex: '0 0 50%',
                  fontSize: '0.85rem',
                  transform: 'translate(-10%, 30%)'
                }}
              >
                {(() => {
                  const totalCash =
                    netAnnual +
                    annualTax +
                    medicareAmount +
                    helpAmount +
                    employerSuper;
                  return (
                    <>
                      <DonutBreakdownRow
                        label="Net pay"
                        value={netAnnual}
                        total={totalCash}
                        color="#60a5fa"
                      />
                      <DonutBreakdownRow
                        label="Income tax"
                        value={annualTax}
                        total={totalCash}
                        color="#fb923c"
                      />
                      <DonutBreakdownRow
                        label="Medicare levy"
                        value={medicareAmount}
                        total={totalCash}
                        color="#f97316"
                      />
                      {hasHelp && helpAmount > 0 && (
                        <DonutBreakdownRow
                          label="HELP repayments"
                          value={helpAmount}
                          total={totalCash}
                          color="#a855f7"
                        />
                      )}
                      <DonutBreakdownRow
                        label="Super"
                        value={employerSuper}
                        total={totalCash}
                        color="#22c55e"
                      />
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Simple Australian resident tax approximation, similar to BorrowingCapacity.
const calculateAnnualTax = (
  taxableIncome: number,
  residency: TaxResidency,
  claimTaxFree: boolean
): number => {
  if (taxableIncome <= 0) return 0;

  if (residency !== 'resident') {
    // Simple non-resident: no tax-free threshold, flat bands.
    if (taxableIncome <= 120000) return taxableIncome * 0.32;
    if (taxableIncome <= 180000) return 38400 + (taxableIncome - 120000) * 0.37;
    return 60600 + (taxableIncome - 180000) * 0.45;
  }

  const base = taxableIncome;

  // Approx 2024–25 resident rates. If no tax-free threshold, treat first
  // 18,200 as taxable at lowest marginal rate.
  const thresholdOffset = claimTaxFree ? 18200 : 0;

  if (base <= 18200) return 0;
  if (base <= 45000) return (base - thresholdOffset) * 0.19;
  if (base <= 120000) return 5092 + (base - 45000) * 0.325;
  if (base <= 180000) return 29467 + (base - 120000) * 0.37;
  return 51667 + (base - 180000) * 0.45;
};

const calculateMedicare = (
  taxableIncome: number,
  option: MedicareOption
): number => {
  if (option === 'exempt' || taxableIncome <= 0) return 0;
  if (option === 'reduced') return taxableIncome * 0.01;
  return taxableIncome * 0.02;
};

const calculateHelpRepayments = (taxableIncome: number): number => {
  if (taxableIncome < 54000) return 0;
  if (taxableIncome < 64000) return taxableIncome * 0.01;
  if (taxableIncome < 75000) return taxableIncome * 0.02;
  if (taxableIncome < 86000) return taxableIncome * 0.03;
  if (taxableIncome < 97000) return taxableIncome * 0.04;
  if (taxableIncome < 108000) return taxableIncome * 0.05;
  if (taxableIncome < 119000) return taxableIncome * 0.06;
  return taxableIncome * 0.07;
};

const splitGrossIntoSalaryAndSuper = (
  packageTotal: number,
  superRate: number
) => {
  if (superRate <= 0) {
    return { employerSuper: 0, salaryPortionAnnual: packageTotal };
  }
  const salaryPortionAnnual = packageTotal / (1 + superRate);
  const employerSuper = packageTotal - salaryPortionAnnual;
  return { employerSuper, salaryPortionAnnual };
};

const currencyFormatter0 = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0
});

interface BreakdownRowProps {
  label: string;
  value: number;
  bold?: boolean;
}

const BreakdownRow: React.FC<BreakdownRowProps> = ({ label, value, bold }) => {
  return (
    <div
      style={{
        fontSize: '0.9rem',
        color: 'var(--text-main)',
        marginBottom: 2,
        display: 'flex',
        justifyContent: 'space-between',
        gap: '0.75rem'
      }}
    >
      <span>{label}</span>
      <span style={{ fontWeight: bold ? 600 : 400 }}>
        {value < 0 ? `−${currencyFormatter0.format(Math.abs(value))}` : currencyFormatter0.format(value)}
      </span>
    </div>
  );
};

interface BreakdownTableRowProps {
  label: string;
  annual: number;
  per: number;
  bold?: boolean;
}

const BreakdownTableRow: React.FC<BreakdownTableRowProps> = ({
  label,
  annual,
  per,
  bold
}) => {
  const weight = bold ? 600 : 400;
  return (
    <tr>
      <td style={{ padding: '0.25rem 0' }}>{label}</td>
      <td style={{ padding: '0.25rem 0', textAlign: 'right', fontWeight: weight }}>
        {annual < 0
          ? `−${currencyFormatter0.format(Math.abs(annual))}`
          : currencyFormatter0.format(annual)}
      </td>
      <td style={{ padding: '0.25rem 0', textAlign: 'right', fontWeight: weight }}>
        {per < 0
          ? `−${currencyFormatter0.format(Math.abs(per))}`
          : currencyFormatter0.format(per)}
      </td>
    </tr>
  );
};

interface PaySummaryRowProps {
  label: string;
  values: number[]; // order corresponds to freqOrder
  isNegative?: boolean;
}

const PaySummaryRow: React.FC<PaySummaryRowProps> = ({
  label,
  values,
  isNegative
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.2fr) repeat(4, minmax(0, 1fr))',
        fontSize: '0.85rem',
        padding: '0.2rem 0',
        columnGap: '0.75rem'
      }}
    >
      <div>{label}</div>
      {values.map((v, index) => (
        <div
          key={index}
          style={{ textAlign: 'right', fontWeight: 500 }}
        >
          {isNegative && v > 0
            ? `−${currencyFormatter0.format(Math.abs(v))}`
            : currencyFormatter0.format(v)}
        </div>
      ))}
    </div>
  );
};

interface DonutBreakdownRowProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

const DonutBreakdownRow: React.FC<DonutBreakdownRowProps> = ({
  label,
  value,
  total,
  color
}) => {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.25rem',
        gap: '0.5rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '999px',
            backgroundColor: color
          }}
        />
        <span>{label}</span>
      </div>
      <div
        style={{
          textAlign: 'right',
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.35rem'
        }}
      >
        <div style={{ fontWeight: 500 }}>
          {currencyFormatter0.format(value)}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {pct.toFixed(0)}%
        </div>
      </div>
    </div>
  );
};

interface LabeledNumberPCProps {
  id: string;
  label: string;
  varSymbol?: string;
  suffix?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

const LabeledNumberPC: React.FC<LabeledNumberPCProps> = ({
  id,
  label,
  varSymbol,
  suffix,
  value,
  min,
  max,
  step,
  onChange
}) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <div
        style={{
          position: 'relative',
          display: 'inline-flex',
          width: '100%'
        }}
      >
        <input
          id={id}
          type="number"
          value={Number.isNaN(value) ? '' : value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: '100%',
            padding: '0.4rem 0.75rem',
            paddingLeft: varSymbol ? '2.75rem' : '0.75rem',
            paddingRight: suffix ? '1.4rem' : '0.75rem',
            fontSize: '0.9rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--control-border)',
            boxSizing: 'border-box',
            backgroundColor: 'var(--control-bg)',
            color: 'var(--text-main)'
          }}
        />
        {varSymbol && (
          <span
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)'
            }}
          >
            {varSymbol} =
          </span>
        )}
        {suffix && (
          <span
            style={{
              position: 'absolute',
              right: '0.65rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)'
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

interface LabeledCurrencyPCProps {
  id: string;
  label: string;
  varSymbol?: string;
  value: number;
  min?: number;
  onChange: (value: number) => void;
}

const LabeledCurrencyPC: React.FC<LabeledCurrencyPCProps> = ({
  id,
  label,
  varSymbol,
  value,
  min,
  onChange
}) => {
  const [display, setDisplay] = useState<string>('');

  React.useEffect(() => {
    if (!Number.isFinite(value)) {
      setDisplay('');
    } else {
      setDisplay(value ? currencyFormatter0.format(value) : '');
    }
  }, [value]);

  const handleChange = (raw: string) => {
    const numeric = raw.replace(/[^0-9]/g, '');
    const nextValue = numeric ? Number(numeric) : 0;
    if (min !== undefined && nextValue < min) {
      onChange(min);
      return;
    }
    setDisplay(numeric ? currencyFormatter0.format(nextValue) : '');
    onChange(nextValue);
  };

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <div
        style={{
          position: 'relative',
          display: 'inline-flex',
          width: '100%'
        }}
      >
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={display}
          onChange={(e) => handleChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.4rem 0.75rem',
            paddingLeft: varSymbol ? '2.75rem' : '0.75rem',
            fontSize: '0.9rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--control-border)',
            boxSizing: 'border-box',
            backgroundColor: 'var(--control-bg)',
            color: 'var(--text-main)'
          }}
        />
        {varSymbol && (
          <span
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)'
            }}
          >
            {varSymbol} =
          </span>
        )}
      </div>
    </div>
  );
};

interface SummaryCardPCProps {
  label: string;
  value: string;
}

const SummaryCardPC: React.FC<SummaryCardPCProps> = ({ label, value }) => (
  <div
    className="summary-card"
    style={{
      borderRadius: '0.5rem',
      border: '1px solid var(--border-subtle)',
      width: '75%',
      margin: '0 auto'
    }}
  >
    <div
      style={{
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        marginBottom: '0.15rem'
      }}
    >
      {label}
    </div>
    <div style={{ fontWeight: 600 }}>{value}</div>
  </div>
);

// Relation pills (=, −) were used previously between cards; removed for a
// simpler layout but the component is kept here for potential future use.
