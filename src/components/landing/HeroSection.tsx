import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Sparkles, Shield, Play, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const trustLogos = [
  { name: 'Fortune 500', label: 'Fortune 500 Companies' },
  { name: 'Tech Startups', label: 'Tech Startups' },
  { name: 'Consulting Firms', label: 'Consulting Firms' },
  { name: 'Financial Services', label: 'Financial Services' },
];

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen hero-gradient overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(217_91%_60%/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(217_91%_60%/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Gradient orbs - more subtle */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />

      <div className="container relative z-10 mx-auto px-6 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium">AI-Powered Financial Analysis</span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              AI ROI Calculator That Thinks Like a{' '}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">CFO</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/80 mb-4 leading-relaxed">
              Model NPV, IRR, payback, and risk-adjusted returns for your AI projects—without touching a spreadsheet.
            </p>
            
            {/* Supporting microcopy */}
            <p className="text-sm text-white/60 mb-8">
              Combine financial rigor with AI-powered market research to justify your next AI investment in minutes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button 
                variant="secondary" 
                size="xl"
                asChild
                className="bg-white text-slate-900 hover:bg-white/90 shadow-lg"
              >
                <Link to="/ai-roi-calculator">
                  Start Full ROI Analysis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="xl"
                asChild
                className="border-2 border-white/30 text-white hover:bg-white/10"
              >
                <Link to="/ai-research">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get AI-Powered Estimate
                </Link>
              </Button>
            </div>

            {/* CTA Clarifiers */}
            <div className="flex flex-col sm:flex-row gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Full Analysis: Detailed costs, benefits, risk modeling
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                AI Estimate: No numbers required
              </span>
            </div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {/* Mock Dashboard Preview */}
            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="absolute -top-3 -right-3 px-3 py-1 bg-accent rounded-full text-xs font-semibold text-accent-foreground">
                Live Preview
              </div>
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wide mb-1">AI Project Analysis</p>
                  <p className="text-white font-semibold">Customer Support Automation</p>
                </div>
                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
                  Positive Outlook
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/50 text-xs mb-1">ROI</p>
                  <p className="font-mono text-2xl font-bold text-emerald-400">+127%</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/50 text-xs mb-1">NPV</p>
                  <p className="font-mono text-2xl font-bold text-white">$847K</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/50 text-xs mb-1">Payback</p>
                  <p className="font-mono text-2xl font-bold text-white">14 mo</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/50 text-xs mb-1">Risk-Adj ROI</p>
                  <p className="font-mono text-2xl font-bold text-primary">+89%</p>
                </div>
              </div>

              {/* Mini Chart Placeholder */}
              <div className="bg-white/5 rounded-xl p-4 h-24 flex items-end gap-1">
                {[40, 55, 45, 70, 85, 75, 90, 95].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-primary/50 to-primary rounded-t"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-white/10"
        >
          <p className="text-center text-white/40 text-sm mb-6">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {trustLogos.map((logo) => (
              <div key={logo.name} className="text-white/30 text-sm font-medium">
                {logo.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};