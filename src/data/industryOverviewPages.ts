import technologyPagesRaw from '@/data/raw/technologyPages.json';
import { IndustryOverviewPageData, TechnologyPagesDataset } from '@/types/matrix';

const overviewDataset = technologyPagesRaw as TechnologyPagesDataset;

export const industryOverviewPages = (overviewDataset.industryPages ?? []) as IndustryOverviewPageData[];
