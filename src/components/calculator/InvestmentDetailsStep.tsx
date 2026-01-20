import { useState } from 'react';
import { useCalculatorStore, CostEntry, TangibleBenefit } from '@/store/calculatorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { EnhancedSlider } from '@/components/ui/enhanced-slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Trash2, 
  ChevronDown,
  Info,
  Settings2,
  Sparkles
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const costCategories = {
  implementation: { label: 'Implementation', description: 'Professional services', typical: [50000, 200000] },
  infrastructure: { label: 'Infrastructure', description: 'Cloud & compute', typical: [20000, 100000] },
  licensing: { label: 'Licensing', description: 'Software subscriptions', typical: [30000, 150000] },
  personnel: { label: 'Personnel', description: 'Internal team costs', typical: [50000, 200000] },
  training: { label: 'Training', description: 'Staff enablement', typical: [10000, 50000] },
  maintenance: { label: 'Maintenance', description: 'Ongoing support', typical: [15000, 75000] },
  consulting: { label: 'Consulting', description: 'External expertise', typical: [25000, 100000] },
  other: { label: 'Other', description: 'Miscellaneous', typical: [5000, 25000] },
};

const benefitCategories = {
  revenue: { label: 'Revenue Growth', types: ['New Revenue', 'Upselling', 'Retention'] },
  cost_reduction: { label: 'Cost Reduction', types: ['Labor Savings', 'Operational', 'Error Reduction'] },
  productivity: { label: 'Productivity', types: ['Time Savings', 'Throughput', 'Faster Delivery'] },
};

type CostCategory = keyof typeof costCategories;

interface InvestmentDetailsStepProps {
  onBack: () => void;
  onContinue: () => void;
}

