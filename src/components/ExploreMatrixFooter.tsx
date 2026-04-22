import { InteractiveHeatmatrix } from '@/components/InteractiveHeatmatrix';
import { SectionHeader } from '@/components/SectionHeader';
import { industries, matrixCells, technologies } from '@/data';

type ExploreMatrixFooterProps = {
  highlightTechnologySlug?: string;
  highlightIndustrySlug?: string;
  highlightCellId?: string;
};

export function ExploreMatrixFooter({
  highlightTechnologySlug,
  highlightIndustrySlug,
  highlightCellId
}: ExploreMatrixFooterProps) {
  return (
    <section className="space-y-6">
      <SectionHeader
        label="Explore More"
        title="Navigate The Heatmatrix"
        description="Continue exploring related intersections, technology columns, and industry rows."
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
