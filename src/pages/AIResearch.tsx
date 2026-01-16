import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Zap, 
  Brain,
  Search,
  Building2,
  Loader2,
  Globe,
  FileText,
  Sparkles,
  Clock,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { INDUSTRIES, AI_SERVICES, COMPANY_SIZES, LOCATIONS, TIME_HORIZONS } from '@/components/quick-calculator/constants';
import { AnalysisReport } from '@/components/quick-calculator/types';
import { AnalysisReportView } from '@/components/quick-calculator/AnalysisReportView';

const AIResearch = () => {
  // AI Research state
  const [aiIndustry, setAiIndustry] = useState('');
  const [aiService, setAiService] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [location, setLocation] = useState('');
  const [timeHorizon, setTimeHorizon] = useState(3);
  const [freeTextNotes, setFreeTextNotes] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null);
  const [researchStep, setResearchStep] = useState(0);

  const researchSteps = [
    'Analyzing your industry and use case...',
    'Gathering market data and benchmarks...',
    'Evaluating solution providers...',
    'Building ROI projections...',
    'Generating recommendations...'
  ];

  const handleAIResearch = async () => {
    if (!aiIndustry || !aiService) {
      toast.error('Please select both an industry and AI service type');
      return;
    }

    setIsResearching(true);
    setAnalysisReport(null);
    setResearchStep(0);

    // Simulate progress steps
    const stepInterval = setInterval(() => {
      setResearchStep(prev => {
        if (prev < researchSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 8000);

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

      clearInterval(stepInterval);

      if (error) throw error;

      if (data?.success && data?.data) {
        setAnalysisReport(data.data as AnalysisReport);
        toast.success('Comprehensive analysis completed!');
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      clearInterval(stepInterval);
      console.error('Research error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to complete analysis');
    } finally {
      setIsResearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatePresence mode="wait">
            {!analysisReport ? (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto"
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-7 h-7 text-primary" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                    AI-Powered ROI Analysis
                  </h1>
                  <p className="text-slate-600 max-w-lg mx-auto">
                    Describe your business and use case. We'll estimate costs, benefits, and ROI using industry benchmarks.
                  </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Tell us about your project</h2>
                      <p className="text-sm text-slate-500">No metrics needed - just a few details</p>
                    </div>
                  </div>

                  {/* How it works */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-cyan-500/5 border border-primary/10 mb-6">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div className="text-sm text-slate-700">
                        <strong className="text-slate-900">What you'll get:</strong> A comprehensive analysis including ROI projections, solution providers, cost breakdown, risks, and implementation roadmap.
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Required Fields */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          Your Industry <span className="text-rose-500">*</span>
                        </Label>
                        <Select value={aiIndustry} onValueChange={setAiIndustry}>
                          <SelectTrigger className="bg-white border-slate-200 focus:border-primary">
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
                        <Label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-slate-400" />
                          AI Service Type <span className="text-rose-500">*</span>
                        </Label>
                        <Select value={aiService} onValueChange={setAiService}>
                          <SelectTrigger className="bg-white border-slate-200 focus:border-primary">
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

                    {/* Optional Fields */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-700 mb-2 block">Company Size</Label>
                        <Select value={companySize} onValueChange={setCompanySize}>
                          <SelectTrigger className="bg-white border-slate-200">
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
                        <Label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-slate-400" />
                          Location / Region
                        </Label>
                        <Select value={location} onValueChange={setLocation}>
                          <SelectTrigger className="bg-white border-slate-200">
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
                      <Label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        Analysis Time Horizon
                      </Label>
                      <Select value={timeHorizon.toString()} onValueChange={(v) => setTimeHorizon(Number(v))}>
                        <SelectTrigger className="bg-white border-slate-200">
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
                      <Label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        Additional Context <span className="text-slate-400 font-normal">(Optional)</span>
                      </Label>
                      <Textarea
                        value={freeTextNotes}
                        onChange={(e) => setFreeTextNotes(e.target.value)}
                        placeholder="E.g., We handle 500 support tickets/day and want AI to handle 60% automatically. Budget is around $50k/year..."
                        className="min-h-[100px] bg-white border-slate-200 focus:border-primary resize-none"
                      />
                    </div>

                    <Button 
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-12"
                      onClick={handleAIResearch}
                      disabled={isResearching || !aiIndustry || !aiService}
                    >
                      {isResearching ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating Analysis...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" />
                          Generate AI Analysis
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Loading State */}
                  {isResearching && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div className="space-y-3">
                        {researchSteps.map((step, idx) => (
                          <div 
                            key={idx} 
                            className={`flex items-center gap-3 text-sm transition-opacity ${
                              idx <= researchStep ? 'opacity-100' : 'opacity-40'
                            }`}
                          >
                            {idx < researchStep ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : idx === researchStep ? (
                              <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                            )}
                            <span className={idx <= researchStep ? 'text-slate-700' : 'text-slate-400'}>
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 mt-4 text-center">
                        This may take 30-60 seconds for a comprehensive analysis
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Trust Elements */}
                <div className="mt-6 text-center text-xs text-slate-500">
                  <p>🔒 We don't store your data • Analysis based on industry benchmarks</p>
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
        </div>
      </div>
    </div>
  );
};

export default AIResearch;
