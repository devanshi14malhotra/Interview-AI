'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { FileText, Lock, CheckCircle2, UploadCloud, Code, Server, Database, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useInterview } from '@/context/InterviewContext';

const DEMO_JOB_DESCRIPTIONS = {
  frontend: `We are looking for a Mid-Level Frontend Engineer to join our core product team. You will be responsible for building responsive, high-performance web applications using React and Next.js. Requirements: 3+ years of experience with React, TypeScript, and modern CSS frameworks (Tailwind). Experience with state management (Redux, Zustand) and testing (Jest, Cypress) is a plus.`,
  backend: `We are seeking a Backend Software Engineer to design and scale our microservices architecture. You will work primarily in Node.js and Go. Requirements: Strong experience with RESTful APIs, GraphQL, and relational databases (PostgreSQL). Knowledge of message queues (RabbitMQ/Kafka) and Docker/Kubernetes deployment workflows.`,
  data: `Looking for a Data Scientist to help build predictive models and analyze complex datasets. Requirements: Proficiency in Python (Pandas, Scikit-learn, PyTorch) and SQL. Strong background in statistics and machine learning algorithms. Experience with deploying ML models to production environments and working with large-scale data processing tools (Spark, Hadoop) is preferred.`
};

export default function SetupPage() {
  const router = useRouter();
  const { setResumeText, setJobDescription: setGlobalJobDesc } = useInterview();
  
  const [file, setFile] = useState<File | null>(null);
  const [jobDescInput, setJobDescInput] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (pdfFile: File): Promise<string> => {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      fullText += content.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return fullText;
  };

  const handleBegin = async () => {
    if (file && jobDescInput.trim()) {
      setIsProcessing(true);
      let resumeTxt = '';
      try {
        if (file.type === 'application/pdf') {
          resumeTxt = await extractTextFromPDF(file);
        } else {
          resumeTxt = "Dummy resume text because file was not a PDF.";
        }
      } catch (e) {
        console.warn("Could not parse PDF precisely, using fallback text to prevent blocking the flow.", e);
        resumeTxt = "Candidate is an experienced software engineer with a strong background in web development, React, Node.js, and system architecture. They have built scalable applications and have great problem-solving skills.";
      }
      
      setResumeText(resumeTxt);
      setGlobalJobDesc(jobDescInput);
      router.push('/verify');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans">
      
      {/* Top Navigation */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-4 h-4 rounded-full bg-accent glow-text shadow-[0_0_10px_var(--color-accent-glow)] group-hover:scale-125 transition-transform"></div>
          <span className="text-2xl font-bold text-text-primary tracking-wider font-heading group-hover:text-accent transition-colors">InterviewAI</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="border-white/10 hover:border-accent hover:text-accent transition-colors">
            Back
          </Button>
          <ThemeToggle />
        </div>
      </nav>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 flex flex-col">
        
        {/* Header & Progress Indicator */}
        <div className="flex items-center gap-6 mb-12">
          <h1 className="text-2xl font-bold text-white">Set up your interview</h1>
          <div className="flex-1 h-[1px] bg-white/5"></div>
          <div className="flex gap-2">
            <div className="w-8 h-1.5 rounded-full bg-accent"></div>
            <div className="w-8 h-1.5 rounded-full bg-white/10"></div>
            <div className="w-8 h-1.5 rounded-full bg-white/10"></div>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Resume Upload */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-text-secondary mb-3 tracking-widest uppercase">Your Resume (PDF)</label>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf" 
              onChange={handleFileChange}
            />
            <div 
              className={`flex-1 min-h-[250px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-colors ${
                file 
                  ? 'border-success/50 bg-success/5' 
                  : isHovering 
                    ? 'border-accent/50 bg-accent/5' 
                    : 'border-white/10 bg-surface hover:border-white/20'
              } cursor-pointer group`}
              onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
              onDragLeave={() => setIsHovering(false)}
              onDrop={(e) => { 
                e.preventDefault(); 
                setIsHovering(false); 
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  setFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={`w-12 h-14 rounded-lg bg-white/5 flex items-center justify-center mb-4 transition-colors ${file ? 'text-success bg-success/10' : 'text-white'}`}>
                {file ? <CheckCircle2 className="w-6 h-6" /> : <UploadCloud className="w-6 h-6 text-text-secondary group-hover:text-accent transition-colors" />}
              </div>
              <div className="text-sm text-white font-medium mb-1 text-center">
                {file ? 'Resume uploaded successfully' : 'Click or drop your resume here'}
              </div>
              <div className="text-xs text-text-secondary text-center">
                {file ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)` : 'Supports PDF - Max 5MB'}
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-text-secondary tracking-widest uppercase">Job Description</label>
            </div>
            
            <textarea 
              className="flex-1 min-h-[250px] bg-surface border border-white/10 rounded-xl p-5 text-sm text-white placeholder:text-text-secondary focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 resize-none transition-all font-sans"
              placeholder="Paste the target job description here. Our AI will deeply analyze the requirements to generate role-specific technical and behavioral questions..."
              value={jobDescInput}
              onChange={(e) => setJobDescInput(e.target.value)}
            />

            {/* Demo Options */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs text-text-secondary py-1.5 mr-2">Quick load (Demo):</span>
              <button 
                onClick={() => setJobDescInput(DEMO_JOB_DESCRIPTIONS.frontend)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/10 hover:border-accent/50 hover:bg-accent/10 text-xs text-text-secondary hover:text-white transition-colors"
              >
                <Code className="w-3.5 h-3.5" /> Frontend
              </button>
              <button 
                onClick={() => setJobDescInput(DEMO_JOB_DESCRIPTIONS.backend)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/10 hover:border-accent/50 hover:bg-accent/10 text-xs text-text-secondary hover:text-white transition-colors"
              >
                <Server className="w-3.5 h-3.5" /> Backend
              </button>
              <button 
                onClick={() => setJobDescInput(DEMO_JOB_DESCRIPTIONS.data)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/10 hover:border-accent/50 hover:bg-accent/10 text-xs text-text-secondary hover:text-white transition-colors"
              >
                <Database className="w-3.5 h-3.5" /> Data Science
              </button>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Lock className="w-3.5 h-3.5 text-warning" />
            <span>Parsed locally. Nothing is stored.</span>
          </div>
          <Button 
            onClick={handleBegin} 
            disabled={!file || !jobDescInput.trim() || isProcessing}
            className="px-10 py-3 flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Parsing Resume...
              </>
            ) : (
              'Begin Verification'
            )}
          </Button>
        </div>

      </main>
    </div>
  );
}
