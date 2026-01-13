import { BarChart3, Twitter, Linkedin, Github } from 'lucide-react';
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
  { href: '#', label: 'Blog' },
  { href: '#', label: 'Guides' },
  { href: '#', label: 'AI ROI Benchmarks' },
  { href: '#', label: 'Case Studies' },
];

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-white">AI ROI Studio</span>
            </div>
            <p className="text-slate-400 max-w-sm mb-6 text-sm leading-relaxed">
              Financial-grade AI investment analysis. Calculate ROI, NPV, IRR, and risk-adjusted 
              returns to make confident AI decisions.
            </p>
            {/* Trust Statement */}
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <span>🔒 Data encrypted in transit</span>
              <span>🚫 We never sell your data</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
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
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
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
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
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
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} AI ROI Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-500 hover:text-white transition-colors" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors" aria-label="GitHub">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-600 text-center max-w-3xl mx-auto">
            AI ROI Studio provides estimates for informational purposes only. Results are projections 
            based on user inputs and should not be considered financial advice. Consult qualified 
            professionals before making investment decisions.
          </p>
        </div>
      </div>
    </footer>
  );
};