import { motion } from 'framer-motion';
import { 
  Calculator, 
  Brain, 
  ShieldCheck, 
  FileText,
  Target,
  Users
} from 'lucide-react';

const topFeatures = [
  {
    icon: Calculator,
    title: 'Finance-Grade Modeling',
    description: 'Standard ROI, NPV, IRR, and payback calculations used by CFOs.',
    tags: ['ROI %', 'NPV', 'IRR', 'Payback'],
  },
  {
    icon: Brain,
    title: 'AI Research Engine',
    description: 'Pull benchmark assumptions and vendor options based on your industry.',
    tags: ['Benchmarks', 'Vendors', 'Costs'],
  },
  {
    icon: ShieldCheck,
    title: 'Risk-Adjusted Scenarios',
    description: 'Conservative, base, and optimistic projections with probability weights.',
    tags: ['Scenarios', 'Risk', 'Sensitivity'],
  },
];

const secondaryFeatures = [
  {
    icon: FileText,
    title: 'PDF & Excel Export',
    description: 'Generate shareable reports for stakeholders.',
  },
  {
    icon: Target,
    title: 'Industry Templates',
    description: 'Pre-configured for common AI use cases.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Share analyses with your team (coming soon).',
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="section-spacing bg-background">
      <div className="container mx-auto px-6 max-w-6xl">
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
          <p className="text-muted-foreground max-w-xl mx-auto">
            Structured financial analysis without the complexity
          </p>
        </motion.div>

        {/* Top 3 Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {topFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card-level-2 p-6 card-hover"
            >
              <div className="icon-container w-10 h-10 mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {feature.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {feature.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Secondary Features */}
        <div className="grid md:grid-cols-3 gap-4">
          {secondaryFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              className="card-level-3 p-4 flex items-start gap-3"
            >
              <div className="icon-container w-9 h-9 shrink-0">
                <feature.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm mb-0.5">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-xs">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
