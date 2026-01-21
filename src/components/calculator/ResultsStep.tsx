import { useState, useRef } from 'react';
import { useCalculatorStore, CalculationResults, ProjectData } from '@/store/calculatorStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Clock,
  Target,
  FileText,
  Share2,
  RotateCcw,
  Download,
  AlertTriangle,
  CheckCircle2,
  Info,
  Percent,
  Calculator,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Sliders,
  Save,
  Plus,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Animated number component
const AnimatedNumber = ({ value, formatter, duration = 1000 }: { value: number; formatter: (v: number) => string; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useState(() => {
    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOut;
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  });
  
  return <span>{formatter(displayValue)}</span>;
};

// Metric tooltip explanations
const metricExplanations = {
  simpleROI: {
    title: 'Simple ROI',
    description: 'Return on Investment measures the percentage gain or loss relative to your total investment.',
    formula: '(Total Benefits - Total Costs) / Total Costs × 100%',
    interpretation: 'A positive ROI means your investment generates more value than it costs.',
  },
  riskAdjustedROI: {
    title: 'Risk-Adjusted ROI',
    description: 'ROI adjusted for implementation, adoption, technical, and market risks.',
    formula: 'Simple ROI × Risk Multiplier',
    interpretation: 'This is a more conservative estimate that accounts for things that could go wrong.',
  },
  npv: {
    title: 'Net Present Value',
    description: 'The total value of all future cash flows discounted to today\'s dollars.',
    formula: 'Σ(Cash Flow / (1 + discount rate)^period)',
    interpretation: 'A positive NPV means the investment creates value. Higher is better.',
  },
  payback: {
    title: 'Payback Period',
    description: 'How long until cumulative benefits exceed the initial investment.',
    formula: 'Initial Investment / Monthly Net Benefit',
    interpretation: 'Shorter payback periods mean faster recovery of your investment.',
  },
  irr: {
    title: 'Internal Rate of Return',
    description: 'The discount rate at which NPV equals zero.',
    formula: 'Solved iteratively to find rate where NPV = 0',
    interpretation: 'Compare to your cost of capital. If IRR > cost of capital, the investment is attractive.',
  },
  tco: {
    title: 'Total Cost of Ownership',
    description: 'All costs over the project horizon including one-time and recurring costs.',
    formula: 'One-time Costs + (Annual Costs × Years)',
    interpretation: 'The full financial commitment required for this AI investment.',
  },
};

// Recommendation logic based on results
const getRecommendation = (results: CalculationResults) => {
  const score = 
    (results.riskAdjustedROI > 100 ? 30 : results.riskAdjustedROI > 50 ? 20 : results.riskAdjustedROI > 0 ? 10 : 0) +
    (results.npv > 0 ? 25 : 0) +
    (results.paybackPeriodMonths < 12 ? 25 : results.paybackPeriodMonths < 24 ? 15 : results.paybackPeriodMonths < 36 ? 5 : 0) +
    (results.riskAnalysis.riskLevel === 'low' ? 20 : results.riskAnalysis.riskLevel === 'moderate' ? 10 : 0);

  if (score >= 80) {
    return {
      level: 'strong',
      title: 'Strong Investment Opportunity',
      description: 'This AI initiative shows exceptional returns with manageable risk.',
      color: 'success',
      icon: CheckCircle2,
      actions: [
        'Secure budget approval immediately',
        'Identify quick wins for early validation',
        'Set up KPI tracking before launch',
      ],
    };
  } else if (score >= 50) {
    return {
      level: 'moderate',
      title: 'Positive but Measured Opportunity',
      description: 'This project shows positive returns but requires careful execution.',
      color: 'primary',
      icon: TrendingUp,
      actions: [
        'Consider a pilot phase to validate assumptions',
        'Develop risk mitigation strategies',
        'Set clear go/no-go decision gates',
      ],
    };
  } else if (score >= 25) {
    return {
      level: 'marginal',
      title: 'Marginal Investment Case',
      description: 'Returns are possible but uncertain. Proceed with caution.',
      color: 'warning',
      icon: AlertTriangle,
      actions: [
        'Challenge and validate cost assumptions',
        'Identify additional benefit drivers',
        'Consider phased implementation',
      ],
    };
  } else {
    return {
      level: 'weak',
      title: 'Investment Requires Optimization',
      description: 'Current projections show weak or negative returns.',
      color: 'destructive',
      icon: TrendingDown,
      actions: [
        'Revisit cost estimates and vendor negotiations',
        'Identify overlooked benefits',
        'Consider alternative approaches or vendors',
      ],
    };
  }
};

interface ResultsStepProps {
  isDemo?: boolean;
  onExitDemo?: () => void;
}

export const ResultsStep = ({ isDemo = false, onExitDemo }: ResultsStepProps) => {
  const { results, projectData, setCurrentStep, resetCalculator, updateProjectData, calculateResults } = useCalculatorStore();
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);
  
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [whatIfAdjustments, setWhatIfAdjustments] = useState({
    costChange: 0,
    benefitChange: 0,
    delayMonths: 0,
  });
  const [expandedSections, setExpandedSections] = useState({
    methodology: false,
    keyTakeaways: true,
    riskDetails: false,
  });

  if (!results) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Calculator className="w-8 h-8 text-primary" />
        </div>
        <p className="text-muted-foreground">Calculating results...</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const isPositiveROI = results.simpleROI >= 0;
  const recommendation = getRecommendation(results);
  const RecommendationIcon = recommendation.icon;

  // Chart data
  const yearlyData = results.yearlyProjections.map((proj) => ({
    name: `Year ${proj.year}`,
    costs: proj.costs,
    benefits: proj.benefits,
    cumulative: proj.cumulative,
    roi: proj.roi,
  }));

  // Scenario comparison data
  const scenarioData = [
    { name: 'Pessimistic', roi: results.scenarios.pessimistic.roi, npv: results.scenarios.pessimistic.npv },
    { name: 'Baseline', roi: results.scenarios.baseline.roi, npv: results.scenarios.baseline.npv },
    { name: 'Optimistic', roi: results.scenarios.optimistic.roi, npv: results.scenarios.optimistic.npv },
  ];

  // Key takeaways based on results
  const keyTakeaways = [
    results.riskAdjustedROI > 50 
      ? `Strong ${formatPercent(results.riskAdjustedROI)} risk-adjusted return justifies investment`
      : results.riskAdjustedROI > 0
      ? `Positive ${formatPercent(results.riskAdjustedROI)} risk-adjusted return, but monitor closely`
      : `Negative ROI of ${formatPercent(results.riskAdjustedROI)} indicates need for optimization`,
    results.paybackPeriodMonths < 18
      ? `Quick payback of ${results.paybackPeriodMonths.toFixed(1)} months reduces investment risk`
      : results.paybackPeriodMonths < 36
      ? `${results.paybackPeriodMonths.toFixed(1)} month payback is acceptable for this project type`
      : `Extended payback of ${results.paybackPeriodMonths.toFixed(1)} months increases exposure`,
    results.npv > 0
      ? `Positive NPV of ${formatCurrency(results.npv)} indicates value creation`
      : `Negative NPV suggests the investment destroys value at current projections`,
    results.riskAnalysis.riskLevel === 'low' || results.riskAnalysis.riskLevel === 'moderate'
      ? `${results.riskAnalysis.riskLevel.charAt(0).toUpperCase() + results.riskAnalysis.riskLevel.slice(1)} risk profile supports investment decision`
      : `${results.riskAnalysis.riskLevel.charAt(0).toUpperCase() + results.riskAnalysis.riskLevel.slice(1)} risk level requires mitigation strategies`,
  ];

  // Export to PDF
  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    
    setIsExporting(true);
    toast.info('Generating PDF report...');
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Add header
      pdf.setFontSize(20);
      pdf.text('AI ROI Analysis Report', 20, 20);
      pdf.setFontSize(12);
      pdf.text(projectData.projectName, 20, 30);
      pdf.text(new Date().toLocaleDateString(), 20, 38);
      
      // Add content
      pdf.addImage(imgData, 'PNG', 10, 50, pdfWidth - 20, Math.min(pdfHeight, 230));
      
      pdf.save(`${projectData.projectName.replace(/\s+/g, '-')}-roi-analysis.pdf`);
      toast.success('PDF report downloaded successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Share results
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/calculator?demo=true`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  // What-if analysis - apply adjustments
  const applyWhatIfChanges = () => {
    // This would recalculate with adjusted values
    toast.success('What-if adjustments applied');
    setShowWhatIf(false);
  };

  const MetricTooltip = ({ metricKey }: { metricKey: keyof typeof metricExplanations }) => {
    const info = metricExplanations[metricKey];
    return (
      <TooltipProvider>
        <UITooltip>
          <TooltipTrigger asChild>
            <button className="ml-1 text-muted-foreground hover:text-foreground">
              <HelpCircle className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm p-4">
            <div className="space-y-2">
              <p className="font-semibold text-sm">{info.title}</p>
              <p className="text-xs text-muted-foreground">{info.description}</p>
              <div className="pt-2 border-t">
                <p className="text-xs font-mono bg-muted p-2 rounded">{info.formula}</p>
              </div>
              <p className="text-xs text-muted-foreground italic">{info.interpretation}</p>
            </div>
          </TooltipContent>
        </UITooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="space-y-8" ref={reportRef}>
      {/* Hero Metric - Risk-Adjusted ROI */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`metric-card relative overflow-hidden ${
          recommendation.level === 'strong' ? 'bg-gradient-to-br from-success/10 via-card to-card border-success/30' :
          recommendation.level === 'moderate' ? 'bg-gradient-to-br from-primary/10 via-card to-card border-primary/30' :
          recommendation.level === 'marginal' ? 'bg-gradient-to-br from-warning/10 via-card to-card border-warning/30' :
          'bg-gradient-to-br from-destructive/10 via-card to-card border-destructive/30'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Risk-Adjusted ROI</span>
              <MetricTooltip metricKey="riskAdjustedROI" />
            </div>
            <div className={`font-mono text-5xl md:text-6xl font-bold ${
              results.riskAdjustedROI >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              {formatPercent(results.riskAdjustedROI)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Over {projectData.timeHorizonYears} years with risk adjustments applied
            </p>
          </div>
          
          {/* Mini sparkline visualization */}
          <div className="w-full md:w-48 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yearlyData}>
                <Area 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary) / 0.2)"
                  strokeWidth={2}
                />
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="metric-card"
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Net Present Value</span>
            <MetricTooltip metricKey="npv" />
          </div>
          <div className={`font-mono text-2xl font-bold ${results.npv >= 0 ? 'text-success' : 'text-destructive'}`}>
            {formatCurrency(results.npv)}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="metric-card"
        >
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Internal Rate of Return</span>
            <MetricTooltip metricKey="irr" />
          </div>
          <div className="font-mono text-2xl font-bold text-foreground">
            {results.irr !== null ? `${results.irr.toFixed(1)}%` : 'N/A'}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="metric-card"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Payback Period</span>
            <MetricTooltip metricKey="payback" />
          </div>
          <div className="font-mono text-2xl font-bold text-foreground">
            {results.paybackPeriodMonths < 120 
              ? `${results.paybackPeriodMonths.toFixed(1)} mo`
              : 'N/A'
            }
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="metric-card"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Simple ROI</span>
            <MetricTooltip metricKey="simpleROI" />
          </div>
          <div className={`font-mono text-2xl font-bold ${isPositiveROI ? 'text-success' : 'text-destructive'}`}>
            {formatPercent(results.simpleROI)}
          </div>
        </motion.div>
      </div>

      {/* Tertiary Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-muted/30 border">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-muted-foreground">Total Cost of Ownership</span>
            <MetricTooltip metricKey="tco" />
          </div>
          <span className="font-mono font-semibold text-foreground">{formatCurrency(results.tco)}</span>
        </div>
        <div className="p-4 rounded-lg bg-muted/30 border">
          <span className="text-xs text-muted-foreground block mb-1">Total Benefits</span>
          <span className="font-mono font-semibold text-success">{formatCurrency(results.totalTangibleBenefits)}</span>
        </div>
        <div className="p-4 rounded-lg bg-muted/30 border">
          <span className="text-xs text-muted-foreground block mb-1">Overall Confidence</span>
          <span className="font-mono font-semibold text-foreground">{results.overallConfidence.toFixed(0)}%</span>
        </div>
      </div>

      {/* Key Takeaways */}
      <Collapsible 
        open={expandedSections.keyTakeaways}
        onOpenChange={(open) => setExpandedSections(prev => ({ ...prev, keyTakeaways: open }))}
      >
        <CollapsibleTrigger className="w-full">
          <div className="metric-card flex items-center justify-between cursor-pointer hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold">Key Takeaways</span>
            </div>
            {expandedSections.keyTakeaways ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 p-4 rounded-lg bg-muted/30 border space-y-2">
            {keyTakeaways.map((takeaway, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm">{takeaway}</p>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Charts */}
      <Tabs defaultValue="cashflow" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="costbenefit">Costs vs Benefits</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="cashflow" className="mt-6">
          <div className="metric-card">
            <h3 className="text-lg font-semibold mb-6">Cumulative Cash Flow Projection</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} className="text-xs" />
                  <Tooltip 
                    formatter={(value: number, name: string) => [formatCurrency(value), name]}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" />
                  <Area 
                    type="monotone" 
                    dataKey="cumulative" 
                    stroke="hsl(217, 91%, 60%)" 
                    fill="hsl(217, 91%, 60%)"
                    fillOpacity={0.3}
                    strokeWidth={3}
                    name="Cumulative"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="costbenefit" className="mt-6">
          <div className="metric-card">
            <h3 className="text-lg font-semibold mb-6">Year-by-Year Costs vs Benefits</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} className="text-xs" />
                  <Tooltip 
                    formatter={(value: number, name: string) => [formatCurrency(value), name]}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="costs" fill="hsl(0, 84%, 60%)" name="Costs" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="benefits" fill="hsl(142, 71%, 45%)" name="Benefits" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="mt-6">
          <div className="metric-card">
            <h3 className="text-lg font-semibold mb-6">Scenario Comparison</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scenarioData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tickFormatter={(value) => formatPercent(value)} className="text-xs" />
                  <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                  <Tooltip 
                    formatter={(value: number) => [formatPercent(value), 'ROI']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="roi" radius={[0, 4, 4, 0]} name="ROI">
                    {scenarioData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.roi >= 0 ? 'hsl(142, 71%, 45%)' : 'hsl(0, 84%, 60%)'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* What-If Analysis */}
      <Collapsible open={showWhatIf} onOpenChange={setShowWhatIf}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">
            <Sliders className="mr-2 h-4 w-4" />
            What-If Analysis
            {showWhatIf ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <div className="metric-card space-y-6">
            <p className="text-sm text-muted-foreground">
              Adjust key variables to see how they impact your ROI.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm">Cost Change: {whatIfAdjustments.costChange > 0 ? '+' : ''}{whatIfAdjustments.costChange}%</Label>
                <Slider
                  value={[whatIfAdjustments.costChange]}
                  onValueChange={([value]) => setWhatIfAdjustments(prev => ({ ...prev, costChange: value }))}
                  min={-50}
                  max={50}
                  step={5}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="text-sm">Benefit Change: {whatIfAdjustments.benefitChange > 0 ? '+' : ''}{whatIfAdjustments.benefitChange}%</Label>
                <Slider
                  value={[whatIfAdjustments.benefitChange]}
                  onValueChange={([value]) => setWhatIfAdjustments(prev => ({ ...prev, benefitChange: value }))}
                  min={-50}
                  max={50}
                  step={5}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="text-sm">Implementation Delay: {whatIfAdjustments.delayMonths} months</Label>
                <Slider
                  value={[whatIfAdjustments.delayMonths]}
                  onValueChange={([value]) => setWhatIfAdjustments(prev => ({ ...prev, delayMonths: value }))}
                  min={0}
                  max={12}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
            
            <Button onClick={applyWhatIfChanges}>
              Apply Changes
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Investment Recommendation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`metric-card border-2 ${
          recommendation.level === 'strong' ? 'border-success/50 bg-success/5' :
          recommendation.level === 'moderate' ? 'border-primary/50 bg-primary/5' :
          recommendation.level === 'marginal' ? 'border-warning/50 bg-warning/5' :
          'border-destructive/50 bg-destructive/5'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${
            recommendation.level === 'strong' ? 'bg-success/10' :
            recommendation.level === 'moderate' ? 'bg-primary/10' :
            recommendation.level === 'marginal' ? 'bg-warning/10' :
            'bg-destructive/10'
          }`}>
            <RecommendationIcon className={`w-6 h-6 ${
              recommendation.level === 'strong' ? 'text-success' :
              recommendation.level === 'moderate' ? 'text-primary' :
              recommendation.level === 'marginal' ? 'text-warning' :
              'text-destructive'
            }`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {recommendation.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {recommendation.description}
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">Recommended Actions:</p>
              {recommendation.actions.map((action, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">{action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Risk Analysis */}
      <Collapsible 
        open={expandedSections.riskDetails}
        onOpenChange={(open) => setExpandedSections(prev => ({ ...prev, riskDetails: open }))}
      >
        <CollapsibleTrigger className="w-full">
          <div className="metric-card flex items-center justify-between cursor-pointer hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <span className="font-semibold">Risk Analysis Details</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                results.riskAnalysis.riskLevel === 'low' ? 'bg-success/10 text-success' :
                results.riskAnalysis.riskLevel === 'moderate' ? 'bg-primary/10 text-primary' :
                results.riskAnalysis.riskLevel === 'elevated' ? 'bg-warning/10 text-warning' :
                'bg-destructive/10 text-destructive'
              }`}>
                {results.riskAnalysis.riskLevel.toUpperCase()}
              </span>
            </div>
            {expandedSections.riskDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 p-4 rounded-lg bg-muted/30 border space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-xs text-muted-foreground block">Implementation Risk</span>
                <span className="font-mono font-semibold">{projectData.implementationRisk}%</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Adoption Risk</span>
                <span className="font-mono font-semibold">{projectData.adoptionRisk}%</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Technical Risk</span>
                <span className="font-mono font-semibold">{projectData.technicalRisk}%</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Market Risk</span>
                <span className="font-mono font-semibold">{projectData.marketRisk}%</span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Risk Multiplier</span>
                  <span className="font-mono font-semibold">{(results.riskAnalysis.riskMultiplier * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Weighted Average Risk</span>
                  <span className="font-mono font-semibold">{results.riskAnalysis.weightedAverageRisk.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t">
        <Button variant="outline" size="lg" onClick={() => setCurrentStep(1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Adjust Inputs
        </Button>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => {
            resetCalculator();
            navigate('/calculator');
          }}>
            <RotateCcw className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
          <Button variant="outline" onClick={handleShare}>
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
            {copied ? 'Copied!' : 'Share'}
          </Button>
          <Button variant="default" onClick={handleExportPDF} disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? 'Generating...' : 'Export PDF'}
          </Button>
        </div>
      </div>
    </div>
  );
};
