import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
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
  Globe,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { INDUSTRIES, AI_SERVICES, COMPANY_SIZES, LOCATIONS, TIME_HORIZONS } from '@/components/quick-calculator/constants';
import { AnalysisReport } from '@/components/quick-calculator/types';
import { AnalysisReportView } from '@/components/quick-calculator/AnalysisReportView';

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
  const [location, setLocation] = useState('');
  const [timeHorizon, setTimeHorizon] = useState(3);
  const [freeTextNotes, setFreeTextNotes] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null);

  // Manual calculations
  const totalAnnualBenefit = annualSavings + annualRevenue;
  const adjustedBenefit = totalAnnualBenefit * (confidence / 100);
  const totalBenefits = adjustedBenefit * years;
  const simpleROI = ((totalBenefits - investment) / investment) * 100;
  const paybackMonths = investment / (adjustedBenefit / 12);
  const threeYearValue = adjustedBenefit * 3 - investment;
  const npv = -investment + (adjustedBenefit / 1.1) + (adjustedBenefit / 1.21) + (adjustedBenefit / 1.331);

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const isPositive = simpleROI >= 0;

  const handleAIResearch = async () => {
    if (!aiIndustry || !aiService) {
      toast.error('Please select both an industry and AI service type');
      return;
    }

    setIsResearching(true);
    setAnalysisReport(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-research', {
        body: { 
          industry: INDUSTRIES.find(i => i.value === aiIndustry)?.label || aiIndustry,
          aiService: AI_SERVICES.find(s => s.value === aiService)?.label || aiService,
          companySize: COMPANY_SIZES.find(s => s.value === companySize)?.label || undefined,
          location: LOCATIONS.find(l => l.value === location)?.label || undefined,
          freeTextNotes: freeTextNotes || undefined,
          timeHorizonYears: timeHorizon
        }
      });

      if (error) throw error;

      if (data?.success && data?.data) {
        setAnalysisReport(data.data as AnalysisReport);
        toast.success('Comprehensive analysis completed!');
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Research error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to complete analysis');
    } finally {
      setIsResearching(false);
    }
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
                {!analysisReport ? (
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
                          <h2 className="text-xl font-semibold text-foreground">AI-Powered Analysis</h2>
                          <p className="text-sm text-muted-foreground">
                            No metrics needed - just tell us about your business
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">How it works:</span> Select your industry, AI service, and optional details. Our AI will generate a comprehensive 14-section analysis including providers, pricing, ROI estimates, risks, and implementation roadmaps.
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
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
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Company Size</Label>
                          <Select value={companySize} onValueChange={setCompanySize}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select company size" />
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

                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            <Globe className="w-4 h-4 inline mr-2" />
                            Location / Region
                          </Label>
                          <Select value={location} onValueChange={setLocation}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              {LOCATIONS.map(loc => (
                                <SelectItem key={loc.value} value={loc.value}>
                                  {loc.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          <Clock className="w-4 h-4 inline mr-2" />
                          Analysis Time Horizon
                        </Label>
                        <Select value={timeHorizon.toString()} onValueChange={(v) => setTimeHorizon(Number(v))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_HORIZONS.map(th => (
                              <SelectItem key={th.value} value={th.value.toString()}>
                                {th.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          <FileText className="w-4 h-4 inline mr-2" />
                          Additional Context (Optional)
                        </Label>
                        <Textarea
                          value={freeTextNotes}
                          onChange={(e) => setFreeTextNotes(e.target.value)}
                          placeholder="E.g., We handle 200 tickets/day, want 24/7 coverage, budget around $50k/year..."
                          className="min-h-[100px]"
                        />
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
                            Generating Comprehensive Analysis...
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            Generate AI Analysis
                          </>
                        )}
                      </Button>

                      {isResearching && (
                        <div className="text-center text-sm text-muted-foreground">
                          <p>Researching market data, providers, and generating recommendations...</p>
                          <p className="text-xs mt-1">This may take 30-60 seconds</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AnalysisReportView 
                      report={analysisReport} 
                      onReset={() => setAnalysisReport(null)} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            {/* Manual Entry Tab */}
            <TabsContent value="manual">
              <div className="grid lg:grid-cols-2 gap-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                  <div className="metric-card space-y-6">
                    <h2 className="text-xl font-semibold text-foreground">Investment Details</h2>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Total AI Investment</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input type="number" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} className="pl-8 font-mono text-lg" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Expected Annual Cost Savings</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input type="number" value={annualSavings} onChange={(e) => setAnnualSavings(Number(e.target.value))} className="pl-8 font-mono text-lg" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Expected Annual Revenue Increase</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input type="number" value={annualRevenue} onChange={(e) => setAnnualRevenue(Number(e.target.value))} className="pl-8 font-mono text-lg" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Time Horizon: {years} years</Label>
                      <Slider value={[years]} onValueChange={([v]) => setYears(v)} min={1} max={10} step={1} className="py-2" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Confidence Level: {confidence}%</Label>
                      <Slider value={[confidence]} onValueChange={([v]) => setConfidence(v)} min={10} max={100} step={5} className="py-2" />
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <div className="metric-card">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Results</h2>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className={`w-5 h-5 ${isPositive ? 'text-success' : 'text-destructive'}`} />
                            <span className="text-sm text-muted-foreground">Simple ROI</span>
                          </div>
                          <span className={`text-2xl font-mono font-bold ${isPositive ? 'text-success' : 'text-destructive'}`}>
                            {simpleROI.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                          <p className="text-xs text-muted-foreground">Payback Period</p>
                          <p className="text-lg font-mono font-semibold text-foreground">{paybackMonths.toFixed(1)} mo</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <DollarSign className="w-5 h-5 text-success mx-auto mb-1" />
                          <p className="text-xs text-muted-foreground">3-Year Value</p>
                          <p className={`text-lg font-mono font-semibold ${threeYearValue >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {formatCurrency(threeYearValue)}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Net Present Value</p>
                        <p className={`text-xl font-mono font-bold ${npv >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {formatCurrency(npv)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-border">
                      <Button variant="hero" className="w-full" onClick={() => navigate('/calculator')}>
                        Full Detailed Analysis
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
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
