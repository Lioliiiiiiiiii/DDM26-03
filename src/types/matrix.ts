export type ScoreDimensions = {
  strategicUrgency: number;
  adoptionVelocity: number;
  investmentConfidence: number;
  innovationIntensity: number;
  operationalReadiness: number;
};

export type Metric = {
  label: string;
  value: string;
  tone?: 'neutral' | 'positive' | 'warning';
};

export type TimelinePoint = {
  year: string;
  value: number;
};

export type RankingItem = {
  label: string;
  score: number;
  detail?: string;
};

export type UseCase = {
  title: string;
  description: string;
  signal: string;
};

export type MarketSignal = {
  label: string;
  value: string;
};

export type Quote = {
  speaker: string;
  role: string;
  text: string;
};

export type Technology = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  definition: string;
  color: string;
  strategicScores: ScoreDimensions;
  scoreSummary: Metric[];
  dimensionBreakdown: RankingItem[];
  perceptionRankings: RankingItem[];
  impactTimeline: TimelinePoint[];
  topUseCases: UseCase[];
  marketValidation: {
    ecosystemMetrics: Metric[];
    notablePlayers: string[];
    fundingSignals: MarketSignal[];
  };
  researchInnovation: {
    publicationTrend: TimelinePoint[];
    cagr: string;
    patentLeaders: string[];
  };
  expertQuote: Quote;
};

export type Industry = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  strategicScores: ScoreDimensions;
  scoreSummary: Metric[];
  disruptionDimensions: RankingItem[];
  topTechnologies: RankingItem[];
  impactDistribution: TimelinePoint[];
  maturityTimeline: TimelinePoint[];
  useCaseSnippets: UseCase[];
  marketValidation: {
    ecosystemMetrics: Metric[];
    topCompanies: string[];
    fundingIndicators: MarketSignal[];
  };
  expertQuote: Quote;
};

export type MatrixCell = {
  id: string;
  technologySlug: string;
  industrySlug: string;
  score: number;
  summary: string;
  strategicOverview: string;
  keyIndicators: Metric[];
  useCases: UseCase[];
  marketSignals: MarketSignal[];
  publicationTrend: TimelinePoint[];
  perceptionSnapshot: RankingItem[];
  expertInsight: Quote;
};

export type KeyFinding = {
  id: string;
  title: string;
  summary: string;
  evidence: string[];
  highlightCellIds: string[];
};

export type AboutContent = {
  intro: string;
  audience: string[];
  interpretation: string[];
  methodology: string[];
  researchApproach: string[];
  institutionalContext: string;
};

export type HomepageIntroContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  typewriterLine: string;
  noiseStatements: string[];
  sortHeadline: string;
  sortSummary: string;
  scrollHint: string;
};

export type TechnologyOrderEntry = {
  id: string;
  slug: string;
  name: string;
  color: string;
};

export type TechnologyIndustryRadarProfile = {
  industrySlug: string;
  industryName: string;
  heatScore: number;
  radar: {
    innovationIntensity: number;
    innovationMomentum: number;
    startupActivity: number;
    marketValidation: number;
    professionalsPerception: number;
  };
};

export type TechnologyOverviewMetricSummary = {
  averageHeatScore: number;
  topExposureSector: string;
  cellsAbove60: number;
};

export type TechnologyImpactRankingItem = {
  technologyKey: string;
  technologySlug: string;
  label: string;
  score: number;
};

export type TechnologyImpactDistributionItem = {
  label: string;
  count: number;
  percentage: number;
};

export type TechnologyMarketScatterPoint = {
  name: string;
  foundedYear: number;
  fundingUsd: number;
  category: 'Native' | 'Unicorn' | 'Emerging';
};

export type TechnologyTopApplicant = {
  name: string;
  documentCount: number;
  status: 'none' | 'new_challenger' | 'significant_climber' | 'significant_drop';
};

export type TechnologyResearchSeriesPoint = {
  year: string;
  [technologySlug: string]: string | number;
};

export type TechnologyPageData = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  themeColor: string;
  definition: string;
  summary: string;
  overview: {
    summaryMetrics: TechnologyOverviewMetricSummary;
    industryRadarProfiles: TechnologyIndustryRadarProfile[];
    chairComment: {
      speaker: string;
      quote: string;
    };
  };
  professionalsPerception: {
    impactRanking: TechnologyImpactRankingItem[];
    impactDistribution: TechnologyImpactDistributionItem[];
    topUseCases: UseCase[];
  };
  marketValidation: {
    totals: {
      unicornFundingUsd: number;
      unicornCount: number;
      nativeUnicornCount: number;
      emergingUnicornCount: number;
      startupCount2025: number;
    };
    scatterPoints: TechnologyMarketScatterPoint[];
  };
  researchInnovation: {
    patentsDeltaPct: number;
    scholarDeltaPct: number;
    topApplicants2025: TechnologyTopApplicant[];
    topApplicantsNote: string;
  };
};

export type TechnologyPagesDataset = {
  generatedAt: string;
  source: {
    heatmatrixWorkbook: string;
    contentWorkbook: string;
  };
  technologyOrder: TechnologyOrderEntry[];
  researchSeries: {
    patents: TechnologyResearchSeriesPoint[];
    scholarWork: TechnologyResearchSeriesPoint[];
  };
  technologies: TechnologyPageData[];
};
