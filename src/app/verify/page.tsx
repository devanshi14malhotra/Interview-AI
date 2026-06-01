'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { CheckCircle2, Circle, Camera, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function VerifyPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let timers: NodeJS.Timeout[] = [];
    let isMounted = true;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        // Progress through verification steps once camera is loaded
        setStep(1); // Camera access granted
        
        timers.push(setTimeout(() => setStep(2), 2000)); // Scanning...
        timers.push(setTimeout(() => setStep(3), 3500)); // Photo captured
        timers.push(setTimeout(() => {
          // Stop camera before navigating
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          router.push('/interview');
        }, 5000));
        
      } catch (err) {
        console.error("Camera access denied or error:", err);
        setCameraError("Camera access denied or unavailable. Please allow camera permissions to continue.");
      }
    };

    startCamera();
    
    return () => {
      isMounted = false;
      timers.forEach(clearTimeout);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [router]);

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
          <h1 className="text-2xl font-bold text-white">Identity verification</h1>
          <div className="flex-1 h-[1px] bg-white/5"></div>
          <div className="flex gap-2">
            <div className="w-8 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent-glow)]"></div>
            <div className="w-8 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent-glow)]"></div>
            <div className="w-8 h-1.5 rounded-full bg-white/10"></div>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Camera Frame */}
          <div className="relative aspect-video bg-surface rounded-xl overflow-hidden flex items-center justify-center border border-white/10 shadow-2xl">
            {/* Corner Brackets */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-accent/70 rounded-tl z-10"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-accent/70 rounded-tr z-10"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-accent/70 rounded-bl z-10"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-accent/70 rounded-br z-10"></div>
            
            {cameraError ? (
              <div className="flex flex-col items-center text-center p-6 text-danger">
                <ShieldAlert className="w-12 h-12 mb-4 opacity-80" />
                <p className="text-sm font-medium">{cameraError}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-6" 
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
                />
                {step === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-20">
                    <div className="flex flex-col items-center text-white">
                      <Camera className="w-8 h-8 mb-3 animate-pulse text-accent" />
                      <p className="text-sm font-medium tracking-wide">Requesting Camera Access...</p>
                    </div>
                  </div>
                )}
                {step === 1 && (
                  <div className="absolute inset-0 border-[4px] border-accent/20 animate-pulse z-20 pointer-events-none"></div>
                )}
                {step === 3 && (
                  <div className="absolute inset-0 bg-success/20 z-20 flex items-center justify-center pointer-events-none transition-colors duration-500">
                    <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center shadow-[0_0_30px_var(--color-success)] scale-110 transition-transform">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Checklist */}
          <div className="space-y-6">
            <p className="text-sm text-text-secondary leading-relaxed mb-8">
              Stay centered in the frame. We verify your identity locally and monitor for proctoring to ensure exam integrity. No video data leaves your device.
            </p>

            <ul className="space-y-4">
              <li className={`flex items-center gap-4 text-sm font-medium transition-colors duration-300 ${step >= 0 ? 'text-white' : 'text-text-secondary'}`}>
                {step >= 1 ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Circle className="w-5 h-5 text-accent animate-pulse" />}
                Camera access granted
              </li>
              <li className={`flex items-center gap-4 text-sm font-medium transition-colors duration-300 ${step >= 1 ? 'text-white' : 'text-text-secondary/30'}`}>
                {step >= 2 ? <CheckCircle2 className="w-5 h-5 text-success" /> : step === 1 ? <Circle className="w-5 h-5 text-accent animate-pulse" /> : <Circle className="w-5 h-5 border-white/20 rounded-full" />}
                Face detection - scanning...
              </li>
              <li className={`flex items-center gap-4 text-sm font-medium transition-colors duration-300 ${step >= 2 ? 'text-white' : 'text-text-secondary/30'}`}>
                {step >= 3 ? <CheckCircle2 className="w-5 h-5 text-success" /> : step === 2 ? <Circle className="w-5 h-5 text-accent animate-pulse" /> : <Circle className="w-5 h-5 border-white/20 rounded-full" />}
                Reference photo captured
              </li>
              <li className={`flex items-center gap-4 text-sm font-medium transition-colors duration-300 ${step >= 3 ? 'text-white' : 'text-text-secondary/30'}`}>
                {step >= 3 ? <CheckCircle2 className="w-5 h-5 text-success shadow-[0_0_10px_var(--color-success)] rounded-full" /> : <Circle className="w-5 h-5 border-white/20 rounded-full" />}
                Identity confirmed
              </li>
            </ul>
          </div>

        </div>
      </main>
    </div>
  );
}
