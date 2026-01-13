import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
    variant: 'outline' as const,
    clarifier: 'One analysis = one saved ROI scenario',
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'For serious AI investors',
    features: [
      'Unlimited analyses',
      'Full metrics (ROI, NPV, IRR, risk-adjusted)',
      'AI-powered research reports',
      'Monte Carlo simulation',
      'PDF & Excel export',
      'Scenario comparison',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
    href: '/ai-roi-calculator',
    variant: 'hero' as const,
    popular: true,
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
      'Custom benchmarks',
      'Dedicated success manager',
      'SLA guarantees',
    ],
    cta: 'Contact Sales',
    href: 'mailto:sales@ai-roi-studio.com',
    variant: 'outline' as const,
    clarifier: 'Volume discounts available',
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="section-spacing bg-background">
      <div className="container mx-auto px-6">
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as your AI initiatives grow
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`metric-card relative flex flex-col ${
                plan.popular ? 'border-primary shadow-lg md:scale-105 z-10' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-mono text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground text-sm">
                      {plan.period}
                    </span>
                  )}
                </div>
                {plan.priceSubtext && (
                  <p className="text-xs text-muted-foreground mt-1">{plan.priceSubtext}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Button
                  variant={plan.variant}
                  className="w-full"
                  asChild
                >
                  <Link to={plan.href}>
                    {plan.cta}
                  </Link>
                </Button>
                {plan.clarifier && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    {plan.clarifier}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};