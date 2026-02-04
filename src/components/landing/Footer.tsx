import { BarChart3, Lock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageContainer, Grid } from '@/components/layout/LayoutPrimitives';

const productLinks = [
  { href: '/ai-roi-calculator', label: 'Calculator' },
  { href: '/ai-research', label: 'AI Research' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#features', label: 'Features' },
];

const companyLinks = [
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: 'mailto:support@roic.app', label: 'Contact' },
];

const resourceLinks = [
  { href: '#methodology', label: 'Methodology & Assumptions' },
  { href: '#', label: 'AI ROI Benchmarks' },
  { href: '#', label: 'Blog' },
  { href: '#', label: 'Guides' },
];

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-800">
      <PageContainer>
        <Grid cols={1} className="md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20">
                <img src="/logo.png" alt="ROIC Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">ROIC</span>
            </div>
            <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
              Financial-grade AI investment analysis. Calculate ROI, NPV, and risk-adjusted
              returns to make confident AI decisions.
            </p>

            {/* Security statements */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                <Lock className="w-3.5 h-3.5" />
                <span>All data encrypted in transit (HTTPS)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                <Shield className="w-3.5 h-3.5" />
                <span>We don't sell or share your financial data</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm tracking-wide">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm tracking-wide">Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm tracking-wide">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Grid>

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} ROIC. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-slate-500 border border-slate-800">
              Early Access
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8">
          <p className="text-[10px] text-slate-600 text-center max-w-3xl mx-auto leading-relaxed">
            ROIC provides illustrative estimates to support internal planning.
            Results depend entirely on your inputs and assumptions and should not be treated
            as financial advice or guarantees. Consult qualified professionals before making
            investment decisions.
          </p>
        </div>
      </PageContainer>
    </footer>
  );
};
