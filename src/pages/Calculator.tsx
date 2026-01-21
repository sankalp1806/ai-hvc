import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { QuickSetupStep } from '@/components/calculator/QuickSetupStep';
import { InvestmentDetailsStep } from '@/components/calculator/InvestmentDetailsStep';
import { ResultsStep } from '@/components/calculator/ResultsStep';
import { AutosaveIndicator } from '@/components/calculator/AutosaveIndicator';
import { useCalculatorStore } from '@/store/calculatorStore';
import { cn } from '@/lib/utils';
import { Check, Play, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router-dom';

const steps = [
  { id: 0, title: 'Quick Setup', description: 'Organization & AI solution', icon: Sparkles },
  { id: 1, title: 'Investment Details', description: 'Costs & benefits', icon: Clock },
  { id: 2, title: 'Results & Scenarios', description: 'Analysis dashboard', icon: Play },
];

// Demo data for "Try with Example" feature
const demoProjectData = {
  companyName: 'Acme Manufacturing',
  industry: 'Manufacturing',
  companySize: 'medium' as const,
  annualRevenue: '$10M - $50M',
  projectName: 'AI-Powered Quality Inspection System',
  projectDescription: 'Deploy computer vision AI to automate quality inspection on manufacturing lines',
  projectStage: 'pre' as const,
  useCases: ['vision', 'automation'],
  primaryGoal: 'Cost Reduction',
  timeHorizonYears: 3,
  discountRate: 10,
  implementationRisk: 25,
  adoptionRisk: 30,
  technicalRisk: 20,
  marketRisk: 15,
};

const demoCosts = [
  { id: '1', category: 'licensing' as const, type: 'licensing', name: 'Computer Vision Platform License', oneTimeCost: 0, monthlyRecurring: 0, annualRecurring: 48000, yearsApplicable: [], confidenceLevel: 85 },
  { id: '2', category: 'infrastructure' as const, type: 'infrastructure', name: 'Hardware (Cameras & Servers)', oneTimeCost: 75000, monthlyRecurring: 0, annualRecurring: 0, yearsApplicable: [], confidenceLevel: 90 },
  { id: '3', category: 'implementation' as const, type: 'implementation', name: 'Integration & Setup', oneTimeCost: 45000, monthlyRecurring: 0, annualRecurring: 0, yearsApplicable: [], confidenceLevel: 75 },
  { id: '4', category: 'training' as const, type: 'training', name: 'Staff Training', oneTimeCost: 15000, monthlyRecurring: 0, annualRecurring: 0, yearsApplicable: [], confidenceLevel: 80 },
];

const demoBenefits = [
  { id: '1', category: 'cost_reduction' as const, name: 'Reduced Defect Rate', currentBaselineValue: 0, expectedImprovementPercent: 40, expectedAnnualValue: 120000, realizationStartMonth: 3, rampUpMonths: 6, confidenceLevel: 75 },
  { id: '2', category: 'productivity' as const, name: 'Quality Inspector Time Savings', currentBaselineValue: 0, expectedImprovementPercent: 30, expectedAnnualValue: 65000, realizationStartMonth: 3, rampUpMonths: 6, confidenceLevel: 80 },
  { id: '3', category: 'cost_reduction' as const, name: 'Reduced Customer Returns', currentBaselineValue: 0, expectedImprovementPercent: 25, expectedAnnualValue: 35000, realizationStartMonth: 6, rampUpMonths: 6, confidenceLevel: 70 },
];

const Calculator = () => {
  const { currentStep, setCurrentStep, updateProjectData, calculateResults, resetCalculator } = useCalculatorStore();
  const [searchParams] = useSearchParams();
  const [isDemo, setIsDemo] = useState(false);

  // Handle demo mode from URL
  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      loadDemoData();
    }
  }, [searchParams]);

  const loadDemoData = () => {
    resetCalculator();
    updateProjectData(demoProjectData);
    demoCosts.forEach(cost => useCalculatorStore.getState().addCost(cost));
    demoBenefits.forEach(benefit => useCalculatorStore.getState().addTangibleBenefit(benefit));
    setIsDemo(true);
    setCurrentStep(2);
    setTimeout(() => calculateResults(), 100);
  };

  const handleStepNavigation = (step: number) => {
    if (step === 2) {
      calculateResults();
    }
    setCurrentStep(step);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <QuickSetupStep onContinue={() => handleStepNavigation(1)} />;
      case 1:
        return (
          <InvestmentDetailsStep 
            onBack={() => setCurrentStep(0)} 
            onContinue={() => handleStepNavigation(2)} 
          />
        );
      case 2:
        return <ResultsStep isDemo={isDemo} onExitDemo={() => { setIsDemo(false); resetCalculator(); setCurrentStep(0); }} />;
      default:
        return <QuickSetupStep onContinue={() => handleStepNavigation(1)} />;
    }
  };

  // Map old 6-step to new 3-step if needed
  const mappedStep = currentStep > 2 ? 2 : currentStep;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6">
          {/* Demo Banner */}
          {isDemo && (
            <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <div>
                  <span className="font-medium">Demo Mode</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    This is example data. Edit values or start fresh to calculate your own ROI.
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => { setIsDemo(false); resetCalculator(); setCurrentStep(0); }}>
                Start Fresh
              </Button>
            </div>
          )}

          {/* Progress Steps - Simplified 3 steps */}
          <div className="mb-12">
            <div className="flex items-center justify-center max-w-2xl mx-auto">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => index <= mappedStep && handleStepNavigation(index)}
                      className={cn(
                        "flex flex-col items-center transition-all",
                        index <= mappedStep ? "cursor-pointer" : "cursor-not-allowed"
                      )}
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                          index < mappedStep
                            ? "bg-success text-success-foreground"
                            : index === mappedStep
                            ? "bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {index < mappedStep ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <StepIcon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "mt-2 text-sm font-medium hidden sm:block",
                          index <= mappedStep ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {step.title}
                      </span>
                      <span
                        className={cn(
                          "text-xs hidden sm:block",
                          index <= mappedStep ? "text-muted-foreground" : "text-muted-foreground/50"
                        )}
                      >
                        {step.description}
                      </span>
                    </button>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          "w-16 md:w-24 h-0.5 mx-4 transition-all duration-300",
                          index < mappedStep ? "bg-success" : "bg-muted"
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Estimated time & Autosave */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="text-xs text-muted-foreground">
                Estimated time: ~5 minutes
              </span>
              <span className="text-muted-foreground">•</span>
              <AutosaveIndicator />
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mappedStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
