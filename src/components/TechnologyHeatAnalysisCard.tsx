'use client';

import { useMemo, useState } from 'react';
import { FilterPillGroup } from '@/components/FilterPillGroup';
import { HeatAnalysisProfile, TechnologyIndustryRadarProfile } from '@/types/matrix';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from 'recharts';

type TechnologyHeatAnalysisCardProps = {
  profiles?: HeatAnalysisProfile[];
  industries?: TechnologyIndustryRadarProfile[];
  chairComment: {
    speaker: string;
    quote: string;
  };
  pageName: string;
  sectionTitle?: string;
  selectedProfileSlug?: string;
  onSelectProfileSlug?: (slug: string) => void;
};

const CHAIR_COMMENT_PLACEHOLDER =
  'Chair commentary placeholder - final interpretation will be added here. This space should explain why this intersection matters, what signals are strongest, and how the Chair interprets the balance between hype, market validation, and implementation readiness. The final version will provide a concise strategic reading of this specific matrix intersection.';

const RADAR_DIMENSIONS = [
  { key: 'innovationIntensity', label: 'Innovation intensity' },
  { key: 'innovationMomentum', label: 'Innovation momentum' },
  { key: 'startupActivity', label: 'Startup activity' },
  { key: 'marketValidation', label: 'Market validation' },
  { key: 'professionalsPerception', label: "Professionals' perception" }
] as const;

function splitRadarLabel(value: string) {
  const words = value.split(' ');

  if (words.length <= 1) {
    return [value];
  }

  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(' '), words.slice(midpoint).join(' ')];
}

function RadarAxisTick({
  x,
  y,
  cx,
  payload
}: {
  x?: number;
  y?: number;
  cx?: number;
  payload?: { value?: string };
}) {
  if (x === undefined || y === undefined || !payload?.value) {
    return null;
  }

  const lines = splitRadarLabel(payload.value);
  const anchor = cx !== undefined && x > cx + 8 ? 'start' : cx !== undefined && x < cx - 8 ? 'end' : 'middle';

  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="middle"
      fill="rgba(241, 245, 249, 0.92)"
      fontSize={12}
      fontWeight={700}
    >
      {lines.map((line, index) => (
        <tspan key={line} x={x} dy={index === 0 ? -(lines.length - 1) * 7 : 14}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export function TechnologyHeatAnalysisCard({
  profiles,
  industries = [],
  chairComment,
  pageName,
  sectionTitle = 'Strategic Overview per Industry',
  selectedProfileSlug,
  onSelectProfileSlug
}: TechnologyHeatAnalysisCardProps) {
  const normalizedProfiles = useMemo<HeatAnalysisProfile[]>(
    () =>
      profiles ??
      industries.map((entry) => ({
        slug: entry.industrySlug,
        name: entry.industryName,
        heatScore: entry.heatScore,
        radar: entry.radar
      })),
    [profiles, industries]
  );

  const [internalSelectedSlug, setInternalSelectedSlug] = useState(normalizedProfiles[0]?.slug ?? '');
  const activeSelectedSlug = selectedProfileSlug ?? internalSelectedSlug;

  const selectedProfile =
    normalizedProfiles.find((entry) => entry.slug === activeSelectedSlug) ?? normalizedProfiles[0];

  const handleSelect = (slug: string) => {
    if (onSelectProfileSlug) {
      onSelectProfileSlug(slug);
      return;
    }
    setInternalSelectedSlug(slug);
  };

  const radarData = useMemo(() => {
    if (!selectedProfile) {
      return [];
    }

    return RADAR_DIMENSIONS.map((dimension) => ({
      dimension: dimension.label,
      value: selectedProfile.radar[dimension.key]
    }));
  }, [selectedProfile]);

  const hasRealChairComment =
    chairComment.quote.trim().length > 0 && !chairComment.quote.toLowerCase().includes('placeholder');
  const chairCommentBody = hasRealChairComment ? chairComment.quote : CHAIR_COMMENT_PLACEHOLDER;

  return (
    <section className="space-y-5 rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-4 md:p-5">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">Heat Analysis</p>
        <h2 className="text-lg font-semibold text-slate-100 md:text-xl">{sectionTitle}</h2>
        <FilterPillGroup
          options={normalizedProfiles.map((profile) => ({ slug: profile.slug, name: profile.name }))}
          selectedSlug={selectedProfile?.slug ?? ''}
          onSelect={handleSelect}
          ariaLabel="Heat Analysis filters"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <article className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-200">{selectedProfile?.name}</p>
            <p className="text-sm font-semibold text-orange-200">Heat score {selectedProfile?.heatScore}</p>
          </div>
          <div className="h-[360px] md:h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="72%" margin={{ top: 32, right: 78, bottom: 32, left: 78 }}>
                <PolarGrid
                  stroke="rgba(203, 213, 225, 0.34)"
                  radialLines
                  gridType="polygon"
                />
                <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                <PolarAngleAxis dataKey="dimension" tick={<RadarAxisTick />} />
                <Radar
                  dataKey="value"
                  stroke="rgba(251, 146, 60, 1)"
                  strokeWidth={2.5}
                  fill="rgba(251, 146, 60, 0.34)"
                  fillOpacity={1}
                />
                <RechartsTooltip
                  formatter={(value: number) => [value.toFixed(2), 'Score']}
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
        </article>

        <article className="flex min-h-[300px] flex-col justify-between rounded-xl border border-[rgba(245,158,11,0.28)] bg-[#12213D] p-5 text-slate-100">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#F59E0B]">
              Chair comment: {pageName} x {selectedProfile?.name}
            </p>
            <p className="text-sm font-medium leading-7 text-[#F8FAFC]">{chairCommentBody}</p>
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#CBD5E1]">
            {chairComment.speaker}
          </p>
        </article>
      </div>
    </section>
  );
}
