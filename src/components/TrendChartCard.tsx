'use client';

import { DataCard } from '@/components/DataCard';
import { TimelinePoint } from '@/types/matrix';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis
} from 'recharts';

type TrendChartCardProps = {
  title: string;
  subtitle?: string;
  data: TimelinePoint[];
  showArea?: boolean;
  dataKeyLabel?: string;
};

export function TrendChartCard({
  title,
  subtitle,
  data,
  showArea = true,
  dataKeyLabel = 'value'
}: TrendChartCardProps) {
  return (
    <DataCard title={title} subtitle={subtitle} className="h-full">
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(251, 146, 60, 0.65)" />
                <stop offset="95%" stopColor="rgba(251, 146, 60, 0)" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" vertical={false} />
            <XAxis dataKey="year" tick={{ fill: 'rgba(226, 232, 240, 0.75)', fontSize: 12 }} />
            <YAxis tick={{ fill: 'rgba(226, 232, 240, 0.75)', fontSize: 12 }} width={36} />
            <RechartsTooltip
              formatter={(value: number) => [value, dataKeyLabel]}
              contentStyle={{
                backgroundColor: 'rgba(10, 15, 23, 0.96)',
                border: '1px solid rgba(251, 146, 60, 0.35)',
                borderRadius: 12,
                color: '#f8fafc'
              }}
            />
            {showArea ? <Area type="monotone" dataKey="value" stroke="transparent" fill="url(#trendFill)" /> : null}
            <Line
              type="monotone"
              dataKey="value"
              stroke="rgba(252, 211, 77, 0.95)"
              strokeWidth={2.4}
              dot={{ r: 3, strokeWidth: 0, fill: 'rgba(254, 215, 170, 0.95)' }}
              activeDot={{ r: 5, fill: '#fb923c' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DataCard>
  );
}
