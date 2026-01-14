import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  calculateRiskAdjustment, 
  calculateNPV, 
  calculateIRR, 
  calculatePaybackPeriod,
  generateCashFlowProjection,
  type RiskAdjustedOutput 
} from '@/lib/calculations/financialEngine';

export interface CostEntry {
  id: string;
  category: 'implementation' | 'infrastructure' | 'personnel' | 'training' | 'maintenance' | 'licensing' | 'consulting' | 'other';
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
  category: 'revenue' | 'cost_reduction' | 'productivity';
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

export interface YearlyProjection {
  year: number;
  costs: number;
  benefits: number;
  cumulative: number;
  discountedCumulative: number;
  roi: number;
}

export interface CalculationResults {
  // Core metrics
  simpleROI: number;
  riskAdjustedROI: number;
  npv: number;
  riskAdjustedNPV: number;
  irr: number | null;
  paybackPeriodMonths: number;
  discountedPaybackMonths: number;
  
  // Cost/benefit totals
  tco: number;
  totalCosts: number;
  totalTangibleBenefits: number;
  totalIntangibleValue: number;
  
  // Ratios
  benefitCostRatio: number;
  profitabilityIndex: number;
  
  // Risk analysis
  riskAnalysis: RiskAdjustedOutput;
  
  // Soft metrics
  softROIScore: number;
  overallConfidence: number;
  
  // Projections
  yearlyProjections: YearlyProjection[];
  
  // Scenario analysis
  scenarios: {
    pessimistic: { roi: number; npv: number };
    baseline: { roi: number; npv: number };
    optimistic: { roi: number; npv: number };
  };
}

interface CalculatorStore {
  currentStep: number;
  projectData: ProjectData;
  results: CalculationResults | null;
  isCalculating: boolean;
  
