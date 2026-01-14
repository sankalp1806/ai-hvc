import { useCalculatorStore } from '@/store/calculatorStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Shield, ArrowLeft, ArrowRight, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { calculateRiskAdjustment } from '@/lib/calculations/financialEngine';

const riskFactors = [
  {
    key: 'implementationRisk',
    label: 'Implementation Risk',
    description: 'Risk of delays, scope creep, or technical challenges during implementation',
    weight: '30%',
    examples: 'Vendor delays, integration issues, resource constraints',
  },
  {
    key: 'adoptionRisk',
    label: 'Adoption Risk',
    description: 'Risk that users won\'t adopt or properly use the AI solution',
    weight: '25%',
    examples: 'User resistance, training gaps, workflow disruption',
  },
  {
    key: 'technicalRisk',
    label: 'Technical Risk',
    description: 'Risk of AI model performance issues, data quality problems, or integration failures',
    weight: '25%',
    examples: 'Model accuracy, data quality, system compatibility',
  },
  {
    key: 'marketRisk',
    label: 'Market Risk',
    description: 'Risk of market changes, competitor actions, or regulatory impacts',
    weight: '20%',
    examples: 'Regulatory changes, competitive disruption, market shifts',
  },
];

export const RiskAssessmentStep = () => {
  const { projectData, updateProjectData, setCurrentStep, calculateResults } = useCalculatorStore();

  const handleContinue = () => {
    calculateResults();
    setCurrentStep(5);
  };

  // Use the NEW CORRECT risk calculation
  const riskAnalysis = calculateRiskAdjustment({
    implementationRisk: projectData.implementationRisk,
    adoptionRisk: projectData.adoptionRisk,
    technicalRisk: projectData.technicalRisk,
    marketRisk: projectData.marketRisk,
  });

  const getRiskLevelStyles = (level: string) => {
    switch (level) {
      case 'low':
        return { label: 'Low', color: 'text-emerald-500', bg: 'bg-emerald-500' };
      case 'moderate':
        return { label: 'Moderate', color: 'text-amber-500', bg: 'bg-amber-500' };
      case 'elevated':
        return { label: 'Elevated', color: 'text-orange-500', bg: 'bg-orange-500' };
      case 'high':
        return { label: 'High', color: 'text-red-500', bg: 'bg-red-500' };
      default:
        return { label: 'Unknown', color: 'text-muted-foreground', bg: 'bg-muted' };
    }
  };

  const getRiskColor = (value: number) => {
    if (value <= 25) return 'text-emerald-500';
    if (value <= 45) return 'text-amber-500';
    if (value <= 65) return 'text-orange-500';
    return 'text-red-500';
  };

  const riskStyles = getRiskLevelStyles(riskAnalysis.riskLevel);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-warning" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Risk Assessment
        </h1>
        <p className="text-muted-foreground">
          Evaluate potential risks to generate risk-adjusted projections
        </p>
      </div>

      {/* Summary - Updated with correct calculations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className={`w-5 h-5 ${riskStyles.color}`} />
            <span className="text-sm text-muted-foreground">Overall Risk Level</span>
          </div>
          <div className={`font-mono text-3xl font-bold ${riskStyles.color}`}>
            {riskAnalysis.weightedAverageRisk.toFixed(0)}%
          </div>
          <span className={`text-sm font-medium ${riskStyles.color}`}>
            {riskStyles.label} Risk
          </span>
        </div>
        
        <div className="metric-card border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Risk Multiplier</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Applied to your ROI and NPV calculations. Higher risk = lower multiplier.
                    Uses weighted average, not compounding failure model.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="font-mono text-3xl font-bold text-primary">
            {(riskAnalysis.riskMultiplier * 100).toFixed(0)}%
          </div>
          <span className="text-sm text-muted-foreground">
            Benefit adjustment factor
          </span>
        </div>

        <div className="metric-card border-success/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="text-sm text-muted-foreground">Adjusted Discount Rate</span>
          </div>
          <div className="font-mono text-3xl font-bold text-success">
            {riskAnalysis.riskAdjustedDiscountRate.toFixed(1)}%
          </div>
          <span className="text-sm text-muted-foreground">
            Base {projectData.discountRate}% + risk premium
          </span>
        </div>
      </div>

      {/* Risk Sliders */}
      <div className="metric-card space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Risk Factors</h3>
          <span className="text-xs text-muted-foreground">Drag sliders to adjust</span>
        </div>
        
        {riskFactors.map((risk) => {
          const value = projectData[risk.key as keyof typeof projectData] as number;
          const color = getRiskColor(value);
          
          return (
            <div key={risk.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">{risk.label}</Label>
                    <span className="text-xs text-muted-foreground">({risk.weight} weight)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs font-medium mb-1">{risk.description}</p>
                          <p className="text-xs text-muted-foreground">Examples: {risk.examples}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className="text-right min-w-[60px]">
                  <span className={`font-mono text-lg font-semibold ${color}`}>{value}%</span>
                </div>
              </div>
              
              <div className="relative">
                <Slider
                  value={[value]}
                  onValueChange={([v]) => updateProjectData({ [risk.key]: v })}
                  min={0}
                  max={80}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Low (0%)</span>
                  <span>Moderate (40%)</span>
                  <span>High (80%)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scenario Preview */}
      <div className="metric-card bg-muted/30">
        <h4 className="text-sm font-semibold mb-4">Scenario Impact Preview</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <div className="text-xs text-amber-700 dark:text-amber-400 mb-1">Pessimistic</div>
            <div className="font-mono font-semibold text-amber-800 dark:text-amber-300">
              {(riskAnalysis.scenarioAnalysis.pessimistic * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-amber-600 dark:text-amber-500">of base benefits</div>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="text-xs text-primary mb-1">Baseline</div>
            <div className="font-mono font-semibold text-primary">
              {(riskAnalysis.scenarioAnalysis.baseline * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground">of base benefits</div>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <div className="text-xs text-emerald-700 dark:text-emerald-400 mb-1">Optimistic</div>
            <div className="font-mono font-semibold text-emerald-800 dark:text-emerald-300">
              {(riskAnalysis.scenarioAnalysis.optimistic * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-500">of base benefits</div>
          </div>
        </div>
      </div>

      {/* Risk Methodology Notice */}
      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Weighted Average Risk Model</p>
          <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
            Your risk-adjusted metrics use a weighted average of risk factors, not compounding probabilities. 
            This provides more realistic projections: even with moderate risk across all factors, 
            you'll see a reasonable adjustment rather than an extreme penalty.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" size="lg" onClick={() => setCurrentStep(3)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button variant="hero" size="lg" onClick={handleContinue}>
          Calculate Results
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
