'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Check, X, Loader2, BrainCircuit, MessageSquare, Briefcase } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useInterview } from '@/context/InterviewContext';
import { useRouter } from 'next/navigation';

export default function ReportPage() {
  const router = useRouter();
  const { questions, answers, jobDescription, reportData, setReportData } = useInterview();
  const [loading, setLoading] = useState(!reportData);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      if (reportData) {
        setLoading(false);
        return;
      }
      
      if (!questions.length || !answers.length) {
        setError('No interview data found. Please start a new session.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/generate-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questions, answers, jobDescription }),
        });
        
        if (!res.ok) throw new Error('Failed to generate report');
        
        const data = await res.json();
        setReportData(data.reportData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to generate your report. Please try again.');
        setLoading(false);
      }
    };

    fetchReport();
  }, [questions, answers, jobDescription, reportData, setReportData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 animate-spin text-accent mb-4" />
        <h2 className="text-xl font-bold font-heading">Analyzing your interview...</h2>
        <p className="text-text-secondary mt-2 text-sm">Evaluating technical depth, communication, and problem solving.</p>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white">
        <h2 className="text-xl font-bold text-danger mb-4">{error || 'Something went wrong'}</h2>
        <Button onClick={() => router.push('/')}>Go Home</Button>
      </div>
    );
  }

  const { score, metrics, feedback, suitabilityAnalysis, qaReview } = reportData;
  const isHire = score >= 75;

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans">
      
      {/* Top Navigation */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 print:hidden">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-4 h-4 rounded-full bg-accent glow-text shadow-[0_0_10px_var(--color-accent-glow)] group-hover:scale-125 transition-transform"></div>
          <span className="text-2xl font-bold text-text-primary tracking-wider font-heading group-hover:text-accent transition-colors">InterviewAI</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => window.print()} className="border-border hover:bg-surface text-text-primary rounded hover:border-accent transition-colors">
            Download PDF
          </Button>
          <ThemeToggle />
          <Link href="/">
            <Button variant="outline" size="sm" className="border-border hover:bg-surface text-text-primary rounded hover:border-accent transition-colors">
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex items-center gap-6">
          <h1 className="text-sm font-bold text-text-secondary tracking-widest uppercase">Final Report</h1>
          <div className="flex-1 h-[1px] bg-white/5"></div>
        </div>

        {/* Primary Report Card */}
        <div className="bg-surface border border-white/5 rounded-xl p-8 shadow-2xl flex flex-col">
          <div className="flex items-start justify-between mb-8 pb-8 border-b border-white/5">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Interview Readiness Report</h2>
              <p className="text-sm text-text-secondary">Completed {new Date().toLocaleDateString()}</p>
            </div>
            <div className={`text-sm font-bold px-4 py-2 rounded-lg border ${isHire ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
              {isHire ? 'Recommend Hire' : 'Needs Preparation'}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
            {/* Score */}
            <div className="flex flex-col items-center shrink-0">
              <div className="relative w-40 h-40 rounded-full bg-background border-8 border-surface flex items-center justify-center mb-4 shadow-[0_0_30px_var(--color-accent-glow)]">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="46" fill="transparent" stroke={isHire ? "#10B981" : "#F59E0B"} strokeWidth="8" strokeDasharray="289" strokeDashoffset={289 - (289 * score) / 100} strokeLinecap="round" />
                </svg>
                <span className="text-5xl font-black text-white font-heading">{score}</span>
              </div>
              <div className={isHire ? "text-success font-bold text-lg" : "text-warning font-bold text-lg"}>
                {isHire ? 'Interview Ready' : 'Keep Practicing'}
              </div>
            </div>

            {/* Metric Bars */}
            <div className="flex-1 w-full space-y-6">
              {[
                { label: 'Technical', val: metrics.technical, bg: 'bg-accent' },
                { label: 'Communication', val: metrics.communication, bg: 'bg-success' },
                { label: 'Problem solving', val: metrics.problemSolving, bg: 'bg-accent' },
                { label: 'Behavioral', val: metrics.behavioral, bg: 'bg-accent/70' },
                { label: 'Time mgmt', val: metrics.timeManagement, bg: 'bg-warning' }
              ].map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary w-32">{metric.label}</span>
                  <div className="flex-1 h-1.5 bg-background rounded-full mx-4 overflow-hidden">
                    <div className={`h-full ${metric.bg} rounded-full`} style={{ width: `${metric.val}%` }}></div>
                  </div>
                  <span className="font-mono text-white">{metric.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Pills */}
          <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-white/5">
            {feedback.positive.map((point: string, i: number) => (
              <div key={i} className="flex items-center gap-2 bg-success/10 text-success border border-success/20 px-3 py-1.5 rounded-md text-xs font-medium">
                <Check className="w-3.5 h-3.5" /> {point}
              </div>
            ))}
            {feedback.negative.map((point: string, i: number) => (
              <div key={i} className="flex items-center gap-2 bg-danger/10 text-danger border border-danger/20 px-3 py-1.5 rounded-md text-xs font-medium">
                <X className="w-3.5 h-3.5" /> {point}
              </div>
            ))}
          </div>
        </div>

        {/* Suitability Analysis */}
        {suitabilityAnalysis && (
          <div className="bg-surface border border-white/5 rounded-xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="w-6 h-6 text-accent" />
              <h3 className="text-xl font-bold text-white">Job Suitability Analysis</h3>
            </div>
            <p className="text-text-secondary leading-relaxed">{suitabilityAnalysis}</p>
          </div>
        )}

        {/* Q&A Review */}
        {qaReview && qaReview.length > 0 && (
          <div className="bg-surface border border-white/5 rounded-xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
              <MessageSquare className="w-6 h-6 text-accent" />
              <h3 className="text-xl font-bold text-white">Question & Answer Review</h3>
            </div>
            
            <div className="space-y-8">
              {qaReview.map((item: any, idx: number) => (
                <div key={idx} className="bg-background border border-border rounded-xl p-6">
                  <div className="mb-4">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider mb-2 block">Question {idx + 1}</span>
                    <h4 className="text-lg font-medium text-white">{item.question}</h4>
                  </div>
                  
                  <div className="mb-4 pl-4 border-l-2 border-white/10">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 block">Your Answer</span>
                    <p className="text-text-secondary">{item.userAnswer}</p>
                  </div>
                  
                  <div className={`border rounded-lg p-4 ${item.isPositive ? 'bg-success/10 border-success/20' : 'bg-danger/10 border-danger/20'}`}>
                    <span className={`text-xs font-bold uppercase tracking-wider mb-1 block ${item.isPositive ? 'text-success' : 'text-danger'}`}>
                      AI Feedback {item.isPositive ? '(Positive)' : '(Needs Improvement)'}
                    </span>
                    <p className="text-white text-sm leading-relaxed">{item.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
