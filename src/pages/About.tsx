import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Target, Award, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Hero */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Making AI Investments
              <span className="gradient-text"> Measurable</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              We built AI ROI Studio because we believe every AI investment decision should be 
              backed by rigorous financial analysis—not just gut feelings or vendor promises.
            </p>
          </div>

          {/* Mission */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="metric-card text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Our Mission</h3>
              <p className="text-muted-foreground text-sm">
                Empower businesses to make confident AI investment decisions with transparent, 
                finance-grade analysis tools.
              </p>
            </div>

            <div className="metric-card text-center">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Who We Serve</h3>
              <p className="text-muted-foreground text-sm">
                CFOs, IT leaders, consultants, and anyone evaluating AI projects who needs 
                to justify investments with hard numbers.
              </p>
            </div>

            <div className="metric-card text-center">
              <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Our Approach</h3>
              <p className="text-muted-foreground text-sm">
                Combine traditional financial modeling (NPV, IRR, payback) with AI-powered 
                market research and risk analysis.
              </p>
            </div>
          </div>

          {/* Story */}
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Why We Built This</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                After years of watching organizations struggle to quantify the value of AI investments, 
                we realized there was a gap. Spreadsheets were too complex. Simple calculators were too basic. 
                And most tools ignored the nuanced risks and intangible benefits that make AI projects unique.
              </p>
              <p>
                AI ROI Studio bridges that gap. We've combined the rigor of financial modeling with the 
                intelligence of AI-powered research to create a tool that gives you a complete picture—not 
                just a single ROI number, but NPV, IRR, payback period, risk-adjusted returns, and 
                actionable insights.
              </p>
              <p>
                Whether you're evaluating a customer support chatbot or a predictive maintenance system, 
                our goal is to help you make the case with confidence.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/ai-roi-calculator">
                Try the Calculator
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;