import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { history, resume, jd, role } = await req.json();

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
      You are a hiring manager writing a structured candidate evaluation.
      Based on the interview data below, generate a final report.
      
      Return ONLY a JSON object with this exact structure:
      {
        "strengths": ["strength 1", "strength 2", "strength 3"],
        "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
        "improvementPlan": ["action 1", "action 2", "action 3", "action 4", "action 5"],
        "hiringRecommendation": "Recommend" | "Borderline" | "DoNotRecommend",
        "summary": "A 2-3 sentence paragraph summarizing the candidate's performance."
      }
      
      Role: ${role}
      Resume: ${resume.substring(0, 1000)}
      Job Description: ${jd.substring(0, 1000)}
      
      Interview History (Questions, Answers, and Scores):
      ${JSON.stringify(history).substring(0, 5000)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response?.text || "{}";
    const report = JSON.parse(text || "{}");
    
    return NextResponse.json({ report });
  } catch (error: any) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
