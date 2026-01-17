import { BarChart3, Lock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  { href: 'mailto:support@ai-roi-studio.com', label: 'Contact' },
];

const resourceLinks = [
  { href: '#methodology', label: 'Methodology & Assumptions' },
  { href: '#', label: 'AI ROI Benchmarks' },
  { href: '#', label: 'Blog' },
  { href: '#', label: 'Guides' },
];

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg text-white">AI ROI Studio</span>
            </div>
            <p className="text-slate-400 max-w-sm mb-5 text-sm leading-relaxed">
              Financial-grade AI investment analysis. Calculate ROI, NPV, and risk-adjusted 
              returns to make confident AI decisions.
            </p>
            
            {/* Security statements */}
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                All data encrypted in transit (HTTPS)
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                We don't sell or share your financial data
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-medium text-white mb-4 text-sm">Product</h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-medium text-white mb-4 text-sm">Resources</h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-medium text-white mb-4 text-sm">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} AI ROI Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded text-[10px] uppercase tracking-wide bg-slate-800 text-slate-400">
              Early Access
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-600 text-center max-w-2xl mx-auto leading-relaxed">
            AI ROI Studio provides illustrative estimates to support internal planning. 
            Results depend entirely on your inputs and assumptions and should not be treated 
            as financial advice or guarantees. Consult qualified professionals before making 
            investment decisions.
          </p>
        </div>
      </div>
    </footer>
  );
};
