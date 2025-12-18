import { motion } from 'framer-motion';
import { 
  Calculator, 
  PieChart, 
  LineChart, 
  ShieldCheck, 
  Sparkles,
  FileText 
} from 'lucide-react';

const features = [
  {
    icon: Calculator,
    title: 'Holistic ROI Calculation',
    description: 'Calculate comprehensive ROI including NPV, IRR, payback period, and risk-adjusted returns.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: PieChart,
    title: 'Intangible Benefits Scoring',
    description: 'Quantify hard-to-measure benefits like improved decision-making and employee productivity.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: LineChart,
    title: 'Monte Carlo Simulation',
    description: '10,000 iterations for robust risk analysis and probability distributions.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    icon: ShieldCheck,
    title: 'Risk Assessment',
    description: 'Comprehensive risk analysis covering implementation, adoption, technical, and market risks.',
    color: 'text-destructive',
    bg: 'bg-destructive/10',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Insights',
    description: 'Get intelligent recommendations and optimization opportunities from GPT-4 analysis.',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: FileText,
    title: 'Professional Reports',
    description: 'Generate executive summaries and detailed reports in PDF, Excel, and PowerPoint.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Enterprise-Grade Value Analysis
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to make data-driven AI investment decisions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="metric-card group hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
