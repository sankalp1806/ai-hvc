import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/ai-roi-calculator', label: 'Calculator' },
  { href: '/ai-research', label: 'AI Research' },
  { href: '/#pricing', label: 'Pricing' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showSolidNav = scrolled || !isLanding;

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        showSolidNav 
          ? "bg-white/95 backdrop-blur-md border-b border-border shadow-sm" 
          : "bg-transparent"
      )}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className={cn(
                "font-bold text-lg transition-colors",
                showSolidNav ? "text-foreground" : "text-white"
              )}>
                AI ROI Studio
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === link.href 
                      ? "text-primary" 
                      : showSolidNav ? "text-muted-foreground" : "text-white/90 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Button 
                variant={showSolidNav ? "ghost" : "ghost"} 
                size="sm"
                className={cn(
                  !showSolidNav && "text-white hover:text-white hover:bg-white/10"
                )}
              >
                Sign In
              </Button>
              <Button 
                variant={showSolidNav ? "default" : "secondary"} 
                size="sm"
                asChild
              >
                <Link to="/ai-roi-calculator">
                  Get Started Free
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-black/5"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className={cn("w-6 h-6", showSolidNav ? "text-foreground" : "text-white")} />
              ) : (
                <Menu className={cn("w-6 h-6", showSolidNav ? "text-foreground" : "text-white")} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 z-40 md:hidden" 
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 z-50 md:hidden bg-white border-b border-border shadow-lg">
            <div className="container mx-auto px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block text-base font-medium transition-colors hover:text-primary py-2",
                    location.pathname === link.href ? "text-primary" : "text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border space-y-3">
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
                <Button variant="default" size="sm" className="w-full" asChild>
                  <Link to="/ai-roi-calculator" onClick={() => setIsOpen(false)}>
                    Get Started Free
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};