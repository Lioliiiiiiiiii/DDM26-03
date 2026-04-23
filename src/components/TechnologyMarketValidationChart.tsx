'use client';

import { DataCard } from '@/components/DataCard';
import { MetricPill } from '@/components/MetricPill';
import { TechnologyMarketScatterPoint } from '@/types/matrix';
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis
} from 'recharts';

type TechnologyMarketValidationChartProps = {
  totals: {
    unicornFundingUsd: number;
    unicornCount: number;
    nativeUnicornCount: number;
    emergingUnicornCount: number;
    startupCount2025: number;
  };
  points: TechnologyMarketScatterPoint[];
};

const CATEGORY_COLORS: Record<TechnologyMarketScatterPoint['category'], string> = {
  Native: '#f59e0b',
  Unicorn: '#72a9ff',
  Emerging: '#4ade80'
};

const formatUsd = (value: number) => {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  return `$${Math.round(value).toLocaleString('en-US')}`;
};

export function TechnologyMarketValidationChart({ totals, points }: TechnologyMarketValidationChartProps) {
  const nativePoints = points.filter((point) => point.category === 'Native');
  const unicornPoints = points.filter((point) => point.category === 'Unicorn');
  const emergingPoints = points.filter((point) => point.category === 'Emerging');

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <MetricPill label="Total funding" value={formatUsd(totals.unicornFundingUsd)} tone="positive" />
        <MetricPill label="Unicorn count" value={String(totals.unicornCount)} />
        <MetricPill label="Native" value={String(totals.nativeUnicornCount)} />
        <MetricPill label="Emerging" value={String(totals.emergingUnicornCount)} />
        <MetricPill label="Startups 2025" value={String(totals.startupCount2025)} />
      </div>

      <DataCard
        title="Organization Funding Landscape"
        subtitle="Founded date vs total funding by maturity category"
      >
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 8, bottom: 8, left: 8 }}>
              <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" />
              <XAxis
                type="number"
                dataKey="foundedYear"
                domain={[1995, 2027]}
                tick={{ fill: 'rgba(226, 232, 240, 0.72)', fontSize: 11 }}
                tickCount={8}
                name="Founded"
              />
              <YAxis
                type="number"
                dataKey="fundingUsd"
                scale="log"
                domain={[1_000_000, 'dataMax']}
                tick={{ fill: 'rgba(226, 232, 240, 0.72)', fontSize: 11 }}
                tickFormatter={formatUsd}
                width={62}
                name="Funding"
              />
              <RechartsTooltip
                cursor={{ strokeDasharray: '3 3', stroke: 'rgba(251, 146, 60, 0.3)' }}
                formatter={(value: number, _name: string, payload: { payload?: TechnologyMarketScatterPoint }) => [
                  formatUsd(value),
                  payload?.payload?.name ?? 'Organization'
                ]}
                labelFormatter={(label) => `Founded: ${label}`}
                contentStyle={{
                  backgroundColor: 'rgba(10, 15, 23, 0.96)',
                  border: '1px solid rgba(251, 146, 60, 0.35)',
                  borderRadius: 12,
                  color: '#f8fafc'
                }}
              />
              <Scatter data={nativePoints} fill={CATEGORY_COLORS.Native} name="Native" />
              <Scatter data={unicornPoints} fill={CATEGORY_COLORS.Unicorn} name="Unicorn" />
              <Scatter data={emergingPoints} fill={CATEGORY_COLORS.Emerging} name="Emerging" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.14em] text-slate-300">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" /> Native
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#72a9ff]" /> Unicorn
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#4ade80]" /> Emerging
          </span>
        </div>
      </DataCard>
    </div>
  );
}
