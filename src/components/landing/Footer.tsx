import { BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">AI-HVC</span>
            </div>
            <p className="text-muted-foreground max-w-md">
              Measure the true value of your AI investments with comprehensive ROI analysis, 
              intangible benefits scoring, and AI-powered insights.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/calculator" className="hover:text-background transition-colors">Calculator</Link></li>
              <li><Link to="/quick-calculator" className="hover:text-background transition-colors">Quick Mode</Link></li>
              <li><Link to="/" className="hover:text-background transition-colors">Templates</Link></li>
              <li><Link to="/" className="hover:text-background transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/" className="hover:text-background transition-colors">About</Link></li>
              <li><Link to="/" className="hover:text-background transition-colors">Blog</Link></li>
              <li><Link to="/" className="hover:text-background transition-colors">Privacy</Link></li>
              <li><Link to="/" className="hover:text-background transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-muted-foreground/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI Holistic Value Calculator. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Measure AI value with confidence.
          </p>
        </div>
      </div>
    </footer>
  );
};
