import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  ArrowRight,
  Calculator
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickCalculator = () => {
  const navigate = useNavigate();
  const [investment, setInvestment] = useState(150000);
  const [annualSavings, setAnnualSavings] = useState(75000);
  const [annualRevenue, setAnnualRevenue] = useState(25000);
  const [years, setYears] = useState(3);
  const [confidence, setConfidence] = useState(70);
  const [industry, setIndustry] = useState('');

  const totalAnnualBenefit = annualSavings + annualRevenue;
  const adjustedBenefit = totalAnnualBenefit * (confidence / 100);
  const totalBenefits = adjustedBenefit * years;
  const simpleROI = ((totalBenefits - investment) / investment) * 100;
  const paybackMonths = investment / (adjustedBenefit / 12);
  const threeYearValue = adjustedBenefit * 3 - investment;
  const npv = -investment + (adjustedBenefit / 1.1) + (adjustedBenefit / 1.21) + (adjustedBenefit / 1.331);

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const isPositive = simpleROI >= 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Quick ROI Calculator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get instant estimates for your AI investment. For comprehensive analysis with risk assessment and intangible benefits, use our full calculator.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Input Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="metric-card space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Investment Details</h2>

                {/* Industry */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Industry (Optional)</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance & Banking</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail & E-commerce</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Total Investment */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Total AI Investment
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      value={investment}
                      onChange={(e) => setInvestment(Number(e.target.value))}
                      className="pl-8 font-mono text-lg"
                    />
                  </div>
                </div>

                {/* Annual Cost Savings */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Expected Annual Cost Savings
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      value={annualSavings}
                      onChange={(e) => setAnnualSavings(Number(e.target.value))}
                      className="pl-8 font-mono text-lg"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Labor, operational, or efficiency savings
                  </p>
                </div>

                {/* Annual Revenue Increase */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Expected Annual Revenue Increase
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      value={annualRevenue}
                      onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                      className="pl-8 font-mono text-lg"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    New revenue from AI-enabled products or services
                  </p>
                </div>

                {/* Time Horizon */}
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
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1 year</span>
                    <span>10 years</span>
                  </div>
                </div>

                {/* Confidence Level */}
                <div>
                  <Label className="text-sm font-medium mb-4 block">
                    Confidence Level: {confidence}%
                  </Label>
                  <Slider
                    value={[confidence]}
                    onValueChange={([v]) => setConfidence(v)}
                    min={30}
                    max={100}
                    step={5}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Low (30%)</span>
                    <span>High (100%)</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Results Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Main ROI Card */}
              <div className={`metric-card ${isPositive ? 'border-success/30' : 'border-destructive/30'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground">Simple ROI</span>
                  <TrendingUp className={`w-6 h-6 ${isPositive ? 'text-success' : 'text-destructive'}`} />
                </div>
                <div className={`font-mono text-5xl font-bold ${isPositive ? 'text-success' : 'text-destructive'}`}>
                  {simpleROI >= 0 ? '+' : ''}{simpleROI.toFixed(0)}%
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Over {years} year{years > 1 ? 's' : ''} at {confidence}% confidence
                </p>
              </div>

              {/* Secondary Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="metric-card">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Payback Period</span>
                  </div>
                  <div className="font-mono text-2xl font-bold text-foreground">
                    {paybackMonths < 120 ? `${paybackMonths.toFixed(1)} mo` : 'N/A'}
                  </div>
                </div>

                <div className="metric-card">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">3-Year Net Value</span>
                  </div>
                  <div className={`font-mono text-2xl font-bold ${threeYearValue >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(threeYearValue)}
                  </div>
                </div>

                <div className="metric-card">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">NPV (10% discount)</span>
                  </div>
                  <div className={`font-mono text-2xl font-bold ${npv >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(npv)}
                  </div>
                </div>

                <div className="metric-card">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Annual Benefit</span>
                  </div>
                  <div className="font-mono text-2xl font-bold text-foreground">
                    {formatCurrency(adjustedBenefit)}
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
                <h3 className="font-semibold text-foreground mb-2">
                  Want a comprehensive analysis?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get detailed insights including Monte Carlo simulation, risk-adjusted returns, intangible benefits scoring, and AI-powered recommendations.
                </p>
                <Button 
                  variant="hero" 
                  className="w-full"
                  onClick={() => navigate('/calculator')}
                >
                  Full Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-muted-foreground text-center">
                * This is a simplified calculation. Actual ROI may vary based on implementation details, market conditions, and other factors. Use our full calculator for comprehensive analysis.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickCalculator;
