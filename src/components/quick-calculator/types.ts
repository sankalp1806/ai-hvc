export interface MetricItem {
  name: string;
  value: string;
  unit: string;
  timeHorizon: string;
}

export interface ChartDescription {
  chartType: string;
  title: string;
  xAxis: string;
  yAxis: string;
  description: string;
}

export interface ComparisonOption {
  option: string;
  cost: string;
  roi: string;
  complexity: string;
  risk: string;
  scalability: string;
  bestFor: string;
}

export interface PricingTier {
  tierName: string;
  price: string;
  features: string[];
  limitations: string[];
}

export interface SolutionProvider {
  name: string;
  category: string;
  description: string;
  fitForSize: string;
  fitForIndustry: string;
  strengths: string[];
  tradeoffs: string[];
  integrationRequirements: string;
  pricingTiers: PricingTier[];
  websiteUrl: string;
}

export interface CostItem {
  category: string;
  amount: string;
  notes: string;
}

export interface Phase {
  phaseName: string;
  duration: string;
  activities: string[];
  keyStakeholders: string[];
  deliverables: string[];
}

export interface Risk {
  category: string;
  risk: string;
  likelihood: string;
  impact: string;
  mitigation: string;
}

export interface SensitivityItem {
  assumption: string;
  baseCase: string;
  impact: string;
}

export interface PrioritizedAction {
  priority: number;
  action: string;
  rationale: string;
  effort: string;
  impact: string;
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface ResourceItem {
  title: string;
  type: string;
  relevance: string;
}

export interface AnalysisReport {
  validationSummary: {
    status: string;
    issues: string[];
    handlingNotes: string;
  };
  contextOverview: {
    scenarioSummary: {
      industry: string;
      serviceType: string;
      companySize: string;
      maturityAssumptions: string;
      keyGoals: string[];
    };
    locationContext: {
      region: string;
      currency: string;
      regulatoryEnvironment: string;
      costModifiers: string;
      marketMaturity: string;
    };
  };
  executiveSummary: {
    overallRecommendation: string;
    topRecommendation: string;
    estimatedBenefitProfile: string;
    biggestRisks: string[];
    roiRange: {
      conservative: string;
      optimistic: string;
    };
    paybackPeriod: string;
    confidenceLevel: string;
    keyTakeaways: string[];
  };
  keyMetrics: {
    financial: MetricItem[];
    operational: MetricItem[];
    adoption: MetricItem[];
  };
  visualDescriptions: ChartDescription[];
  comparativeAnalysis: {
    applicable: boolean;
    comparisonMatrix: ComparisonOption[];
    bestForLowBudget: string;
    bestForFastImplementation: string;
    bestForMaximumUpside: string;
  };
  solutionProviders: SolutionProvider[];
  costBudgetImpact: {
    costBreakdown: {
      oneTime: CostItem[];
      recurring: CostItem[];
    };
    companySizeImpact: string;
    locationImpact: string;
    yearOneTotal: string;
    yearTwoTotal: string;
    yearThreeTotal: string;
    totalTCO: string;
  };
  timeline: {
    overviewOptions: {
      fastTrack: {
        duration: string;
        tradeoffs: string;
        bestFor: string;
      };
      standard: {
        duration: string;
        tradeoffs: string;
        bestFor: string;
      };
      comprehensive: {
        duration: string;
        tradeoffs: string;
        bestFor: string;
      };
    };
    phases: Phase[];
  };
  risksAndSensitivity: {
    risks: Risk[];
    sensitivityAnalysis: SensitivityItem[];
  };
  insightsRecommendations: {
    overallVerdict: string;
    prioritizedActions: PrioritizedAction[];
    immediateNextSteps: string[];
    mediumTermSteps: string[];
    longTermConsiderations: string[];
    byBudgetLevel: {
      lowBudget: string;
      mediumBudget: string;
      highBudget: string;
    };
    byRiskAppetite: {
      conservative: string;
      balanced: string;
      aggressive: string;
    };
  };
  methodology: {
    approach: string;
    dataSourceTypes: string[];
    keyAssumptions: string[];
    limitations: string[];
    confidenceNotes: string;
  };
  appendix: {
    glossary: GlossaryItem[];
    additionalResources: ResourceItem[];
  };
  metadata: {
    timeHorizon: string;
    currency: string;
    generatedDate: string;
    disclaimer: string;
  };
}
