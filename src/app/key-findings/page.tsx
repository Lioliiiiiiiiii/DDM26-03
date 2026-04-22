import type { Metadata } from 'next';
import Link from 'next/link';
import { ContextualPageNav } from '@/components/ContextualPageNav';
import { DataCard } from '@/components/DataCard';
import { InsightQuote } from '@/components/InsightQuote';
import { MotionReveal } from '@/components/MotionReveal';
import { SectionHeader } from '@/components/SectionHeader';
import { TrendChartCard } from '@/components/TrendChartCard';
import { keyFindings, matrixCells, technologies } from '@/data';

export const metadata: Metadata = {
  title: 'Key Findings',
  description: 'Executive synthesis of major hotspots, cross-industry patterns, and growth signals from DDM 2026.'
};

export default function KeyFindingsPage() {
  const topCells = [...matrixCells].sort((a, b) => b.score - a.score).slice(0, 8);
  const growthSignals = [...matrixCells]
    .sort(
      (a, b) =>
        b.publicationTrend[b.publicationTrend.length - 1].value -
        a.publicationTrend[a.publicationTrend.length - 1].value
    )
    .slice(0, 5);

  return (
    <div className="space-y-10">
      <MotionReveal>
        <SectionHeader
          label="Executive Summary"
          title="Key Findings"
          description="The strongest strategic conclusions from the Digital Disruption Matrix 2026, including priority hotspots, pattern shifts, and counterintuitive signals."
        />
      </MotionReveal>

      <ContextualPageNav
        links={[
          { label: 'Major Hotspots', href: '#major-hotspots' },
          { label: 'Cross-Industry Patterns', href: '#cross-industry' },
          { label: 'Growth Signals', href: '#growth-signals' }
        ]}
      />

      <MotionReveal>
        <section id="major-hotspots" className="space-y-5">
          <SectionHeader
            label="Major Hotspots"
            title="Where pressure and readiness converge"
            description="Top intersections by disruption score and implementation momentum."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {topCells.map((cell) => (
              <DataCard key={cell.id} title={cell.summary} subtitle={`Score ${cell.score}`}>
                <p className="text-sm text-slate-300">{cell.strategicOverview}</p>
                <Link
                  href={`/matrix/${cell.technologySlug}/${cell.industrySlug}`}
                  className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.14em] text-orange-200 hover:text-orange-100"
                >
                  Open Cell
                </Link>
              </DataCard>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="cross-industry" className="space-y-5">
          <SectionHeader
            label="Cross-Industry Patterns"
            title="Themes emerging across sectors"
            description="Synthesis notes that explain why disruption clusters are appearing where they are."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {keyFindings.map((finding) => (
              <DataCard key={finding.id} title={finding.title}>
                <p className="text-sm leading-relaxed text-slate-300">{finding.summary}</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {finding.evidence.map((point) => (
                    <li key={point} className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2">
                      {point}
                    </li>
                  ))}
                </ul>
              </DataCard>
            ))}
          </div>
          <InsightQuote
            {...technologies[0].expertQuote}
            text="The most resilient organizations are sequencing transformation as portfolio design: operational gains, trust controls, and experimentation capacity advance in tandem."
          />
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="growth-signals" className="space-y-5">
          <SectionHeader
            label="Strongest Growth Signals"
            title="Research and market acceleration indicators"
            description="Publication momentum and perceived prioritization from high-growth intersections."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {growthSignals.map((cell) => (
              <TrendChartCard
                key={cell.id}
                title={cell.summary}
                subtitle={`Cell score ${cell.score}`}
                data={cell.publicationTrend}
                dataKeyLabel="signal"
              />
            ))}
          </div>
        </section>
      </MotionReveal>
    </div>
  );
}
