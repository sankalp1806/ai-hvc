import { useState } from 'react';
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
  LineChart,
  PieChart,
  AlertCircle,
  Zap,
  Globe,
  Building2,
  Calendar,
  BookOpen,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalysisReport } from './types';

interface AnalysisReportViewProps {
  report: AnalysisReport;
  onReset: () => void;
}

export const AnalysisReportView = ({ report, onReset }: AnalysisReportViewProps) => {
  const [expandedProviders, setExpandedProviders] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(['executive']);

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

  const getRiskColor = (level: string) => {
    const lower = level.toLowerCase();
    if (lower === 'low') return 'bg-success/10 text-success border-success/20';
    if (lower === 'medium') return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-destructive/10 text-destructive border-destructive/20';
  };

  const getConfidenceColor = (level: string) => {
    const lower = level.toLowerCase();
    if (lower === 'high') return 'text-success';
    if (lower === 'medium') return 'text-warning';
    return 'text-destructive';
  };

  const SectionHeader = ({ 
    id, 
    icon: Icon, 
    title, 
    subtitle 
  }: { 
    id: string; 
    icon: React.ElementType; 
    title: string; 
    subtitle?: string;
  }) => (
    <div 
      className="flex items-center justify-between cursor-pointer p-4 hover:bg-muted/50 rounded-t-lg transition-colors"
      onClick={() => toggleSection(id)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {expandedSections.includes(id) ? (
        <ChevronUp className="w-5 h-5 text-muted-foreground" />
      ) : (
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Reset */}
      <div className="metric-card">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Analysis Complete</h2>
              <p className="text-sm text-muted-foreground">
                {report.contextOverview.scenarioSummary.industry} • {report.contextOverview.scenarioSummary.serviceType}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onReset}>
            New Analysis
          </Button>
        </div>
      </div>

      {/* Section 1: Validation Summary */}
      {report.validationSummary.issues.length > 0 && (
        <div className="metric-card border-warning/50">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h3 className="font-semibold text-foreground">Input Validation Notes</h3>
          </div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {report.validationSummary.issues.map((issue, idx) => (
              <li key={idx}>• {issue}</li>
            ))}
          </ul>
          {report.validationSummary.handlingNotes && (
            <p className="mt-2 text-sm text-muted-foreground">{report.validationSummary.handlingNotes}</p>
          )}
        </div>
      )}

      {/* Section 2: Context Overview */}
      <div className="metric-card">
        <SectionHeader id="context" icon={Globe} title="Context & Scenario Overview" />
        <AnimatePresence>
          {expandedSections.includes('context') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Scenario Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Industry</span>
                      <span className="text-foreground">{report.contextOverview.scenarioSummary.industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">AI Service</span>
                      <span className="text-foreground">{report.contextOverview.scenarioSummary.serviceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Company Size</span>
                      <span className="text-foreground">{report.contextOverview.scenarioSummary.companySize}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground mb-2">Key Goals</p>
                    <div className="flex flex-wrap gap-1">
                      {report.contextOverview.scenarioSummary.keyGoals.map((goal, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{goal}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Location & Regional Context</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Region</span>
                      <span className="text-foreground">{report.contextOverview.locationContext.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Currency</span>
                      <span className="text-foreground">{report.contextOverview.locationContext.currency}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">{report.contextOverview.locationContext.regulatoryEnvironment}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section 3: Executive Summary */}
      <div className="metric-card border-primary/30">
        <SectionHeader id="executive" icon={Target} title="Executive Summary" subtitle="Key findings and recommendations" />
        <AnimatePresence>
          {expandedSections.includes('executive') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4"
            >
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-4">
                <p className="text-foreground font-medium">{report.executiveSummary.overallRecommendation}</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">ROI Range</p>
                  <p className="text-lg font-semibold text-success">
                    {report.executiveSummary.roiRange.conservative} - {report.executiveSummary.roiRange.optimistic}
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Payback Period</p>
                  <p className="text-lg font-semibold text-foreground">{report.executiveSummary.paybackPeriod}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Confidence Level</p>
                  <p className={`text-lg font-semibold capitalize ${getConfidenceColor(report.executiveSummary.confidenceLevel)}`}>
                    {report.executiveSummary.confidenceLevel}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Key Takeaways</h4>
                  <ul className="space-y-2">
                    {report.executiveSummary.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {takeaway}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Biggest Risks</h4>
                  <div className="flex flex-wrap gap-2">
                    {report.executiveSummary.biggestRisks.map((risk, idx) => (
                      <Badge key={idx} variant="outline" className="border-destructive/30 text-destructive">
                        <AlertCircle className="w-3 h-3 mr-1" /> {risk}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section 4: Key Metrics */}
      <div className="metric-card">
        <SectionHeader id="metrics" icon={BarChart3} title="Key Metrics Overview" />
        <AnimatePresence>
          {expandedSections.includes('metrics') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4"
            >
              <Tabs defaultValue="financial" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                  <TabsTrigger value="operational">Operational</TabsTrigger>
                  <TabsTrigger value="adoption">Adoption</TabsTrigger>
                </TabsList>
                <TabsContent value="financial">
                  <div className="grid md:grid-cols-2 gap-3">
                    {report.keyMetrics.financial.map((metric, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-border">
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-muted-foreground">{metric.name}</span>
                          {metric.timeHorizon && (
                            <Badge variant="outline" className="text-xs">{metric.timeHorizon}</Badge>
                          )}
                        </div>
                        <p className="text-lg font-mono font-semibold text-foreground mt-1">
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="operational">
                  <div className="grid md:grid-cols-2 gap-3">
                    {report.keyMetrics.operational.map((metric, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-border">
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-muted-foreground">{metric.name}</span>
                          {metric.timeHorizon && (
                            <Badge variant="outline" className="text-xs">{metric.timeHorizon}</Badge>
                          )}
                        </div>
                        <p className="text-lg font-mono font-semibold text-foreground mt-1">
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="adoption">
                  <div className="grid md:grid-cols-2 gap-3">
                    {report.keyMetrics.adoption.map((metric, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-border">
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-muted-foreground">{metric.name}</span>
                          {metric.timeHorizon && (
                            <Badge variant="outline" className="text-xs">{metric.timeHorizon}</Badge>
                          )}
                        </div>
                        <p className="text-lg font-mono font-semibold text-foreground mt-1">
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section 5: Visualized Results */}
      <div className="metric-card">
        <SectionHeader id="visuals" icon={LineChart} title="Visualized Results" subtitle="Chart descriptions for key data" />
        <AnimatePresence>
          {expandedSections.includes('visuals') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4"
            >
              <div className="grid gap-4">
                {report.visualDescriptions.map((chart, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-border bg-muted/30">
                    <div className="flex items-center gap-2 mb-2">
                      {chart.chartType.toLowerCase().includes('line') && <LineChart className="w-4 h-4 text-primary" />}
                      {chart.chartType.toLowerCase().includes('bar') && <BarChart3 className="w-4 h-4 text-primary" />}
                      {chart.chartType.toLowerCase().includes('pie') && <PieChart className="w-4 h-4 text-primary" />}
                      {!chart.chartType.toLowerCase().includes('line') && 
                       !chart.chartType.toLowerCase().includes('bar') && 
                       !chart.chartType.toLowerCase().includes('pie') && <BarChart3 className="w-4 h-4 text-primary" />}
                      <h4 className="font-medium text-foreground">{chart.title}</h4>
                      <Badge variant="secondary" className="text-xs">{chart.chartType}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{chart.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>X-Axis: {chart.xAxis}</span>
                      <span>Y-Axis: {chart.yAxis}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section 6: Comparative Analysis */}
      {report.comparativeAnalysis.applicable && (
        <div className="metric-card">
          <SectionHeader id="comparative" icon={Target} title="Comparative Analysis" />
          <AnimatePresence>
            {expandedSections.includes('comparative') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4"
              >
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Option</th>
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Cost</th>
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">ROI</th>
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Complexity</th>
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Risk</th>
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Best For</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.comparativeAnalysis.comparisonMatrix.map((row, idx) => (
                        <tr key={idx} className="border-b border-border/50">
                          <td className="py-2 px-3 font-medium text-foreground">{row.option}</td>
                          <td className="py-2 px-3 text-muted-foreground">{row.cost}</td>
                          <td className="py-2 px-3 text-success">{row.roi}</td>
                          <td className="py-2 px-3">
                            <Badge className={getRiskColor(row.complexity)}>{row.complexity}</Badge>
                          </td>
                          <td className="py-2 px-3">
                            <Badge className={getRiskColor(row.risk)}>{row.risk}</Badge>
                          </td>
                          <td className="py-2 px-3 text-muted-foreground text-xs">{row.bestFor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Best for Low Budget</p>
                    <p className="text-sm text-foreground">{report.comparativeAnalysis.bestForLowBudget}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Best for Fast Implementation</p>
                    <p className="text-sm text-foreground">{report.comparativeAnalysis.bestForFastImplementation}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Best for Maximum Upside</p>
                    <p className="text-sm text-foreground">{report.comparativeAnalysis.bestForMaximumUpside}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Section 7: Solution Providers */}
      <div className="metric-card">
        <SectionHeader id="providers" icon={Building2} title="Solution Providers" subtitle={`${report.solutionProviders.length} providers analyzed`} />
        <AnimatePresence>
          {expandedSections.includes('providers') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4"
            >
              <div className="space-y-4">
                {report.solutionProviders.map((provider, idx) => (
                  <div key={idx} className="border border-border rounded-lg overflow-hidden">
                    <div 
                      className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleProvider(provider.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-foreground">{provider.name}</h4>
                            <Badge variant="secondary" className="text-xs">{provider.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{provider.description}</p>
                        </div>
                        {expandedProviders.includes(provider.name) ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
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
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-medium text-success mb-2">Strengths</h5>
                                <ul className="text-sm space-y-1">
                                  {provider.strengths.map((s, i) => (
                                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                      <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                      {s}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-warning mb-2">Trade-offs</h5>
                                <ul className="text-sm space-y-1">
                                  {provider.tradeoffs.map((t, i) => (
                                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                      <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                                      {t}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div>
                              <h5 className="text-sm font-medium text-foreground mb-2">Pricing Tiers</h5>
                              <div className="grid gap-3">
                                {provider.pricingTiers.map((tier, i) => (
                                  <div key={i} className="p-3 rounded-lg bg-muted/50">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium text-foreground">{tier.tierName}</span>
                                      <span className="text-sm font-mono text-primary">{tier.price}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {tier.features.slice(0, 4).map((f, fi) => (
                                        <Badge key={fi} variant="outline" className="text-xs">{f}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {provider.websiteUrl && (
                              <Button variant="outline" size="sm" asChild>
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section 8: Cost & Budget Impact */}
      <div className="metric-card">
        <SectionHeader id="costs" icon={DollarSign} title="Cost & Budget Impact" />
        <AnimatePresence>
          {expandedSections.includes('costs') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4"
            >
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">One-Time Costs</h4>
                  <div className="space-y-2">
                    {report.costBudgetImpact.costBreakdown.oneTime.map((cost, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{cost.category}</span>
                        <span className="font-mono text-foreground">{cost.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Recurring Costs</h4>
                  <div className="space-y-2">
                    {report.costBudgetImpact.costBreakdown.recurring.map((cost, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{cost.category}</span>
                        <span className="font-mono text-foreground">{cost.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 p-4 rounded-lg bg-muted/50">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Year 1 Total</p>
                  <p className="font-mono font-semibold text-foreground">{report.costBudgetImpact.yearOneTotal}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Year 2 Total</p>
                  <p className="font-mono font-semibold text-foreground">{report.costBudgetImpact.yearTwoTotal}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Year 3 Total</p>
                  <p className="font-mono font-semibold text-foreground">{report.costBudgetImpact.yearThreeTotal}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Total TCO</p>
                  <p className="font-mono font-semibold text-primary">{report.costBudgetImpact.totalTCO}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section 9: Timeline */}
      <div className="metric-card">
        <SectionHeader id="timeline" icon={Calendar} title="Timeline & Implementation Roadmap" />
        <AnimatePresence>
          {expandedSections.includes('timeline') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4"
            >
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-warning" />
                    <h4 className="font-medium text-foreground">Fast Track</h4>
                  </div>
                  <p className="text-sm font-mono text-primary mb-2">{report.timeline.overviewOptions.fastTrack.duration}</p>
                  <p className="text-xs text-muted-foreground">{report.timeline.overviewOptions.fastTrack.tradeoffs}</p>
                </div>
                <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-primary" />
                    <h4 className="font-medium text-foreground">Standard</h4>
                  </div>
                  <p className="text-sm font-mono text-primary mb-2">{report.timeline.overviewOptions.standard.duration}</p>
                  <p className="text-xs text-muted-foreground">{report.timeline.overviewOptions.standard.tradeoffs}</p>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-success" />
                    <h4 className="font-medium text-foreground">Comprehensive</h4>
                  </div>
                  <p className="text-sm font-mono text-primary mb-2">{report.timeline.overviewOptions.comprehensive.duration}</p>
                  <p className="text-xs text-muted-foreground">{report.timeline.overviewOptions.comprehensive.tradeoffs}</p>
                </div>
              </div>

              <div className="space-y-4">
                {report.timeline.phases.map((phase, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        {idx + 1}
                      </div>
                      {idx < report.timeline.phases.length - 1 && (
                        <div className="w-0.5 flex-1 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{phase.phaseName}</h4>
                        <Badge variant="outline" className="text-xs">{phase.duration}</Badge>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1 mb-2">
                        {phase.activities.map((activity, aIdx) => (
                          <li key={aIdx}>• {activity}</li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-1">
                        {phase.deliverables.map((d, dIdx) => (
                          <Badge key={dIdx} variant="secondary" className="text-xs">{d}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section 10: Risks & Sensitivity */}
      <div className="metric-card">
        <SectionHeader id="risks" icon={Shield} title="Risks, Constraints & Sensitivity Analysis" />
        <AnimatePresence>
          {expandedSections.includes('risks') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4"
            >
              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-3">Key Risks</h4>
                <div className="space-y-3">
                  {report.risksAndSensitivity.risks.map((risk, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{risk.category}</Badge>
                        <Badge className={getRiskColor(risk.likelihood)}>Likelihood: {risk.likelihood}</Badge>
                        <Badge className={getRiskColor(risk.impact)}>Impact: {risk.impact}</Badge>
                      </div>
                      <p className="text-sm text-foreground mb-2">{risk.risk}</p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Mitigation:</strong> {risk.mitigation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Sensitivity Analysis</h4>
                <div className="space-y-2">
                  {report.risksAndSensitivity.sensitivityAnalysis.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.assumption}</p>
                          <p className="text-xs text-muted-foreground">Base case: {item.baseCase}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{item.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section 11: Insights & Recommendations */}
      <div className="metric-card border-success/30">
        <SectionHeader id="insights" icon={Lightbulb} title="Insights & Recommendations" />
        <AnimatePresence>
          {expandedSections.includes('insights') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4"
            >
              <div className="p-4 rounded-lg bg-success/5 border border-success/20 mb-6">
                <p className="text-foreground font-medium">{report.insightsRecommendations.overallVerdict}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-3">Prioritized Actions</h4>
                <div className="space-y-3">
                  {report.insightsRecommendations.prioritizedActions.map((action) => (
                    <div key={action.priority} className="p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                          {action.priority}
                        </div>
                        <span className="font-medium text-foreground">{action.action}</span>
                        <Badge className={getRiskColor(action.effort === 'High' ? 'high' : action.effort === 'Medium' ? 'medium' : 'low')}>
                          Effort: {action.effort}
                        </Badge>
                        <Badge className={action.impact === 'High' ? 'bg-success/10 text-success' : action.impact === 'Medium' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}>
                          Impact: {action.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{action.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Immediate (0-3 months)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {report.insightsRecommendations.immediateNextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Medium-term (3-12 months)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {report.insightsRecommendations.mediumTermSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Long-term (1-3 years)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {report.insightsRecommendations.longTermConsiderations.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="text-sm font-medium text-foreground mb-3">By Budget Level</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong className="text-muted-foreground">Low:</strong> <span className="text-foreground">{report.insightsRecommendations.byBudgetLevel.lowBudget}</span></div>
                    <div><strong className="text-muted-foreground">Medium:</strong> <span className="text-foreground">{report.insightsRecommendations.byBudgetLevel.mediumBudget}</span></div>
                    <div><strong className="text-muted-foreground">High:</strong> <span className="text-foreground">{report.insightsRecommendations.byBudgetLevel.highBudget}</span></div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="text-sm font-medium text-foreground mb-3">By Risk Appetite</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong className="text-muted-foreground">Conservative:</strong> <span className="text-foreground">{report.insightsRecommendations.byRiskAppetite.conservative}</span></div>
                    <div><strong className="text-muted-foreground">Balanced:</strong> <span className="text-foreground">{report.insightsRecommendations.byRiskAppetite.balanced}</span></div>
                    <div><strong className="text-muted-foreground">Aggressive:</strong> <span className="text-foreground">{report.insightsRecommendations.byRiskAppetite.aggressive}</span></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section 12: Methodology */}
      <div className="metric-card">
        <SectionHeader id="methodology" icon={BookOpen} title="Methodology, Data Sources & Assumptions" />
        <AnimatePresence>
          {expandedSections.includes('methodology') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4"
            >
              <p className="text-sm text-foreground mb-4">{report.methodology.approach}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Data Source Types</h4>
                  <div className="flex flex-wrap gap-1">
                    {report.methodology.dataSourceTypes.map((source, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{source}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Key Assumptions</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {report.methodology.keyAssumptions.map((a, idx) => (
                      <li key={idx}>• {a}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-foreground mb-2">Limitations</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {report.methodology.limitations.map((l, idx) => (
                    <li key={idx}>• {l}</li>
                  ))}
                </ul>
              </div>

              <p className="text-sm text-muted-foreground mt-4 italic">{report.methodology.confidenceNotes}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section 14: Footer/Metadata */}
      <div className="p-4 rounded-lg bg-muted/30 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Report Metadata</span>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
          <span>Time Horizon: {report.metadata.timeHorizon}</span>
          <span>Currency: {report.metadata.currency}</span>
          <span>Generated: {report.metadata.generatedDate}</span>
        </div>
        <p className="text-xs text-muted-foreground italic">{report.metadata.disclaimer}</p>
      </div>
    </div>
  );
};
