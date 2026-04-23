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
  radius: number;
};

const STATUS_COLORS: Record<Exclude<TechnologyTopApplicant['status'], 'none'>, string> = {
  new_challenger: '#facc15',
  significant_climber: '#4ade80',
  significant_drop: '#f87171'
};

const BUBBLE_LAYOUT_WIDTH = 1000;
const BUBBLE_LAYOUT_HEIGHT = 640;
const BUBBLE_PADDING = 10;

const wrapLabel = (value: string, maxCharsPerLine = 16, maxLines = 3) => {
  const words = value.trim().split(/\s+/);
  if (words.length === 1 && words[0].length > maxCharsPerLine) {
    const chunks = [];
    for (let index = 0; index < words[0].length; index += maxCharsPerLine) {
      chunks.push(words[0].slice(index, index + maxCharsPerLine));
    }
    const limited = chunks.slice(0, maxLines);
    if (chunks.length > maxLines) {
      limited[maxLines - 1] = `${limited[maxLines - 1].slice(0, Math.max(0, maxCharsPerLine - 1))}…`;
    }
    return limited;
  }

  const lines: string[] = [];
  let currentLine = '';
  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      currentLine = candidate;
      continue;
    }
    if (currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      lines.push(word.slice(0, maxCharsPerLine));
      currentLine = word.slice(maxCharsPerLine);
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  if (lines.length <= maxLines) {
    return lines;
  }

  const truncated = lines.slice(0, maxLines);
  const lastLine = truncated[maxLines - 1];
  truncated[maxLines - 1] = `${lastLine.slice(0, Math.max(0, maxCharsPerLine - 1))}…`;
  return truncated;
};

const formatSignedPercentage = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

const createBubbleData = (topApplicants: TechnologyTopApplicant[]): ApplicantBubbleDatum[] => {
  const ranked = [...topApplicants].sort((a, b) => b.documentCount - a.documentCount);
  const centerX = BUBBLE_LAYOUT_WIDTH / 2;
  const centerY = BUBBLE_LAYOUT_HEIGHT / 2;
  const placed: ApplicantBubbleDatum[] = [];

  for (const applicant of ranked) {
    const baseRadius = 34 + Math.sqrt(applicant.documentCount) * 0.95;
    const radius = Math.min(baseRadius, 88);
    let placedBubble: ApplicantBubbleDatum | null = null;

    for (let attempt = 0; attempt < 560; attempt += 1) {
      const angle = attempt * 2.399963 + ranked.length * 0.12;
      const spiral = 20 * Math.sqrt(attempt);
      const x = centerX + Math.cos(angle) * spiral * 1.85;
      const y = centerY + Math.sin(angle) * spiral * 1.3;

      const insideBounds =
        x - radius >= BUBBLE_PADDING &&
        x + radius <= BUBBLE_LAYOUT_WIDTH - BUBBLE_PADDING &&
        y - radius >= BUBBLE_PADDING &&
        y + radius <= BUBBLE_LAYOUT_HEIGHT - BUBBLE_PADDING;

      if (!insideBounds) {
        continue;
      }

      const collides = placed.some((existing) => {
        const dx = x - existing.x;
        const dy = y - existing.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < radius + existing.radius + 7;
      });

      if (!collides) {
        placedBubble = {
          ...applicant,
          x,
          y,
          z: applicant.documentCount,
          radius
        };
        break;
      }
    }

    if (!placedBubble) {
      const fallbackRow = Math.floor(placed.length / 4);
      const fallbackCol = placed.length % 4;
      placedBubble = {
        ...applicant,
        x: 155 + fallbackCol * 230,
        y: 115 + fallbackRow * 155,
        z: applicant.documentCount,
        radius: Math.max(34, radius * 0.84)
      };
    }

    placed.push(placedBubble);
  }

  return placed;
};

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
  const applicantBubbleData = createBubbleData(topApplicants);

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
        <div className="h-[430px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <XAxis type="number" dataKey="x" domain={[0, BUBBLE_LAYOUT_WIDTH]} hide />
              <YAxis type="number" dataKey="y" domain={[0, BUBBLE_LAYOUT_HEIGHT]} hide />
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
                  const radius = payload.radius;
                  const textLines = wrapLabel(payload.name);
                  const hasStatus = payload.status !== 'none';
                  const outsideLabel = radius < 44;
                  const fontSize = radius > 72 ? 11 : radius > 56 ? 10 : 9;

                  return (
                    <g>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={radius}
                        fill="rgba(20,30,60,0.85)"
                        stroke="#7C8CFF"
                        strokeWidth={1.7}
                      />
                      {hasStatus ? (
                        <circle
                          cx={cx + radius * 0.72}
                          cy={cy - radius * 0.72}
                          r={4.4}
                          fill={STATUS_COLORS[payload.status as Exclude<TechnologyTopApplicant['status'], 'none'>]}
                          stroke="rgba(15, 23, 42, 0.95)"
                          strokeWidth={1.3}
                        />
                      ) : null}
                      {outsideLabel ? (
                        <text
                          x={cx}
                          y={cy + radius + 13}
                          textAnchor="middle"
                          fill="#e2e8f0"
                          fontSize={9}
                          fontWeight={600}
                        >
                          {textLines[0]}
                        </text>
                      ) : (
                        <text
                          x={cx}
                          y={cy - ((textLines.length - 1) * (fontSize + 1)) / 2}
                          textAnchor="middle"
                          fill="#f1f5f9"
                          fontSize={fontSize}
                          fontWeight={600}
                        >
                          {textLines.map((line, index) => (
                            <tspan key={`${payload.name}-${line}-${index}`} x={cx} dy={index === 0 ? 0 : fontSize + 2}>
                              {line}
                            </tspan>
                          ))}
                        </text>
                      )}
                    </g>
                  );
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
