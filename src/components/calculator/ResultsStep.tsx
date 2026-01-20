import { useCalculatorStore } from '@/store/calculatorStore';
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
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
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = ['hsl(217, 91%, 60%)', 'hsl(160, 84%, 39%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)'];

interface ResultsStepProps {
  isDemo?: boolean;
  onExitDemo?: () => void;
}

export const ResultsStep = ({ isDemo = false, onExitDemo }: ResultsStepProps) => {
  const { results, projectData, setCurrentStep, resetCalculator } = useCalculatorStore();
  const navigate = useNavigate();

  if (!results) {
    return (
      <div className="text-center py-12">
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

  const costBenefitData = [
    { name: 'Total Costs', value: results.totalCosts, fill: 'hsl(0, 84%, 60%)' },
    { name: 'Tangible Benefits', value: results.totalTangibleBenefits, fill: 'hsl(160, 84%, 39%)' },
    { name: 'Intangible Value', value: results.totalIntangibleValue, fill: 'hsl(217, 91%, 60%)' },
  ];

  const yearlyData = results.yearlyProjections.map((proj) => ({
    name: `Year ${proj.year}`,
    costs: proj.costs,
    benefits: proj.benefits,
    cumulative: proj.cumulative,
    roi: proj.roi,
  }));

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className={`w-16 h-16 rounded-2xl ${isPositiveROI ? 'bg-success/10' : 'bg-destructive/10'} flex items-center justify-center mx-auto mb-4`}>
          {isPositiveROI ? (
            <TrendingUp className="w-8 h-8 text-success" />
          ) : (
            <TrendingDown className="w-8 h-8 text-destructive" />
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Analysis Results
        </h1>
        <p className="text-muted-foreground">
          {projectData.projectName} - {projectData.timeHorizonYears} Year Projection
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Simple ROI</span>
          </div>
          <div className={`font-mono text-2xl font-bold ${isPositiveROI ? 'text-success' : 'text-destructive'}`}>
            {formatPercent(results.simpleROI)}
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Net Present Value</span>
          </div>
          <div className={`font-mono text-2xl font-bold ${results.npv >= 0 ? 'text-success' : 'text-destructive'}`}>
            {formatCurrency(results.npv)}
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Payback Period</span>
          </div>
          <div className="font-mono text-2xl font-bold text-foreground">
            {results.paybackPeriodMonths < 120 
              ? `${results.paybackPeriodMonths.toFixed(1)} mo`
              : 'N/A'
            }
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Risk-Adjusted ROI</span>
          </div>
          <div className={`font-mono text-2xl font-bold ${results.riskAdjustedROI >= 0 ? 'text-primary' : 'text-destructive'}`}>
            {formatPercent(results.riskAdjustedROI)}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-muted/30 border">
          <span className="text-xs text-muted-foreground block mb-1">Total Cost of Ownership</span>
          <span className="font-mono font-semibold text-foreground">{formatCurrency(results.tco)}</span>
        </div>
        <div className="p-4 rounded-lg bg-muted/30 border">
          <span className="text-xs text-muted-foreground block mb-1">Internal Rate of Return</span>
          <span className="font-mono font-semibold text-foreground">{results.irr.toFixed(1)}%</span>
        </div>
        <div className="p-4 rounded-lg bg-muted/30 border">
          <span className="text-xs text-muted-foreground block mb-1">Soft ROI Score</span>
          <span className="font-mono font-semibold text-primary">{results.softROIScore.toFixed(0)}/100</span>
        </div>
        <div className="p-4 rounded-lg bg-muted/30 border">
          <span className="text-xs text-muted-foreground block mb-1">Overall Confidence</span>
          <span className="font-mono font-semibold text-foreground">{results.overallConfidence.toFixed(0)}%</span>
        </div>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="metric-card">
            <h3 className="text-lg font-semibold mb-6">Cost vs Benefits</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costBenefitData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    type="number" 
                    tickFormatter={(value) => formatCurrency(value)}
                    className="text-xs"
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={120}
                    className="text-xs"
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), '']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {costBenefitData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projections" className="mt-6">
          <div className="metric-card">
            <h3 className="text-lg font-semibold mb-6">Year-by-Year Projections</h3>
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
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="benefits" 
                    stackId="1"
                    stroke="hsl(160, 84%, 39%)" 
                    fill="hsl(160, 84%, 39%)"
                    fillOpacity={0.6}
                    name="Benefits"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="costs" 
                    stackId="2"
                    stroke="hsl(0, 84%, 60%)" 
                    fill="hsl(0, 84%, 60%)"
                    fillOpacity={0.6}
                    name="Costs"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="mt-6">
          <div className="metric-card">
            <h3 className="text-lg font-semibold mb-6">Cumulative Cash Flow</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyData}>
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
                  <Line 
                    type="monotone" 
                    dataKey="cumulative" 
                    stroke="hsl(217, 91%, 60%)" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(217, 91%, 60%)', strokeWidth: 2 }}
                    name="Cumulative"
                  />
                  <Line 
                    type="monotone" 
                    dataKey={() => 0}
                    stroke="hsl(var(--border))" 
                    strokeDasharray="5 5"
                    strokeWidth={1}
                    dot={false}
                    name="Break-even"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Investment Recommendation */}
      <div className={`metric-card ${isPositiveROI ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
        <div className="flex items-start gap-4">
          {isPositiveROI ? (
            <TrendingUp className="w-8 h-8 text-success shrink-0" />
          ) : (
            <TrendingDown className="w-8 h-8 text-destructive shrink-0" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isPositiveROI ? 'Positive Investment Outlook' : 'Investment Caution Advised'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isPositiveROI 
                ? `Based on your inputs, this AI investment shows a ${formatPercent(results.simpleROI)} ROI over ${projectData.timeHorizonYears} years. With a payback period of ${results.paybackPeriodMonths.toFixed(1)} months and risk-adjusted ROI of ${formatPercent(results.riskAdjustedROI)}, this appears to be a financially sound investment.`
                : `Based on your inputs, this AI investment shows a negative ROI of ${formatPercent(results.simpleROI)}. Consider revising cost estimates, identifying additional benefits, or exploring alternative implementations.`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Button variant="outline" size="lg" onClick={() => setCurrentStep(4)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Adjust Inputs
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => {
            resetCalculator();
            navigate('/calculator');
          }}>
            <RotateCcw className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
          <Button variant="default">
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="hero">
            <Share2 className="mr-2 h-4 w-4" />
            Share Results
          </Button>
        </div>
      </div>
    </div>
  );
};
