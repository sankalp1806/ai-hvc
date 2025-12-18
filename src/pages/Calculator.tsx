import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { BusinessProfileStep } from '@/components/calculator/BusinessProfileStep';
import { ProjectDetailsStep } from '@/components/calculator/ProjectDetailsStep';
import { CostInputStep } from '@/components/calculator/CostInputStep';
import { BenefitsStep } from '@/components/calculator/BenefitsStep';
import { RiskAssessmentStep } from '@/components/calculator/RiskAssessmentStep';
import { ResultsStep } from '@/components/calculator/ResultsStep';
import { useCalculatorStore } from '@/store/calculatorStore';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const steps = [
  { id: 0, title: 'Business Profile', description: 'Company information' },
  { id: 1, title: 'AI Project', description: 'Project details' },
  { id: 2, title: 'Costs', description: 'Investment breakdown' },
  { id: 3, title: 'Benefits', description: 'Expected returns' },
  { id: 4, title: 'Risk', description: 'Risk assessment' },
  { id: 5, title: 'Results', description: 'Analysis dashboard' },
];

const Calculator = () => {
  const { currentStep, setCurrentStep } = useCalculatorStore();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BusinessProfileStep />;
      case 1:
        return <ProjectDetailsStep />;
      case 2:
        return <CostInputStep />;
      case 3:
        return <BenefitsStep />;
      case 4:
        return <RiskAssessmentStep />;
      case 5:
        return <ResultsStep />;
      default:
        return <BusinessProfileStep />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => index <= currentStep && setCurrentStep(index)}
                    className={cn(
                      "flex flex-col items-center transition-all",
                      index <= currentStep ? "cursor-pointer" : "cursor-not-allowed"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                        index < currentStep
                          ? "bg-accent text-accent-foreground"
                          : index === currentStep
                          ? "bg-primary text-primary-foreground shadow-glow"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {index < currentStep ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={cn(
                        "mt-2 text-xs font-medium hidden sm:block",
                        index <= currentStep ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-12 md:w-24 h-0.5 mx-2 transition-all duration-300",
                        index < currentStep ? "bg-accent" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
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
