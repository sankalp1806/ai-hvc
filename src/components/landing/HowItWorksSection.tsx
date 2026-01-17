import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
    <section className="section-spacing bg-muted/30">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground">
            From inputs to insights in under 5 minutes
          </p>
        </motion.div>

        {/* Steps - Horizontal on Desktop */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connector line - desktop only */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-5 left-[calc(50%+32px)] w-[calc(100%-64px)] h-px bg-border" />
              )}
              
              <div className="flex flex-col items-center text-center">
                {/* Step number pill */}
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mb-4 font-mono text-sm font-semibold">
                  {step.number}
                </div>
                
                <h3 className="font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {step.bullets.map((bullet, i) => (
                    <li key={i}>• {bullet}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* What you'll do in 5 minutes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          viewport={{ once: true }}
          className="card-level-2 p-6 max-w-2xl mx-auto mb-10"
        >
          <h4 className="font-medium text-foreground mb-3 text-center">
            What you'll do in the next 5 minutes:
          </h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">→</span>
              Describe your use case and key assumptions
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">→</span>
              Enter expected costs and benefits
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">→</span>
              Review ROI, NPV, and risk-adjusted scenarios in a shareable report
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
            <Link to="/ai-roi-calculator">
              Start Free Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
