import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DataCard } from '@/components/DataCard';
import { ExploreMatrixFooter } from '@/components/ExploreMatrixFooter';
import { InsightQuote } from '@/components/InsightQuote';
import { MetricPill } from '@/components/MetricPill';
import { MotionReveal } from '@/components/MotionReveal';
import { RankingList } from '@/components/RankingList';
import { SectionHeader } from '@/components/SectionHeader';
import { TrendChartCard } from '@/components/TrendChartCard';
import { industries, matrixCells, technologies } from '@/data';
import { getPreviousNextCells } from '@/lib/matrix';

type CellPageProps = {
  params: Promise<{ technologySlug: string; industrySlug: string }>;
};

export function generateStaticParams() {
  return matrixCells.map((cell) => ({
    technologySlug: cell.technologySlug,
    industrySlug: cell.industrySlug
  }));
}

export async function generateMetadata({ params }: CellPageProps): Promise<Metadata> {
  const { technologySlug, industrySlug } = await params;
  const technology = technologies.find((item) => item.slug === technologySlug);
  const industry = industries.find((item) => item.slug === industrySlug);

  if (!technology || !industry) {
    return { title: 'Cell Not Found' };
  }

  return {
    title: `${technology.name} × ${industry.name}`,
    description: `Quick-view profile for ${technology.name} in ${industry.name}.`
  };
}

export default async function MatrixCellPage({ params }: CellPageProps) {
  const { technologySlug, industrySlug } = await params;

  const cell = matrixCells.find(
    (item) => item.technologySlug === technologySlug && item.industrySlug === industrySlug
  );
  const technology = technologies.find((item) => item.slug === technologySlug);
  const industry = industries.find((item) => item.slug === industrySlug);

  if (!cell || !technology || !industry) {
    notFound();
  }

  const { previous, next } = getPreviousNextCells(technologySlug, industrySlug);

  return (
    <div className="space-y-8">
      <MotionReveal>
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em]">
            <Link
              href={`/technology/${technology.slug}`}
              className="rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-slate-300 transition hover:border-orange-300/45 hover:text-orange-100"
            >
              {technology.shortName}
            </Link>
            <span className="text-slate-500">x</span>
            <Link
              href={`/industry/${industry.slug}`}
              className="rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-slate-300 transition hover:border-orange-300/45 hover:text-orange-100"
            >
              {industry.name}
            </Link>
          </div>

          <SectionHeader
            label="Matrix Quick View"
            title={`${technology.name} × ${industry.name}`}
            description={cell.summary}
          />
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <DataCard
            title="Strategic overview"
            subtitle="Why this intersection matters"
            className="bg-gradient-to-r from-slate-900/85 via-slate-900/70 to-orange-500/10"
          >
            <p className="text-sm leading-relaxed text-slate-300">{cell.strategicOverview}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {cell.keyIndicators.map((indicator) => (
                <MetricPill key={indicator.label} {...indicator} />
              ))}
            </div>
          </DataCard>

          <RankingList title="Perception snapshot" items={cell.perceptionSnapshot} />
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="grid gap-4 lg:grid-cols-2">
          <DataCard title="Most relevant use cases" subtitle="Operationally meaningful pathways">
            <ul className="space-y-3">
              {cell.useCases.map((useCase) => (
                <li key={useCase.title} className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                  <p className="text-sm font-semibold text-slate-100">{useCase.title}</p>
                  <p className="mt-2 text-sm text-slate-300">{useCase.description}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-orange-200">{useCase.signal}</p>
                </li>
              ))}
            </ul>
          </DataCard>
          <DataCard title="Market and adoption signals" subtitle="Snapshot indicators">
            <ul className="space-y-2 text-sm text-slate-300">
              {cell.marketSignals.map((signal) => (
                <li
                  key={signal.label}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2"
                >
                  <span>{signal.label}</span>
                  <span className="font-semibold text-orange-200">{signal.value}</span>
                </li>
              ))}
            </ul>
          </DataCard>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <TrendChartCard
            title="Publication and innovation signal"
            subtitle="Estimated cumulative momentum"
            data={cell.publicationTrend}
            dataKeyLabel="signals"
          />
          <InsightQuote {...cell.expertInsight} />
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2">
            {previous ? (
              <Link
                href={`/matrix/${previous.technologySlug}/${previous.industrySlug}`}
                className="rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200 transition hover:border-orange-300/45 hover:text-orange-100"
              >
                Previous Cell
              </Link>
            ) : null}
            {next ? (
              <Link
                href={`/matrix/${next.technologySlug}/${next.industrySlug}`}
                className="rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200 transition hover:border-orange-300/45 hover:text-orange-100"
              >
                Next Cell
              </Link>
            ) : null}
          </div>
          <Link
            href="/#heatmatrix"
            className="rounded-lg border border-orange-300/45 bg-orange-500/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-orange-100 transition hover:bg-orange-500/25"
          >
            Return to Heatmatrix
          </Link>
        </section>
      </MotionReveal>

      <ExploreMatrixFooter
        highlightTechnologySlug={technology.slug}
        highlightIndustrySlug={industry.slug}
        highlightCellId={cell.id}
      />
    </div>
  );
}
