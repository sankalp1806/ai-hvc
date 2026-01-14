/**
 * Investment Recommendation Engine
 * 
 * Generates traffic light recommendations based on financial metrics
 * and provides actionable guidance for decision makers.
 */

export interface RecommendationConfig {
  riskAdjustedROI: number;
  npv: number;
  irr: number | null;
  paybackMonths: number;
  hurdleRate: number;
  maxAcceptablePayback: number; // in months
  totalInvestment: number;
  riskLevel: 'low' | 'moderate' | 'elevated' | 'high';
}

export interface Recommendation {
  status: 'strong' | 'favorable' | 'marginal' | 'weak' | 'negative';
  color: 'emerald' | 'cyan' | 'amber' | 'orange' | 'red';
  headline: string;
  summary: string;
  keyStrengths: string[];
  keyRisks: string[];
  actionItems: string[];
  confidence: 'high' | 'medium' | 'low';
  score: number;
}

export function generateRecommendation(config: RecommendationConfig): Recommendation {
  const { 
    riskAdjustedROI, 
    npv, 
    irr, 
    paybackMonths, 
    hurdleRate, 
    maxAcceptablePayback, 
    totalInvestment,
    riskLevel 
  } = config;
  
  let score = 0;
  const strengths: string[] = [];
  const risks: string[] = [];
  
  // ROI scoring (max 30 pts)
  if (riskAdjustedROI > 100) {
    score += 30;
    strengths.push('Exceptional risk-adjusted returns exceeding 100%');
  } else if (riskAdjustedROI > 50) {
    score += 25;
    strengths.push('Strong risk-adjusted returns above 50%');
  } else if (riskAdjustedROI > 25) {
    score += 20;
    strengths.push('Solid risk-adjusted returns above 25%');
  } else if (riskAdjustedROI > 10) {
    score += 10;
    strengths.push('Positive returns above cost of capital');
  } else if (riskAdjustedROI > 0) {
    score += 5;
    risks.push('Marginal returns may not justify implementation effort');
  } else {
    risks.push('Negative ROI indicates potential value destruction');
  }
  
  // NPV scoring (max 25 pts)
  if (npv > 0) {
    const npvMultiplier = npv / totalInvestment;
    if (npvMultiplier > 2) {
      score += 25;
      strengths.push(`NPV equals ${Math.round(npvMultiplier * 100)}% of investment`);
    } else if (npvMultiplier > 1) {
      score += 20;
      strengths.push('Positive NPV indicates significant value creation');
    } else if (npvMultiplier > 0.5) {
      score += 15;
      strengths.push('Positive NPV indicates value creation');
    } else {
      score += 10;
    }
  } else {
    risks.push('Negative NPV at current discount rate');
  }
  
  // IRR scoring (max 25 pts)
  if (irr !== null) {
    if (irr > hurdleRate * 2) {
      score += 25;
      strengths.push(`IRR of ${irr.toFixed(1)}% significantly exceeds hurdle rate`);
    } else if (irr > hurdleRate * 1.5) {
      score += 20;
      strengths.push(`IRR of ${irr.toFixed(1)}% comfortably exceeds hurdle rate`);
    } else if (irr > hurdleRate) {
      score += 15;
      strengths.push(`IRR of ${irr.toFixed(1)}% exceeds hurdle rate`);
    } else if (irr > 0) {
      score += 5;
      risks.push(`IRR of ${irr.toFixed(1)}% below hurdle rate of ${hurdleRate}%`);
    } else {
      risks.push(`Negative IRR indicates fundamental project issues`);
    }
  } else {
    // IRR couldn't be calculated
    score += 5; // Neutral
  }
  
  // Payback scoring (max 20 pts)
  if (paybackMonths <= maxAcceptablePayback * 0.5) {
    score += 20;
    strengths.push(`Rapid ${paybackMonths.toFixed(0)}-month payback period`);
  } else if (paybackMonths <= maxAcceptablePayback * 0.75) {
    score += 15;
    strengths.push(`Reasonable ${paybackMonths.toFixed(0)}-month payback period`);
  } else if (paybackMonths <= maxAcceptablePayback) {
    score += 10;
  } else if (paybackMonths < Infinity) {
    score += 5;
    risks.push(`Extended ${paybackMonths.toFixed(0)}-month payback period exceeds target`);
  } else {
    risks.push('Investment may never achieve payback');
  }
  
  // Risk level adjustment
  if (riskLevel === 'high') {
    score -= 10;
    risks.push('High overall risk profile requires careful monitoring');
  } else if (riskLevel === 'elevated') {
    score -= 5;
    risks.push('Elevated risk profile warrants risk mitigation planning');
  } else if (riskLevel === 'low') {
    score += 5;
    strengths.push('Low risk profile supports investment confidence');
  }
  
  // Clamp score
  score = Math.max(0, Math.min(100, score));
  
  // Generate recommendation based on score
  if (score >= 80) {
    return {
      status: 'strong',
      color: 'emerald',
      headline: 'Strong Investment Case',
      summary: 'This AI initiative demonstrates compelling financial returns with acceptable risk. The analysis supports moving forward with full investment.',
      keyStrengths: strengths,
      keyRisks: risks,
      actionItems: [
        'Secure budget approval and resource allocation',
        'Establish baseline metrics for ROI tracking',
        'Identify quick wins to demonstrate early value',
        'Develop detailed implementation roadmap',
      ],
      confidence: 'high',
      score,
    };
  }
  
  if (score >= 60) {
    return {
      status: 'favorable',
      color: 'cyan',
      headline: 'Favorable With Considerations',
      summary: 'Financial projections support the investment, though a phased approach is recommended to validate assumptions and manage risk.',
      keyStrengths: strengths,
      keyRisks: risks,
      actionItems: [
        'Consider a pilot phase to validate key assumptions',
        'Develop risk mitigation strategies for identified concerns',
        'Set clear go/no-go decision gates',
        'Plan for iterative implementation',
      ],
      confidence: 'medium',
      score,
    };
  }
  
  if (score >= 40) {
    return {
      status: 'marginal',
      color: 'amber',
      headline: 'Marginal Returns — Scope Review Recommended',
      summary: 'Current projections show limited upside. Consider reducing scope, renegotiating vendor terms, or identifying additional benefit drivers.',
      keyStrengths: strengths,
      keyRisks: risks,
      actionItems: [
        'Challenge and validate cost assumptions',
        'Identify additional measurable benefits',
        'Consider a reduced-scope pilot program',
        'Explore alternative implementation approaches',
      ],
      confidence: 'medium',
      score,
    };
  }
  
  if (score >= 20) {
    return {
      status: 'weak',
      color: 'orange',
      headline: 'Weak Case — Significant Concerns',
      summary: 'Current projections do not support the investment. A fundamental reassessment of scope, approach, or timing is recommended.',
      keyStrengths: strengths,
      keyRisks: risks,
      actionItems: [
        'Reassess project scope and objectives',
        'Explore alternative solutions or vendors',
        'Consider postponing until conditions improve',
        'Document findings for future reference',
      ],
      confidence: 'low',
      score,
    };
  }
  
  return {
    status: 'negative',
    color: 'red',
    headline: 'Not Recommended — Value Destruction Risk',
    summary: 'This investment would likely destroy value under current assumptions. Proceeding is not recommended without fundamental changes to the project scope or approach.',
    keyStrengths: strengths,
    keyRisks: risks,
    actionItems: [
      'Do not proceed with current proposal',
      'Document rejection rationale for stakeholders',
      'Redirect resources to higher-value initiatives',
      'Revisit if conditions change significantly',
    ],
    confidence: 'high',
    score,
  };
}

