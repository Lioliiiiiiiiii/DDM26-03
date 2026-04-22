import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContextualPageNav } from '@/components/ContextualPageNav';
import { DataCard } from '@/components/DataCard';
import { ExploreMatrixFooter } from '@/components/ExploreMatrixFooter';
import { InsightQuote } from '@/components/InsightQuote';
import { MarketValidationPanel } from '@/components/MarketValidationPanel';
import { MetricPill } from '@/components/MetricPill';
import { MotionReveal } from '@/components/MotionReveal';
import { RadarChartCard } from '@/components/RadarChartCard';
import { RankingList } from '@/components/RankingList';
import { SectionHeader } from '@/components/SectionHeader';
import { TrendChartCard } from '@/components/TrendChartCard';
import { technologies } from '@/data';
import { getCellsByTechnology } from '@/lib/matrix';

type TechnologyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return technologies.map((technology) => ({ slug: technology.slug }));
}

export async function generateMetadata({ params }: TechnologyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const technology = technologies.find((item) => item.slug === slug);

  if (!technology) {
    return { title: 'Technology Not Found' };
  }

  return {
    title: technology.name,
    description: technology.summary
  };
}

export default async function TechnologyPage({ params }: TechnologyPageProps) {
  const { slug } = await params;
  const technology = technologies.find((item) => item.slug === slug);

  if (!technology) {
    notFound();
  }

  const cells = getCellsByTechnology(technology.slug)
    .sort((a, b) => b.score - a.score)
    .map((cell) => ({ label: cell.industrySlug.replaceAll('-', ' '), score: cell.score }));

  return (
    <div className="space-y-8">
      <MotionReveal>
        <section className="space-y-4">
          <Link
            href="/"
            className="inline-flex rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200 transition hover:border-orange-300/45 hover:text-orange-100"
          >
            Back to Heatmatrix
          </Link>
          <SectionHeader
            label="Technology Overview"
            title={technology.name}
            description={technology.definition}
          />
        </section>
      </MotionReveal>

      <ContextualPageNav
        links={[
          { label: 'Strategic Overview', href: '#strategic-overview' },
          { label: "Professional's Perception", href: '#perception' },
          { label: 'Market Validation', href: '#market-validation' },
          { label: 'Research & Innovation', href: '#research' }
        ]}
      />

      <MotionReveal>
        <section id="strategic-overview" className="space-y-4">
          <SectionHeader
            label="Strategic Overview"
            title="Strategic signal profile"
            description={technology.summary}
          />
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <RadarChartCard
              title={`${technology.shortName} strategic radar`}
              description="Five-dimension disruption profile"
              scores={technology.strategicScores}
            />
            <div className="space-y-4">
              <DataCard title="Score summary">
                <div className="grid gap-2">
                  {technology.scoreSummary.map((metric) => (
                    <MetricPill key={metric.label} {...metric} />
                  ))}
                </div>
              </DataCard>
              <RankingList title="Dimension breakdown" items={technology.dimensionBreakdown} />
            </div>
          </div>
          <InsightQuote {...technology.expertQuote} />
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="perception" className="space-y-4">
          <SectionHeader
            label="Professional's Perception"
            title="How practitioners view impact and timeline"
            description="Survey-aligned views across leadership, operations, and implementation teams."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <RankingList title="Perception rankings" items={technology.perceptionRankings} />
            <TrendChartCard
              title="Impact distribution timeline"
              subtitle="How perceived disruption has evolved"
              data={technology.impactTimeline}
            />
          </div>
          <DataCard title="Top use cases" subtitle="Most-voted deployment pathways">
            <div className="grid gap-3 md:grid-cols-3">
              {technology.topUseCases.map((useCase) => (
                <div key={useCase.title} className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                  <p className="text-sm font-semibold text-slate-100">{useCase.title}</p>
                  <p className="mt-2 text-sm text-slate-300">{useCase.description}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-orange-200">{useCase.signal}</p>
                </div>
              ))}
            </div>
          </DataCard>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="market-validation" className="space-y-4">
          <SectionHeader
            label="Market Validation"
            title="Ecosystem and capital confirmation"
            description="Signal quality from company formation, funding flows, and strategic actors."
          />
          <MarketValidationPanel
            ecosystemMetrics={technology.marketValidation.ecosystemMetrics}
            notableActors={technology.marketValidation.notablePlayers}
            signals={technology.marketValidation.fundingSignals}
          />
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="research" className="space-y-4">
          <SectionHeader
            label="Research & Innovation"
            title="Knowledge production and patent momentum"
            description="Publication growth and research concentration over time."
          />
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <TrendChartCard
              title="Cumulative publication trend"
              subtitle={`Estimated CAGR: ${technology.researchInnovation.cagr}`}
              data={technology.researchInnovation.publicationTrend}
              dataKeyLabel="publications"
            />
            <DataCard title="Notable patent applicants">
              <ul className="space-y-2 text-sm text-slate-300">
                {technology.researchInnovation.patentLeaders.map((leader) => (
                  <li key={leader} className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2">
                    {leader}
                  </li>
                ))}
              </ul>
            </DataCard>
          </div>
          <DataCard title="Top related industry intersections">
            <div className="grid gap-2 md:grid-cols-3">
              {cells.slice(0, 6).map((item) => (
                <div key={item.label} className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Industry</p>
                  <p className="text-sm text-slate-100">{item.label}</p>
                  <p className="text-sm font-semibold text-orange-200">Score {item.score}</p>
                </div>
              ))}
            </div>
          </DataCard>
        </section>
      </MotionReveal>

      <ExploreMatrixFooter highlightTechnologySlug={technology.slug} />
    </div>
  );
}
