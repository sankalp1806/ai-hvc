import { useCalculatorStore } from '@/store/calculatorStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Shield, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';

const riskFactors = [
  {
    key: 'implementationRisk',
    label: 'Implementation Risk',
    description: 'Risk of delays, scope creep, or technical challenges during implementation',
    color: 'bg-destructive',
  },
  {
    key: 'adoptionRisk',
    label: 'Adoption Risk',
    description: 'Risk that users won\'t adopt or properly use the AI solution',
    color: 'bg-warning',
  },
  {
    key: 'technicalRisk',
    label: 'Technical Risk',
    description: 'Risk of AI model performance issues, data quality problems, or integration failures',
    color: 'bg-primary',
  },
  {
    key: 'marketRisk',
    label: 'Market Risk',
    description: 'Risk of market changes, competitor actions, or regulatory impacts',
    color: 'bg-muted-foreground',
  },
];

export const RiskAssessmentStep = () => {
  const { projectData, updateProjectData, setCurrentStep, calculateResults } = useCalculatorStore();

  const handleContinue = () => {
    calculateResults();
    setCurrentStep(5);
  };

  const getRiskLevel = (value: number) => {
    if (value <= 20) return { label: 'Low', color: 'text-success' };
    if (value <= 40) return { label: 'Moderate', color: 'text-warning' };
    if (value <= 60) return { label: 'Elevated', color: 'text-orange-500' };
    return { label: 'High', color: 'text-destructive' };
  };

  const overallRisk = Math.round(
    (projectData.implementationRisk +
      projectData.adoptionRisk +
      projectData.technicalRisk +
      projectData.marketRisk) / 4
  );

  const successProbability = Math.round(
    (1 - projectData.implementationRisk / 100) *
    (1 - projectData.adoptionRisk / 100) *
    (1 - projectData.technicalRisk / 100) *
    (1 - projectData.marketRisk / 100) * 100
  );

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

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="metric-card">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className={`w-5 h-5 ${getRiskLevel(overallRisk).color}`} />
            <span className="text-sm text-muted-foreground">Overall Risk Level</span>
          </div>
          <div className={`font-mono text-3xl font-bold ${getRiskLevel(overallRisk).color}`}>
            {overallRisk}%
          </div>
          <span className={`text-sm font-medium ${getRiskLevel(overallRisk).color}`}>
            {getRiskLevel(overallRisk).label} Risk
          </span>
        </div>
        
        <div className="metric-card border-success/20">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-success" />
            <span className="text-sm text-muted-foreground">Success Probability</span>
          </div>
          <div className="font-mono text-3xl font-bold text-success">
            {successProbability}%
          </div>
          <span className="text-sm text-muted-foreground">
            Based on combined risk factors
          </span>
        </div>
      </div>

      {/* Risk Sliders */}
      <div className="metric-card space-y-8">
        {riskFactors.map((risk) => {
          const value = projectData[risk.key as keyof typeof projectData] as number;
          const level = getRiskLevel(value);
          
          return (
            <div key={risk.key}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <Label className="text-sm font-medium">{risk.label}</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">{risk.description}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-lg font-semibold">{value}%</span>
                  <span className={`block text-xs font-medium ${level.color}`}>{level.label}</span>
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
                  <span>High (80%)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Impact Notice */}
      <div className="p-4 rounded-lg bg-muted/50 border border-border flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">How Risk Affects Your Results</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your risk-adjusted ROI will be calculated by multiplying the base ROI by the success probability 
            ({successProbability}%). This provides a more realistic projection accounting for potential setbacks.
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
