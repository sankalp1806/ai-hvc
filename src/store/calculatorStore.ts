import { create } from 'zustand';

export interface CostEntry {
  id: string;
  category: 'direct' | 'indirect' | 'hidden' | 'recurring';
  type: string;
  name: string;
  oneTimeCost: number;
  monthlyRecurring: number;
  annualRecurring: number;
  yearsApplicable: number[];
  confidenceLevel: number;
}

export interface TangibleBenefit {
  id: string;
  category: 'revenue' | 'cost_reduction' | 'efficiency';
  name: string;
  currentBaselineValue: number;
  expectedImprovementPercent: number;
  expectedAnnualValue: number;
  realizationStartMonth: number;
  rampUpMonths: number;
  confidenceLevel: number;
}

export interface IntangibleBenefit {
  id: string;
  category: string;
  name: string;
  qualitativeScore: number;
  weight: number;
  estimatedMonetaryValue: number;
  proxyMetrics: {
    current: number;
    target: number;
    benchmark: number;
  };
}

export interface ProjectData {
  // Business Profile
  companyName: string;
  industry: string;
  companySize: 'solo' | 'small' | 'medium' | 'large' | 'enterprise';
  annualRevenue: string;
  
  // Project Details
  projectName: string;
  projectDescription: string;
  projectStage: 'pre' | 'post';
  useCases: string[];
  primaryGoal: string;
  timeHorizonYears: number;
  discountRate: number;
  
  // Costs
  costs: CostEntry[];
  
  // Benefits
  tangibleBenefits: TangibleBenefit[];
  intangibleBenefits: IntangibleBenefit[];
  
  // Risk Assessment
  implementationRisk: number;
  adoptionRisk: number;
  technicalRisk: number;
  marketRisk: number;
}

export interface CalculationResults {
  simpleROI: number;
  riskAdjustedROI: number;
  npv: number;
  irr: number;
  paybackPeriodMonths: number;
  tco: number;
  totalCosts: number;
  totalTangibleBenefits: number;
  totalIntangibleValue: number;
  softROIScore: number;
  overallConfidence: number;
  yearlyProjections: {
    year: number;
    costs: number;
    benefits: number;
    cumulative: number;
    roi: number;
  }[];
}

interface CalculatorStore {
  currentStep: number;
  projectData: ProjectData;
  results: CalculationResults | null;
  isCalculating: boolean;
  
  setCurrentStep: (step: number) => void;
  updateProjectData: (data: Partial<ProjectData>) => void;
  addCost: (cost: CostEntry) => void;
  removeCost: (id: string) => void;
  addTangibleBenefit: (benefit: TangibleBenefit) => void;
  removeTangibleBenefit: (id: string) => void;
  addIntangibleBenefit: (benefit: IntangibleBenefit) => void;
  removeIntangibleBenefit: (id: string) => void;
  calculateResults: () => void;
  resetCalculator: () => void;
}

const initialProjectData: ProjectData = {
  companyName: '',
  industry: '',
  companySize: 'small',
  annualRevenue: '',
  projectName: '',
  projectDescription: '',
  projectStage: 'pre',
  useCases: [],
  primaryGoal: '',
  timeHorizonYears: 3,
  discountRate: 10,
  costs: [],
  tangibleBenefits: [],
  intangibleBenefits: [],
  implementationRisk: 20,
  adoptionRisk: 25,
  technicalRisk: 15,
  marketRisk: 10,
};

// Calculation functions
const calculateTCO = (costs: CostEntry[], years: number): number => {
  let total = 0;
  costs.forEach(cost => {
    total += cost.oneTimeCost;
    total += cost.annualRecurring * years;
    total += cost.monthlyRecurring * 12 * years;
  });
  return total;
};

const calculateNPV = (
  initialInvestment: number,
  cashFlows: number[],
  discountRate: number
): number => {
  let npv = -initialInvestment;
  cashFlows.forEach((cf, t) => {
    npv += cf / Math.pow(1 + discountRate / 100, t + 1);
  });
  return npv;
};

const calculateIRR = (cashFlows: number[], initialGuess = 0.1): number => {
  const maxIterations = 1000;
  const tolerance = 0.0001;
  let rate = initialGuess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivative = 0;
    
    cashFlows.forEach((cf, t) => {
      npv += cf / Math.pow(1 + rate, t);
      derivative -= t * cf / Math.pow(1 + rate, t + 1);
    });

    const newRate = rate - npv / derivative;
    
    if (Math.abs(newRate - rate) < tolerance) {
      return newRate * 100;
    }
    rate = newRate;
  }
  return rate * 100;
};

const calculatePaybackPeriod = (
  initialInvestment: number,
  monthlyBenefits: number[]
): number => {
  let cumulative = 0;
  for (let i = 0; i < monthlyBenefits.length; i++) {
    cumulative += monthlyBenefits[i];
    if (cumulative >= initialInvestment) {
      // Interpolate for fractional month
      const prevCumulative = cumulative - monthlyBenefits[i];
      const remaining = initialInvestment - prevCumulative;
      const fraction = remaining / monthlyBenefits[i];
      return i + fraction;
    }
  }
  return monthlyBenefits.length;
};

const calculateSoftROI = (intangibleBenefits: IntangibleBenefit[]): number => {
  if (intangibleBenefits.length === 0) return 0;
  
  const totalWeight = intangibleBenefits.reduce((sum, b) => sum + b.weight, 0);
  if (totalWeight === 0) return 0;
  
  const weightedSum = intangibleBenefits.reduce(
    (sum, b) => sum + b.qualitativeScore * b.weight,
    0
  );
  
  return (weightedSum / totalWeight) * 10; // Scale to 0-100
};

