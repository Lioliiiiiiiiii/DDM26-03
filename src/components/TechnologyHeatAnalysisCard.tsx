'use client';

import { useMemo, useState } from 'react';
import { TechnologyIndustryRadarProfile } from '@/types/matrix';
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from 'recharts';

type TechnologyHeatAnalysisCardProps = {
  industries: TechnologyIndustryRadarProfile[];
  chairComment: {
    speaker: string;
    quote: string;
  };
};

export function TechnologyHeatAnalysisCard({ industries, chairComment }: TechnologyHeatAnalysisCardProps) {
  const [selectedIndustrySlug, setSelectedIndustrySlug] = useState(industries[0]?.industrySlug ?? '');

  const selectedIndustry =
    industries.find((entry) => entry.industrySlug === selectedIndustrySlug) ?? industries[0];

  const radarData = useMemo(() => {
    if (!selectedIndustry) {
      return [];
    }
    return [
      { dimension: 'Innovation intensity', value: selectedIndustry.radar.innovationIntensity },
      { dimension: 'Innovation momentum', value: selectedIndustry.radar.innovationMomentum },
      { dimension: 'Startup activity', value: selectedIndustry.radar.startupActivity },
      { dimension: 'Market validation', value: selectedIndustry.radar.marketValidation },
      { dimension: "Professionals' perception", value: selectedIndustry.radar.professionalsPerception }
    ];
  }, [selectedIndustry]);

  return (
    <section className="space-y-4 rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-4 md:p-5">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">Heat Analysis</p>
        <h2 className="text-lg font-semibold text-slate-100 md:text-xl">Strategic Overview per Industry</h2>
        <div className="flex flex-wrap gap-2">
          {industries.map((industry) => {
            const isActive = industry.industrySlug === selectedIndustry?.industrySlug;
            return (
              <button
                key={industry.industrySlug}
                type="button"
                onClick={() => setSelectedIndustrySlug(industry.industrySlug)}
                className={`rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] transition ${
                  isActive
                    ? 'border-orange-300/60 bg-orange-500/20 text-orange-100'
                    : 'border-white/10 bg-slate-900/70 text-slate-300 hover:border-white/20'
                }`}
              >
                {industry.industryName}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <article className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-200">{selectedIndustry?.industryName}</p>
            <p className="text-sm font-semibold text-orange-200">Heat score {selectedIndustry?.heatScore}</p>
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

        <article className="flex min-h-[260px] flex-col justify-between rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 p-4 text-slate-950">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-900/80">Chair Comment</p>
            <p className="text-sm font-medium leading-relaxed text-slate-900/95">&ldquo;{chairComment.quote}&rdquo;</p>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900/75">
            {chairComment.speaker}
          </p>
        </article>
      </div>
    </section>
  );
}