/**
 * Get recommendation badge styles based on status
 */
export function getRecommendationStyles(status: Recommendation['status']): {
  bgClass: string;
  textClass: string;
  borderClass: string;
  iconColor: string;
} {
  switch (status) {
    case 'strong':
      return {
        bgClass: 'bg-emerald-50 dark:bg-emerald-950/50',
        textClass: 'text-emerald-700 dark:text-emerald-300',
        borderClass: 'border-emerald-200 dark:border-emerald-800',
        iconColor: 'text-emerald-500',
      };
    case 'favorable':
      return {
        bgClass: 'bg-cyan-50 dark:bg-cyan-950/50',
        textClass: 'text-cyan-700 dark:text-cyan-300',
        borderClass: 'border-cyan-200 dark:border-cyan-800',
        iconColor: 'text-cyan-500',
      };
    case 'marginal':
      return {
        bgClass: 'bg-amber-50 dark:bg-amber-950/50',
        textClass: 'text-amber-700 dark:text-amber-300',
        borderClass: 'border-amber-200 dark:border-amber-800',
        iconColor: 'text-amber-500',
      };
    case 'weak':
      return {
        bgClass: 'bg-orange-50 dark:bg-orange-950/50',
        textClass: 'text-orange-700 dark:text-orange-300',
        borderClass: 'border-orange-200 dark:border-orange-800',
        iconColor: 'text-orange-500',
      };
    case 'negative':
      return {
        bgClass: 'bg-red-50 dark:bg-red-950/50',
        textClass: 'text-red-700 dark:text-red-300',
        borderClass: 'border-red-200 dark:border-red-800',
        iconColor: 'text-red-500',
      };
  }
}
