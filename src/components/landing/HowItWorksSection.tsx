import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const steps = [
  {
    number: '01',
    title: 'Describe Your Business & Use Case',
    description: 'Industry, company size, and the AI problem you\'re solving.',
    color: 'bg-primary',
  },
  {
    number: '02',
    title: 'Enter Costs & Expected Benefits',
    description: 'We guide you through typical cost categories and measurable outcomes.',
    color: 'bg-accent',
  },
  {
    number: '03',
    title: 'Review ROI With Risk & Scenarios',
    description: 'See ROI, NPV, payback, and risk-adjusted projections. Export or share.',
    color: 'bg-amber-500',
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="section-spacing bg-muted/30">
      <div className="container mx-auto px-6">
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From inputs to insights in minutes, not hours
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-border" />
              )}
              
              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <span className="font-mono text-2xl font-bold text-white">{step.number}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button variant="hero" size="lg" asChild>
            <Link to="/ai-roi-calculator">
              Start Your Analysis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};