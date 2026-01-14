import { useState } from 'react';
import { useCalculatorStore, CostEntry } from '@/store/calculatorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, ArrowLeft, ArrowRight, Plus, Trash2, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Updated cost categories matching the CostEntry type
const costCategories = {
  implementation: {
    label: 'Implementation & Integration',
    description: 'Professional services for deployment',
    typicalRange: { min: 50000, max: 500000 },
  },
  infrastructure: {
    label: 'Infrastructure & Hardware',
    description: 'Cloud, compute, storage, networking',
    typicalRange: { min: 20000, max: 200000 },
  },
  licensing: {
    label: 'Software Licensing',
    description: 'AI platform licenses and subscriptions',
    typicalRange: { min: 30000, max: 300000 },
  },
  personnel: {
    label: 'Personnel & Staffing',
    description: 'Internal team costs and hiring',
    typicalRange: { min: 50000, max: 400000 },
  },
  training: {
    label: 'Training & Enablement',
    description: 'Staff training and change management',
    typicalRange: { min: 10000, max: 100000 },
  },
  maintenance: {
    label: 'Maintenance & Support',
    description: 'Ongoing vendor support and updates',
    typicalRange: { min: 15000, max: 100000 },
  },
  consulting: {
    label: 'Consulting & Advisory',
    description: 'External expertise and strategy',
    typicalRange: { min: 25000, max: 200000 },
  },
  other: {
    label: 'Other Costs',
    description: 'Miscellaneous and contingency',
    typicalRange: { min: 5000, max: 50000 },
  },
};

type CostCategory = keyof typeof costCategories;

export const CostInputStep = () => {
  const { projectData, addCost, removeCost, setCurrentStep } = useCalculatorStore();
  const [newCost, setNewCost] = useState<Partial<CostEntry>>({
    category: 'implementation',
    type: '',
    name: '',
    oneTimeCost: 0,
    monthlyRecurring: 0,
    annualRecurring: 0,
    confidenceLevel: 80,
  });

  const handleAddCost = () => {
    if (!newCost.name) return;
    
    const cost: CostEntry = {
      id: crypto.randomUUID(),
      category: newCost.category as CostCategory,
      type: newCost.type || newCost.category || 'other',
      name: newCost.name,
      oneTimeCost: newCost.oneTimeCost || 0,
      monthlyRecurring: newCost.monthlyRecurring || 0,
      annualRecurring: newCost.annualRecurring || 0,
      yearsApplicable: [],
      confidenceLevel: newCost.confidenceLevel || 80,
    };
    
    addCost(cost);
    setNewCost({
      category: 'implementation',
      type: '',
      name: '',
      oneTimeCost: 0,
      monthlyRecurring: 0,
      annualRecurring: 0,
      confidenceLevel: 80,
    });
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

  const selectedCategory = costCategories[newCost.category as CostCategory];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Investment Costs
        </h1>
        <p className="text-muted-foreground">
          Enter all costs associated with your AI implementation
        </p>
      </div>

      {/* Summary */}
      <div className="metric-card border-destructive/20">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-muted-foreground">Total Estimated Cost</span>
            <div className="font-mono text-3xl font-bold text-foreground">
              {formatCurrency(totalCosts)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-muted-foreground">{projectData.costs.length} items</span>
            <div className="text-sm text-muted-foreground">
              Over {projectData.timeHorizonYears} years
            </div>
          </div>
        </div>
      </div>

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
                setNewCost({ 
                  ...newCost, 
                  category: value, 
                  name: cat.label,
                  type: value 
                });
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
            {selectedCategory && (
              <p className="text-xs text-muted-foreground mt-1">
                {selectedCategory.description}
              </p>
            )}
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2 block">Name / Description</Label>
            <Input
              value={newCost.name || ''}
              onChange={(e) => setNewCost({ ...newCost, name: e.target.value })}
              placeholder="e.g., AI Platform License"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-sm font-medium">One-time Cost</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Upfront costs paid once at the start</p>
                    {selectedCategory && (
                      <p className="text-xs text-muted-foreground">
                        Typical: {formatCurrency(selectedCategory.typicalRange.min)} - {formatCurrency(selectedCategory.typicalRange.max)}
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-sm font-medium">Annual Recurring</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Costs that repeat each year</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
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
          <h3 className="text-lg font-semibold mb-4">Cost Items</h3>
          <div className="space-y-3">
            {projectData.costs.map((cost) => (
              <div
                key={cost.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border"
              >
                <div>
                  <div className="font-medium">{cost.name}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {costCategories[cost.category as CostCategory]?.label || cost.category}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-mono font-semibold">
                      {formatCurrency(cost.oneTimeCost + cost.annualRecurring * projectData.timeHorizonYears)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {cost.oneTimeCost > 0 && `${formatCurrency(cost.oneTimeCost)} one-time`}
                      {cost.oneTimeCost > 0 && cost.annualRecurring > 0 && ' + '}
                      {cost.annualRecurring > 0 && `${formatCurrency(cost.annualRecurring)}/yr`}
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

      {/* Quick Add Templates */}
      {projectData.costs.length === 0 && (
        <div className="metric-card bg-muted/30">
          <h4 className="text-sm font-medium mb-3">Quick Add Common Costs</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { category: 'licensing' as const, name: 'AI Platform License', oneTime: 0, annual: 50000 },
              { category: 'implementation' as const, name: 'Implementation Services', oneTime: 100000, annual: 0 },
              { category: 'training' as const, name: 'Staff Training', oneTime: 25000, annual: 5000 },
              { category: 'infrastructure' as const, name: 'Cloud Infrastructure', oneTime: 10000, annual: 36000 },
              { category: 'maintenance' as const, name: 'Annual Maintenance', oneTime: 0, annual: 20000 },
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

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" size="lg" onClick={() => setCurrentStep(1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button variant="hero" size="lg" onClick={() => setCurrentStep(3)}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
