import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Shield, Lock, Eye, Trash2, Server, Mail } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 13, 2026
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <div className="metric-card mb-6">
              <div className="flex items-start gap-4">
                <Lock className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Your Data is Safe</h2>
                  <p className="text-muted-foreground">
                    We encrypt all data in transit using HTTPS. We never sell or share your input data 
                    with third parties. You can delete your analyses at any time.
                  </p>
                </div>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                We collect information you provide directly to us when using AI ROI Studio:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Account information (email, name) when you sign up</li>
                <li>Business profile data you enter into the calculator</li>
                <li>Cost and benefit estimates for ROI analysis</li>
                <li>Usage data to improve our services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>To provide and improve our ROI calculation services</li>
                <li>To personalize your experience and provide relevant benchmarks</li>
                <li>To communicate with you about your account and updates</li>
                <li>To ensure the security and integrity of our platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your analysis data for as long as your account is active. You may request 
                deletion of your data at any time by contacting us or through your account settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Third-Party Services</h2>
              <p className="text-muted-foreground">
                We use trusted third-party services for hosting, analytics, and AI processing. 
                These providers are bound by strict data protection agreements and only process 
                data as necessary to provide their services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@ai-roi-studio.com" className="text-primary hover:underline">
                  privacy@ai-roi-studio.com
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

export default Privacy;