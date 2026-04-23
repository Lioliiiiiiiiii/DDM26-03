import technologyPagesRaw from '@/data/raw/technologyPages.json';
import { TechnologyPageData, TechnologyPagesDataset } from '@/types/matrix';

export const technologyPagesDataset = technologyPagesRaw as TechnologyPagesDataset;

export const technologyPages = technologyPagesDataset.technologies as TechnologyPageData[];

export const technologyResearchSeries = technologyPagesDataset.researchSeries;

export const technologyOrder = technologyPagesDataset.technologyOrder;