export const InvestmentDetailsStep = ({ onBack, onContinue }: InvestmentDetailsStepProps) => {
  const { projectData, addCost, removeCost, addTangibleBenefit, removeTangibleBenefit, updateProjectData } = useCalculatorStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState('costs');
  
  const [newCost, setNewCost] = useState<Partial<CostEntry>>({
    category: 'implementation',
    name: '',
    oneTimeCost: 0,
    annualRecurring: 0,
    confidenceLevel: 80,
  });

  const [newBenefit, setNewBenefit] = useState<Partial<TangibleBenefit>>({
    category: 'cost_reduction',
    name: '',
    expectedAnnualValue: 0,
    confidenceLevel: 70,
  });

  const handleAddCost = () => {
    if (!newCost.name) return;
    
    const cost: CostEntry = {
      id: crypto.randomUUID(),
      category: newCost.category as CostCategory,
      type: newCost.category || 'other',
      name: newCost.name,
      oneTimeCost: newCost.oneTimeCost || 0,
      monthlyRecurring: 0,
      annualRecurring: newCost.annualRecurring || 0,
      yearsApplicable: [],
      confidenceLevel: newCost.confidenceLevel || 80,
    };
    
    addCost(cost);
    setNewCost({ category: 'implementation', name: '', oneTimeCost: 0, annualRecurring: 0, confidenceLevel: 80 });
  };

  const handleAddBenefit = () => {
    if (!newBenefit.name || !newBenefit.expectedAnnualValue) return;
    
    const benefit: TangibleBenefit = {
      id: crypto.randomUUID(),
      category: newBenefit.category as any,
      name: newBenefit.name,
      currentBaselineValue: 0,
      expectedImprovementPercent: 20,
      expectedAnnualValue: newBenefit.expectedAnnualValue,
      realizationStartMonth: 3,
      rampUpMonths: 6,
      confidenceLevel: newBenefit.confidenceLevel || 70,
    };
    
    addTangibleBenefit(benefit);
    setNewBenefit({ category: 'cost_reduction', name: '', expectedAnnualValue: 0, confidenceLevel: 70 });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalCosts = projectData.costs.reduce(
    (sum, cost) => sum + cost.oneTimeCost + cost.annualRecurring * projectData.timeHorizonYears,
    0
  );

  const totalBenefits = projectData.tangibleBenefits.reduce(
    (sum, b) => sum + b.expectedAnnualValue * projectData.timeHorizonYears * (b.confidenceLevel / 100),
    0
  );

  const runningROI = totalCosts > 0 ? ((totalBenefits - totalCosts) / totalCosts) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Investment Details
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Enter your expected costs and benefits. We'll calculate ROI as you go.
        </p>
      </div>

      {/* Running Summary - Always visible */}
      <div className="sticky top-20 z-10 bg-background/95 backdrop-blur-sm -mx-4 px-4 py-3 border-b">
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto text-center">
          <div>
            <span className="text-xs text-muted-foreground block">Total Costs</span>
            <span className="font-mono text-lg font-bold text-destructive">{formatCurrency(totalCosts)}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Total Benefits</span>
            <span className="font-mono text-lg font-bold text-success">{formatCurrency(totalBenefits)}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Running ROI</span>
            <span className={`font-mono text-lg font-bold ${runningROI >= 0 ? 'text-success' : 'text-destructive'}`}>
              {runningROI >= 0 ? '+' : ''}{runningROI.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="costs" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Costs
            {projectData.costs.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-destructive/10 text-destructive rounded-full">
                {projectData.costs.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="benefits" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Benefits
            {projectData.tangibleBenefits.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-success/10 text-success rounded-full">
                {projectData.tangibleBenefits.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="costs" className="mt-6 space-y-6">
          {/* Quick Add Templates */}
          {projectData.costs.length === 0 && (
            <div className="metric-card bg-muted/30">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Quick Add Common Costs</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { category: 'licensing' as const, name: 'AI Platform License', oneTime: 0, annual: 50000 },
                  { category: 'implementation' as const, name: 'Implementation Services', oneTime: 100000, annual: 0 },
                  { category: 'training' as const, name: 'Staff Training', oneTime: 25000, annual: 5000 },
                  { category: 'infrastructure' as const, name: 'Cloud Infrastructure', oneTime: 10000, annual: 36000 },
                ].map((template, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addCost({
                        id: crypto.randomUUID(),
                        category: template.category,
                        type: template.category,
                        name: template.name,
                        oneTimeCost: template.oneTime,
                        monthlyRecurring: 0,
                        annualRecurring: template.annual,
                        yearsApplicable: [],
                        confidenceLevel: 75,
                      });
                    }}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Add Cost Form */}
          <div className="metric-card">
            <h3 className="text-lg font-semibold mb-4">Add Cost Item</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Category</Label>
                <Select
                  value={newCost.category}
                  onValueChange={(value: CostCategory) => {
                    const cat = costCategories[value];
                    setNewCost({ ...newCost, category: value, name: cat.label });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(costCategories).map(([key, cat]) => (
                      <SelectItem key={key} value={key}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Name</Label>
                <Input
                  value={newCost.name || ''}
                  onChange={(e) => setNewCost({ ...newCost, name: e.target.value })}
                  placeholder="e.g., AI Platform License"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">One-time Cost</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={newCost.oneTimeCost || ''}
                    onChange={(e) => setNewCost({ ...newCost, oneTimeCost: Number(e.target.value) })}
                    className="pl-8 font-mono"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Annual Recurring</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={newCost.annualRecurring || ''}
                    onChange={(e) => setNewCost({ ...newCost, annualRecurring: Number(e.target.value) })}
                    className="pl-8 font-mono"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Confidence: {newCost.confidenceLevel}%</Label>
                <Slider
                  value={[newCost.confidenceLevel || 80]}
                  onValueChange={([value]) => setNewCost({ ...newCost, confidenceLevel: value })}
                  min={10}
                  max={100}
                  step={5}
                />
              </div>
            </div>

            <Button onClick={handleAddCost} disabled={!newCost.name}>
              <Plus className="mr-2 h-4 w-4" />
              Add Cost
            </Button>
          </div>

          {/* Cost List */}
          {projectData.costs.length > 0 && (
            <div className="metric-card">
              <h3 className="text-lg font-semibold mb-4">Cost Items ({projectData.costs.length})</h3>
              <div className="space-y-3">
                {projectData.costs.map((cost) => (
                  <div
                    key={cost.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border"
                  >
                    <div>
                      <div className="font-medium">{cost.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {costCategories[cost.category as CostCategory]?.label || cost.category}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-mono font-semibold">
                          {formatCurrency(cost.oneTimeCost + cost.annualRecurring * projectData.timeHorizonYears)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {cost.confidenceLevel}% confidence
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCost(cost.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="benefits" className="mt-6 space-y-6">
          {/* Quick Add Templates */}
          {projectData.tangibleBenefits.length === 0 && (
            <div className="metric-card bg-success/5 border-success/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">Quick Add Common Benefits</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { category: 'cost_reduction', name: 'Labor Cost Savings', value: 75000 },
                  { category: 'productivity', name: 'Productivity Gains', value: 50000 },
                  { category: 'revenue', name: 'Revenue Increase', value: 100000 },
                  { category: 'cost_reduction', name: 'Error Reduction', value: 25000 },
                ].map((template, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="border-success/30 hover:bg-success/10"
                    onClick={() => {
                      addTangibleBenefit({
                        id: crypto.randomUUID(),
                        category: template.category as any,
                        name: template.name,
                        currentBaselineValue: 0,
                        expectedImprovementPercent: 20,
                        expectedAnnualValue: template.value,
                        realizationStartMonth: 3,
                        rampUpMonths: 6,
                        confidenceLevel: 70,
                      });
                    }}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Add Benefit Form */}
          <div className="metric-card">
            <h3 className="text-lg font-semibold mb-4">Add Benefit</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Category</Label>
                <Select
                  value={newBenefit.category}
                  onValueChange={(value: any) => setNewBenefit({ ...newBenefit, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(benefitCategories).map(([key, cat]) => (
                      <SelectItem key={key} value={key}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Benefit Name</Label>
                <Input
                  value={newBenefit.name || ''}
                  onChange={(e) => setNewBenefit({ ...newBenefit, name: e.target.value })}
                  placeholder="e.g., Customer Service Cost Savings"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Expected Annual Value</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={newBenefit.expectedAnnualValue || ''}
                    onChange={(e) => setNewBenefit({ ...newBenefit, expectedAnnualValue: Number(e.target.value) })}
                    className="pl-8 font-mono"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Confidence: {newBenefit.confidenceLevel}%</Label>
                <Slider
                  value={[newBenefit.confidenceLevel || 70]}
                  onValueChange={([value]) => setNewBenefit({ ...newBenefit, confidenceLevel: value })}
                  min={10}
                  max={100}
                  step={5}
                />
              </div>
            </div>

            <Button onClick={handleAddBenefit} disabled={!newBenefit.name || !newBenefit.expectedAnnualValue}>
              <Plus className="mr-2 h-4 w-4" />
              Add Benefit
            </Button>
          </div>

          {/* Benefit List */}
          {projectData.tangibleBenefits.length > 0 && (
            <div className="metric-card">
              <h3 className="text-lg font-semibold mb-4">Benefits ({projectData.tangibleBenefits.length})</h3>
              <div className="space-y-3">
                {projectData.tangibleBenefits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20"
                  >
                    <div>
                      <div className="font-medium">{benefit.name}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {benefit.category.replace('_', ' ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-mono font-semibold text-success">
                          {formatCurrency(benefit.expectedAnnualValue)}/yr
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {benefit.confidenceLevel}% confidence
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTangibleBenefit(benefit.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Advanced Settings */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Advanced Settings
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <div className="metric-card space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Label className="text-sm font-medium">
                  Analysis Time Horizon: {projectData.timeHorizonYears} years
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">How many years to project costs and benefits. 3-5 years is typical for AI projects.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <EnhancedSlider
                value={[projectData.timeHorizonYears]}
                onValueChange={([value]) => updateProjectData({ timeHorizonYears: value })}
                min={1}
                max={10}
                step={1}
                valueSuffix=" years"
                benchmarks={[
                  { value: 3, label: 'Typical' },
                  { value: 5, label: 'Long-term' },
                ]}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Label className="text-sm font-medium">
                  Discount Rate: {projectData.discountRate}%
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs font-medium mb-1">What is this?</p>
                      <p className="text-xs">The rate used to discount future cash flows to present value. Typically your company's cost of capital or required rate of return.</p>
                      <p className="text-xs mt-2">Typical range: 8-15%</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <EnhancedSlider
                value={[projectData.discountRate]}
                onValueChange={([value]) => updateProjectData({ discountRate: value })}
                min={0}
                max={25}
                step={0.5}
                valueSuffix="%"
                benchmarks={[
                  { value: 8, label: 'Low' },
                  { value: 12, label: 'Typical' },
                  { value: 18, label: 'High' },
                ]}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          variant="hero" 
          size="lg" 
          onClick={onContinue}
          disabled={projectData.costs.length === 0 && projectData.tangibleBenefits.length === 0}
        >
          Continue to Results
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
