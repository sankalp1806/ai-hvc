import { useCalculatorStore } from '@/store/calculatorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Lightbulb, ArrowRight, Sparkles, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const industries = [
  { value: 'Technology', description: 'Software, SaaS, IT services' },
  { value: 'Finance & Banking', description: 'Banking, insurance, fintech' },
  { value: 'Healthcare', description: 'Hospitals, pharma, healthtech' },
  { value: 'Manufacturing', description: 'Industrial, automotive, electronics' },
  { value: 'Retail & E-commerce', description: 'Retail, online commerce' },
  { value: 'Consulting', description: 'Professional services, advisory' },
  { value: 'Education', description: 'Schools, universities, edtech' },
  { value: 'Other', description: 'Other industries' },
];

const companySizes = [
  { value: 'solo', label: 'Solo', description: '1 person', multiplier: 0.5 },
  { value: 'small', label: 'Small', description: '2-50', multiplier: 0.8 },
  { value: 'medium', label: 'Mid-Market', description: '51-500', multiplier: 1.0 },
  { value: 'large', label: 'Large', description: '501-5K', multiplier: 1.2 },
  { value: 'enterprise', label: 'Enterprise', description: '5K+', multiplier: 1.5 },
];

const useCases = [
  { value: 'chatbot', label: 'Customer Service AI', icon: '💬', description: 'Automate support inquiries' },
  { value: 'automation', label: 'Process Automation', icon: '⚙️', description: 'Streamline workflows' },
  { value: 'analytics', label: 'Predictive Analytics', icon: '📊', description: 'Forecast trends and patterns' },
  { value: 'document', label: 'Document Processing', icon: '📄', description: 'Extract and process documents' },
  { value: 'content', label: 'Content Generation', icon: '✍️', description: 'Create marketing content' },
  { value: 'vision', label: 'Computer Vision', icon: '👁️', description: 'Image/video analysis' },
];

const quickTemplates = [
  {
    name: 'Customer Service AI',
    icon: '💬',
    industry: 'Technology',
    useCases: ['chatbot'],
    description: 'Deploy AI chatbot for support automation',
  },
  {
    name: 'Quality Inspection',
    icon: '🔍',
    industry: 'Manufacturing',
    useCases: ['vision'],
    description: 'AI-powered quality control system',
  },
  {
    name: 'Document Automation',
    icon: '📄',
    industry: 'Finance & Banking',
    useCases: ['document', 'automation'],
    description: 'Automate document processing',
  },
];

interface QuickSetupStepProps {
  onContinue: () => void;
}

