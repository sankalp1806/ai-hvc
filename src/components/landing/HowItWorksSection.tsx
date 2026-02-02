import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Section, PageContainer, Grid } from '@/components/layout/LayoutPrimitives';

const steps = [
  {
    number: '01',
    title: 'Describe Your Use Case',
    bullets: [
      'Select your industry and company size',
      'Choose the AI application type',
    ],
  },
  {
    number: '02',
    title: 'Enter Costs & Benefits',
    bullets: [
      'Implementation and operational costs',
      'Expected savings or revenue impact',
    ],
  },
  {
    number: '03',
    title: 'Review ROI Scenarios',
    bullets: [
      'See ROI, NPV, payback, and risk metrics',
      'Export or share your analysis',
    ],
  },
];

export const HowItWorksSection = () => {
  return (
    <Section className="bg-muted/30">
      <PageContainer size="default">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground">
            From inputs to insights in under 5 minutes
          </p>
        </motion.div>

        {/* Steps - Horizontal on Desktop */}
        <Grid cols={3} gap="lg" className="mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Connector line - desktop only */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-border/50 -z-10" />
              )}

              <div className="flex flex-col items-center text-center p-6 bg-background/50 rounded-2xl border border-border/50 hover:bg-background hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                {/* Step number pill */}
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-6 font-mono text-lg font-bold shadow-glow shadow-primary/20 group-hover:scale-110 transition-transform">
                  {step.number}
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {step.title}
                </h3>

                <ul className="space-y-2 text-sm text-muted-foreground">
                  {step.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-center justify-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </Grid>

        {/* What you'll do in 5 minutes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-xl p-8 max-w-3xl mx-auto mb-12 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
          <h4 className="font-semibold text-lg text-foreground mb-6 text-center">
            What you'll do in the next 5 minutes:
          </h4>
          <Grid cols={1} className="md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center gap-2">
              <span className="text-2xl">✍️</span>
              <span className="text-sm text-muted-foreground">Describe use case</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <span className="text-2xl">💰</span>
              <span className="text-sm text-muted-foreground">Enter costs/benefits</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <span className="text-2xl">📊</span>
              <span className="text-sm text-muted-foreground">Get ROI Report</span>
            </div>
          </Grid>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" asChild className="h-12 px-8 text-base shadow-lg shadow-primary/20">
            <Link to="/ai-roi-calculator">
              Start Free Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </PageContainer>
    </Section>
  );
};
