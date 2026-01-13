import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 pt-20">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-indigo-500/20 rounded-[100%] blur-[120px] opacity-40 pointer-events-none" />
      
      <div className="container relative z-10 px-6 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: The Pitch */}
        <div className="text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Live Financial Modeling
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            ROI Analysis <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              CFOs Trust
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
            Stop relying on spreadsheet guesswork. Generate board-ready 
            financial projections, NPV, and risk models in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button variant="hero" size="xl" asChild className="h-14 px-8 text-lg shadow-indigo-500/25 shadow-lg">
              <Link to="/ai-roi-calculator">
                Start Analysis <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="xl" className="h-14 px-8 text-lg text-slate-300 hover:text-white hover:bg-white/5">
              View Sample Report
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-500 pt-4">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Bank-grade Security</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Export to PDF/Excel</div>
          </div>
        </div>

        {/* Right: The "Live" Preview Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-30" />
          <div className="relative bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
            {/* Fake Browser Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/20" />
                <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
              </div>
              <div className="ml-4 px-3 py-1 rounded bg-slate-800 text-[10px] text-slate-500 font-mono w-full max-w-[200px]">
                ai-roi-studio.com/report/v2
              </div>
            </div>

            {/* Dashboard Content Preview */}
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-slate-400 text-sm mb-1">Projected Net Value (3Y)</div>
                  <div className="text-4xl font-mono font-bold text-white">$2,450,000</div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded text-sm font-medium">
                    <TrendingUp className="w-3 h-3" /> +214% ROI
                  </div>
                </div>
              </div>

              {/* Simplified Graph Visual */}
              <div className="h-32 flex items-end justify-between gap-2">
                {[35, 45, 30, 60, 75, 65, 85, 95].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                    className="w-full bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-sm opacity-80"
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-1">Payback Period</div>
                  <div className="text-lg font-semibold text-white">4.2 Months</div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-1">Risk Rating</div>
                  <div className="text-lg font-semibold text-white flex items-center gap-2">
                     Low <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
