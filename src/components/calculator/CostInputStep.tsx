import { useState } from 'react';
import { useCalculatorStore, CostEntry } from '@/store/calculatorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DollarSign, ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';

const costCategories = {
  direct: {
    label: 'Direct Costs',
    description: 'Core investment costs',
    types: [
      { value: 'software_licensing', label: 'AI Software Licensing' },
      { value: 'hardware', label: 'Hardware & Infrastructure' },
      { value: 'implementation', label: 'Implementation Services' },
      { value: 'data_prep', label: 'Data Preparation' },
      { value: 'custom_dev', label: 'Custom Development' },
    ],
  },
  indirect: {
    label: 'Indirect Costs',
    description: 'Supporting investment costs',
    types: [
      { value: 'training', label: 'Employee Training' },
      { value: 'change_mgmt', label: 'Change Management' },
      { value: 'opportunity', label: 'Opportunity Cost' },
    ],
  },
  hidden: {
    label: 'Hidden Costs',
    description: 'Often overlooked costs',
    types: [
      { value: 'integration', label: 'Integration Complexity' },
      { value: 'data_quality', label: 'Data Quality Remediation' },
      { value: 'security', label: 'Security & Compliance' },
      { value: 'vendor_mgmt', label: 'Vendor Management' },
      { value: 'tech_debt', label: 'Technical Debt' },
    ],
  },
  recurring: {
    label: 'Recurring Costs',
    description: 'Ongoing operational costs',
    types: [
      { value: 'maintenance', label: 'Maintenance & Support' },
      { value: 'cloud', label: 'Cloud Hosting / Compute' },
      { value: 'retraining', label: 'Model Retraining' },
      { value: 'data_storage', label: 'Data Storage' },
      { value: 'license_renewal', label: 'License Renewals' },
    ],
  },
};

export const CostInputStep = () => {
  const { projectData, addCost, removeCost, setCurrentStep } = useCalculatorStore();
  const [newCost, setNewCost] = useState<Partial<CostEntry>>({
    category: 'direct',
    type: '',
    name: '',
    oneTimeCost: 0,
    monthlyRecurring: 0,
    annualRecurring: 0,
    confidenceLevel: 80,
  });

  const handleAddCost = () => {
    if (!newCost.type || !newCost.name) return;
    
    const cost: CostEntry = {
      id: crypto.randomUUID(),
      category: newCost.category as any,
      type: newCost.type,
      name: newCost.name,
      oneTimeCost: newCost.oneTimeCost || 0,
      monthlyRecurring: newCost.monthlyRecurring || 0,
      annualRecurring: newCost.annualRecurring || 0,
      yearsApplicable: [],
      confidenceLevel: newCost.confidenceLevel || 80,
    };
    
    addCost(cost);
    setNewCost({
      category: 'direct',
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
              onValueChange={(value: any) => setNewCost({ ...newCost, category: value, type: '' })}
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
            <Label className="text-sm font-medium mb-2 block">Type</Label>
            <Select
              value={newCost.type}
              onValueChange={(value) => {
                const typeLabel = costCategories[newCost.category as keyof typeof costCategories]?.types
                  .find(t => t.value === value)?.label || '';
                setNewCost({ ...newCost, type: value, name: typeLabel });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {costCategories[newCost.category as keyof typeof costCategories]?.types.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

        <Button onClick={handleAddCost} disabled={!newCost.type}>
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
                  <div className="text-sm text-muted-foreground capitalize">{cost.category}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-mono font-semibold">
                      {formatCurrency(cost.oneTimeCost + cost.annualRecurring)}
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
