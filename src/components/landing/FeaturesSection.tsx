import { motion } from 'framer-motion';
import { 
  Calculator, 
  Brain, 
  LineChart, 
  ShieldCheck, 
  Sparkles,
  FileText,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';

const topFeatures = [
  {
    icon: Calculator,
    title: 'Holistic Financial Metrics',
    description: 'ROI, NPV, IRR, payback period, and risk-adjusted returns—all calculated automatically from your inputs.',
    highlights: ['ROI %', 'NPV', 'IRR', 'Payback Period', 'Risk-Adjusted ROI'],
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Sparkles,
    title: 'Intangible Benefits Scoring',
    description: 'Quantify hard-to-measure benefits like customer satisfaction, decision speed, and employee retention.',
    highlights: ['Customer Experience', 'Decision Quality', 'Employee Satisfaction', 'Brand Value'],
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Brain,
    title: 'AI Research Engine',
    description: 'Automatically pull benchmark assumptions, vendor options, and common pitfalls based on your industry and use case.',
    highlights: ['Industry Benchmarks', 'Vendor Comparison', 'Cost Ranges', 'Risk Factors'],
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
];

const secondaryFeatures = [
  {
    icon: ShieldCheck,
    title: 'Scenario & Risk Analysis',
    description: 'Explore optimistic, realistic, and conservative scenarios with risk sliders and sensitivity analysis.',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    icon: FileText,
    title: 'Exportable Reports',
    description: 'Generate professional PDF reports and spreadsheets to share with stakeholders.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Target,
    title: 'Industry Templates',
    description: 'Pre-configured templates for common AI use cases across industries.',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="section-spacing bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why This Beats a Spreadsheet
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade financial analysis without the complexity
          </p>
        </motion.div>

        {/* Top 3 Features - Large Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {topFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="metric-card group hover:-translate-y-1 transition-transform duration-200"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {feature.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {feature.highlights.map((highlight) => (
                  <span 
                    key={highlight}
                    className="px-2.5 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Secondary Features - Smaller Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {secondaryFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              className="p-5 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg ${feature.bg} flex items-center justify-center shrink-0`}>
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};