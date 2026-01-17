import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

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
    <section className="section-spacing bg-muted/30">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Designed for */}
          <div className="card-level-2 p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              Designed for
            </h3>
            <ul className="space-y-3">
              {designedFor.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Not designed for */}
          <div className="card-level-3 p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                <X className="w-3.5 h-3.5 text-slate-500" />
              </div>
              Not designed for
            </h3>
            <ul className="space-y-3">
              {notDesignedFor.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
