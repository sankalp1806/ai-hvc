import { motion } from 'framer-motion';
import {
  Calculator,
  Brain,
  ShieldCheck,
  FileText,
  Target,
  Users
} from 'lucide-react';
import { PageContainer, Section, Grid, Stack } from '@/components/layout/LayoutPrimitives';

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
    <Section id="features" spacing="default" className="bg-background">
      <PageContainer>
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
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Structured financial analysis without the complexity
          </p>
        </motion.div>

        {/* Top 3 Features */}
        <Grid cols={3} gap="lg" className="mb-16">
          {topFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                {feature.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {feature.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary-foreground border border-secondary/20">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </Grid>

        {/* Secondary Features */}
        <Grid cols={3} gap="md">
          {secondaryFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              className="bg-muted/30 border border-transparent hover:border-border rounded-lg p-5 flex items-start gap-4 transition-colors"
            >
              <div className="p-2 bg-background rounded-md shadow-sm shrink-0">
                <feature.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm mb-1">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </Grid>
      </PageContainer>
    </Section>
  );
};
