import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';

export const QuickPreview = () => {
  const navigate = useNavigate();
  const [investment, setInvestment] = useState(100000);
  const [annualSavings, setAnnualSavings] = useState(50000);
  const [years, setYears] = useState(3);

  const totalBenefits = annualSavings * years;
  const simpleROI = ((totalBenefits - investment) / investment) * 100;
  const paybackMonths = investment / (annualSavings / 12);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="metric-card"
          >
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Quick ROI Preview
            </h3>

            <div className="space-y-6">
              <div>
                <Label htmlFor="investment" className="text-sm font-medium mb-2 block">
                  Total AI Investment
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="investment"
                    type="number"
                    value={investment}
                    onChange={(e) => setInvestment(Number(e.target.value))}
                    className="pl-8 font-mono"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="savings" className="text-sm font-medium mb-2 block">
                  Expected Annual Savings/Revenue
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="savings"
                    type="number"
                    value={annualSavings}
                    onChange={(e) => setAnnualSavings(Number(e.target.value))}
                    className="pl-8 font-mono"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-4 block">
                  Time Horizon: {years} years
                </Label>
                <Slider
                  value={[years]}
                  onValueChange={([v]) => setYears(v)}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <Button 
                variant="hero" 
                className="w-full"
                onClick={() => navigate('/calculator')}
              >
                Get Detailed Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="text-center lg:text-left mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Instant Results
              </h3>
              <p className="text-muted-foreground">
                Based on your quick inputs
              </p>
            </div>

            {/* ROI Card */}
            <div className="metric-card border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Simple ROI</span>
                <TrendingUp className={`w-5 h-5 ${simpleROI >= 0 ? 'text-success' : 'text-destructive'}`} />
              </div>
              <div className={`font-mono text-4xl font-bold ${simpleROI >= 0 ? 'text-success' : 'text-destructive'}`}>
                {simpleROI >= 0 ? '+' : ''}{simpleROI.toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Over {years} year{years > 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Total Value */}
              <div className="metric-card">
                <span className="text-sm font-medium text-muted-foreground block mb-2">
                  Total Value Created
                </span>
                <div className="font-mono text-2xl font-bold text-foreground">
                  {formatCurrency(totalBenefits)}
                </div>
              </div>

              {/* Payback */}
              <div className="metric-card">
                <span className="text-sm font-medium text-muted-foreground block mb-2">
                  Payback Period
                </span>
                <div className="font-mono text-2xl font-bold text-foreground">
                  {paybackMonths.toFixed(1)} mo
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center lg:text-left">
              * This is a simplified calculation. Full analysis includes NPV, IRR, risk adjustment, and intangible benefits.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
