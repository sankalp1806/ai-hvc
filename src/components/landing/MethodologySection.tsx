import { motion } from 'framer-motion';
import { Calculator, TrendingUp, ShieldCheck, ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Section, PageContainer, Grid } from '@/components/layout/LayoutPrimitives';

export const MethodologySection = () => {
  return (
    <Section className="bg-background">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How the Model Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transparent methodology based on standard financial analysis
          </p>
        </motion.div>

        <Grid cols={3} gap="lg" className="mb-10">
          {/* Standard Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">Standard Metrics</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              We calculate ROI, NPV, IRR, and payback period using formulas recognized by finance professionals.
            </p>
            <div className="p-3 bg-muted rounded-lg border border-border/50">
              <code className="text-xs font-mono text-primary block">
                ROI = (Benefits − Costs) / Costs
              </code>
            </div>
          </motion.div>

          {/* Scenario Construction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">Risk Scenarios</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Conservative, base, and optimistic projections with weighted probabilities for risk-adjusted returns.
            </p>
            <div className="p-3 bg-muted rounded-lg border border-border/50">
              <code className="text-xs font-mono text-primary block">
                Adj. ROI = ROI × Risk Multiplier
              </code>
            </div>
          </motion.div>

          {/* Data Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">Benchmark Sources</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              AI benchmarks derived from published research, industry reports, and historical cost curves.
            </p>
            <span className="text-xs font-medium text-muted-foreground bg-secondary/10 px-2 py-1 rounded inline-block text-secondary-foreground">
              Model v2.0 – Updated January 2025
            </span>
          </motion.div>
        </Grid>

        {/* Disclaimer + View Methodology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-muted/30 border border-border rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              <strong className="text-foreground">Conservative by default.</strong>{' '}
              This tool provides illustrative estimates to support internal planning. Results depend on your inputs and should not be treated as financial advice.
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="shrink-0 font-medium">
                View Methodology
                <ExternalLink className="ml-2 w-3 h-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Calculation Methodology</DialogTitle>
                <DialogDescription>
                  How we calculate financial metrics and construct scenarios
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 mt-4 text-sm">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Core Formulas</h4>
                  <div className="space-y-3 text-muted-foreground">
                    <div>
                      <strong>Return on Investment (ROI)</strong>
                      <code className="block mt-1 p-2 bg-muted rounded text-xs font-mono">
                        ROI = ((Total Benefits − Total Costs) / Total Costs) × 100%
                      </code>
                    </div>
                    <div>
                      <strong>Net Present Value (NPV)</strong>
                      <code className="block mt-1 p-2 bg-muted rounded text-xs font-mono">
                        NPV = Σ (Cash Flow / (1 + Discount Rate)^t) for each period t
                      </code>
                    </div>
                    <div>
                      <strong>Payback Period</strong>
                      <code className="block mt-1 p-2 bg-muted rounded text-xs font-mono">
                        Payback = Initial Investment / Monthly Net Cash Flow
                      </code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Risk Adjustment</h4>
                  <p className="text-muted-foreground mb-2">
                    We use a weighted average of four risk factors (implementation, adoption, technical, market)
                    to calculate a risk multiplier. The multiplier has a floor of 0.5—even high-risk projects
                    don't get completely zeroed out.
                  </p>
                  <code className="block p-2 bg-muted rounded text-xs font-mono">
                    Risk Multiplier = 1 − (Weighted Avg Risk / 200)
                  </code>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Scenario Analysis</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li><strong>Conservative:</strong> 70% of base case benefits, 110% of costs</li>
                    <li><strong>Base Case:</strong> Your entered values</li>
                    <li><strong>Optimistic:</strong> 130% of base case benefits, 90% of costs</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Data Sources</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Industry benchmark data from published research reports</li>
                    <li>Historical AI implementation cost curves</li>
                    <li>Vendor pricing from public sources</li>
                  </ul>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800 text-xs text-center">
                    <strong>Disclaimer:</strong> AI ROI Studio provides illustrative estimates only.
                    Actual results will vary.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </PageContainer>
    </Section>
  );
};
