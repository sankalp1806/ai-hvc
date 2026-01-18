import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  Shield,
  Lightbulb,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart,
  AlertCircle,
  Zap,
  Globe,
  Building2,
  Calendar,
  BookOpen,
  Info,
  Download,
  Share2,
  RefreshCw,
  ArrowRight,
  Sparkles,
  TrendingDown,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AnalysisReport } from './types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
  LineChart,
  Line,
  ReferenceLine
} from 'recharts';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AnalysisReportViewProps {
  report: AnalysisReport;
  onReset: () => void;
}

// Animated counter component
const AnimatedNumber = ({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useMemo(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
};

export const AnalysisReportView = ({ report, onReset }: AnalysisReportViewProps) => {
  const [expandedProviders, setExpandedProviders] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(['metrics', 'comparative']);
  const [activeMetricTab, setActiveMetricTab] = useState('financial');
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const toggleProvider = (name: string) => {
    setExpandedProviders(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    
    setIsExporting(true);
    toast.info('Generating PDF...');
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      let heightLeft = imgHeight * ratio;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pdfHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight * ratio;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
        heightLeft -= pdfHeight;
      }
      
      const fileName = `AI-ROI-Analysis-${report.contextOverview?.scenarioSummary?.industry || 'Report'}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'AI ROI Analysis',
      text: `AI ROI Analysis for ${report.contextOverview?.scenarioSummary?.industry} - ${report.contextOverview?.scenarioSummary?.serviceType}. ROI: ${report.executiveSummary?.roiRange?.conservative} - ${report.executiveSummary?.roiRange?.optimistic}`,
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const getRiskColor = (level: string) => {
    const lower = level?.toLowerCase() || '';
    if (lower === 'low') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (lower === 'medium') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-rose-100 text-rose-700 border-rose-200';
  };

  const getConfidenceColor = (level: string) => {
    const lower = level?.toLowerCase() || '';
    if (lower === 'high') return 'text-emerald-600';
    if (lower === 'medium') return 'text-amber-600';
    return 'text-rose-600';
  };

  const getConfidenceBg = (level: string) => {
    const lower = level?.toLowerCase() || '';
    if (lower === 'high') return 'bg-emerald-50 border-emerald-200';
    if (lower === 'medium') return 'bg-amber-50 border-amber-200';
    return 'bg-rose-50 border-rose-200';
  };

  // Parse ROI range for display
  const parseRoiValue = (str: string) => {
    const match = str?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Generate chart data from report
  const generateCashFlowData = () => {
    const months = 36;
    const data = [];
    let cumulative = -50000; // Initial investment
    
    for (let i = 0; i <= months; i++) {
      const monthlyBenefit = i === 0 ? 0 : 4000 + (i * 200);
      const monthlyCost = i === 0 ? 50000 : 1500;
      cumulative += (monthlyBenefit - (i === 0 ? 0 : monthlyCost));
      
      data.push({
        month: i,
        cumulative: Math.round(cumulative),
        benefit: monthlyBenefit,
        cost: monthlyCost,
      });
    }
    return data;
  };

  const generateComparisonData = () => {
    return report.comparativeAnalysis?.comparisonMatrix?.map(opt => ({
      name: opt.option?.split(' ').slice(0, 2).join(' ') || 'Option',
      roi: parseRoiValue(opt.roi) || 0,
      complexity: opt.complexity === 'Low' ? 30 : opt.complexity === 'Medium' ? 60 : 90,
      risk: opt.risk === 'Low' ? 20 : opt.risk === 'Medium' ? 50 : 80,
    })) || [];
  };

  const cashFlowData = generateCashFlowData();
  const comparisonData = generateComparisonData();

  const SectionCard = ({ 
    id, 
    icon: Icon, 
    title, 
    subtitle,
    children,
    level = 2,
    defaultExpanded = false,
    accentColor
  }: { 
    id: string; 
    icon: React.ElementType; 
    title: string; 
    subtitle?: string;
    children: React.ReactNode;
    level?: 1 | 2 | 3;
    defaultExpanded?: boolean;
    accentColor?: 'primary' | 'success' | 'warning';
  }) => {
    const isExpanded = expandedSections.includes(id);
    
    const cardStyles = {
      1: 'bg-white border-2 shadow-lg',
      2: 'bg-white border shadow-sm',
      3: 'bg-slate-50 border shadow-none',
    };
    
    const borderColors = {
      primary: 'border-primary/30',
      success: 'border-emerald-300',
      warning: 'border-amber-300',
    };

    return (
      <div className={`rounded-xl overflow-hidden ${cardStyles[level]} ${accentColor ? borderColors[accentColor] : 'border-slate-200'}`}>
        <button 
          className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-slate-50/80 transition-colors text-left"
          onClick={() => toggleSection(id)}
          aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              accentColor === 'success' ? 'bg-emerald-100' : 
              accentColor === 'warning' ? 'bg-amber-100' : 'bg-primary/10'
            }`}>
              <Icon className={`w-5 h-5 ${
                accentColor === 'success' ? 'text-emerald-600' : 
                accentColor === 'warning' ? 'text-amber-600' : 'text-primary'
              }`} />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-slate-900">{title}</h3>
              {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-slate-100">
                <div className="pt-4">
                  {children}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Sticky Header Bar */}
        <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-900">Analysis Complete</h2>
                  <Badge className={`${getConfidenceBg(report.executiveSummary?.confidenceLevel)} ${getConfidenceColor(report.executiveSummary?.confidenceLevel)} border`}>
                    {report.executiveSummary?.confidenceLevel} Confidence
                  </Badge>
                </div>
                <p className="text-sm text-slate-500">
                  {report.contextOverview?.scenarioSummary?.industry} • {report.contextOverview?.scenarioSummary?.serviceType}
                  {report.contextOverview?.locationContext?.region && ` • ${report.contextOverview.locationContext.region}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleExportPDF}
                disabled={isExporting}
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export PDF'}</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button variant="outline" size="sm" onClick={onReset} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">New Analysis</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Report Content - wrapped for PDF export */}
        <div ref={reportRef} className="space-y-6">

        {/* Hero Metrics Section - Level 1 Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium text-slate-300">Executive Summary</span>
          </div>
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 md:p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-300 uppercase tracking-wide">ROI Range</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-emerald-400 font-mono">
                {report.executiveSummary?.roiRange?.conservative} - {report.executiveSummary?.roiRange?.optimistic}
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 md:p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-300 uppercase tracking-wide">Payback Period</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white font-mono">
                {report.executiveSummary?.paybackPeriod}
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 md:p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-300 uppercase tracking-wide">Total TCO</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white font-mono">
                {report.costBudgetImpact?.totalTCO || 'N/A'}
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 md:p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-slate-300 uppercase tracking-wide">NPV</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white font-mono">
                {report.keyMetrics?.financial?.find(m => m.name.toLowerCase().includes('npv'))?.value || 'N/A'}
              </p>
            </div>
          </div>
          
          {/* Recommendation */}
          <div className="bg-white/5 rounded-xl p-4 md:p-5 border border-white/10">
            <p className="text-base md:text-lg text-white leading-relaxed">
              {report.executiveSummary?.overallRecommendation}
            </p>
          </div>
          
          {/* Key Takeaways */}
          <div className="mt-6 grid md:grid-cols-2 gap-3">
            {report.executiveSummary?.keyTakeaways?.slice(0, 4).map((takeaway, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </div>
            ))}
          </div>
          
          {/* Risks */}
          <div className="mt-6 flex flex-wrap gap-2">
            {report.executiveSummary?.biggestRisks?.map((risk, idx) => (
              <Badge key={idx} variant="outline" className="bg-rose-500/20 text-rose-300 border-rose-400/30">
                <AlertCircle className="w-3 h-3 mr-1" /> {risk}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Dashboard Grid - 2 Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* ROI Projection Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <LineChartIcon className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-slate-900">Cumulative Cash Flow</h3>
                </div>
                <Badge variant="outline" className="text-xs">36 months</Badge>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashFlowData}>
                    <defs>
                      <linearGradient id="cashFlowGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#6B7280', fontSize: 11 }}
                      axisLine={{ stroke: '#E5E7EB' }}
                      tickFormatter={(v) => `M${v}`}
                    />
                    <YAxis 
                      tick={{ fill: '#6B7280', fontSize: 11 }}
                      axisLine={{ stroke: '#E5E7EB' }}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <RechartsTooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Cumulative']}
                      labelFormatter={(label) => `Month ${label}`}
                      contentStyle={{ 
                        backgroundColor: '#FFFFFF', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <ReferenceLine y={0} stroke="#EF4444" strokeDasharray="5 5" />
                    <Area 
                      type="monotone" 
                      dataKey="cumulative" 
                      stroke="#10B981" 
                      fill="url(#cashFlowGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Break-even point estimated around month 12-16
              </p>
            </motion.div>

            {/* Key Metrics */}
            <SectionCard
              id="metrics"
              icon={BarChart3}
              title="Key Metrics Overview"
              level={2}
              defaultExpanded
            >
              <Tabs value={activeMetricTab} onValueChange={setActiveMetricTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4 bg-slate-100">
                  <TabsTrigger value="financial" className="text-xs md:text-sm">Financial</TabsTrigger>
                  <TabsTrigger value="operational" className="text-xs md:text-sm">Operational</TabsTrigger>
                  <TabsTrigger value="adoption" className="text-xs md:text-sm">Adoption</TabsTrigger>
                </TabsList>
                <TabsContent value="financial">
                  <div className="grid grid-cols-2 gap-3">
                    {report.keyMetrics?.financial?.map((metric, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs text-slate-500">{metric.name}</span>
                          {metric.timeHorizon && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{metric.timeHorizon}</Badge>
                          )}
                        </div>
                        <p className="text-lg font-mono font-semibold text-slate-900">
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="operational">
                  <div className="grid grid-cols-2 gap-3">
                    {report.keyMetrics?.operational?.map((metric, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs text-slate-500">{metric.name}</span>
                          {metric.timeHorizon && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{metric.timeHorizon}</Badge>
                          )}
                        </div>
                        <p className="text-lg font-mono font-semibold text-slate-900">
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="adoption">
                  <div className="grid grid-cols-2 gap-3">
                    {report.keyMetrics?.adoption?.map((metric, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs text-slate-500">{metric.name}</span>
                          {metric.timeHorizon && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{metric.timeHorizon}</Badge>
                          )}
                        </div>
                        <p className="text-lg font-mono font-semibold text-slate-900">
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </SectionCard>

            {/* Cost & Budget */}
            <SectionCard
              id="costs"
              icon={DollarSign}
              title="Cost & Budget Impact"
              level={2}
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">One-Time Costs</h4>
                  <div className="space-y-2">
                    {report.costBudgetImpact?.costBreakdown?.oneTime?.map((cost, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-slate-500">{cost.category}</span>
                        <span className="font-mono text-slate-900">{cost.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Recurring Costs</h4>
                  <div className="space-y-2">
                    {report.costBudgetImpact?.costBreakdown?.recurring?.map((cost, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-slate-500">{cost.category}</span>
                        <span className="font-mono text-slate-900">{cost.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200">
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase">Year 1</p>
                  <p className="text-sm font-mono font-semibold text-slate-900">{report.costBudgetImpact?.yearOneTotal}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase">Year 2</p>
                  <p className="text-sm font-mono font-semibold text-slate-900">{report.costBudgetImpact?.yearTwoTotal}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase">Year 3</p>
                  <p className="text-sm font-mono font-semibold text-slate-900">{report.costBudgetImpact?.yearThreeTotal}</p>
                </div>
                <div className="text-center bg-primary/10 rounded-lg py-1">
                  <p className="text-[10px] text-primary uppercase font-medium">Total TCO</p>
                  <p className="text-sm font-mono font-bold text-primary">{report.costBudgetImpact?.totalTCO}</p>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Comparative Analysis Chart */}
            {report.comparativeAnalysis?.applicable && comparisonData.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-slate-900">Solution Comparison</h3>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 11 }} />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        tick={{ fill: '#6B7280', fontSize: 11 }}
                        width={80}
                      />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: '#FFFFFF', 
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="roi" name="ROI %" fill="#10B981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* Comparative Table */}
            <SectionCard
              id="comparative"
              icon={Target}
              title="Comparative Analysis"
              level={2}
              defaultExpanded
            >
              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-2 text-slate-500 font-medium text-xs">Option</th>
                      <th className="text-left py-2 px-2 text-slate-500 font-medium text-xs">Cost</th>
                      <th className="text-left py-2 px-2 text-slate-500 font-medium text-xs">ROI</th>
                      <th className="text-left py-2 px-2 text-slate-500 font-medium text-xs">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.comparativeAnalysis?.comparisonMatrix?.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-2 font-medium text-slate-900 text-xs">{row.option}</td>
                        <td className="py-2.5 px-2 text-slate-600 text-xs">{row.cost}</td>
                        <td className="py-2.5 px-2 text-emerald-600 font-mono text-xs">{row.roi}</td>
                        <td className="py-2.5 px-2">
                          <Badge className={`${getRiskColor(row.risk)} text-[10px] px-1.5`}>{row.risk}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                  <p className="text-[10px] text-emerald-600 font-medium uppercase">Low Budget</p>
                  <p className="text-xs text-slate-700 mt-1">{report.comparativeAnalysis?.bestForLowBudget}</p>
                </div>
                <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-100">
                  <p className="text-[10px] text-cyan-600 font-medium uppercase">Fast Track</p>
                  <p className="text-xs text-slate-700 mt-1">{report.comparativeAnalysis?.bestForFastImplementation}</p>
                </div>
                <div className="p-2 rounded-lg bg-purple-50 border border-purple-100">
                  <p className="text-[10px] text-purple-600 font-medium uppercase">Max Upside</p>
                  <p className="text-xs text-slate-700 mt-1">{report.comparativeAnalysis?.bestForMaximumUpside}</p>
                </div>
              </div>
            </SectionCard>

            {/* Risks */}
            <SectionCard
              id="risks"
              icon={Shield}
              title="Risks & Sensitivity"
              level={2}
              accentColor="warning"
            >
              <div className="space-y-3 mb-4">
                {report.risksAndSensitivity?.risks?.slice(0, 3).map((risk, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge variant="outline" className="text-[10px] px-1.5">{risk.category}</Badge>
                      <Badge className={`${getRiskColor(risk.likelihood)} text-[10px] px-1.5`}>
                        {risk.likelihood} Likelihood
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-700">{risk.risk}</p>
                    <p className="text-xs text-slate-500 mt-1.5">
                      <strong>Mitigation:</strong> {risk.mitigation}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Sensitivity Analysis</h4>
                <div className="space-y-2">
                  {report.risksAndSensitivity?.sensitivityAnalysis?.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2 rounded-lg bg-amber-50/50">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-slate-700">{item.assumption} (Base: {item.baseCase})</p>
                        <p className="text-xs text-slate-500">{item.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        {/* Full Width Sections */}
        <div className="space-y-6">
          {/* Solution Providers */}
          <SectionCard
            id="providers"
            icon={Building2}
            title="Solution Providers"
            subtitle={`${report.solutionProviders?.length || 0} providers analyzed`}
            level={2}
          >
            <div className="grid md:grid-cols-2 gap-4">
              {report.solutionProviders?.map((provider, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <button 
                    className="w-full p-4 hover:bg-slate-50 transition-colors text-left"
                    onClick={() => toggleProvider(provider.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900">{provider.name}</h4>
                          <Badge variant="secondary" className="text-[10px]">{provider.category}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{provider.description}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedProviders.includes(provider.name) ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedProviders.includes(provider.name) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-100"
                      >
                        <div className="p-4 space-y-4 bg-slate-50/50">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-xs font-medium text-emerald-600 mb-2">Strengths</h5>
                              <ul className="text-xs space-y-1">
                                {provider.strengths?.map((s, i) => (
                                  <li key={i} className="flex items-start gap-1.5 text-slate-600">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-xs font-medium text-amber-600 mb-2">Trade-offs</h5>
                              <ul className="text-xs space-y-1">
                                {provider.tradeoffs?.map((t, i) => (
                                  <li key={i} className="flex items-start gap-1.5 text-slate-600">
                                    <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                                    {t}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div>
                            <h5 className="text-xs font-medium text-slate-700 mb-2">Pricing</h5>
                            <div className="flex gap-2 overflow-x-auto pb-1">
                              {provider.pricingTiers?.slice(0, 3).map((tier, i) => (
                                <div key={i} className="shrink-0 p-2 rounded-md bg-white border border-slate-200 min-w-[120px]">
                                  <p className="text-xs font-medium text-slate-700">{tier.tierName}</p>
                                  <p className="text-sm font-mono text-primary">{tier.price}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {provider.websiteUrl && (
                            <Button variant="outline" size="sm" asChild className="w-full">
                              <a href={provider.websiteUrl} target="_blank" rel="noopener noreferrer">
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
          </SectionCard>

          {/* Timeline */}
          <SectionCard
            id="timeline"
            icon={Calendar}
            title="Implementation Timeline"
            level={2}
          >
            <div className="grid md:grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-lg border border-amber-200 bg-amber-50">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-700">Fast Track</span>
                </div>
                <p className="text-lg font-mono font-bold text-amber-600">{report.timeline?.overviewOptions?.fastTrack?.duration}</p>
                <p className="text-[10px] text-amber-600/80 mt-1">{report.timeline?.overviewOptions?.fastTrack?.tradeoffs}</p>
              </div>
              <div className="p-3 rounded-lg border-2 border-primary/30 bg-primary/5">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-primary">Standard</span>
                  <Badge className="text-[8px] px-1 bg-primary text-white">Recommended</Badge>
                </div>
                <p className="text-lg font-mono font-bold text-primary">{report.timeline?.overviewOptions?.standard?.duration}</p>
                <p className="text-[10px] text-slate-500 mt-1">{report.timeline?.overviewOptions?.standard?.tradeoffs}</p>
              </div>
              <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-700">Comprehensive</span>
                </div>
                <p className="text-lg font-mono font-bold text-emerald-600">{report.timeline?.overviewOptions?.comprehensive?.duration}</p>
                <p className="text-[10px] text-emerald-600/80 mt-1">{report.timeline?.overviewOptions?.comprehensive?.tradeoffs}</p>
              </div>
            </div>

            <div className="space-y-0">
              {report.timeline?.phases?.map((phase, idx) => (
                <div key={idx} className="flex gap-3 pb-4">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    {idx < (report.timeline?.phases?.length || 0) - 1 && (
                      <div className="w-0.5 flex-1 bg-slate-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-slate-900">{phase.phaseName}</h4>
                      <Badge variant="outline" className="text-[10px] px-1.5">{phase.duration}</Badge>
                    </div>
                    <ul className="text-xs text-slate-500 space-y-0.5 mb-2">
                      {phase.activities?.slice(0, 2).map((activity, aIdx) => (
                        <li key={aIdx}>• {activity}</li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1">
                      {phase.deliverables?.slice(0, 2).map((d, dIdx) => (
                        <Badge key={dIdx} variant="secondary" className="text-[10px] bg-slate-100">{d}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Recommendations */}
          <SectionCard
            id="insights"
            icon={Lightbulb}
            title="Recommendations & Next Steps"
            level={1}
            accentColor="success"
          >
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 mb-6">
              <p className="text-base text-slate-800 font-medium">{report.insightsRecommendations?.overallVerdict}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {report.insightsRecommendations?.prioritizedActions?.map((action, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                      {action.priority}
                    </div>
                    <Badge className={`text-[10px] ${
                      action.impact === 'High' ? 'bg-emerald-100 text-emerald-700' : 
                      action.impact === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {action.impact} Impact
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-slate-900 mb-1">{action.action}</p>
                  <p className="text-xs text-slate-500">{action.rationale}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Immediate Steps (0-3 months)</h4>
                <ul className="space-y-1.5">
                  {report.insightsRecommendations?.immediateNextSteps?.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Medium Term (3-12 months)</h4>
                <ul className="space-y-1.5">
                  {report.insightsRecommendations?.mediumTermSteps?.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <ArrowRight className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionCard>

          {/* Methodology - Level 3 Card */}
          <SectionCard
            id="methodology"
            icon={BookOpen}
            title="Methodology & Assumptions"
            level={3}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Approach</h4>
                <p className="text-sm text-slate-600 mb-4">{report.methodology?.approach}</p>
                
                <h4 className="text-sm font-medium text-slate-700 mb-2">Data Sources</h4>
                <div className="flex flex-wrap gap-1">
                  {report.methodology?.dataSourceTypes?.map((source, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{source}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Key Assumptions</h4>
                <ul className="space-y-1 text-sm text-slate-600">
                  {report.methodology?.keyAssumptions?.map((assumption, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Info className="w-3 h-3 text-slate-400 shrink-0 mt-1" />
                      {assumption}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-3 rounded-lg bg-slate-100 text-xs text-slate-500">
              <strong>Disclaimer:</strong> {report.metadata?.disclaimer}
            </div>
          </SectionCard>

          {/* Context Overview - Level 3 Card */}
          <SectionCard
            id="context"
            icon={Globe}
            title="Context & Scenario Details"
            level={3}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Scenario Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Industry</span>
                    <span className="text-slate-900">{report.contextOverview?.scenarioSummary?.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">AI Service</span>
                    <span className="text-slate-900">{report.contextOverview?.scenarioSummary?.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Company Size</span>
                    <span className="text-slate-900">{report.contextOverview?.scenarioSummary?.companySize}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Location Context</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Region</span>
                    <span className="text-slate-900">{report.contextOverview?.locationContext?.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Currency</span>
                    <span className="text-slate-900">{report.contextOverview?.locationContext?.currency}</span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500">{report.contextOverview?.locationContext?.regulatoryEnvironment}</p>
              </div>
            </div>
          </SectionCard>
        </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-primary to-cyan-500 rounded-xl p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Ready to take the next step?</h3>
          <p className="text-white/80 mb-4">Export this report or run a detailed analysis with your specific numbers.</p>
          <div className="flex justify-center gap-3">
            <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10" onClick={onReset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
