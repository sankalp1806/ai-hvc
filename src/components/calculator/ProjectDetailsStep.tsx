import { useCalculatorStore } from '@/store/calculatorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Lightbulb, ArrowLeft, ArrowRight } from 'lucide-react';

const useCases = [
  { value: 'chatbot', label: 'Customer Service Chatbot' },
  { value: 'automation', label: 'Process Automation' },
  { value: 'analytics', label: 'Predictive Analytics' },
  { value: 'document', label: 'Document Processing' },
  { value: 'fraud', label: 'Fraud Detection' },
  { value: 'personalization', label: 'Personalization Engine' },
  { value: 'maintenance', label: 'Predictive Maintenance' },
  { value: 'content', label: 'Content Generation' },
  { value: 'vision', label: 'Computer Vision / QC' },
  { value: 'other', label: 'Other' },
];

const primaryGoals = [
  'Cost Reduction', 'Revenue Growth', 'Operational Efficiency',
  'Customer Experience', 'Risk Mitigation', 'Innovation', 'Competitive Advantage'
];

export const ProjectDetailsStep = () => {
  const { projectData, updateProjectData, setCurrentStep } = useCalculatorStore();

  const handleUseCaseToggle = (useCase: string) => {
    const current = projectData.useCases;
    const updated = current.includes(useCase)
      ? current.filter((u) => u !== useCase)
      : [...current, useCase];
    updateProjectData({ useCases: updated });
  };

  const canProceed = projectData.projectName && projectData.useCases.length > 0;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Lightbulb className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          AI Project Details
        </h1>
        <p className="text-muted-foreground">
          Describe your AI initiative and implementation parameters
        </p>
      </div>

      <div className="metric-card space-y-6">
        {/* Project Name */}
        <div>
          <Label htmlFor="projectName" className="text-sm font-medium mb-2 block">
            Project Name
          </Label>
          <Input
            id="projectName"
            placeholder="e.g., Customer Support AI Assistant"
            value={projectData.projectName}
            onChange={(e) => updateProjectData({ projectName: e.target.value })}
          />
        </div>

        {/* Project Description */}
        <div>
          <Label htmlFor="description" className="text-sm font-medium mb-2 block">
            Project Description (Optional)
          </Label>
          <Textarea
            id="description"
            placeholder="Briefly describe the AI project and its objectives..."
            value={projectData.projectDescription}
            onChange={(e) => updateProjectData({ projectDescription: e.target.value })}
            rows={3}
          />
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

        {/* Use Cases */}
        <div>
          <Label className="text-sm font-medium mb-4 block">
            AI Use Case(s)
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {useCases.map((useCase) => (
              <div
                key={useCase.value}
                className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent/5 cursor-pointer transition-all"
                onClick={() => handleUseCaseToggle(useCase.value)}
              >
                <Checkbox
                  checked={projectData.useCases.includes(useCase.value)}
                  onCheckedChange={() => handleUseCaseToggle(useCase.value)}
                />
                <span className="text-sm">{useCase.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Goal */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Primary Goal
          </Label>
          <Select
            value={projectData.primaryGoal}
            onValueChange={(value) => updateProjectData({ primaryGoal: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select primary goal" />
            </SelectTrigger>
            <SelectContent>
              {primaryGoals.map((goal) => (
                <SelectItem key={goal} value={goal}>
                  {goal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Horizon */}
        <div>
          <Label className="text-sm font-medium mb-4 block">
            Analysis Time Horizon: {projectData.timeHorizonYears} years
          </Label>
          <Slider
            value={[projectData.timeHorizonYears]}
            onValueChange={([value]) => updateProjectData({ timeHorizonYears: value })}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>1 year</span>
            <span>10 years</span>
          </div>
        </div>

        {/* Discount Rate */}
        <div>
          <Label className="text-sm font-medium mb-4 block">
            Discount Rate: {projectData.discountRate}%
          </Label>
          <Slider
            value={[projectData.discountRate]}
            onValueChange={([value]) => updateProjectData({ discountRate: value })}
            min={0}
            max={25}
            step={0.5}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Used for NPV calculation. Typical range: 8-15%
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" size="lg" onClick={() => setCurrentStep(0)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          variant="hero"
          size="lg"
          onClick={() => setCurrentStep(2)}
          disabled={!canProceed}
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
