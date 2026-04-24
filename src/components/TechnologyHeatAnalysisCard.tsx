'use client';

import { useMemo, useState } from 'react';
import { HeatAnalysisProfile, TechnologyIndustryRadarProfile } from '@/types/matrix';
import {
  PolarAngleAxis,
  PolarGrid,
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
  sectionTitle?: string;
  selectedProfileSlug?: string;
  onSelectProfileSlug?: (slug: string) => void;
};

export function TechnologyHeatAnalysisCard({
  profiles,
  industries = [],
  chairComment,
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
    return [
      { dimension: 'Innovation intensity', value: selectedProfile.radar.innovationIntensity },
      { dimension: 'Innovation momentum', value: selectedProfile.radar.innovationMomentum },
      { dimension: 'Startup activity', value: selectedProfile.radar.startupActivity },
      { dimension: 'Market validation', value: selectedProfile.radar.marketValidation },
      { dimension: "Professionals' perception", value: selectedProfile.radar.professionalsPerception }
    ];
  }, [selectedProfile]);

  return (
    <section className="space-y-4 rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-4 md:p-5">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">Heat Analysis</p>
        <h2 className="text-lg font-semibold text-slate-100 md:text-xl">{sectionTitle}</h2>
        <div className="flex flex-wrap gap-2">
          {normalizedProfiles.map((profile) => {
            const isActive = profile.slug === selectedProfile?.slug;
            return (
              <button
                key={profile.slug}
                type="button"
                onClick={() => handleSelect(profile.slug)}
                className={`rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] transition ${
                  isActive
                    ? 'border-orange-300/60 bg-orange-500/20 text-orange-100'
                    : 'border-white/10 bg-slate-900/70 text-slate-300 hover:border-white/20'
                }`}
              >
                {profile.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <article className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-200">{selectedProfile?.name}</p>
            <p className="text-sm font-semibold text-orange-200">Heat score {selectedProfile?.heatScore}</p>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="68%">
                <PolarGrid stroke="rgba(148, 163, 184, 0.22)" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: 'rgba(226, 232, 240, 0.8)', fontSize: 11, fontWeight: 500 }}
                />
                <Radar
                  dataKey="value"
                  stroke="rgba(251, 146, 60, 0.95)"
                  fill="rgba(251, 146, 60, 0.28)"
                  fillOpacity={0.95}
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

        <article className="flex min-h-[260px] flex-col justify-between rounded-xl border border-[rgba(245,158,11,0.28)] bg-[#12213D] p-4 text-slate-100">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#F59E0B]">Chair Comment</p>
            <p className="text-sm font-medium leading-7 text-[#F8FAFC]">&ldquo;{chairComment.quote}&rdquo;</p>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#CBD5E1]">
            {chairComment.speaker}
          </p>
        </article>
      </div>
    </section>
  );
}
