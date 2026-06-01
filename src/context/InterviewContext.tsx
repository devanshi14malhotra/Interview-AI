'use client';

import React, { createContext, useContext, useState } from 'react';

export interface Question {
  id: string;
  text: string;
  category: 'Technical' | 'Behavioral' | 'Problem Solving';
}

export interface Answer {
  questionId: string;
  text: string;
  timeSpentSeconds: number;
}

export interface ReportData {
  score: number;
  metrics: {
    technical: number;
    communication: number;
    problemSolving: number;
    behavioral: number;
    timeManagement: number;
  };
  feedback: {
    positive: string[];
    negative: string[];
  };
}

interface InterviewState {
  resumeText: string;
  jobDescription: string;
  questions: Question[];
  answers: Answer[];
  reportData: ReportData | null;
  setResumeText: (text: string) => void;
  setJobDescription: (text: string) => void;
  setQuestions: (qs: Question[]) => void;
  addAnswer: (answer: Answer) => void;
  setReportData: (data: ReportData) => void;
  resetSession: () => void;
}

const InterviewContext = createContext<InterviewState | undefined>(undefined);

export function InterviewProvider({ children }: { children: React.ReactNode }) {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const addAnswer = (answer: Answer) => {
    setAnswers(prev => [...prev, answer]);
  };

  const resetSession = () => {
    setResumeText('');
    setJobDescription('');
    setQuestions([]);
    setAnswers([]);
    setReportData(null);
  };

  return (
    <InterviewContext.Provider value={{
      resumeText,
      jobDescription,
      questions,
      answers,
      reportData,
      setResumeText,
      setJobDescription,
      setQuestions,
      addAnswer,
      setReportData,
      resetSession
    }}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}
