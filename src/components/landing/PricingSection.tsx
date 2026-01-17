import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
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
    href: 'mailto:sales@ai-roi-studio.com',
    highlighted: false,
    clarifier: 'Volume discounts available',
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="section-spacing bg-background">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground">
            Start free and scale as your AI initiatives grow
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative flex flex-col rounded-xl border p-6 ${
                plan.highlighted 
                  ? 'bg-slate-50 border-primary shadow-lg' 
                  : 'bg-card border-border'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-mono text-3xl font-bold text-foreground">
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

              <ul className="space-y-3 mb-6 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Button
                  variant={plan.highlighted ? 'default' : 'outline'}
                  className={`w-full ${plan.highlighted ? 'bg-primary hover:bg-primary/90' : ''}`}
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

        {/* Early Access Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Early access pricing — lock in these rates before general availability
          </div>
        </motion.div>
      </div>
    </section>
  );
};