export const useCalculatorStore = create<CalculatorStore>((set, get) => ({
  currentStep: 0,
  projectData: initialProjectData,
  results: null,
  isCalculating: false,

  setCurrentStep: (step) => set({ currentStep: step }),

  updateProjectData: (data) =>
    set((state) => ({
      projectData: { ...state.projectData, ...data },
    })),

  addCost: (cost) =>
    set((state) => ({
      projectData: {
        ...state.projectData,
        costs: [...state.projectData.costs, cost],
      },
    })),

  removeCost: (id) =>
    set((state) => ({
      projectData: {
        ...state.projectData,
        costs: state.projectData.costs.filter((c) => c.id !== id),
      },
    })),

  addTangibleBenefit: (benefit) =>
    set((state) => ({
      projectData: {
        ...state.projectData,
        tangibleBenefits: [...state.projectData.tangibleBenefits, benefit],
      },
    })),

  removeTangibleBenefit: (id) =>
    set((state) => ({
      projectData: {
        ...state.projectData,
        tangibleBenefits: state.projectData.tangibleBenefits.filter((b) => b.id !== id),
      },
    })),

  addIntangibleBenefit: (benefit) =>
    set((state) => ({
      projectData: {
        ...state.projectData,
        intangibleBenefits: [...state.projectData.intangibleBenefits, benefit],
      },
    })),

  removeIntangibleBenefit: (id) =>
    set((state) => ({
      projectData: {
        ...state.projectData,
        intangibleBenefits: state.projectData.intangibleBenefits.filter((b) => b.id !== id),
      },
    })),

  calculateResults: () => {
    set({ isCalculating: true });

    const { projectData } = get();
    const { costs, tangibleBenefits, intangibleBenefits, timeHorizonYears, discountRate } = projectData;

    // Calculate TCO
    const tco = calculateTCO(costs, timeHorizonYears);

    // Calculate one-time costs
    const oneTimeCosts = costs.reduce((sum, c) => sum + c.oneTimeCost, 0);

    // Calculate annual costs
    const annualCosts = costs.reduce(
      (sum, c) => sum + c.annualRecurring + c.monthlyRecurring * 12,
      0
    );

    // Calculate total tangible benefits
    const annualBenefits = tangibleBenefits.reduce(
      (sum, b) => sum + b.expectedAnnualValue * (b.confidenceLevel / 100),
      0
    );

    const totalTangibleBenefits = annualBenefits * timeHorizonYears;

    // Calculate intangible value
    const totalIntangibleValue = intangibleBenefits.reduce(
      (sum, b) => sum + b.estimatedMonetaryValue,
      0
    );

    // Generate yearly projections
    const yearlyProjections = [];
    let cumulative = -oneTimeCosts;

    for (let year = 1; year <= timeHorizonYears; year++) {
      const yearCosts = year === 1 ? oneTimeCosts + annualCosts : annualCosts;
      const yearBenefits = annualBenefits;
      cumulative += yearBenefits - (year === 1 ? 0 : annualCosts);

      yearlyProjections.push({
        year,
        costs: yearCosts,
        benefits: yearBenefits,
        cumulative,
        roi: yearCosts > 0 ? ((yearBenefits - yearCosts) / yearCosts) * 100 : 0,
      });
    }

    // Calculate cash flows for NPV and IRR
    const cashFlows = [-oneTimeCosts];
    for (let year = 1; year <= timeHorizonYears; year++) {
      cashFlows.push(annualBenefits - annualCosts);
    }

    // Simple ROI
    const simpleROI = tco > 0 ? ((totalTangibleBenefits - tco) / tco) * 100 : 0;

    // Risk adjustment
    const { implementationRisk, adoptionRisk, technicalRisk, marketRisk } = projectData;
    const successProbability =
      (1 - implementationRisk / 100) *
      (1 - adoptionRisk / 100) *
      (1 - technicalRisk / 100) *
      (1 - marketRisk / 100);
    const riskAdjustedROI = simpleROI * successProbability;

    // NPV
    const npv = calculateNPV(oneTimeCosts, cashFlows.slice(1), discountRate);

    // IRR
    const irr = cashFlows.some(cf => cf > 0) ? calculateIRR(cashFlows) : 0;

    // Payback period
    const monthlyBenefitAmount = annualBenefits / 12;
    const monthlyBenefits = Array(timeHorizonYears * 12).fill(monthlyBenefitAmount);
    const paybackPeriodMonths = calculatePaybackPeriod(oneTimeCosts, monthlyBenefits);

    // Soft ROI
    const softROIScore = calculateSoftROI(intangibleBenefits);

    // Overall confidence
    const avgConfidence =
      [...costs, ...tangibleBenefits].reduce(
        (sum, item) => sum + ('confidenceLevel' in item ? item.confidenceLevel : 70),
        0
      ) / Math.max([...costs, ...tangibleBenefits].length, 1);

    set({
      results: {
        simpleROI,
        riskAdjustedROI,
        npv,
        irr,
        paybackPeriodMonths,
        tco,
        totalCosts: tco,
        totalTangibleBenefits,
        totalIntangibleValue,
        softROIScore,
        overallConfidence: avgConfidence,
        yearlyProjections,
      },
      isCalculating: false,
    });
  },

  resetCalculator: () =>
    set({
      currentStep: 0,
      projectData: initialProjectData,
      results: null,
      isCalculating: false,
    }),
}));
