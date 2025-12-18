import { useState } from 'react';
import { useCalculatorStore, TangibleBenefit, IntangibleBenefit } from '@/store/calculatorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, ArrowLeft, ArrowRight, Plus, Trash2, Sparkles } from 'lucide-react';

const tangibleCategories = {
  revenue: {
    label: 'Revenue Increase',
    types: ['New Revenue Streams', 'Upselling/Cross-selling', 'Customer Retention'],
  },
  cost_reduction: {
    label: 'Cost Reduction',
    types: ['Labor Savings', 'Operational Costs', 'Material Costs', 'Error/Rework Reduction'],
  },
  efficiency: {
    label: 'Efficiency Gains',
    types: ['Process Time Reduction', 'Throughput Increase', 'Faster Time-to-Market'],
  },
};

const intangibleCategories = [
  { value: 'decision_making', label: 'Improved Decision Making', weight: 15 },
  { value: 'customer_experience', label: 'Customer Experience', weight: 20 },
  { value: 'employee_satisfaction', label: 'Employee Satisfaction', weight: 10 },
  { value: 'competitive_advantage', label: 'Competitive Advantage', weight: 15 },
  { value: 'risk_mitigation', label: 'Risk Mitigation', weight: 15 },
  { value: 'innovation', label: 'Innovation & Scalability', weight: 15 },
  { value: 'brand', label: 'Brand & Reputation', weight: 10 },
];

