import { industries, matrixCells, technologies } from '@/data';

export const getTechnologyBySlug = (slug: string) =>
  technologies.find((technology) => technology.slug === slug);

export const getIndustryBySlug = (slug: string) => industries.find((industry) => industry.slug === slug);

export const getCellBySlugs = (technologySlug: string, industrySlug: string) =>
  matrixCells.find(
    (cell) => cell.technologySlug === technologySlug && cell.industrySlug === industrySlug
  );

export const getCellsByTechnology = (technologySlug: string) =>
  matrixCells.filter((cell) => cell.technologySlug === technologySlug);

export const getCellsByIndustry = (industrySlug: string) =>
  matrixCells.filter((cell) => cell.industrySlug === industrySlug);

export const getAverageMatrixScore = () =>
  Math.round(matrixCells.reduce((acc, cell) => acc + cell.score, 0) / matrixCells.length);

export const getTopCells = (count = 6) => [...matrixCells].sort((a, b) => b.score - a.score).slice(0, count);

export const getPreviousNextCells = (technologySlug: string, industrySlug: string) => {
  const sorted = [...matrixCells].sort((a, b) => a.id.localeCompare(b.id));
  const currentIndex = sorted.findIndex(
    (cell) => cell.technologySlug === technologySlug && cell.industrySlug === industrySlug
  );

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: sorted[(currentIndex - 1 + sorted.length) % sorted.length],
    next: sorted[(currentIndex + 1) % sorted.length]
  };
};

export const getMatrixColor = (score: number) => {
  if (score >= 80) return 'from-[#ea580c] to-[#c2410c]';
  if (score >= 65) return 'from-[#f97316] to-[#ea580c]';
  if (score >= 50) return 'from-[#fb923c] to-[#f97316]';
  if (score >= 35) return 'from-[#fdba74] to-[#fb923c]';
  if (score >= 20) return 'from-[#fed7aa] to-[#fdba74]';
  return 'from-[#ffedd5] to-[#fed7aa]';
};
