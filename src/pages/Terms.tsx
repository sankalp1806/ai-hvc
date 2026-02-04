import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { FileText, AlertCircle, Scale, Ban } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 13, 2026
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <div className="metric-card mb-6 border-warning/30 bg-warning/5">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-warning shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Important Disclaimer</h2>
                  <p className="text-muted-foreground">
                    ROIC provides estimates and projections for informational purposes only.
                    Results should not be considered financial advice. Always consult with qualified
                    professionals before making investment decisions.
                  </p>
                </div>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using ROIC, you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground mb-4">
                ROIC provides tools for calculating and analyzing the return on investment
                for AI projects, including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>ROI, NPV, IRR, and payback period calculations</li>
                <li>Risk-adjusted return analysis</li>
                <li>AI-powered market research and benchmarks</li>
                <li>Report generation and export features</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Responsibilities</h2>
              <p className="text-muted-foreground mb-4">You agree to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide accurate information when using our services</li>
                <li>Use the service only for lawful purposes</li>
                <li>Not attempt to reverse engineer or exploit the service</li>
                <li>Maintain the confidentiality of your account credentials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                ROIC and its creators shall not be liable for any direct, indirect, incidental,
                consequential, or punitive damages arising from your use of the service or reliance on
                any projections or estimates provided. Financial projections are estimates only and
                actual results may vary significantly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content, features, and functionality of ROIC are owned by us and are
                protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. We will notify users of
                material changes via email or through the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact</h2>
              <p className="text-muted-foreground">
                Questions about these Terms should be sent to{' '}
                <a href="mailto:legal@roic.app" className="text-primary hover:underline">
                  legal@roic.app
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;