export const BenefitsStep = () => {
  const { 
    projectData, 
    addTangibleBenefit, 
    removeTangibleBenefit,
    addIntangibleBenefit,
    removeIntangibleBenefit,
    setCurrentStep 
  } = useCalculatorStore();

  const [newTangible, setNewTangible] = useState<Partial<TangibleBenefit>>({
    category: 'revenue',
    name: '',
    currentBaselineValue: 0,
    expectedImprovementPercent: 20,
    expectedAnnualValue: 0,
    realizationStartMonth: 3,
    rampUpMonths: 6,
    confidenceLevel: 70,
  });

  const [newIntangible, setNewIntangible] = useState<Partial<IntangibleBenefit>>({
    category: 'decision_making',
    name: 'Improved Decision Making',
    qualitativeScore: 7,
    weight: 15,
    estimatedMonetaryValue: 0,
  });

  const handleAddTangible = () => {
    if (!newTangible.name) return;
    
    const benefit: TangibleBenefit = {
      id: crypto.randomUUID(),
      category: newTangible.category as any,
      name: newTangible.name,
      currentBaselineValue: newTangible.currentBaselineValue || 0,
      expectedImprovementPercent: newTangible.expectedImprovementPercent || 20,
      expectedAnnualValue: newTangible.expectedAnnualValue || 0,
      realizationStartMonth: newTangible.realizationStartMonth || 3,
      rampUpMonths: newTangible.rampUpMonths || 6,
      confidenceLevel: newTangible.confidenceLevel || 70,
    };
    
    addTangibleBenefit(benefit);
    setNewTangible({
      category: 'revenue',
      name: '',
      currentBaselineValue: 0,
      expectedImprovementPercent: 20,
      expectedAnnualValue: 0,
      realizationStartMonth: 3,
      rampUpMonths: 6,
      confidenceLevel: 70,
    });
  };

  const handleAddIntangible = () => {
    const category = intangibleCategories.find(c => c.value === newIntangible.category);
    
    const benefit: IntangibleBenefit = {
      id: crypto.randomUUID(),
      category: newIntangible.category || 'decision_making',
      name: category?.label || 'Custom Benefit',
      qualitativeScore: newIntangible.qualitativeScore || 7,
      weight: category?.weight || 10,
      estimatedMonetaryValue: newIntangible.estimatedMonetaryValue || 0,
      proxyMetrics: { current: 0, target: 0, benchmark: 0 },
    };
    
    addIntangibleBenefit(benefit);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalTangible = projectData.tangibleBenefits.reduce(
    (sum, b) => sum + b.expectedAnnualValue * projectData.timeHorizonYears * (b.confidenceLevel / 100),
    0
  );

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-success" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Expected Benefits
        </h1>
        <p className="text-muted-foreground">
          Define tangible returns and intangible value
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="metric-card border-success/20">
          <span className="text-sm text-muted-foreground">Total Tangible Value</span>
          <div className="font-mono text-2xl font-bold text-success">
            {formatCurrency(totalTangible)}
          </div>
          <span className="text-xs text-muted-foreground">
            {projectData.tangibleBenefits.length} items over {projectData.timeHorizonYears} years
          </span>
        </div>
        <div className="metric-card border-primary/20">
          <span className="text-sm text-muted-foreground">Soft ROI Score</span>
          <div className="font-mono text-2xl font-bold text-primary">
            {projectData.intangibleBenefits.length > 0 
              ? Math.round(
                  projectData.intangibleBenefits.reduce((sum, b) => sum + b.qualitativeScore * b.weight, 0) /
                  projectData.intangibleBenefits.reduce((sum, b) => sum + b.weight, 0) * 10
                )
              : 0
            }/100
          </div>
          <span className="text-xs text-muted-foreground">
            {projectData.intangibleBenefits.length} intangible factors
          </span>
        </div>
      </div>

      <Tabs defaultValue="tangible" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tangible">Tangible Benefits</TabsTrigger>
          <TabsTrigger value="intangible">
            <Sparkles className="w-4 h-4 mr-2" />
            Intangible Benefits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tangible" className="mt-6">
          <div className="metric-card">
            <h3 className="text-lg font-semibold mb-4">Add Tangible Benefit</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Category</Label>
                <Select
                  value={newTangible.category}
                  onValueChange={(value: any) => setNewTangible({ ...newTangible, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(tangibleCategories).map(([key, cat]) => (
                      <SelectItem key={key} value={key}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Benefit Name</Label>
                <Select
                  value={newTangible.name}
                  onValueChange={(value) => setNewTangible({ ...newTangible, name: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select benefit type" />
                  </SelectTrigger>
                  <SelectContent>
                    {tangibleCategories[newTangible.category as keyof typeof tangibleCategories]?.types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Expected Annual Value</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={newTangible.expectedAnnualValue || ''}
                    onChange={(e) => setNewTangible({ ...newTangible, expectedAnnualValue: Number(e.target.value) })}
                    className="pl-8 font-mono"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Confidence: {newTangible.confidenceLevel}%</Label>
                <Slider
                  value={[newTangible.confidenceLevel || 70]}
                  onValueChange={([value]) => setNewTangible({ ...newTangible, confidenceLevel: value })}
                  min={10}
                  max={100}
                  step={5}
                />
              </div>
            </div>

            <Button onClick={handleAddTangible} disabled={!newTangible.name}>
              <Plus className="mr-2 h-4 w-4" />
              Add Benefit
            </Button>
          </div>

          {/* Tangible List */}
          {projectData.tangibleBenefits.length > 0 && (
            <div className="metric-card mt-4">
              <h3 className="text-lg font-semibold mb-4">Tangible Benefits</h3>
              <div className="space-y-3">
                {projectData.tangibleBenefits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20"
                  >
                    <div>
                      <div className="font-medium">{benefit.name}</div>
                      <div className="text-sm text-muted-foreground capitalize">{benefit.category.replace('_', ' ')}</div>
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

        <TabsContent value="intangible" className="mt-6">
          <div className="metric-card">
            <h3 className="text-lg font-semibold mb-4">Add Intangible Benefit</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Category</Label>
                <Select
                  value={newIntangible.category}
                  onValueChange={(value) => {
                    const cat = intangibleCategories.find(c => c.value === value);
                    setNewIntangible({ 
                      ...newIntangible, 
                      category: value,
                      name: cat?.label || '',
                      weight: cat?.weight || 10
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {intangibleCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Impact Score: {newIntangible.qualitativeScore}/10
                </Label>
                <Slider
                  value={[newIntangible.qualitativeScore || 7]}
                  onValueChange={([value]) => setNewIntangible({ ...newIntangible, qualitativeScore: value })}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
            </div>

            <Button onClick={handleAddIntangible}>
              <Plus className="mr-2 h-4 w-4" />
              Add Intangible Benefit
            </Button>
          </div>

          {/* Intangible List */}
          {projectData.intangibleBenefits.length > 0 && (
            <div className="metric-card mt-4">
              <h3 className="text-lg font-semibold mb-4">Intangible Benefits</h3>
              <div className="space-y-3">
                {projectData.intangibleBenefits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <div>
                      <div className="font-medium">{benefit.name}</div>
                      <div className="text-sm text-muted-foreground">Weight: {benefit.weight}%</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-mono font-semibold text-primary">
                          {benefit.qualitativeScore}/10
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Impact score
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIntangibleBenefit(benefit.id)}
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

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" size="lg" onClick={() => setCurrentStep(2)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button variant="hero" size="lg" onClick={() => setCurrentStep(4)}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