export const QuickSetupStep = ({ onContinue }: QuickSetupStepProps) => {
  const { projectData, updateProjectData } = useCalculatorStore();

  const handleUseCaseToggle = (useCase: string) => {
    const current = projectData.useCases;
    const updated = current.includes(useCase)
      ? current.filter((u) => u !== useCase)
      : [...current, useCase];
    updateProjectData({ useCases: updated });
  };

  const handleTemplateSelect = (template: typeof quickTemplates[0]) => {
    updateProjectData({
      projectName: template.name,
      industry: template.industry,
      useCases: template.useCases,
      projectDescription: template.description,
    });
  };

  const canProceed = projectData.projectName && projectData.industry && projectData.useCases.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Quick Setup
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Tell us about your organization and the AI solution you're evaluating. This helps us tailor the analysis.
        </p>
      </div>

      {/* Quick Templates */}
      <div className="metric-card bg-primary/5 border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Quick Start Templates</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {quickTemplates.map((template) => (
            <button
              key={template.name}
              onClick={() => handleTemplateSelect(template)}
              className="p-4 rounded-lg border-2 border-transparent bg-card hover:border-primary/30 hover:bg-primary/5 text-left transition-all"
            >
              <div className="text-2xl mb-2">{template.icon}</div>
              <div className="font-medium text-sm">{template.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{template.description}</div>
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="project" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            AI Solution
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="mt-6 space-y-6">
          <div className="metric-card space-y-6">
            {/* Company Name */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="companyName" className="text-sm font-medium">
                  Company Name
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">Optional for calculations, but helps personalize your report.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="companyName"
                placeholder="Enter your company name"
                value={projectData.companyName}
                onChange={(e) => updateProjectData({ companyName: e.target.value })}
              />
            </div>

            {/* Industry */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-sm font-medium">Industry</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs font-medium mb-1">Why this matters:</p>
                      <p className="text-xs">Industry affects typical implementation costs, expected benefits, and risk factors in our benchmarks.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select
                value={projectData.industry}
                onValueChange={(value) => updateProjectData({ industry: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      <div className="flex flex-col">
                        <span>{industry.value}</span>
                        <span className="text-xs text-muted-foreground">{industry.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Company Size */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Label className="text-sm font-medium">Company Size</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs font-medium mb-1">Impact on analysis:</p>
                      <p className="text-xs">Larger companies typically have higher implementation costs but also greater potential benefits from economies of scale.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <RadioGroup
                value={projectData.companySize}
                onValueChange={(value: any) => updateProjectData({ companySize: value })}
                className="grid grid-cols-2 md:grid-cols-5 gap-3"
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
                      className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent/5 hover:border-primary/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all text-center"
                    >
                      <span className="font-medium text-sm">{size.label}</span>
                      <span className="text-xs text-muted-foreground">{size.description}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="project" className="mt-6 space-y-6">
          <div className="metric-card space-y-6">
            {/* Project Name */}
            <div>
              <Label htmlFor="projectName" className="text-sm font-medium mb-2 block">
                Project Name *
              </Label>
              <Input
                id="projectName"
                placeholder="e.g., Customer Support AI Assistant"
                value={projectData.projectName}
                onChange={(e) => updateProjectData({ projectName: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Give your AI initiative a descriptive name
              </p>
            </div>

            {/* Use Cases */}
            <div>
              <Label className="text-sm font-medium mb-4 block">
                AI Use Case(s) *
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {useCases.map((useCase) => (
                  <div
                    key={useCase.value}
                    className={`flex items-start space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                      projectData.useCases.includes(useCase.value)
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/30 hover:bg-accent/5'
                    }`}
                    onClick={() => handleUseCaseToggle(useCase.value)}
                  >
                    <Checkbox
                      checked={projectData.useCases.includes(useCase.value)}
                      onCheckedChange={() => handleUseCaseToggle(useCase.value)}
                      className="mt-0.5"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span>{useCase.icon}</span>
                        <span className="text-sm font-medium">{useCase.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{useCase.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Stage */}
            <div>
              <Label className="text-sm font-medium mb-4 block">
                Project Stage
              </Label>
              <RadioGroup
                value={projectData.projectStage}
                onValueChange={(value: 'pre' | 'post') => updateProjectData({ projectStage: value })}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="pre" id="pre" className="peer sr-only" />
                  <Label
                    htmlFor="pre"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent/5 hover:border-primary/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                  >
                    <span className="font-medium">Pre-Implementation</span>
                    <span className="text-xs text-muted-foreground mt-1">Planning or evaluating</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="post" id="post" className="peer sr-only" />
                  <Label
                    htmlFor="post"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent/5 hover:border-primary/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                  >
                    <span className="font-medium">Post-Implementation</span>
                    <span className="text-xs text-muted-foreground mt-1">Measuring actual results</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Validation Status */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${projectData.industry ? 'bg-success' : 'bg-muted-foreground/30'}`} />
          <span className="text-sm text-muted-foreground">Industry selected</span>
        </div>
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${projectData.projectName ? 'bg-success' : 'bg-muted-foreground/30'}`} />
          <span className="text-sm text-muted-foreground">Project named</span>
        </div>
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${projectData.useCases.length > 0 ? 'bg-success' : 'bg-muted-foreground/30'}`} />
          <span className="text-sm text-muted-foreground">Use case selected</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button
          variant="hero"
          size="lg"
          onClick={onContinue}
          disabled={!canProceed}
          className="min-w-[200px]"
        >
          Continue to Investment Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
