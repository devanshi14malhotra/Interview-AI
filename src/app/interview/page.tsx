'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Clock, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useInterview } from '@/context/InterviewContext';

export default function InterviewPage() {
  const router = useRouter();
  const { resumeText, jobDescription, questions, setQuestions, addAnswer, answers } = useInterview();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);
  const [faceDetected, setFaceDetected] = useState(true);
  const [loadingText, setLoadingText] = useState('Analyzing your resume and the job description...');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);
  const hasFetched = useRef(false);

  // Preload alarm audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.loop = true;
      audio.volume = 1.0;
      alarmAudioRef.current = audio;
    }
  }, []);

  // Keep camera on during interview
  useEffect(() => {
    let isMounted = true;
    
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!isMounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };
    
    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Attach stream to video tag once it mounts (after loading screen)
  useEffect(() => {
    if (!loading && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [loading]);

  // Fake Face Detection using tab/window visibility
  useEffect(() => {
    if (loading || error) return;
    
    const handleBlur = () => {
      setFaceDetected(false);
      if (alarmAudioRef.current) {
        alarmAudioRef.current.play().catch(e => console.log('Audio blocked:', e));
      }
    };

    const handleFocus = () => {
      setFaceDetected(true);
      if (alarmAudioRef.current) {
        alarmAudioRef.current.pause();
        alarmAudioRef.current.currentTime = 0;
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('mouseleave', handleBlur);
    document.addEventListener('mouseenter', handleFocus);
    
    // Also catch visibility change for completeness
    const handleVisibility = () => document.hidden ? handleBlur() : handleFocus();
    document.addEventListener('visibilitychange', handleVisibility);
    
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('mouseleave', handleBlur);
      document.removeEventListener('mouseenter', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [loading, error]);

  // Rotating Loading Messages
  useEffect(() => {
    if (!loading) return;
    const messages = [
      "Analyzing your resume and the job description...",
      "Extracting your technical skills and experience...",
      "Generating highly specific interview questions...",
      "Setting up proctoring and anti-cheat...",
      "Almost ready... All the best for your interview!"
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % messages.length;
      setLoadingText(messages[idx]);
    }, 2500);
    return () => clearInterval(interval);
  }, [loading]);

  // Fetch questions if we don't have them
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchQuestions = async () => {
      if (!resumeText || !jobDescription) {
        router.push('/setup');
        return;
      }

      if (questions.length > 0) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText, jobDescription }),
        });
        
        if (!res.ok) throw new Error('Failed to generate questions');
        
        const data = await res.json();
        setQuestions(data.questions);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load interview questions. Please try again.');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [resumeText, jobDescription, questions, setQuestions]);

  // Timer logic
  useEffect(() => {
    if (loading || error) return;
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading, error]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (loading || error) return;
    
    const currentQuestion = questions[currentIndex];
    
    // Save answer
    addAnswer({
      questionId: currentQuestion.id,
      text: answer,
      timeSpentSeconds: 120 - timeLeft,
    });

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setAnswer('');
      setTimeLeft(120); // Reset timer for next question
    }
  };

  // Route to report when all questions are answered
  useEffect(() => {
    if (questions.length > 0 && answers.length === questions.length) {
      router.push('/report');
    }
  }, [answers.length, questions.length, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 animate-spin text-accent mb-6" />
        <h2 className="text-2xl font-bold font-heading">Generating Interview</h2>
        <p className="text-text-secondary mt-3 text-sm animate-pulse transition-all">{loadingText}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white">
        <h2 className="text-xl font-bold text-danger mb-4">{error}</h2>
        <Button onClick={() => router.push('/setup')}>Go Back</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans">
      
      {/* Top Navigation */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-accent glow-text shadow-[0_0_10px_var(--color-accent-glow)]"></div>
          <span className="text-2xl font-bold text-text-primary tracking-wider font-heading">InterviewAI</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="border-white/10 hover:border-accent hover:text-accent transition-colors">
            Exit
          </Button>
          <ThemeToggle />
        </div>
      </nav>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col relative">
        
        {/* Floating Camera (Proctored View) at bottom right */}
        <div className="fixed bottom-6 right-6 w-64 bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl z-50">
          <div className="bg-surface/80 backdrop-blur-md px-3 py-2 flex items-center justify-between border-b border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-success" />
              Proctoring Active
            </span>
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" title="Recording"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" title="Microphone Active"></div>
            </div>
          </div>
          <div className="relative aspect-video bg-background">
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover transform -scale-x-100"
            />
            {/* Fake Face Tracking Overlay for MVP */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`w-2/3 h-3/4 border rounded-lg relative transition-colors duration-300 ${faceDetected ? 'border-success/30' : 'border-danger/80 animate-pulse bg-danger/10'}`}>
                <div className={`absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 ${faceDetected ? 'border-success' : 'border-danger'}`}></div>
                <div className={`absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 ${faceDetected ? 'border-success' : 'border-danger'}`}></div>
                <div className={`absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 ${faceDetected ? 'border-success' : 'border-danger'}`}></div>
                <div className={`absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 ${faceDetected ? 'border-success' : 'border-danger'}`}></div>
              </div>
            </div>
            
            <div className={`absolute bottom-2 right-2 px-2 py-0.5 rounded text-[9px] font-mono transition-colors duration-300 ${faceDetected ? 'bg-black/60 text-success' : 'bg-danger text-white animate-bounce'}`}>
              {faceDetected ? 'PROCTOR_ACTIVE' : 'TAB_SWITCH_DETECTED'}
            </div>
            
            {!faceDetected && (
              <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div className="bg-danger text-white text-xs font-bold px-3 py-1.5 rounded animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.8)] text-center">
                  WARNING: Cursor left window or tab switched
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Header & Progress Indicator */}
        <div className="flex items-center gap-6 mb-8 mt-12 md:mt-0">
          <h1 className="text-sm font-bold text-text-secondary tracking-widest uppercase">Interview Session</h1>
          <div className="flex-1 h-[1px] bg-white/5"></div>
        </div>

        {/* Question Card */}
        <div className="bg-surface border border-white/5 rounded-xl p-8 shadow-2xl flex flex-col flex-1 max-h-[70vh]">
          
          {/* Card Header */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
            <div className="flex items-center gap-4">
              <span className="bg-warning/10 text-warning text-xs font-bold px-2.5 py-1 rounded tracking-widest uppercase">
                {currentQuestion.category}
              </span>
              <span className="text-sm font-medium text-text-secondary">Question {currentIndex + 1} of {questions.length}</span>
            </div>
            <div className={`flex items-center gap-3 font-mono text-sm font-bold ${timeLeft < 30 ? 'text-danger' : 'text-warning'}`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)} left
              <div className={`w-2 h-2 rounded-full animate-pulse ml-2 ${timeLeft < 30 ? 'bg-danger' : 'bg-warning'}`}></div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-1 bg-white/5 rounded-full mb-8 overflow-hidden">
             <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold text-white mb-8 leading-snug">
            {currentQuestion.text}
          </h2>

          {/* Answer Area */}
          <div className="flex flex-col flex-1 mb-6">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-xs font-medium text-text-secondary">Please provide a detailed response (~15-150 words)</span>
              <span className={`text-xs font-mono font-medium ${answer.length < 80 ? 'text-warning' : 'text-success'}`}>
                {answer.length} / 1000 characters (Min. 80)
              </span>
            </div>
            <textarea
              className="flex-1 w-full bg-background border border-white/10 rounded-xl p-6 text-sm text-white placeholder:text-text-secondary/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 resize-none transition-all font-sans"
              placeholder="Type your detailed answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              maxLength={1000}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xs text-text-secondary">Tip: Be specific. Mention tools or frameworks you&apos;ve actually used.</span>
            <Button 
              onClick={handleSubmit}
              disabled={!answer.trim()}
              className="px-8 py-3"
            >
              {currentIndex === questions.length - 1 ? 'Finish Interview →' : 'Submit & Next →'}
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
}
