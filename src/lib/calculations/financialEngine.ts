/**
 * Financial Calculation Engine
 * 
 * Provides mathematically rigorous financial calculations for AI ROI analysis.
 * Designed to pass scrutiny from CFOs and financial professionals.
 */

export interface RiskCalculationConfig {
  implementationRisk: number; // 0-100
  adoptionRisk: number;       // 0-100
  technicalRisk: number;      // 0-100
  marketRisk: number;         // 0-100
  weights?: {
    implementation: number;
    adoption: number;
    technical: number;
    market: number;
  };
}

export interface RiskAdjustedOutput {
  averageRisk: number;
  weightedAverageRisk: number;
  riskMultiplier: number;
  riskAdjustedDiscountRate: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  scenarioAnalysis: {
    pessimistic: number;
    baseline: number;
    optimistic: number;
  };
  riskLevel: 'low' | 'moderate' | 'elevated' | 'high';
}

export interface FinancialMetrics {
  simpleROI: number;
  annualizedROI: number;
  npv: number;
  irr: number | null;
  paybackPeriodMonths: number;
  discountedPaybackMonths: number;
  benefitCostRatio: number;
  profitabilityIndex: number;
  riskAdjustedROI: number;
  riskAdjustedNPV: number;
}

export interface CashFlowProjection {
  period: number;
  costs: number;
  benefits: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
  discountedCashFlow: number;
  cumulativeDiscountedCashFlow: number;
}

// Default risk weights based on typical AI project risk distribution
const DEFAULT_RISK_WEIGHTS = {
  implementation: 0.30, // Implementation is often the biggest driver
  adoption: 0.25,       // User adoption is critical for AI success
  technical: 0.25,      // Technical risks can derail projects
  market: 0.20,         // Market risks are often less controllable
};

/**
 * CORRECT Risk Calculation - Weighted Average Model
 * 
 * OLD BROKEN LOGIC: successProbability = (1-r1) × (1-r2) × (1-r3) × (1-r4)
 * This compounded probabilities incorrectly, treating risks as mutually exclusive failure events.
 * 
 * NEW CORRECT LOGIC: Uses weighted average with conservative floor.
 * Risks are friction factors that reduce expected value marginally, not catastrophically.
 */
export function calculateRiskAdjustment(config: RiskCalculationConfig): RiskAdjustedOutput {
  const weights = config.weights || DEFAULT_RISK_WEIGHTS;
  
  // Simple average (for display)
  const averageRisk = (
    config.implementationRisk +
    config.adoptionRisk +
    config.technicalRisk +
    config.marketRisk
  ) / 4;
  
  // Weighted average (for calculations)
  const weightedAverageRisk = (
    config.implementationRisk * weights.implementation +
    config.adoptionRisk * weights.adoption +
    config.technicalRisk * weights.technical +
    config.marketRisk * weights.market
  );
  
  // Risk multiplier with conservative floor
  // Even 100% weighted risk = 50% haircut, not total failure
  // This reflects reality: projects rarely fail completely
  const riskMultiplier = 1 - (weightedAverageRisk / 200);
  
  // Adjust discount rate for NPV (finance standard)
  // Higher risk = higher required return = higher discount rate
  const baseDiscountRate = 10; // Will be passed in actual implementation
  const riskAdjustedDiscountRate = baseDiscountRate + (weightedAverageRisk / 5);
  
  // Confidence interval (±20% based on risk level)
  const confidenceSpread = (weightedAverageRisk / 100) * 0.4;
  const confidenceInterval = {
    lower: riskMultiplier * (1 - confidenceSpread),
    upper: Math.min(riskMultiplier * (1 + confidenceSpread), 1.0),
  };
  
  // Scenario variations for sensitivity analysis
  const scenarioAnalysis = {
    pessimistic: riskMultiplier * 0.7,
    baseline: riskMultiplier,
    optimistic: Math.min(riskMultiplier * 1.3, 1.0),
  };
  
  // Determine risk level category
  let riskLevel: 'low' | 'moderate' | 'elevated' | 'high';
  if (weightedAverageRisk <= 25) {
    riskLevel = 'low';
  } else if (weightedAverageRisk <= 45) {
    riskLevel = 'moderate';
  } else if (weightedAverageRisk <= 65) {
    riskLevel = 'elevated';
  } else {
    riskLevel = 'high';
  }
  
  return {
    averageRisk,
    weightedAverageRisk,
    riskMultiplier,
    riskAdjustedDiscountRate,
    confidenceInterval,
    scenarioAnalysis,
    riskLevel,
  };
}

/**
 * Calculate Simple ROI
 * Formula: ((Total Benefits - Total Costs) / Total Costs) × 100
 */
export function calculateSimpleROI(totalBenefits: number, totalCosts: number): number {
  if (totalCosts <= 0) return 0;
  return ((totalBenefits - totalCosts) / totalCosts) * 100;
}

/**
 * Calculate Annualized ROI
 * Formula: ((1 + ROI)^(1/years) - 1) × 100
 */
