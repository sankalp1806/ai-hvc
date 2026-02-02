import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageContainer } from './LayoutPrimitives';

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
      setScrolled(window.scrollY > 20);
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
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent py-2"
      )}>
        <PageContainer className="flex items-center justify-between h-16 md:h-20 transition-all duration-300">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className={cn(
              "font-bold text-lg tracking-tight transition-colors text-foreground"
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
                    : "text-muted-foreground/80 hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </PageContainer>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 z-50 md:hidden bg-background border-b border-border shadow-soft animate-in slide-in-from-top-2">
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block text-base font-medium transition-colors hover:text-primary py-3 px-4 rounded-md hover:bg-muted",
                      location.pathname === link.href ? "text-primary bg-muted/50" : "text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};