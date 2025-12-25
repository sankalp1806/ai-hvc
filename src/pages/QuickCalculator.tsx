import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  ArrowRight,
  Calculator,
  Sparkles,
  Brain,
  Search,
  Building2,
  Loader2,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const INDUSTRIES = [
  { value: 'technology', label: 'Technology & Software' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'healthcare', label: 'Healthcare & Medical' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'education', label: 'Education' },
  { value: 'legal', label: 'Legal Services' },
  { value: 'marketing', label: 'Marketing & Advertising' },
  { value: 'logistics', label: 'Logistics & Supply Chain' },
  { value: 'hospitality', label: 'Hospitality & Travel' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'other', label: 'Other' },
];

const AI_SERVICES = [
  { value: 'customer-support', label: 'Customer Support / Chatbots', icon: '💬' },
  { value: 'content-generation', label: 'Content Generation', icon: '✍️' },
  { value: 'predictive-maintenance', label: 'Predictive Maintenance', icon: '🔧' },
  { value: 'document-processing', label: 'Document Processing / OCR', icon: '📄' },
  { value: 'data-analytics', label: 'Data Analytics & Insights', icon: '📊' },
  { value: 'fraud-detection', label: 'Fraud Detection', icon: '🛡️' },
  { value: 'personalization', label: 'Personalization Engine', icon: '🎯' },
  { value: 'sales-automation', label: 'Sales Automation', icon: '💼' },
  { value: 'quality-control', label: 'Quality Control / Vision AI', icon: '👁️' },
  { value: 'hr-recruitment', label: 'HR & Recruitment', icon: '👥' },
  { value: 'voice-assistant', label: 'Voice Assistant / IVR', icon: '🎙️' },
  { value: 'general-ai', label: 'General AI Applications', icon: '🤖' },
];

const COMPANY_SIZES = [
  { value: 'solo', label: 'Solo / Freelancer' },
  { value: 'small', label: 'Small (1-50 employees)' },
  { value: 'medium', label: 'Medium (51-500 employees)' },
  { value: 'large', label: 'Large (501-5000 employees)' },
  { value: 'enterprise', label: 'Enterprise (5000+ employees)' },
];

interface Provider {
  name: string;
  description: string;
  website?: string;
  pricingModel: string;
  plans: Array<{
    name: string;
    price: string;
    features: string[];
    bestFor: string;
  }>;
  pros: string[];
  cons: string[];
  typicalCostRange?: {
    small?: string;
    medium?: string;
    enterprise?: string;
  };
  implementationComplexity: string;
  integrationOptions?: string[];
}

interface ResearchData {
  summary: string;
  marketInsights: {
    adoptionRate: string;
    averageROI: string;
    implementationTimeframe: string;
  };
  providers: Provider[];
  recommendations: {
    forSmallBusiness: { provider: string; reason: string };
    forMediumBusiness: { provider: string; reason: string };
    forEnterprise: { provider: string; reason: string };
  };
  implementationGuide: {
    phases: Array<{ phase: string; duration: string; activities: string[] }>;
    keyConsiderations: string[];
    commonChallenges: string[];
    successFactors: string[];
  };
  costEstimates: {
    small: { initialSetup: string; monthlyOperating: string; yearOneTotal: string; potentialSavings: string };
    medium: { initialSetup: string; monthlyOperating: string; yearOneTotal: string; potentialSavings: string };
    enterprise: { initialSetup: string; monthlyOperating: string; yearOneTotal: string; potentialSavings: string };
  };
  timeHorizonOptions: Array<{
    period: string;
    expectedOutcomes: string[];
    riskLevel: string;
  }>;
}

