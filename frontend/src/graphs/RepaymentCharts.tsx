import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  TooltipProps,
  ReferenceLine
} from 'recharts';
import { PeriodRow } from 'calc-engine';
import { formatCurrency, formatThousands } from '../lib/formatters';

interface ChartProps {
  schedule: PeriodRow[];
  height?: number;
  overlaySchedule?: PeriodRow[];
  primaryName?: string;
  overlayName?: string;
  markers?: { monthIndex: number; label: string }[];
  interactive?: boolean; // show tooltip/hover cursor
  showLegend?: boolean;  // optional legend
}

function toMonthlyPoints(schedule: PeriodRow[]) {
  return schedule.filter((row, index) => index % 1 === 0).map((row) => {
    const date = new Date(row.date);
    return {
      dateLabel: `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`,
      principal: row.principalPaid,
      interest: row.interestCharged,
      balance: row.closingBalance
    };
  });
}

export const RepaymentOverTimeChart: React.FC<ChartProps> = ({ schedule, height }) => {
  const data = useMemo(() => toMonthlyPoints(schedule), [schedule]);
  const chartHeight = height ?? 250;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 40, left: 48 }}>
        <XAxis
          dataKey="dateLabel"
          hide={data.length > 40}
          tick={{ fill: 'var(--text-main)' }}
        />
        <YAxis
          tickFormatter={(v) => formatThousands(v)}
          tick={{ fill: 'var(--text-main)' }}
          label={{
            value: 'Repayment amount ($)',
            angle: -90,
            position: 'left',
            offset: 0,
            dy: -30,
            dx: -10,
            style: { fill: 'var(--text-main)' }
          }}
        />
        <Tooltip formatter={(value: number) => formatCurrency(value as number)} />
        <Area
          type="monotone"
          dataKey="principal"
          stackId="1"
          stroke="#9cc4ff"
          fill="rgba(156, 196, 255, 0.35)"
          name="Principle"
        />
        <Area
          type="monotone"
          dataKey="interest"
          stackId="1"
          stroke="#ffc69a"
          fill="rgba(255, 198, 154, 0.32)"
          name="Interest"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const BalanceChart: React.FC<ChartProps> = ({ schedule, height, overlaySchedule, primaryName, overlayName, markers, interactive = true, showLegend = false }) => {
  const data = useMemo<BalanceDatum[]>(() => {
    if (schedule.length === 0) return [];

    const startDate = new Date(schedule[0].date);

  return schedule.map((row, index) => {
      const d = new Date(row.date);
      const monthsFromStart =
        (d.getFullYear() - startDate.getFullYear()) * 12 +
        (d.getMonth() - startDate.getMonth());

      const repayment = row.interestCharged + row.principalPaid;
      const interestShare =
        repayment > 0 ? row.interestCharged / repayment : 0;
      const principalShare = 1 - interestShare;

      const principalRemaining = row.closingBalance;
      const interestArea = principalRemaining * interestShare;
      const principalArea = principalRemaining * principalShare;

      const baselineRow = overlaySchedule && overlaySchedule[index];
      const baselinePrincipalRemaining = baselineRow?.closingBalance;
      const baselineRepayment = baselineRow ? baselineRow.interestCharged + baselineRow.principalPaid : 0;
      const baselineInterestShare = baselineRepayment > 0 ? (baselineRow!.interestCharged / baselineRepayment) : 0;
      const baselinePrincipalShare = baselineRepayment > 0 ? 1 - baselineInterestShare : 0;

      const top = baselinePrincipalRemaining !== undefined
        ? Math.max(principalRemaining, baselinePrincipalRemaining)
        : 0;
      const bottom = baselinePrincipalRemaining !== undefined
        ? Math.min(principalRemaining, baselinePrincipalRemaining)
        : 0;
      const gapSize = baselinePrincipalRemaining !== undefined ? Math.max(0, top - bottom) : 0;

      return {
        monthIndex: monthsFromStart,
        dateLabel: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          '0'
        )}`,
        principalRemaining,
        interestArea,
        principalArea,
        repayment,
        interest: row.interestCharged,
        principal: row.principalPaid,
        baselinePrincipalRemaining,
        baselineInterestArea: (baselinePrincipalRemaining ?? 0) * baselineInterestShare,
        baselinePrincipalArea: (baselinePrincipalRemaining ?? 0) * baselinePrincipalShare,
        gapBottom: bottom,
        gapSize
      };
    });
  }, [schedule, overlaySchedule]);

  const maxPrincipal = (schedule[0]?.openingBalance ?? 0) + 100000;
  const lastMonthIndex = data.length ? data[data.length - 1].monthIndex : 0;
  const maxMonth = lastMonthIndex + 12;

  // Choose X-axis ticks by years rather than raw months
  const maxYear = Math.ceil(maxMonth / 12);
  const yearStep = 5;
  const ticks: number[] = [];
  for (let year = 0; year <= maxYear; year += yearStep) {
    ticks.push(year * 12);
  }

  const chartHeight = height ?? 250;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 40, left: 0 }}>
        <XAxis
          dataKey="monthIndex"
          type="number"
          domain={[0, maxMonth]}
          tickFormatter={(v) => `${Math.round(v / 12)}`}
          ticks={ticks}
          tick={{ fill: 'var(--text-main)', fontSize: 12 }}
          label={{
            value: 'Time (years)',
            position: 'bottom',
            offset: 0,
            style: { fill: 'var(--text-main)', fontSize: 12 }
          }}
        />
        <YAxis
          tickFormatter={(v) => formatThousands(v)}
          domain={[0, maxPrincipal]}
          tick={{ fill: 'var(--text-main)', angle: -45, textAnchor: 'end', fontSize: 12 }}
          width={50}
          label={{
            value: 'Balance ($)',
            angle: -90,
            position: 'left',
            offset: -10,
            style: { fill: 'var(--text-main)', fontSize: 12 }
          }}
        />
        {interactive && <Tooltip content={<BalanceTooltip />} />}
        {showLegend && <Legend />}
        <Area
          type="monotone"
          dataKey="principalArea"
          name={primaryName ?? 'Scenario'}
          stroke="#9cc4ff"
          fill="rgba(156, 196, 255, 0.28)"
          stackId="1"
        />
        <Area
          type="monotone"
          dataKey="interestArea"
          name="Interest share"
          stroke="#ffc69a"
          fill="rgba(255, 198, 154, 0.22)"
          stackId="1"
        />
        {/* Optional band to highlight difference between scenarios */}
        {data.some((d) => d.gapSize && d.gapSize > 0) && (
          <>
            <Area
              type="monotone"
              dataKey="gapBottom"
              stackId="gapBand"
              stroke="none"
              fill="transparent"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="gapSize"
              stackId="gapBand"
              name="Difference band"
              stroke="none"
              fill="rgba(59, 130, 246, 0.18)"
            />
          </>
        )}
        {/* Emphasize principal lines to clarify difference */}
        <Line
          type="monotone"
          dataKey="principalRemaining"
          name={primaryName ? `${primaryName} (line)` : 'Scenario (line)'}
          stroke="#2563eb"
          dot={false}
          strokeWidth={2.25}
        />
        {data.some((d) => d.baselinePrincipalRemaining !== undefined) && (
          <>
            <Area
              type="monotone"
              dataKey="baselinePrincipalArea"
              name={overlayName ? `${overlayName}` : 'Overlay'}
              stroke="#f59e0b"
              fill="rgba(245, 158, 11, 0.18)"
              stackId="2"
            />
            <Area
              type="monotone"
              dataKey="baselineInterestArea"
              name="Overlay interest share"
              stroke="#d97706"
              fill="rgba(217, 119, 6, 0.12)"
              stackId="2"
            />
            <Line
              type="monotone"
              dataKey="baselinePrincipalRemaining"
              name={overlayName ? `${overlayName} (line)` : 'Overlay (line)'}
              stroke="#f59e0b"
              dot={false}
              strokeWidth={2.25}
              strokeDasharray="6 5"
            />
          </>
        )}
        {markers?.map((m, idx) => (
          <ReferenceLine
            key={idx}
            x={m.monthIndex}
            stroke="#94a3b8"
            strokeDasharray="3 3"
            label={{ value: m.label, position: 'bottom', fill: 'var(--text-main)', fontSize: 11 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

interface BalanceDatum {
  monthIndex: number;
  dateLabel: string;
  principalRemaining: number;
  interestArea: number;
  principalArea: number;
  repayment: number;
  interest: number;
  principal: number;
  baselinePrincipalRemaining?: number;
  baselineInterestArea?: number;
  baselinePrincipalArea?: number;
  gapBottom?: number;
  gapSize?: number;
}

const BalanceTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const datum = payload[0].payload as BalanceDatum;
  const repayment = datum.repayment ?? 0;
  const interest = datum.interest ?? 0;
  const principal = datum.principal ?? 0;

  const months = datum.monthIndex ?? 0;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  const heading = years
    ? `${years} years ${remMonths} months`
    : `${remMonths} months`;

  const interestPct = repayment > 0 ? (interest / repayment) * 100 : 0;
  const principalPct = repayment > 0 ? (principal / repayment) * 100 : 0;

  return (
    <div
      style={{
        background: 'var(--chart-tooltip-bg)',
        borderRadius: 8,
        padding: '0.6rem 0.9rem',
        boxShadow: '0 6px 18px rgba(15,23,42,0.25)',
        fontSize: '0.85rem',
        maxWidth: 260
      }}
    >
      <div
        style={{
          fontWeight: 600,
          marginBottom: 6,
          color: 'var(--chart-tooltip-text)'
        }}
      >
        {heading}
      </div>

      <div style={{ marginBottom: 6 }}>
        <div
          style={{
            fontSize: '0.8rem',
            color: 'var(--chart-tooltip-label)',
            marginBottom: 2
          }}
        >
          Repayment amount
        </div>
        <div style={{ fontWeight: 600, color: 'var(--chart-tooltip-text)' }}>
          {formatCurrency(repayment)} (100%)
        </div>
      </div>

      <div style={{ marginBottom: 2, color: '#ffc69a' }}>
        Interest:{' '}
        <span style={{ fontWeight: 600 }}>
          {formatCurrency(interest)}
        </span>{' '}
        <span style={{ color: 'var(--chart-tooltip-label)' }}>({Math.round(interestPct)}%)</span>
      </div>
      <div style={{ color: '#9cc4ff' }}>
        Principle reduction:{' '}
        <span style={{ fontWeight: 600 }}>
          {formatCurrency(principal)}
        </span>{' '}
        <span style={{ color: 'var(--chart-tooltip-label)' }}>({Math.round(principalPct)}%)</span>
      </div>
    </div>
  );
};

// Alternative 1: Just the difference (simpler, more intuitive)
export const CumulativeInterestWithDifferenceLine: React.FC<ChartProps> = ({
  schedule,
  overlaySchedule,
  primaryName = 'Cumulative interest',
  overlayName = 'Overlay',
  showLegend = true,
  height = 250
}) => {
  const data = useMemo(() => {
    if (!overlaySchedule) return [];

    const maxLength = Math.max(schedule.length, overlaySchedule.length);
    let splitRunning = 0;  // Mortgage + Personal
    let singleRunning = 0;  // Single Mortgage

    const result = [];
    for (let i = 0; i < maxLength; i++) {
      const splitRow = schedule[i];  // This is the split scenario
      const singleRow = overlaySchedule[i];  // This is single mortgage

      if (splitRow) {
        splitRunning += splitRow.interestCharged;
      }
      if (singleRow) {
        singleRunning += singleRow.interestCharged;
      }

      const date = new Date((splitRow?.date ?? singleRow?.date) as string);
      // How much MORE the split costs (can be negative if split saves money)
      const difference = splitRunning - singleRunning;

      result.push({
        dateLabel: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        difference: difference  // Allow negative values
      });
    }
    console.log('[Alt1] data length:', result.length, 'first:', result[0], 'last:', result[result.length - 1]);
    return result;
  }, [schedule, overlaySchedule]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 40, left: 5 }}>
        <XAxis
          dataKey="dateLabel"
          hide={data.length > 40}
          tick={{ fill: 'var(--text-main)' }}
          label={{ value: 'Time', position: 'insideBottom', offset: -10, fill: 'var(--text-main)' }}
        />
        <YAxis
          tickFormatter={(v) => formatThousands(v)}
          tick={{ fill: 'var(--text-main)', fontSize: 10, angle: -45 }}
          label={{ value: 'Extra Cost ($)', angle: -90, position: 'insideLeft', fill: 'var(--text-main)' }}
        />
        <Tooltip
          formatter={(v: number) => formatCurrency(v)}
          labelFormatter={(label) => `Time: ${label}`}
        />
        {showLegend && (
          <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '10px', fontSize: '9px' }} />
        )}
        <defs>
          <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="difference"
          name="Extra Interest Cost (Split vs Single)"
          stroke="#ef4444"
          fill="url(#costGradient)"
          strokeWidth={2.5}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Alternative 2: Percentage difference
export const CumulativeInterestPercentageDifference: React.FC<ChartProps> = ({
  schedule,
  overlaySchedule,
  primaryName = 'Cumulative interest',
  overlayName = 'Overlay',
  showLegend = true,
  height = 250
}) => {
  const data = useMemo(() => {
    if (!overlaySchedule) return [];

    const maxLength = Math.max(schedule.length, overlaySchedule.length);
    let singleRunning = 0;  // Single mortgage (schedule)
    let splitRunning = 0;   // Split scenario (overlaySchedule)

    const result = [];
    for (let i = 0; i < maxLength; i++) {
      const singleRow = schedule[i];
      const splitRow = overlaySchedule[i];

      if (singleRow) {
        singleRunning += singleRow.interestCharged;
      }
      if (splitRow) {
        splitRunning += splitRow.interestCharged;
      }

      const date = new Date((singleRow?.date ?? splitRow?.date) as string);
      // Calculate percentage savings: (Split - Single) / Split * 100
      // This shows how much you SAVE (as %) by choosing single mortgage
      const percentageDiff = splitRunning > 0
        ? ((splitRunning - singleRunning) / splitRunning) * 100
        : 0;

      result.push({
        dateLabel: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        percentageDifference: percentageDiff
      });
    }
    console.log('[Alt2] data length:', result.length, 'first:', result[0], 'last:', result[result.length - 1]);
    return result;
  }, [schedule, overlaySchedule]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 40, left: 5 }}>
        <XAxis
          dataKey="dateLabel"
          hide={data.length > 40}
          tick={{ fill: 'var(--text-main)' }}
          label={{ value: 'Time', position: 'insideBottom', offset: -10, fill: 'var(--text-main)' }}
        />
        <YAxis
          tickFormatter={(v) => `${v.toFixed(1)}%`}
          tick={{ fill: 'var(--text-main)', fontSize: 10, angle: -45 }}
          label={{ value: '% Savings vs Split', angle: -90, position: 'insideLeft', fill: 'var(--text-main)' }}
        />
        <Tooltip formatter={(v: number) => `${v.toFixed(2)}%`} />
        {showLegend && (
          <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '10px', fontSize: '9px' }} />
        )}
        <Area
          type="monotone"
          dataKey="percentageDifference"
          name="% Savings (Single Mortgage)"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.3}
          strokeWidth={2.5}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Alternative 3: With milestones
export const CumulativeInterestWithMilestones: React.FC<ChartProps> = ({
  schedule,
  overlaySchedule,
  primaryName = 'Cumulative interest',
  overlayName = 'Overlay',
  showLegend = true,
  height = 250
}) => {
  const data = useMemo(() => {
    const maxLength = Math.max(schedule.length, overlaySchedule?.length ?? 0);
    let primaryRunning = 0;
    let overlayRunning = 0;
    let maxDifference = 0;
    let maxDifferenceIndex = 0;

    const result = [];
    for (let i = 0; i < maxLength; i++) {
      const primaryRow = schedule[i];
      const overlayRow = overlaySchedule?.[i];

      if (primaryRow) {
        primaryRunning += primaryRow.interestCharged;
      }
      if (overlayRow) {
        overlayRunning += overlayRow.interestCharged;
      }

      const date = new Date((primaryRow?.date ?? overlayRow?.date) as string);
      const difference = overlayRow && primaryRow ? overlayRunning - primaryRunning : 0;

      if (difference > maxDifference) {
        maxDifference = difference;
        maxDifferenceIndex = i;
      }

      result.push({
        dateLabel: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        primaryCumulativeInterest: primaryRow ? primaryRunning : undefined,
        overlayCumulativeInterest: overlayRow ? overlayRunning : undefined,
        difference: difference
      });
    }
    return { data: result, maxDifferenceIndex };
  }, [schedule, overlaySchedule]);

  // Find when personal loan ends (60 months for 5 year loan)
  const personalLoanEndIndex = 60;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data.data} margin={{ top: 8, right: 16, bottom: 40, left: 5 }}>
        <XAxis
          dataKey="dateLabel"
          hide={data.data.length > 40}
          tick={{ fill: 'var(--text-main)' }}
          label={{ value: 'Time', position: 'insideBottom', offset: -10, fill: 'var(--text-main)' }}
        />
        <YAxis
          tickFormatter={(v) => formatThousands(v)}
          tick={{ fill: 'var(--text-main)', fontSize: 10, angle: -45 }}
          label={{ value: 'Interest($)', angle: -90, position: 'insideLeft', fill: 'var(--text-main)' }}
        />
        <Tooltip formatter={(v: number) => formatCurrency(v)} />
        {showLegend && (
          <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '10px', fontSize: '9px' }} />
        )}
        {/* Reference lines for milestones */}
        <ReferenceLine
          x={personalLoanEndIndex}
          stroke="#94a3b8"
          strokeDasharray="3 3"
          label={{ value: 'Personal Loan Paid Off', position: 'top', fill: 'var(--text-main)', fontSize: 10 }}
        />
        <ReferenceLine
          x={data.maxDifferenceIndex}
          stroke="#ef4444"
          strokeDasharray="3 3"
          label={{ value: 'Peak Difference', position: 'top', fill: '#ef4444', fontSize: 10 }}
        />
        <defs>
          <linearGradient id="diffGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="overlayCumulativeInterest"
          stroke="none"
          fill="url(#diffGradient)"
        />
        <Line
          type="monotone"
          dataKey="primaryCumulativeInterest"
          name={primaryName}
          stroke="#2563eb"
          dot={false}
          strokeWidth={2.5}
        />
        <Line
          type="monotone"
          dataKey="overlayCumulativeInterest"
          name={overlayName}
          stroke="#f59e0b"
          dot={false}
          strokeWidth={2.5}
          strokeDasharray="6 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Original version with area fill
export const CumulativeInterestChart: React.FC<ChartProps> = ({
  schedule,
  overlaySchedule,
  primaryName = 'Cumulative interest',
  overlayName = 'Overlay',
  showLegend = true,
  height = 250
}) => {
  const data = useMemo(() => {
    const maxLength = Math.max(schedule.length, overlaySchedule?.length ?? 0);
    let primaryRunning = 0;
    let overlayRunning = 0;

    const result = [];
    for (let i = 0; i < maxLength; i++) {
      const primaryRow = schedule[i];
      const overlayRow = overlaySchedule?.[i];

      if (primaryRow) {
        primaryRunning += primaryRow.interestCharged;
      }
      if (overlayRow) {
        overlayRunning += overlayRow.interestCharged;
      }

      const date = new Date((primaryRow?.date ?? overlayRow?.date) as string);

      // Calculate the difference to emphasize the gap
      const difference = overlayRow && primaryRow
        ? overlayRunning - primaryRunning
        : undefined;

      result.push({
        dateLabel: `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}`,
        primaryCumulativeInterest: primaryRow ? primaryRunning : undefined,
        overlayCumulativeInterest: overlayRow ? overlayRunning : undefined,
        difference: difference
      });
    }
    return result;
  }, [schedule, overlaySchedule]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 40, left: 5 }}>
        <XAxis
          dataKey="dateLabel"
          hide={data.length > 40}
          tick={{ fill: 'var(--text-main)' }}
          label={{ value: 'Time', position: 'insideBottom', offset: -10, fill: 'var(--text-main)' }}
        />
        <YAxis
          tickFormatter={(v) => formatThousands(v)}
          tick={{ fill: 'var(--text-main)', fontSize: 10, angle: -45 }}
          label={{ value: 'Interest($)', angle: -90, position: 'insideLeft', fill: 'var(--text-main)' }}
        />
        <Tooltip formatter={(v: number) => formatCurrency(v)} />
        {showLegend && (
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '10px', fontSize: '9px' }}
          />
        )}
        {/* Area fill to emphasize the difference between scenarios */}
        {overlaySchedule && (
          <defs>
            <linearGradient id="differenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1} />
            </linearGradient>
          </defs>
        )}
        <Line
          type="monotone"
          dataKey="primaryCumulativeInterest"
          name={primaryName}
          stroke="#2563eb"
          fill="#2563eb"
          fillOpacity={0.1}
          dot={false}
          strokeWidth={2.5}
        />
        {overlaySchedule && (
          <>
            <Area
              type="monotone"
              dataKey="overlayCumulativeInterest"
              name={`${overlayName} (difference area)`}
              stroke="none"
              fill="url(#differenceGradient)"
            />
            <Line
              type="monotone"
              dataKey="overlayCumulativeInterest"
              name={overlayName}
              stroke="#f59e0b"
              dot={false}
              strokeWidth={2.5}
              strokeDasharray="6 5"
            />
          </>
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};
