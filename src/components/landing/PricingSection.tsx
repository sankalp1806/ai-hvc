import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Section, PageContainer, Grid } from '@/components/layout/LayoutPrimitives';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for exploring AI ROI',
    features: [
      'Up to 3 analyses per month',
      'Basic ROI & payback calculation',
      'Simple PDF export',
      'Core metrics dashboard',
    ],
    cta: 'Start Free',
    href: '/ai-roi-calculator',
    highlighted: false,
    clarifier: 'One analysis = one saved ROI scenario',
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'For serious AI investors',
    features: [
      'Unlimited analyses',
      'Full metrics (ROI, NPV, IRR)',
      'AI-powered research reports',
      'Risk-adjusted scenarios',
      'PDF & Excel export',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
    href: '/ai-roi-calculator',
    highlighted: true,
    clarifier: 'No credit card required for trial',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    priceSubtext: 'Starting at $299/mo',
    period: '',
    description: 'For organizations at scale',
    features: [
      'Everything in Pro',
      'Team collaboration & SSO',
      'Custom modeling templates',
      'API access & integrations',
      'Dedicated success manager',
    ],
    cta: 'Contact Sales',
    href: 'mailto:sales@roic.app',
    highlighted: false,
    clarifier: 'Volume discounts available',
  },
];

export const PricingSection = () => {
  return (
    <Section id="pricing" className="bg-background">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as your AI initiatives grow
          </p>
        </motion.div>

        <Grid cols={3} gap="lg">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative flex flex-col rounded-xl p-8 transition-all duration-300 ${plan.highlighted
                ? 'bg-card border-2 border-primary shadow-xl scale-105 z-10'
                : 'bg-background border border-border shadow-sm hover:shadow-md'
                }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex px-4 py-1 text-xs font-bold uppercase tracking-wide bg-primary text-primary-foreground rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="font-bold text-4xl text-foreground tracking-tight">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground text-sm self-end mb-1">
                      {plan.period}
                    </span>
                  )}
                </div>
                {plan.priceSubtext && (
                  <p className="text-xs text-muted-foreground mb-1">{plan.priceSubtext}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className={`w-5 h-5 shrink-0 ${plan.highlighted ? 'text-primary' : 'text-primary/70'}`} />
                    <span className="text-foreground/90 leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Button
                  variant={plan.highlighted ? 'default' : 'outline'}
                  size="lg"
                  className={`w-full font-semibold ${plan.highlighted ? 'shadow-lg shadow-primary/20' : ''}`}
                  asChild
                >
                  <Link to={plan.href}>
                    {plan.cta}
                  </Link>
                </Button>
                {plan.clarifier && (
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    {plan.clarifier}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </Grid>

        {/* Early Access Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Early access pricing — lock in these rates before general availability
          </div>
        </motion.div>
      </PageContainer>
    </Section>
  );
};
