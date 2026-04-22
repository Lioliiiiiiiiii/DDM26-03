# Digital Disruption Matrix 2026

Production-ready Next.js editorial research platform for exploring technology x industry disruption across an interactive heatmatrix.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Manrope font

## Routes

- `/`
- `/key-findings`
- `/about`
- `/contact`
- `/technology/[slug]`
- `/industry/[slug]`
- `/matrix/[technologySlug]/[industrySlug]`

## Data-First Architecture

All page templates are fed by structured data files, not hardcoded page copy:

- `src/data/technologies.ts` (5 technologies)
- `src/data/industries.ts` (10 industries)
- `src/data/matrixCells.ts` (50 cell profiles)
- `src/data/findings.ts` (editorial findings)
- `src/data/about.ts` (about + methodology)
- `src/data/site.ts` (navigation, hero stats, contact)
- `src/lib/matrix.ts` (selectors, scoring helpers, matrix color logic)

To update the edition:

1. Replace values in the data files above.
2. Keep `slug` fields stable if links must stay backward compatible.
3. Rebuild with `npm run build`.

## Reusable UI Components

Core components are in `src/components`, including:

- `Navbar`
- `Hero`
- `InteractiveHeatmatrix`
- `SectionHeader`
- `DataCard`
- `MetricPill`
- `RadarChartCard`
- `TrendChartCard`
- `RankingList`
- `InsightQuote`
- `ExpandableAccordionSection`
- `MarketValidationPanel`
- `ExploreMatrixFooter`
- `ContactFooter`

## Install

```bash
npm install --legacy-peer-deps --cache ./.npm-cache
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality Checks

```bash
npm run typecheck
npm run build
```

## Deployment (GitHub Pages)

This repository is source-first. Do not hand-edit exported build artifacts.

- Source code lives in `src/`.
- GitHub Actions builds and exports the site from source on every push to `main`.
- The workflow is at `.github/workflows/deploy-pages.yml`.
- Next.js export settings are in `next.config.mjs` and use:
  - `GITHUB_PAGES=true`
  - `GITHUB_PAGES_REPO=DDM26-03`

## Notes

- Matrix interactions support keyboard focus and click-through navigation.
- Pages are statically generated for all configured technologies, industries, and matrix cells.
- Styling and motion are optimized for dark premium editorial presentation with responsive behavior.