  setCurrentStep: (step: number) => void;
  updateProjectData: (data: Partial<ProjectData>) => void;
  addCost: (cost: CostEntry) => void;
  updateCost: (id: string, updates: Partial<CostEntry>) => void;
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
  implementationRisk: 25,
  adoptionRisk: 30,
  technicalRisk: 20,
  marketRisk: 20,
};

// Calculate Total Cost of Ownership
const calculateTCO = (costs: CostEntry[], years: number): number => {
  let total = 0;
  costs.forEach(cost => {
    total += cost.oneTimeCost;
    total += cost.annualRecurring * years;
    total += cost.monthlyRecurring * 12 * years;
  });
  return total;
};

// Calculate Soft ROI Score from intangible benefits
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

export const useCalculatorStore = create<CalculatorStore>()(
  persist(
    (set, get) => ({
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

      updateCost: (id, updates) =>
        set((state) => ({
          projectData: {
            ...state.projectData,
            costs: state.projectData.costs.map((c) =>
              c.id === id ? { ...c, ...updates } : c
            ),
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

        // Calculate one-time costs (initial investment)
        const oneTimeCosts = costs.reduce((sum, c) => sum + c.oneTimeCost, 0);

        // Calculate annual recurring costs
        const annualCosts = costs.reduce(
          (sum, c) => sum + c.annualRecurring + c.monthlyRecurring * 12,
          0
        );

        // Calculate total tangible benefits (confidence-adjusted)
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

        // Calculate risk adjustment using NEW CORRECT methodology
        const riskAnalysis = calculateRiskAdjustment({
          implementationRisk: projectData.implementationRisk,
          adoptionRisk: projectData.adoptionRisk,
          technicalRisk: projectData.technicalRisk,
          marketRisk: projectData.marketRisk,
        });

        // Generate cash flows for financial calculations
        const cashFlows = [-oneTimeCosts];
        for (let year = 1; year <= timeHorizonYears; year++) {
          cashFlows.push(annualBenefits - annualCosts);
        }

        // Calculate Simple ROI
        const simpleROI = tco > 0 ? ((totalTangibleBenefits - tco) / tco) * 100 : 0;

        // Calculate Risk-Adjusted ROI using the correct weighted multiplier
        const riskAdjustedROI = simpleROI * riskAnalysis.riskMultiplier;

        // Calculate NPV with base discount rate
        const npv = calculateNPV(cashFlows, discountRate);
        
        // Calculate NPV with risk-adjusted discount rate
        const riskAdjustedNPV = calculateNPV(cashFlows, riskAnalysis.riskAdjustedDiscountRate);

        // Calculate IRR (with proper edge case handling)
        const irr = calculateIRR(cashFlows);

        // Calculate Payback Period
        const monthlyNetBenefit = (annualBenefits - annualCosts) / 12;
        const paybackPeriodMonths = monthlyNetBenefit > 0 
          ? oneTimeCosts / monthlyNetBenefit 
          : Infinity;
        
        // Discounted payback (approximation)
        const discountedPaybackMonths = paybackPeriodMonths * (1 + discountRate / 100 / 2);

        // Calculate ratios
        const benefitCostRatio = tco > 0 ? totalTangibleBenefits / tco : 0;
        const profitabilityIndex = oneTimeCosts > 0 ? (npv + oneTimeCosts) / oneTimeCosts : 0;

        // Generate yearly projections
        const yearlyProjections: YearlyProjection[] = [];
        let cumulative = -oneTimeCosts;
        let discountedCumulative = -oneTimeCosts;

        for (let year = 1; year <= timeHorizonYears; year++) {
          const yearCosts = year === 1 ? oneTimeCosts + annualCosts : annualCosts;
          const yearBenefits = annualBenefits;
          const netCashFlow = yearBenefits - (year === 1 ? 0 : annualCosts);
          cumulative += netCashFlow;
          discountedCumulative += netCashFlow / Math.pow(1 + discountRate / 100, year);

          yearlyProjections.push({
            year,
            costs: yearCosts,
            benefits: yearBenefits,
            cumulative,
            discountedCumulative,
            roi: yearCosts > 0 ? ((yearBenefits - yearCosts) / yearCosts) * 100 : 0,
          });
        }

        // Scenario analysis using risk multipliers
        const scenarios = {
          pessimistic: {
            roi: simpleROI * riskAnalysis.scenarioAnalysis.pessimistic,
            npv: npv * riskAnalysis.scenarioAnalysis.pessimistic,
          },
          baseline: {
            roi: riskAdjustedROI,
            npv: riskAdjustedNPV,
          },
          optimistic: {
            roi: simpleROI * riskAnalysis.scenarioAnalysis.optimistic,
            npv: npv * riskAnalysis.scenarioAnalysis.optimistic,
          },
        };

        // Soft ROI score
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
            riskAdjustedNPV,
            irr,
            paybackPeriodMonths,
            discountedPaybackMonths,
            tco,
            totalCosts: tco,
            totalTangibleBenefits,
            totalIntangibleValue,
            benefitCostRatio,
            profitabilityIndex,
            riskAnalysis,
            softROIScore,
            overallConfidence: avgConfidence,
            yearlyProjections,
            scenarios,
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
    }),
    {
      name: 'ai-roi-calculator-storage',
      partialize: (state) => ({
        projectData: state.projectData,
        currentStep: state.currentStep,
      }),
    }
  )
);

// Selectors for optimized re-renders
export const useCurrentStep = () => useCalculatorStore((s) => s.currentStep);
export const useProjectData = () => useCalculatorStore((s) => s.projectData);
export const useResults = () => useCalculatorStore((s) => s.results);
export const useIsCalculating = () => useCalculatorStore((s) => s.isCalculating);
export const useCosts = () => useCalculatorStore((s) => s.projectData.costs);
export const useTangibleBenefits = () => useCalculatorStore((s) => s.projectData.tangibleBenefits);
export const useIntangibleBenefits = () => useCalculatorStore((s) => s.projectData.intangibleBenefits);
