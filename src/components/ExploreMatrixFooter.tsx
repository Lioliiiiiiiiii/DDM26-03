import { InteractiveHeatmatrix } from '@/components/InteractiveHeatmatrix';
import { SectionHeader } from '@/components/SectionHeader';
import { industries, matrixCells, technologies } from '@/data';

type ExploreMatrixFooterProps = {
  highlightTechnologySlug?: string;
  highlightIndustrySlug?: string;
  highlightCellId?: string;
  label?: string;
  title?: string;
  description?: string;
};

export function ExploreMatrixFooter({
  highlightTechnologySlug,
  highlightIndustrySlug,
  highlightCellId,
  label = 'Explore More',
  title = 'Navigate The Heatmatrix',
  description = 'Continue exploring related intersections, technology columns, and industry rows.'
}: ExploreMatrixFooterProps) {
  return (
    <section className="space-y-6">
      <SectionHeader
        label={label}
        title={title}
        description={description}
      />
      <InteractiveHeatmatrix
        technologies={technologies}
        industries={industries}
        cells={matrixCells}
        compact
        showLegend={false}
        highlightTechnologySlug={highlightTechnologySlug}
        highlightIndustrySlug={highlightIndustrySlug}
        highlightCellId={highlightCellId}
      />
    </section>
  );
}
