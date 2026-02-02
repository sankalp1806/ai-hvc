import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Section, PageContainer, Grid } from '@/components/layout/LayoutPrimitives';

const designedFor = [
  'Finance leaders evaluating AI investments',
  'Product or data teams needing ROI justification',
  'Consultants preparing AI business cases for clients',
];

const notDesignedFor = [
  'Personal investing or trading decisions',
  'Real-time portfolio management',
  'Automated financial trading',
];

export const WhoItsForSection = () => {
  return (
    <Section className="bg-muted/30">
      <PageContainer size="narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Who This Is For</h2>
          </div>

          <Grid cols={2} gap="lg" className="md:grid-cols-2">
            {/* Designed for */}
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">
                  Designed for
                </h3>
              </div>
              <ul className="space-y-4">
                {designedFor.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not designed for */}
            <div className="bg-muted/30 border border-transparent hover:border-border rounded-xl p-8 h-full transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <X className="w-5 h-5 text-slate-500" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">
                  Not designed for
                </h3>
              </div>
              <ul className="space-y-4">
                {notDesignedFor.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Grid>
        </motion.div>
      </PageContainer>
    </Section>
  );
};
