'use client';

import { DataCard } from '@/components/DataCard';
import { ScoreDimensions } from '@/types/matrix';
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from 'recharts';

type RadarChartCardProps = {
  title: string;
  description?: string;
  scores: ScoreDimensions;
};

export function RadarChartCard({ title, description, scores }: RadarChartCardProps) {
  const chartData = [
    { dimension: 'Urgency', value: scores.strategicUrgency },
    { dimension: 'Velocity', value: scores.adoptionVelocity },
    { dimension: 'Investment', value: scores.investmentConfidence },
    { dimension: 'Innovation', value: scores.innovationIntensity },
    { dimension: 'Readiness', value: scores.operationalReadiness }
  ];

  return (
    <DataCard title={title} subtitle={description} className="h-full">
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} outerRadius="70%">
            <PolarGrid stroke="rgba(148, 163, 184, 0.25)" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: 'rgba(226, 232, 240, 0.8)', fontSize: 12, fontWeight: 500 }}
            />
            <Radar
              dataKey="value"
              stroke="rgba(251, 146, 60, 0.9)"
              fill="rgba(251, 146, 60, 0.32)"
              fillOpacity={0.85}
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 15, 23, 0.96)',
                border: '1px solid rgba(251, 146, 60, 0.35)',
                borderRadius: 12,
                color: '#f8fafc'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </DataCard>
  );
}