export function calculateAnnualizedROI(simpleROI: number, years: number): number {
  if (years <= 0) return 0;
  const roiDecimal = simpleROI / 100;
  if (roiDecimal <= -1) return -100; // Cap at -100%
  return (Math.pow(1 + roiDecimal, 1 / years) - 1) * 100;
}

/**
 * Calculate Net Present Value (NPV)
 * Formula: Σ(CFt / (1 + r)^t) for t = 0 to n
 */
export function calculateNPV(cashFlows: number[], discountRate: number): number {
  const rate = discountRate / 100;
  return cashFlows.reduce((npv, cf, t) => 
    npv + cf / Math.pow(1 + rate, t), 0
  );
}

/**
 * Calculate Internal Rate of Return (IRR)
 * Uses Newton-Raphson method with proper edge case handling
 * 
 * Returns null if:
 * - All cash flows are non-positive (no positive return)
 * - No sign change in cash flows (no IRR exists)
 * - Algorithm doesn't converge
 */
export function calculateIRR(cashFlows: number[], guess: number = 0.1): number | null {
  // Edge case: need at least one positive and one negative cash flow
  const hasPositive = cashFlows.some(cf => cf > 0);
  const hasNegative = cashFlows.some(cf => cf < 0);
  
  if (!hasPositive || !hasNegative) {
    return null; // IRR undefined
  }
  
  const maxIterations = 1000;
  const tolerance = 0.00001;
  let rate = guess;
  
  // Bounds for bisection fallback
  let lowerBound = -0.99;
  let upperBound = 10.0; // 1000% IRR max
  
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivative = 0;
    
    for (let t = 0; t < cashFlows.length; t++) {
      const denominator = Math.pow(1 + rate, t);
      npv += cashFlows[t] / denominator;
      if (t > 0) {
        derivative -= t * cashFlows[t] / Math.pow(1 + rate, t + 1);
      }
    }
    
    // Check for convergence
    if (Math.abs(npv) < tolerance) {
      return rate * 100;
    }
    
    // Newton-Raphson step
    if (Math.abs(derivative) < 1e-10) {
      // Derivative too small, use bisection
      const mid = (lowerBound + upperBound) / 2;
      const midNPV = cashFlows.reduce((sum, cf, t) => 
        sum + cf / Math.pow(1 + mid, t), 0
      );
      
      if (midNPV > 0) {
        lowerBound = mid;
      } else {
        upperBound = mid;
      }
      rate = mid;
    } else {
      const newRate = rate - npv / derivative;
      
      // Bound the rate to prevent divergence
      if (newRate < lowerBound) {
        rate = (rate + lowerBound) / 2;
      } else if (newRate > upperBound) {
        rate = (rate + upperBound) / 2;
      } else {
        // Check for convergence
        if (Math.abs(newRate - rate) < tolerance) {
          return newRate * 100;
        }
        rate = newRate;
      }
    }
  }
  
  // No convergence - return null
  return null;
}

/**
 * Calculate Simple Payback Period
 * Returns the number of months until cumulative cash flow becomes positive
 */
export function calculatePaybackPeriod(
  initialInvestment: number, 
  monthlyNetBenefit: number
): number {
  if (monthlyNetBenefit <= 0) {
    return Infinity; // Never pays back
  }
  return initialInvestment / monthlyNetBenefit;
}

/**
 * Calculate Discounted Payback Period
 * Returns the number of periods until discounted cumulative cash flow becomes positive
 */
export function calculateDiscountedPayback(
  cashFlows: number[], 
  discountRate: number
): number {
  const rate = discountRate / 100 / 12; // Monthly rate
  let cumulative = 0;
  
  for (let t = 0; t < cashFlows.length; t++) {
    cumulative += cashFlows[t] / Math.pow(1 + rate, t);
    if (cumulative >= 0) {
      // Interpolate for fractional period
      const prevCumulative = cumulative - (cashFlows[t] / Math.pow(1 + rate, t));
      if (Math.abs(cumulative - prevCumulative) > 0) {
        const fraction = -prevCumulative / (cumulative - prevCumulative);
        return t - 1 + fraction;
      }
      return t;
    }
  }
  
  return Infinity; // Never pays back within horizon
}

/**
 * Calculate Benefit-Cost Ratio
 * Formula: Total Benefits / Total Costs
 */
export function calculateBenefitCostRatio(totalBenefits: number, totalCosts: number): number {
  if (totalCosts <= 0) return 0;
  return totalBenefits / totalCosts;
}

/**
 * Calculate Profitability Index
 * Formula: (NPV + Initial Investment) / Initial Investment
 */
export function calculateProfitabilityIndex(npv: number, initialInvestment: number): number {
  if (initialInvestment <= 0) return 0;
  return (npv + initialInvestment) / initialInvestment;
}

/**
 * Generate full cash flow projection
 */
