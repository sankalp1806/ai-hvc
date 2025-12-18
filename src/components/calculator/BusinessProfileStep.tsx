import { useCalculatorStore } from '@/store/calculatorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Building2, ArrowRight } from 'lucide-react';

const industries = [
  'Technology', 'Finance & Banking', 'Healthcare', 'Manufacturing',
  'Retail & E-commerce', 'Consulting', 'Education', 'Media & Entertainment',
  'Logistics & Transportation', 'Energy & Utilities', 'Real Estate', 'Other'
];

const companySizes = [
  { value: 'solo', label: 'Solo Entrepreneur', description: '1 person' },
  { value: 'small', label: 'Small Business', description: '2-50 employees' },
  { value: 'medium', label: 'Mid-Market', description: '51-500 employees' },
  { value: 'large', label: 'Large Enterprise', description: '501-5,000 employees' },
  { value: 'enterprise', label: 'Global Enterprise', description: '5,000+ employees' },
];

const revenueRanges = [
  'Under $100K', '$100K - $1M', '$1M - $10M', '$10M - $50M',
  '$50M - $100M', '$100M - $500M', '$500M - $1B', 'Over $1B'
];

export const BusinessProfileStep = () => {
  const { projectData, updateProjectData, setCurrentStep } = useCalculatorStore();

  const canProceed = projectData.companyName && projectData.industry && projectData.companySize;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Tell Us About Your Business
        </h1>
        <p className="text-muted-foreground">
          This helps us tailor our analysis to your organization
        </p>
      </div>

      <div className="metric-card space-y-6">
        {/* Company Name */}
        <div>
          <Label htmlFor="companyName" className="text-sm font-medium mb-2 block">
            Company Name
          </Label>
          <Input
            id="companyName"
            placeholder="Enter your company name"
            value={projectData.companyName}
            onChange={(e) => updateProjectData({ companyName: e.target.value })}
          />
        </div>

        {/* Industry */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Industry
          </Label>
          <Select
            value={projectData.industry}
            onValueChange={(value) => updateProjectData({ industry: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Company Size */}
        <div>
          <Label className="text-sm font-medium mb-4 block">
            Company Size
          </Label>
          <RadioGroup
            value={projectData.companySize}
            onValueChange={(value: any) => updateProjectData({ companySize: value })}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {companySizes.map((size) => (
              <div key={size.value}>
                <RadioGroupItem
                  value={size.value}
                  id={size.value}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={size.value}
                  className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent/5 hover:border-primary/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                >
                  <span className="font-medium text-sm">{size.label}</span>
                  <span className="text-xs text-muted-foreground mt-1">{size.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Annual Revenue */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Annual Revenue Range
          </Label>
          <Select
            value={projectData.annualRevenue}
            onValueChange={(value) => updateProjectData({ annualRevenue: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select revenue range" />
            </SelectTrigger>
            <SelectContent>
              {revenueRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button
          variant="hero"
          size="lg"
          onClick={() => setCurrentStep(1)}
          disabled={!canProceed}
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
