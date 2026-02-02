import { motion } from 'framer-motion';
import { Check, Lock, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PageContainer, Section } from '@/components/layout/LayoutPrimitives';
import { SupaCalculator } from './SupaCalculator';

export const HeroSection = () => {
    return (
        <Section className="bg-background pt-32 pb-20 overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-3xl rounded-bl-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-secondary/5 blur-3xl rounded-tr-[100px] -z-10" />

            <PageContainer>
                <div className="flex flex-col items-center gap-16 relative z-10">

                    {/* Top: Text Content (Centered) */}
                    <div className="text-center max-w-4xl mx-auto space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-8"
                        >
                            {/* Eyebrow */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide mx-auto">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Early Access · AI ROI Modeling
                            </div>

                            {/* Headline */}
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
                                Model AI value in <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                    minutes, not months
                                </span>
                            </h1>

                            {/* Subheadline */}
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                                Stop guessing. Generate precise ROI, NPV, and risk-adjusted scenarios for your AI investments using our standardized financial engine.
                            </p>

                            {/* CTAs - Only Start Estimating button */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                <Button
                                    size="lg"
                                    asChild
                                    className="h-14 px-8 text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all font-semibold rounded-full min-w-[200px]"
                                >
                                    <Link to="/ai-roi-calculator">
                                        Start Estimating
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                </Button>
                            </div>

                            {/* Reassurance row */}
                            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground font-medium pt-2">
                                <span className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-primary" />
                                    No login required
                                </span>
                                <span className="flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-primary" />
                                    Private & Secure
                                </span>
                                <span className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    Export PDF
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom: Supa Calculator (Full Width) */}
                    <div className="w-full max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <SupaCalculator />
                        </motion.div>
                    </div>

                </div>
            </PageContainer>
        </Section>
    );
};
