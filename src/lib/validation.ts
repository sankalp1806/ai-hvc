import { z } from 'zod';
import { ProjectData, CostEntry, TangibleBenefit, IntangibleBenefit } from '@/store/calculatorStore';

// Validation schemas
export const costEntrySchema = z.object({
  id: z.string().min(1),
  category: z.enum(['implementation', 'infrastructure', 'personnel', 'training', 'maintenance', 'licensing', 'consulting', 'other']),
  type: z.string().min(1),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  oneTimeCost: z.number().min(0, 'Cost cannot be negative'),
  monthlyRecurring: z.number().min(0, 'Cost cannot be negative'),
  annualRecurring: z.number().min(0, 'Cost cannot be negative'),
  yearsApplicable: z.array(z.number()),
  confidenceLevel: z.number().min(10, 'Confidence must be at least 10%').max(100, 'Confidence cannot exceed 100%'),
}).refine(
  (data) => data.oneTimeCost > 0 || data.monthlyRecurring > 0 || data.annualRecurring > 0,
  { message: 'At least one cost field must be greater than 0' }
);

export const tangibleBenefitSchema = z.object({
  id: z.string().min(1),
  category: z.enum(['revenue', 'cost_reduction', 'productivity']),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  currentBaselineValue: z.number().min(0),
  expectedImprovementPercent: z.number().min(0).max(1000),
  expectedAnnualValue: z.number().positive('Expected annual value must be positive'),
  realizationStartMonth: z.number().min(0).max(36),
  rampUpMonths: z.number().min(0).max(36),
  confidenceLevel: z.number().min(10).max(100),
});

export const projectDataSchema = z.object({
  companyName: z.string().max(100).optional(),
  industry: z.string().min(1, 'Please select an industry'),
  companySize: z.enum(['solo', 'small', 'medium', 'large', 'enterprise']),
  annualRevenue: z.string().optional(),
  projectName: z.string().min(2, 'Project name must be at least 2 characters').max(200, 'Project name must be less than 200 characters'),
  projectDescription: z.string().max(1000).optional(),
  projectStage: z.enum(['pre', 'post']),
  useCases: z.array(z.string()).min(1, 'Please select at least one use case'),
  primaryGoal: z.string().optional(),
  timeHorizonYears: z.number().int().min(1, 'Time horizon must be at least 1 year').max(10, 'Time horizon cannot exceed 10 years'),
  discountRate: z.number().min(0, 'Discount rate cannot be negative').max(100, 'Discount rate cannot exceed 100%'),
  costs: z.array(costEntrySchema),
  tangibleBenefits: z.array(tangibleBenefitSchema),
  intangibleBenefits: z.array(z.any()),
  implementationRisk: z.number().min(0).max(100),
  adoptionRisk: z.number().min(0).max(100),
  technicalRisk: z.number().min(0).max(100),
  marketRisk: z.number().min(0).max(100),
});

// Validation functions
export const validateCostEntry = (cost: Partial<CostEntry>) => {
  try {
    costEntrySchema.parse(cost);
    return { valid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      };
    }
    return { valid: false, errors: [{ field: 'unknown', message: 'Validation failed' }] };
  }
};

export const validateBenefit = (benefit: Partial<TangibleBenefit>) => {
  try {
    tangibleBenefitSchema.parse(benefit);
    return { valid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      };
    }
    return { valid: false, errors: [{ field: 'unknown', message: 'Validation failed' }] };
  }
};

export const validateProjectData = (data: Partial<ProjectData>) => {
  try {
    projectDataSchema.parse(data);
    return { valid: true, errors: [], canProceed: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
        canProceed: false,
      };
    }
    return { valid: false, errors: [{ field: 'unknown', message: 'Validation failed' }], canProceed: false };
  }
};

// Step validation
export const validateStep = (step: number, projectData: ProjectData) => {
  switch (step) {
    case 0: // Quick Setup
      return {
        valid: projectData.projectName.length >= 2 && 
               projectData.industry.length > 0 && 
               projectData.useCases.length > 0,
        errors: [
          !projectData.projectName.length ? 'Project name is required' : null,
          !projectData.industry.length ? 'Industry is required' : null,
          !projectData.useCases.length ? 'At least one use case is required' : null,
        ].filter(Boolean) as string[],
      };
    
    case 1: // Investment Details
      const hasCostsOrBenefits = projectData.costs.length > 0 || projectData.tangibleBenefits.length > 0;
      return {
        valid: hasCostsOrBenefits,
        errors: hasCostsOrBenefits ? [] : ['Add at least one cost or benefit to continue'],
      };
    
    case 2: // Results
      return { valid: true, errors: [] };
    
    default:
      return { valid: true, errors: [] };
  }
};

// Human-friendly error messages
export const humanizeError = (field: string, error: string): string => {
  const fieldMessages: Record<string, Record<string, string>> = {
    name: {
      'String must contain at least 2 character(s)': 'Give this item a name so you can identify it later',
      default: 'Please provide a valid name',
    },
    oneTimeCost: {
      'Number must be greater than or equal to 0': 'Cost cannot be negative',
      default: 'Please enter a valid amount',
    },
    expectedAnnualValue: {
      'Number must be positive': 'Please enter the expected annual value in dollars',
      default: 'Please enter a valid benefit amount',
    },
  };
  
  const fieldConfig = fieldMessages[field];
  if (fieldConfig) {
    return fieldConfig[error] || fieldConfig.default || error;
  }
  
  return error;
};

// Format validation helpers
export const formatCurrencyInput = (value: string): number => {
  // Remove currency symbols, commas, spaces
  const cleaned = value.replace(/[$,\s]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.max(0, num);
};

export const formatPercentInput = (value: string): number => {
  // Remove percent symbol
  const cleaned = value.replace(/%/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.max(0, Math.min(100, num));
};
