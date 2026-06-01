'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowRight, BrainCircuit, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-accent/20">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-background/80 backdrop-blur-lg border-b border-border/50 transition-all duration-300">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shadow-[0_0_15px_var(--color-accent-glow)] group-hover:scale-110 transition-transform">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight font-heading group-hover:text-accent transition-colors">InterviewAI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium text-sm">
          <Link href="#how-it-works" className="relative text-text-secondary hover:text-text-primary transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-accent after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">How it Works</Link>
          <Link href="#features" className="relative text-text-secondary hover:text-text-primary transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-accent after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">Platform</Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/setup">
            <Button size="sm" className="hidden md:flex">Get Started</Button>
          </Link>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-6 flex items-center justify-center min-h-[85vh]">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background"></div>
          
          <div className="max-w-4xl mx-auto w-full text-center relative z-10">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="mx-auto flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border text-text-secondary font-medium text-xs mb-8 uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_var(--color-accent)]"></span>
                AI-Powered • Adaptive • Real-time
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 font-heading leading-[1.1] tracking-tight">
                Master the art <br /> of the interview.
              </h1>
              
              <p className="text-lg md:text-xl text-text-secondary mb-10 leading-relaxed font-sans max-w-2xl mx-auto">
                Experience highly realistic, adaptive mock interviews tailored to your exact resume and target role. strictly timed, and analyzed by advanced AI.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                <Link href="/setup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg group">
                    Start Your Session
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-16 w-full max-w-3xl mx-auto"
              >
                <div className="flex flex-col items-center justify-center text-center mb-6">
                  <p className="text-xs text-accent font-bold uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                    </span>
                    Future Integrations (Coming Soon)
                  </p>
                  <p className="text-text-secondary text-sm max-w-xl">
                    We are actively building the ultimate Anti-Cheating & AI Voice engine to make InterviewAI the #1 interview platform in the world.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="bg-surface/50 border border-white/5 rounded-xl p-4 flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <BrainCircuit className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">Fully Voice AI Powered</h4>
                      <p className="text-xs text-text-secondary leading-relaxed">Speech-to-text and text-to-speech engine. The AI will audibly ask questions, and you reply naturally using your voice.</p>
                    </div>
                  </div>
                  <div className="bg-surface/50 border border-white/5 rounded-xl p-4 flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-danger" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">Advanced Anti-Cheating</h4>
                      <p className="text-xs text-text-secondary leading-relaxed">Eye-tracking, tab-switching detection, and facial recognition to ensure absolute integrity during the interview.</p>
                    </div>
                  </div>
                  <div className="bg-surface/50 border border-white/5 rounded-xl p-4 flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warning"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/><path d="M17 17h.01"/></svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">Object Detection (Anti-Proxy)</h4>
                      <p className="text-xs text-text-secondary leading-relaxed">Real-time room scanning to detect unauthorized phones, secondary devices, or proxy individuals in the frame.</p>
                    </div>
                  </div>
                  <div className="bg-surface/50 border border-white/5 rounded-xl p-4 flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">Contextual NLP Parsing</h4>
                      <p className="text-xs text-text-secondary leading-relaxed">Deep semantic parsing of your verbal answers, factoring in your tone and hesitations for accurate behavioral scoring.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Value Prop Section */}
        <section id="how-it-works" className="py-32 bg-surface border-y border-border relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="text-center max-w-2xl mx-auto mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">Not just another chatbot.</h2>
              <p className="text-xl text-text-secondary">Our platform simulates the psychological pressure and rigorous standards of top-tier tech interviews.</p>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-12"
            >
              <motion.div variants={fadeIn} className="group cursor-default bg-background p-8 rounded-2xl border border-border shadow-sm hover:border-accent/50 transition-colors">
                <div className="w-14 h-14 bg-surface border border-border rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
                  <ShieldCheck className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-2xl font-bold font-heading mb-4">Proctored Environment</h3>
                <p className="text-text-secondary leading-relaxed text-lg">Local-first facial recognition ensures you stay in frame and focused, simulating the intense scrutiny of a live video interview.</p>
              </motion.div>

              <motion.div variants={fadeIn} className="group cursor-default bg-background p-8 rounded-2xl border border-border shadow-sm hover:border-accent/50 transition-colors">
                <div className="w-14 h-14 bg-surface border border-border rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
                  <BrainCircuit className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-2xl font-bold font-heading mb-4">Adaptive Complexity</h3>
                <p className="text-text-secondary leading-relaxed text-lg">Nail a question? The next one digs deeper. Stumble? It pivots. The AI dynamically adapts to your skill level in real-time.</p>
              </motion.div>

              <motion.div variants={fadeIn} className="group cursor-default bg-background p-8 rounded-2xl border border-border shadow-sm hover:border-accent/50 transition-colors">
                <div className="w-14 h-14 bg-surface border border-border rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
                  <Clock className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-2xl font-bold font-heading mb-4">Strict Time Limits</h3>
                <p className="text-text-secondary leading-relaxed text-lg">Rambling is penalized. You are scored on clarity, conciseness, and accuracy against a strict, ticking countdown timer.</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Feature Split */}
        <section id="features" className="py-32 px-6 overflow-hidden bg-background">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="order-2 lg:order-1"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-surface border border-border shadow-lg flex items-center justify-center p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"></div>
                <div className="w-full max-w-md bg-background border border-border rounded-2xl p-8 shadow-2xl relative z-10">
                  <div className="flex justify-between items-center mb-8 border-b border-border pb-6">
                    <span className="font-heading font-bold text-xl">Feedback Report</span>
                    <span className="text-accent font-black text-2xl glow-text">85/100</span>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-text-secondary font-medium">Clarity</span>
                        <span className="font-bold text-success">Strong</span>
                      </div>
                      <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "85%" }}
                          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                          viewport={{ once: true }}
                          className="h-full bg-success rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-text-secondary font-medium">Depth</span>
                        <span className="font-bold text-warning">Developing</span>
                      </div>
                      <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "60%" }}
                          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                          viewport={{ once: true }}
                          className="h-full bg-warning rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="order-1 lg:order-2 space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold font-heading leading-tight">Actionable insights, <br/>not generic advice.</h2>
              <p className="text-xl text-text-secondary leading-relaxed">
                Receive a comprehensive, beautifully formatted report immediately after your session. We meticulously break down your performance across accuracy, clarity, depth, and time management.
              </p>
              <ul className="space-y-4 pt-6">
                <li className="flex items-center gap-4 text-lg">
                  <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center shrink-0 shadow-[0_0_10px_var(--color-accent-glow)]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span>Granular scoring on multiple technical metrics</span>
                </li>
                <li className="flex items-center gap-4 text-lg">
                  <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center shrink-0 shadow-[0_0_10px_var(--color-accent-glow)]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span>Hiring recommendation based on standards</span>
                </li>
                <li className="flex items-center gap-4 text-lg">
                  <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center shrink-0 shadow-[0_0_10px_var(--color-accent-glow)]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span>Personalized improvement plan</span>
                </li>
              </ul>
            </motion.div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center shadow-[0_0_10px_var(--color-accent-glow)]">
              <BrainCircuit className="w-3 h-3" />
            </div>
            <span className="font-bold text-white tracking-wider font-heading">InterviewAI</span>
          </div>
          <p>© {new Date().getFullYear()} InterviewAI Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
