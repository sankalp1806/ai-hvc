import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Lock, FileText, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Mini Calculator Component for Hero
const MiniCalculator = () => {
  const [cost, setCost] = useState(100000);
  const [savings, setSavings] = useState(25);
  
  const annualSavings = cost * (savings / 100);
  const roi = ((annualSavings * 3 - cost) / cost) * 100;
  const paybackMonths = Math.round((cost / annualSavings) * 12);
  
  return (
    <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-5 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Quick Estimate</span>
      </div>
      
      <div className="space-y-5">
        <div>
          <label className="text-xs text-slate-400 mb-2 block">Annual AI Investment</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={25000}
              max={500000}
              step={5000}
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="flex-1 h-1.5 rounded-full bg-slate-700 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
            <span className="font-mono text-sm text-white w-24 text-right">
              ${(cost / 1000).toFixed(0)}k
            </span>
          </div>
        </div>
        
        <div>
          <label className="text-xs text-slate-400 mb-2 block">Expected Efficiency Gain</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={10}
              max={50}
              step={5}
              value={savings}
              onChange={(e) => setSavings(Number(e.target.value))}
              className="flex-1 h-1.5 rounded-full bg-slate-700 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
            <span className="font-mono text-sm text-white w-24 text-right">
              {savings}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-5 border-t border-slate-700/50">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">3-Year ROI</p>
            <p className="font-mono text-2xl font-bold text-emerald-400">
              {roi.toFixed(0)}%
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Payback</p>
            <p className="font-mono text-2xl font-bold text-white">
              {paybackMonths} mo
            </p>
          </div>
        </div>
      </div>
      
      <Button 
        variant="default" 
        size="sm" 
        asChild 
        className="w-full mt-4 bg-primary hover:bg-primary/90"
      >
        <Link to="/ai-roi-calculator">
          Get Full Analysis <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
};

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center hero-dark pt-20 pb-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Copy */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-left"
          >
            {/* Eyebrow */}
            <div className="eyebrow mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Early Access · AI ROI Modeling
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.1]">
              Model AI project ROI in minutes,{' '}
              <span className="text-primary">not spreadsheets</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-lg">
              Generate ROI, NPV, and risk-adjusted scenarios for AI investments using a structured financial model—without building complex spreadsheets.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button 
                size="lg" 
                asChild 
                className="bg-primary hover:bg-primary/90 text-white font-medium h-12 px-6"
              >
                <Link to="/ai-roi-calculator">
                  Start Free Analysis
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild 
                className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white h-12 px-6"
              >
                <Link to="/ai-research">
                  View Sample Report
                </Link>
              </Button>
            </div>
            
            {/* Reassurance row */}
            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-slate-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                Illustrative estimates only
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Exports to PDF & Excel
              </span>
            </div>
          </motion.div>
          
          {/* Right: Mini Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <MiniCalculator />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
