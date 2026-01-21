import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface HelpItem {
  title: string;
  description: string;
  impact?: string;
  typicalRanges?: {
    low: string;
    medium: string;
    high: string;
  };
  example?: string;
}

export const helpContent: Record<string, HelpItem> = {
  // Business Profile
  companyName: {
    title: 'Company Name',
    description: 'Your organization\'s name for personalizing reports.',
    impact: 'Used in exported reports and shared analyses.',
  },
  industry: {
    title: 'Industry',
    description: 'Your primary business sector.',
    impact: 'Industry affects typical implementation costs, expected benefits, and risk benchmarks.',
    example: 'A healthcare company may have stricter compliance requirements affecting costs.',
  },
  companySize: {
    title: 'Company Size',
    description: 'Number of employees in your organization.',
    impact: 'Larger companies typically have higher costs but greater potential for economies of scale in benefits.',
    typicalRanges: {
      low: 'Solo/Small: Lower absolute costs, faster implementation',
      medium: 'Mid-Market: Balanced costs and benefits potential',
      high: 'Enterprise: Higher costs, but larger benefit multipliers',
    },
  },
  
  // Project Details
  projectName: {
    title: 'Project Name',
    description: 'A descriptive name for your AI initiative.',
    impact: 'Used throughout the analysis and in exported reports.',
    example: 'Customer Service AI Assistant, Predictive Maintenance System',
  },
  useCases: {
    title: 'AI Use Cases',
    description: 'The specific AI applications you\'re evaluating.',
    impact: 'Different use cases have varying cost structures and benefit potentials.',
    typicalRanges: {
      low: 'Content Generation: Lower costs, variable benefits',
      medium: 'Process Automation: Moderate costs, consistent benefits',
      high: 'Computer Vision: Higher infrastructure costs, significant efficiency gains',
    },
  },
  timeHorizon: {
    title: 'Time Horizon',
    description: 'The number of years for your ROI analysis.',
    impact: 'Longer horizons capture more benefits but increase uncertainty.',
    typicalRanges: {
      low: '1-2 years: Short-term, high confidence',
      medium: '3 years: Standard analysis period',
      high: '5+ years: Strategic initiatives, higher uncertainty',
    },
  },
  discountRate: {
    title: 'Discount Rate',
    description: 'The rate used to calculate present value of future cash flows.',
    impact: 'Higher rates reduce NPV of future benefits, making investments appear less attractive.',
    typicalRanges: {
      low: '5-8%: Low-risk organizations, stable markets',
      medium: '10-12%: Standard corporate discount rate',
      high: '15%+: High-risk industries, startups',
    },
    example: 'Most enterprises use 10% as a baseline discount rate.',
  },
  
  // Costs
  oneTimeCost: {
    title: 'One-Time Cost',
    description: 'Upfront costs incurred only at the start of the project.',
    impact: 'Increases initial investment and extends payback period.',
    example: 'Software licenses, implementation services, hardware purchases.',
  },
  annualRecurring: {
    title: 'Annual Recurring Cost',
    description: 'Ongoing costs that repeat every year.',
    impact: 'Reduces net annual benefits and affects overall ROI.',
    example: 'SaaS subscriptions, maintenance contracts, cloud hosting fees.',
  },
  confidenceLevel: {
    title: 'Confidence Level',
    description: 'How confident you are in this estimate (10-100%).',
    impact: 'Lower confidence adjusts expected values downward in calculations.',
    typicalRanges: {
      low: '50-60%: Rough estimates, new technology',
      medium: '70-80%: Vendor quotes, industry benchmarks',
      high: '90%+: Signed contracts, proven implementations',
    },
  },
  
  // Benefits
  expectedAnnualValue: {
    title: 'Expected Annual Value',
    description: 'The estimated monetary value of this benefit per year.',
    impact: 'Directly increases ROI and reduces payback period.',
    example: 'Labor savings: (Hours saved × Hourly rate × Employees affected)',
  },
  rampUpMonths: {
    title: 'Ramp-Up Period',
    description: 'Months before the benefit reaches full value.',
    impact: 'Longer ramp-up delays benefits realization and extends payback.',
    typicalRanges: {
      low: '0-3 months: Quick wins, simple implementations',
      medium: '3-6 months: Standard enterprise deployments',
      high: '6-12 months: Complex integrations, culture change',
    },
  },
  
  // Risk Assessment
  implementationRisk: {
    title: 'Implementation Risk',
    description: 'The likelihood of delays, scope creep, or technical challenges during deployment.',
    impact: 'Higher risk reduces risk-adjusted ROI to account for potential overruns.',
    typicalRanges: {
      low: '10-20%: Well-defined project, proven technology, experienced team',
      medium: '30-50%: Some unknowns, new vendor, moderate complexity',
      high: '60-80%: Cutting-edge tech, complex integration, first-time implementation',
    },
    example: 'A company implementing a proven chatbot with a reliable vendor might set this at 20%.',
  },
  adoptionRisk: {
    title: 'Adoption Risk',
    description: 'The likelihood that users won\'t adopt or fully utilize the AI solution.',
    impact: 'Low adoption reduces realized benefits significantly.',
    typicalRanges: {
      low: '10-25%: Strong executive sponsorship, user-friendly solution',
      medium: '30-50%: Mixed stakeholder support, moderate training needs',
      high: '60-80%: Resistance to change, complex workflows, cultural barriers',
    },
    example: 'AI replacing manual tasks may face resistance from affected workers.',
  },
  technicalRisk: {
    title: 'Technical Risk',
    description: 'The likelihood of technical failures, integration issues, or performance problems.',
    impact: 'Technical issues can reduce benefits and increase costs.',
    typicalRanges: {
      low: '10-20%: Standard technology, simple integrations',
      medium: '30-50%: New API integrations, moderate complexity',
      high: '60-80%: Experimental AI, complex data pipelines, legacy systems',
    },
    example: 'Integrating with legacy mainframe systems increases technical risk.',
  },
  marketRisk: {
    title: 'Market Risk',
    description: 'The likelihood of external factors affecting the investment\'s success.',
    impact: 'Market changes can make the solution obsolete or reduce competitive advantage.',
    typicalRanges: {
      low: '10-20%: Stable market, internal efficiency focus',
      medium: '30-40%: Moderate competition, evolving regulations',
      high: '50-70%: Rapidly changing market, disruptive technology',
    },
    example: 'A rapidly evolving AI landscape may make today\'s solution outdated quickly.',
  },
};

interface ContextualHelpProps {
  topic: keyof typeof helpContent;
  className?: string;
}

export const ContextualHelp = ({ topic, className = '' }: ContextualHelpProps) => {
  const help = helpContent[topic];
  
  if (!help) {
    return null;
  }
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button className={`text-muted-foreground hover:text-foreground transition-colors ${className}`}>
            <HelpCircle className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-4 space-y-3" side="right">
          <div>
            <p className="font-semibold text-sm">{help.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{help.description}</p>
          </div>
          
          {help.impact && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium text-primary">How it affects your analysis:</p>
              <p className="text-xs text-muted-foreground mt-1">{help.impact}</p>
            </div>
          )}
          
          {help.typicalRanges && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium">Typical ranges:</p>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                <li className="flex items-start gap-1">
                  <span className="text-success">•</span>
                  <span>{help.typicalRanges.low}</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-warning">•</span>
                  <span>{help.typicalRanges.medium}</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-destructive">•</span>
                  <span>{help.typicalRanges.high}</span>
                </li>
              </ul>
            </div>
          )}
          
          {help.example && (
            <div className="pt-2 border-t">
              <p className="text-xs italic text-muted-foreground">
                Example: {help.example}
              </p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
