'use client';

import { DataCard } from '@/components/DataCard';
import {
  TechnologyOrderEntry,
  TechnologyResearchSeriesPoint,
  TechnologyTopApplicant
} from '@/types/matrix';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis
} from 'recharts';

type TechnologyResearchInnovationPanelProps = {
  selectedTechnologySlug: string;
  technologyOrder: TechnologyOrderEntry[];
  patentsSeries: TechnologyResearchSeriesPoint[];
  scholarSeries: TechnologyResearchSeriesPoint[];
  patentsDeltaPct: number;
  scholarDeltaPct: number;
  topApplicants: TechnologyTopApplicant[];
  topApplicantsNote: string;
};

type ResearchTrendCardProps = {
  title: string;
  data: TechnologyResearchSeriesPoint[];
  technologyOrder: TechnologyOrderEntry[];
  selectedTechnologySlug: string;
};

type ApplicantBubbleDatum = TechnologyTopApplicant & {
  x: number;
  y: number;
  z: number;
};

const STATUS_COLORS: Record<TechnologyTopApplicant['status'], string> = {
  none: '#6b8bff',
  new_challenger: '#facc15',
  significant_climber: '#4ade80',
  significant_drop: '#f87171'
};

const shortenLabel = (value: string) => {
  if (value.length <= 18) {
    return value;
  }
  return `${value.slice(0, 16)}…`;
};

const formatSignedPercentage = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

function ResearchTrendCard({
  title,
  data,
  technologyOrder,
  selectedTechnologySlug
}: ResearchTrendCardProps) {
  return (
    <DataCard title={title} className="h-full">
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: 4 }}>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.14)" />
            <XAxis dataKey="year" tick={{ fill: 'rgba(226, 232, 240, 0.72)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'rgba(226, 232, 240, 0.72)', fontSize: 11 }} width={42} />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 15, 23, 0.96)',
                border: '1px solid rgba(251, 146, 60, 0.35)',
                borderRadius: 12,
                color: '#f8fafc'
              }}
            />
            {technologyOrder.map((technology) => {
              const isSelected = technology.slug === selectedTechnologySlug;
              return (
                <Line
                  key={technology.slug}
                  type="monotone"
                  dataKey={technology.slug}
                  stroke={technology.color}
                  strokeWidth={isSelected ? 2.8 : 1.3}
                  strokeOpacity={isSelected ? 1 : 0.35}
                  dot={false}
                  activeDot={{ r: isSelected ? 4 : 3 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.12em] text-slate-400">
        {technologyOrder.map((technology) => (
          <span key={technology.slug} className="inline-flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: technology.color,
                opacity: technology.slug === selectedTechnologySlug ? 1 : 0.45
              }}
            />
            {technology.name}
          </span>
        ))}
      </div>
    </DataCard>
  );
}

export function TechnologyResearchInnovationPanel({
  selectedTechnologySlug,
  technologyOrder,
  patentsSeries,
  scholarSeries,
  patentsDeltaPct,
  scholarDeltaPct,
  topApplicants,
  topApplicantsNote
}: TechnologyResearchInnovationPanelProps) {
  const applicantBubbleData: ApplicantBubbleDatum[] = topApplicants.map((item, index) => ({
    ...item,
    x: 10 + (index % 5) * 24 + (Math.floor(index / 5) % 2) * 7,
    y: 10 + Math.floor(index / 5) * 21,
    z: item.documentCount
  }));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ResearchTrendCard
          title="Patents"
          data={patentsSeries}
          technologyOrder={technologyOrder}
          selectedTechnologySlug={selectedTechnologySlug}
        />
        <ResearchTrendCard
          title="Scholar Work"
          data={scholarSeries}
          technologyOrder={technologyOrder}
          selectedTechnologySlug={selectedTechnologySlug}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <DataCard title="Patents 2024 → 2025">
          <p className={`text-2xl font-semibold ${patentsDeltaPct >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
            {formatSignedPercentage(patentsDeltaPct)}
          </p>
        </DataCard>
        <DataCard title="Scholar 2024 → 2025">
          <p className={`text-2xl font-semibold ${scholarDeltaPct >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
            {formatSignedPercentage(scholarDeltaPct)}
          </p>
        </DataCard>
      </div>

      <DataCard title="Top Applicants 2025" subtitle="Bubble size by document count">
        <div className="h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <XAxis type="number" dataKey="x" domain={[0, 120]} hide />
              <YAxis type="number" dataKey="y" domain={[0, 90]} hide />
              <Scatter
                data={applicantBubbleData}
                shape={(shapeProps: unknown) => {
                  const safeProps = shapeProps as Partial<{
                    cx: number;
                    cy: number;
                    payload: ApplicantBubbleDatum;
                  }>;
                  const cx = safeProps.cx ?? 0;
                  const cy = safeProps.cy ?? 0;
                  const payload = safeProps.payload;
                  if (!payload) {
                    return <g />;
                  }
                  const radius = 18 + Math.sqrt(payload.z) / 3.8;
                  return (
                    <g>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={radius}
                        fill="rgba(30, 41, 90, 0.35)"
                        stroke="rgba(129, 140, 248, 0.85)"
                        strokeWidth={1.6}
                      />
                      <circle
                        cx={cx + radius * 0.72}
                        cy={cy - radius * 0.72}
                        r={4}
                        fill={STATUS_COLORS[payload.status as TechnologyTopApplicant['status']]}
                        stroke="rgba(15, 23, 42, 0.95)"
                        strokeWidth={1.4}
                      />
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#e2e8f0"
                        fontSize={10}
                        fontWeight={600}
                      >
                        {shortenLabel(payload.name)}
                      </text>
                    </g>
                  );
                }}
              />
              <RechartsTooltip
                formatter={(value: number) => [value.toLocaleString('en-US'), 'Documents']}
                cursor={{ strokeDasharray: '3 3', stroke: 'rgba(251, 146, 60, 0.25)' }}
                contentStyle={{
                  backgroundColor: 'rgba(10, 15, 23, 0.96)',
                  border: '1px solid rgba(251, 146, 60, 0.35)',
                  borderRadius: 12,
                  color: '#f8fafc'
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-300">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#facc15]" /> New challenger
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#4ade80]" /> Significant climber
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" /> Significant drop
          </span>
        </div>

        {topApplicantsNote ? (
          <p className="mt-4 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-300">
            Note: {topApplicantsNote}
          </p>
        ) : null}
      </DataCard>
    </div>
  );
}
