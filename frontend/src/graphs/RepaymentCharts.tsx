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
  TooltipProps
} from 'recharts';
import { PeriodRow } from 'calc-engine';

interface ChartProps {
  schedule: PeriodRow[];
  height?: number;
  overlaySchedule?: PeriodRow[];
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
      <AreaChart data={data}>
        <XAxis dataKey="dateLabel" hide={data.length > 40} />
        <YAxis tickFormatter={(v) => formatThousands(v)} />
        <Tooltip formatter={(value: number) => formatCurrency(value as number)} />
        <Area
          type="monotone"
          dataKey="principal"
          stackId="1"
          stroke="#16a34a"
          fill="#bbf7d0"
          name="Principal"
        />
        <Area
          type="monotone"
          dataKey="interest"
          stackId="1"
          stroke="#f97316"
          fill="#fed7aa"
          name="Interest"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const BalanceChart: React.FC<ChartProps> = ({ schedule, height, overlaySchedule }) => {
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
        baselinePrincipalRemaining
      };
    });
  }, [schedule, overlaySchedule]);

  const maxPrincipal = (schedule[0]?.openingBalance ?? 0) + 100000;
  const lastMonthIndex = data.length ? data[data.length - 1].monthIndex : 0;
  const maxMonth = lastMonthIndex + 12;
  const tickStep = 96; // ~8 years if monthly
  const ticks: number[] = [];
  for (let m = 0; m <= maxMonth; m += tickStep) {
    ticks.push(m);
  }
  if (ticks.length === 0 || ticks[ticks.length - 1] !== maxMonth) {
    ticks.push(maxMonth);
  }

  const chartHeight = height ?? 250;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <AreaChart data={data}>
        <XAxis
          dataKey="monthIndex"
          type="number"
          domain={[0, maxMonth]}
          tickFormatter={(v) => `${v}`}
          ticks={ticks}
          label={{
            value: 'Time (months)',
            position: 'insideBottomRight',
            offset: -5
          }}
        />
        <YAxis
          tickFormatter={(v) => formatThousands(v)}
          domain={[0, maxPrincipal]}
        />
        <Tooltip content={<BalanceTooltip />} />
        <Area
          type="monotone"
          dataKey="principalArea"
          name="Principal remaining"
          stroke="#2563eb"
          fill="#bfdbfe"
          stackId="1"
        />
        <Area
          type="monotone"
          dataKey="interestArea"
          name="Interest share of repayments"
          stroke="#f97316"
          fill="#fed7aa"
          stackId="1"
        />
        {data.some((d) => d.baselinePrincipalRemaining !== undefined) && (
          <Line
            type="monotone"
            dataKey="baselinePrincipalRemaining"
            name="Principal without extras"
            stroke="#4b5563"
            dot={false}
            strokeDasharray="4 4"
          />
        )}
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
  const heading = `${years} years ${remMonths} months`;

  const interestPct = repayment > 0 ? (interest / repayment) * 100 : 0;
  const principalPct = repayment > 0 ? (principal / repayment) * 100 : 0;

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 4,
        padding: '0.5rem 0.75rem',
        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        fontSize: '0.85rem'
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{heading}</div>
      <div style={{ color: '#111827' }}>
        Repayment amount: {formatCurrency(repayment)} (100%)
      </div>
      <div style={{ color: '#f97316' }}>
        Interest: {formatCurrency(interest)} ({Math.round(interestPct)}%)
      </div>
      <div style={{ color: '#2563eb' }}>
        Principal reduction: {formatCurrency(principal)} (
        {Math.round(principalPct)}%)
      </div>
    </div>
  );
};

export const CumulativeInterestChart: React.FC<ChartProps> = ({ schedule }) => {
  const data = useMemo(() => {
    let running = 0;
    return schedule.map((row) => {
      running += row.interestCharged;
      const date = new Date(row.date);
      return {
        dateLabel: `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}`,
        cumulativeInterest: running
      };
    });
  }, [schedule]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="dateLabel" hide={data.length > 40} />
        <YAxis tickFormatter={(v) => formatThousands(v)} />
        <Tooltip formatter={(v: number) => formatCurrency(v)} />
        <Legend />
        <Line
          type="monotone"
          dataKey="cumulativeInterest"
          name="Cumulative interest"
          stroke="#f97316"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0
  }).format(value);
}

function formatThousands(value: number): string {
  if (value >= 1000) {
    return `${Math.round(value / 1000)}k`;
  }
  return `${Math.round(value)}`;
}