const QuickCalculator = () => {
  const navigate = useNavigate();
  
  // Manual calculation state
  const [investment, setInvestment] = useState(150000);
  const [annualSavings, setAnnualSavings] = useState(75000);
  const [annualRevenue, setAnnualRevenue] = useState(25000);
  const [years, setYears] = useState(3);
  const [confidence, setConfidence] = useState(70);
  const [industry, setIndustry] = useState('');

  // AI Research state
  const [aiIndustry, setAiIndustry] = useState('');
  const [aiService, setAiService] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [researchData, setResearchData] = useState<ResearchData | null>(null);
  const [expandedProviders, setExpandedProviders] = useState<string[]>([]);
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState(0);

  // Manual calculations
  const totalAnnualBenefit = annualSavings + annualRevenue;
  const adjustedBenefit = totalAnnualBenefit * (confidence / 100);
  const totalBenefits = adjustedBenefit * years;
  const simpleROI = ((totalBenefits - investment) / investment) * 100;
  const paybackMonths = investment / (adjustedBenefit / 12);
  const threeYearValue = adjustedBenefit * 3 - investment;
  const npv = -investment + (adjustedBenefit / 1.1) + (adjustedBenefit / 1.21) + (adjustedBenefit / 1.331);

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const isPositive = simpleROI >= 0;

  const handleAIResearch = async () => {
    if (!aiIndustry || !aiService) {
      toast.error('Please select both an industry and AI service type');
      return;
    }

    setIsResearching(true);
    setResearchData(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-research', {
        body: { 
          industry: INDUSTRIES.find(i => i.value === aiIndustry)?.label || aiIndustry,
          aiService: AI_SERVICES.find(s => s.value === aiService)?.label || aiService,
          companySize: COMPANY_SIZES.find(s => s.value === companySize)?.label || undefined
        }
      });

      if (error) throw error;

      if (data?.success && data?.data) {
        setResearchData(data.data);
        toast.success('AI research completed successfully!');
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Research error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to complete AI research');
    } finally {
      setIsResearching(false);
    }
  };

  const toggleProviderExpand = (providerName: string) => {
    setExpandedProviders(prev => 
      prev.includes(providerName) 
        ? prev.filter(n => n !== providerName)
        : [...prev, providerName]
    );
  };

  const getComplexityColor = (complexity: string) => {
    const lower = complexity.toLowerCase();
    if (lower === 'low') return 'text-success';
    if (lower === 'medium') return 'text-warning';
    return 'text-destructive';
  };

  const getRiskColor = (risk: string) => {
    const lower = risk.toLowerCase();
    if (lower === 'low') return 'bg-success/10 text-success';
    if (lower === 'medium') return 'bg-warning/10 text-warning';
    return 'bg-destructive/10 text-destructive';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Quick ROI Calculator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get instant ROI estimates or let AI research the best solutions for your industry
            </p>
          </motion.div>

          <Tabs defaultValue="ai-research" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="ai-research" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Research
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Manual Entry
              </TabsTrigger>
            </TabsList>

            {/* AI Research Tab */}
            <TabsContent value="ai-research">
              <AnimatePresence mode="wait">
                {!researchData ? (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="max-w-2xl mx-auto"
                  >
                    <div className="metric-card space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Brain className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-foreground">AI-Powered Research</h2>
                          <p className="text-sm text-muted-foreground">
                            No metrics needed - just tell us about your business
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">How it works:</span> Select your industry and desired AI service. Our AI will analyze the market and provide you with a comprehensive framework including top providers, pricing options, implementation guides, and ROI estimates.
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          <Building2 className="w-4 h-4 inline mr-2" />
                          Your Industry *
                        </Label>
                        <Select value={aiIndustry} onValueChange={setAiIndustry}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {INDUSTRIES.map(ind => (
                              <SelectItem key={ind.value} value={ind.value}>
                                {ind.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          <Sparkles className="w-4 h-4 inline mr-2" />
                          AI Service to Automate *
                        </Label>
                        <Select value={aiService} onValueChange={setAiService}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select AI service type" />
                          </SelectTrigger>
                          <SelectContent>
                            {AI_SERVICES.map(service => (
                              <SelectItem key={service.value} value={service.value}>
                                <span className="flex items-center gap-2">
                                  <span>{service.icon}</span>
                                  <span>{service.label}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Company Size (Optional)
                        </Label>
                        <Select value={companySize} onValueChange={setCompanySize}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select company size for tailored results" />
                          </SelectTrigger>
                          <SelectContent>
                            {COMPANY_SIZES.map(size => (
                              <SelectItem key={size.value} value={size.value}>
                                {size.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        variant="hero" 
                        className="w-full"
                        onClick={handleAIResearch}
                        disabled={isResearching || !aiIndustry || !aiService}
                      >
                        {isResearching ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Researching AI Solutions...
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            Research AI Solutions
                          </>
                        )}
                      </Button>

                      {isResearching && (
                        <div className="text-center text-sm text-muted-foreground">
                          <p>Analyzing market data and provider information...</p>
                          <p className="text-xs mt-1">This may take 15-30 seconds</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Summary Header */}
                    <div className="metric-card">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-success" />
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold text-foreground">Research Complete</h2>
                            <p className="text-sm text-muted-foreground">
                              {INDUSTRIES.find(i => i.value === aiIndustry)?.label} • {AI_SERVICES.find(s => s.value === aiService)?.label}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setResearchData(null)}
                        >
                          New Search
                        </Button>
                      </div>
                      <p className="text-foreground">{researchData.summary}</p>
                    </div>

                    {/* Market Insights */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="metric-card text-center">
                        <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground mb-1">Adoption Rate</p>
                        <p className="text-lg font-semibold text-foreground">{researchData.marketInsights.adoptionRate}</p>
                      </div>
                      <div className="metric-card text-center">
                        <DollarSign className="w-6 h-6 text-success mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground mb-1">Average ROI</p>
                        <p className="text-lg font-semibold text-success">{researchData.marketInsights.averageROI}</p>
                      </div>
                      <div className="metric-card text-center">
                        <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground mb-1">Implementation Time</p>
                        <p className="text-lg font-semibold text-foreground">{researchData.marketInsights.implementationTimeframe}</p>
                      </div>
                    </div>

                    {/* Providers */}
                    <div className="metric-card">
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        AI Solution Providers
                      </h3>
                      <div className="space-y-4">
                        {researchData.providers.map((provider, idx) => (
                          <div 
                            key={idx}
                            className="border border-border rounded-lg overflow-hidden"
                          >
                            <div 
                              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => toggleProviderExpand(provider.name)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <h4 className="font-semibold text-foreground">{provider.name}</h4>
                                    <span className={`text-xs px-2 py-0.5 rounded ${getComplexityColor(provider.implementationComplexity)}`}>
                                      {provider.implementationComplexity} complexity
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">{provider.description}</p>
                                </div>
                                {expandedProviders.includes(provider.name) ? (
                                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                            
                            <AnimatePresence>
                              {expandedProviders.includes(provider.name) && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="border-t border-border"
                                >
                                  <div className="p-4 space-y-4">
                                    {/* Plans */}
                                    <div>
                                      <h5 className="text-sm font-medium text-foreground mb-2">Pricing Plans</h5>
                                      <div className="grid gap-3">
                                        {provider.plans.map((plan, planIdx) => (
                                          <div key={planIdx} className="p-3 rounded-lg bg-muted/50">
                                            <div className="flex items-center justify-between mb-2">
                                              <span className="font-medium text-foreground">{plan.name}</span>
                                              <span className="text-sm font-mono text-primary">{plan.price}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-2">Best for: {plan.bestFor}</p>
                                            <div className="flex flex-wrap gap-1">
                                              {plan.features.slice(0, 4).map((feature, fIdx) => (
                                                <span key={fIdx} className="text-xs px-2 py-0.5 rounded bg-background text-muted-foreground">
                                                  {feature}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Pros & Cons */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div>
                                        <h5 className="text-sm font-medium text-success mb-2">Pros</h5>
                                        <ul className="text-sm space-y-1">
                                          {provider.pros.map((pro, pIdx) => (
                                            <li key={pIdx} className="flex items-start gap-2 text-muted-foreground">
                                              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                              {pro}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div>
                                        <h5 className="text-sm font-medium text-destructive mb-2">Cons</h5>
                                        <ul className="text-sm space-y-1">
                                          {provider.cons.map((con, cIdx) => (
                                            <li key={cIdx} className="flex items-start gap-2 text-muted-foreground">
                                              <span className="text-destructive">•</span>
                                              {con}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>

                                    {provider.website && (
                                      <Button variant="outline" size="sm" asChild>
                                        <a href={provider.website} target="_blank" rel="noopener noreferrer">
                                          Visit Website <ExternalLink className="ml-2 w-3 h-3" />
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cost Estimates */}
                    <div className="metric-card">
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary" />
                        Cost Estimates by Company Size
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        {(['small', 'medium', 'enterprise'] as const).map((size) => {
                          const estimate = researchData.costEstimates[size];
                          return (
                            <div key={size} className="p-4 rounded-lg border border-border">
                              <h4 className="font-medium text-foreground mb-3 capitalize">{size}</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Initial Setup</span>
                                  <span className="font-mono text-foreground">{estimate.initialSetup}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Monthly</span>
                                  <span className="font-mono text-foreground">{estimate.monthlyOperating}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Year 1 Total</span>
                                  <span className="font-mono text-foreground">{estimate.yearOneTotal}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-border">
                                  <span className="text-success">Potential Savings</span>
                                  <span className="font-mono text-success">{estimate.potentialSavings}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Horizon Options */}
                    <div className="metric-card">
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Implementation Timeline Options
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        {researchData.timeHorizonOptions.map((option, idx) => (
                          <div 
                            key={idx}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              selectedTimeHorizon === idx 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedTimeHorizon(idx)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-foreground">{option.period}</h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getRiskColor(option.riskLevel)}`}>
                                {option.riskLevel} risk
                              </span>
                            </div>
                            <ul className="text-sm space-y-1">
                              {option.expectedOutcomes.map((outcome, oIdx) => (
                                <li key={oIdx} className="flex items-start gap-2 text-muted-foreground">
                                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                  {outcome}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Implementation Guide */}
                    <div className="metric-card">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Implementation Phases</h3>
                      <div className="space-y-4">
                        {researchData.implementationGuide.phases.map((phase, idx) => (
                          <div key={idx} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                                {idx + 1}
                              </div>
                              {idx < researchData.implementationGuide.phases.length - 1 && (
                                <div className="w-0.5 flex-1 bg-border mt-2" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-foreground">{phase.phase}</h4>
                                <span className="text-xs text-muted-foreground">({phase.duration})</span>
                              </div>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {phase.activities.map((activity, aIdx) => (
                                  <li key={aIdx}>• {activity}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="metric-card">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Recommendations</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">For Small Business</h4>
                          <p className="font-semibold text-foreground">{researchData.recommendations.forSmallBusiness.provider}</p>
                          <p className="text-sm text-muted-foreground mt-1">{researchData.recommendations.forSmallBusiness.reason}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">For Medium Business</h4>
                          <p className="font-semibold text-foreground">{researchData.recommendations.forMediumBusiness.provider}</p>
                          <p className="text-sm text-muted-foreground mt-1">{researchData.recommendations.forMediumBusiness.reason}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">For Enterprise</h4>
                          <p className="font-semibold text-foreground">{researchData.recommendations.forEnterprise.provider}</p>
                          <p className="text-sm text-muted-foreground mt-1">{researchData.recommendations.forEnterprise.reason}</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 text-center">
                      <h3 className="font-semibold text-foreground mb-2">
                        Ready for a detailed analysis?
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Use our full calculator with these estimates for comprehensive ROI analysis including risk assessment and Monte Carlo simulation.
                      </p>
                      <Button 
                        variant="hero" 
                        onClick={() => navigate('/calculator')}
                      >
                        Full Analysis
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            {/* Manual Entry Tab */}
            <TabsContent value="manual">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Panel */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="metric-card space-y-6">
                    <h2 className="text-xl font-semibold text-foreground">Investment Details</h2>

                    {/* Industry */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Industry (Optional)</Label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRIES.map(ind => (
                            <SelectItem key={ind.value} value={ind.value}>
                              {ind.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Total Investment */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Total AI Investment
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          type="number"
                          value={investment}
                          onChange={(e) => setInvestment(Number(e.target.value))}
                          className="pl-8 font-mono text-lg"
                        />
                      </div>
                    </div>

                    {/* Annual Cost Savings */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Expected Annual Cost Savings
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          type="number"
                          value={annualSavings}
                          onChange={(e) => setAnnualSavings(Number(e.target.value))}
                          className="pl-8 font-mono text-lg"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Labor, operational, or efficiency savings
                      </p>
                    </div>

                    {/* Annual Revenue Increase */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Expected Annual Revenue Increase
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          type="number"
                          value={annualRevenue}
                          onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                          className="pl-8 font-mono text-lg"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        New revenue from AI-enabled products or services
                      </p>
                    </div>

                    {/* Time Horizon */}
                    <div>
                      <Label className="text-sm font-medium mb-4 block">
                        Time Horizon: {years} years
                      </Label>
                      <Slider
                        value={[years]}
                        onValueChange={([v]) => setYears(v)}
                        min={1}
                        max={10}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>1 year</span>
                        <span>10 years</span>
                      </div>
                    </div>

                    {/* Confidence Level */}
                    <div>
                      <Label className="text-sm font-medium mb-4 block">
                        Confidence Level: {confidence}%
                      </Label>
                      <Slider
                        value={[confidence]}
                        onValueChange={([v]) => setConfidence(v)}
                        min={30}
                        max={100}
                        step={5}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Low (30%)</span>
                        <span>High (100%)</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Results Panel */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-6"
                >
                  {/* Main ROI Card */}
                  <div className={`metric-card ${isPositive ? 'border-success/30' : 'border-destructive/30'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-muted-foreground">Simple ROI</span>
                      <TrendingUp className={`w-6 h-6 ${isPositive ? 'text-success' : 'text-destructive'}`} />
                    </div>
                    <div className={`font-mono text-5xl font-bold ${isPositive ? 'text-success' : 'text-destructive'}`}>
                      {simpleROI >= 0 ? '+' : ''}{simpleROI.toFixed(0)}%
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Over {years} year{years > 1 ? 's' : ''} at {confidence}% confidence
                    </p>
                  </div>

                  {/* Secondary Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="metric-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Payback Period</span>
                      </div>
                      <div className="font-mono text-2xl font-bold text-foreground">
                        {paybackMonths < 120 ? `${paybackMonths.toFixed(1)} mo` : 'N/A'}
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">3-Year Net Value</span>
                      </div>
                      <div className={`font-mono text-2xl font-bold ${threeYearValue >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatCurrency(threeYearValue)}
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">NPV (10% discount)</span>
                      </div>
                      <div className={`font-mono text-2xl font-bold ${npv >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatCurrency(npv)}
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Calculator className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Annual Benefit</span>
                      </div>
                      <div className="font-mono text-2xl font-bold text-foreground">
                        {formatCurrency(adjustedBenefit)}
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
                    <h3 className="font-semibold text-foreground mb-2">
                      Want a comprehensive analysis?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get detailed insights including Monte Carlo simulation, risk-adjusted returns, intangible benefits scoring, and AI-powered recommendations.
                    </p>
                    <Button 
                      variant="hero" 
                      className="w-full"
                      onClick={() => navigate('/calculator')}
                    >
                      Full Analysis
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  {/* Disclaimer */}
                  <p className="text-xs text-muted-foreground text-center">
                    * This is a simplified calculation. Actual ROI may vary based on implementation details, market conditions, and other factors. Use our full calculator for comprehensive analysis.
                  </p>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default QuickCalculator;