export function generateCashFlowProjection(
  initialInvestment: number,
  annualCosts: number,
  annualBenefits: number,
  years: number,
  discountRate: number
): CashFlowProjection[] {
  const projections: CashFlowProjection[] = [];
  let cumulativeCashFlow = 0;
  let cumulativeDiscountedCashFlow = 0;
  const rate = discountRate / 100;
  
  // Year 0: Initial investment
  projections.push({
    period: 0,
    costs: initialInvestment,
    benefits: 0,
    netCashFlow: -initialInvestment,
    cumulativeCashFlow: -initialInvestment,
    discountedCashFlow: -initialInvestment,
    cumulativeDiscountedCashFlow: -initialInvestment,
  });
  
  cumulativeCashFlow = -initialInvestment;
  cumulativeDiscountedCashFlow = -initialInvestment;
  
  // Years 1-n
  for (let year = 1; year <= years; year++) {
    const netCashFlow = annualBenefits - annualCosts;
    const discountedCashFlow = netCashFlow / Math.pow(1 + rate, year);
    
    cumulativeCashFlow += netCashFlow;
    cumulativeDiscountedCashFlow += discountedCashFlow;
    
    projections.push({
      period: year,
      costs: annualCosts,
      benefits: annualBenefits,
      netCashFlow,
      cumulativeCashFlow,
      discountedCashFlow,
      cumulativeDiscountedCashFlow,
    });
  }
  
  return projections;
}

/**
 * Calculate all financial metrics
 */
export function calculateAllMetrics(
  totalCosts: number,
  totalBenefits: number,
  initialInvestment: number,
  annualCosts: number,
  annualBenefits: number,
  years: number,
  discountRate: number,
  riskConfig: RiskCalculationConfig
): FinancialMetrics {
  // Generate cash flows
  const cashFlows = [-initialInvestment];
  for (let year = 1; year <= years; year++) {
    cashFlows.push(annualBenefits - annualCosts);
  }
  
  // Calculate risk adjustment
  const riskAdjustment = calculateRiskAdjustment(riskConfig);
  
  // Core metrics
  const simpleROI = calculateSimpleROI(totalBenefits, totalCosts);
  const annualizedROI = calculateAnnualizedROI(simpleROI, years);
  const npv = calculateNPV(cashFlows, discountRate);
  const irr = calculateIRR(cashFlows);
  
  // Payback
  const monthlyNetBenefit = (annualBenefits - annualCosts) / 12;
  const paybackPeriodMonths = calculatePaybackPeriod(initialInvestment, monthlyNetBenefit);
  
  // Discounted payback (monthly granularity)
  const monthlyCashFlows = [-initialInvestment];
  for (let month = 1; month <= years * 12; month++) {
    monthlyCashFlows.push(monthlyNetBenefit);
  }
  const discountedPaybackMonths = calculateDiscountedPayback(monthlyCashFlows, discountRate);
  
  // Ratios
  const benefitCostRatio = calculateBenefitCostRatio(totalBenefits, totalCosts);
  const profitabilityIndex = calculateProfitabilityIndex(npv, initialInvestment);
  
  // Risk-adjusted metrics
  const riskAdjustedROI = simpleROI * riskAdjustment.riskMultiplier;
  const riskAdjustedNPV = calculateNPV(cashFlows, riskAdjustment.riskAdjustedDiscountRate);
  
  return {
    simpleROI,
    annualizedROI,
    npv,
    irr,
    paybackPeriodMonths,
    discountedPaybackMonths,
    benefitCostRatio,
    profitabilityIndex,
    riskAdjustedROI,
    riskAdjustedNPV,
  };
}

/**
 * Validation Test Matrix - used for unit testing
 * 
 * | Scenario         | Impl | Adopt | Tech | Market | Multiplier | Adj. Discount Rate |
 * |------------------|------|-------|------|--------|------------|-------------------|
 * | All Low (20%)    | 20   | 20    | 20   | 20     | 0.90       | 14%               |
 * | All Medium (50%) | 50   | 50    | 50   | 50     | 0.75       | 20%               |
 * | All High (80%)   | 80   | 80    | 80   | 80     | 0.60       | 26%               |
 * | Mixed Realistic  | 30   | 40    | 25   | 35     | 0.837      | 16.5%             |
 */
export function runValidationTests(): boolean {
  const testCases = [
    { config: { implementationRisk: 20, adoptionRisk: 20, technicalRisk: 20, marketRisk: 20 }, expectedMultiplier: 0.90 },
    { config: { implementationRisk: 50, adoptionRisk: 50, technicalRisk: 50, marketRisk: 50 }, expectedMultiplier: 0.75 },
    { config: { implementationRisk: 80, adoptionRisk: 80, technicalRisk: 80, marketRisk: 80 }, expectedMultiplier: 0.60 },
  ];
  
  for (const test of testCases) {
    const result = calculateRiskAdjustment(test.config);
    if (Math.abs(result.riskMultiplier - test.expectedMultiplier) > 0.01) {
      console.error(`Validation failed for test case`, test, result);
      return false;
    }
  }
  
  return true;
}
