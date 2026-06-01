import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { resume, jd, role } = await req.json();

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
      You are a senior technical interviewer at a top tech company.
      You have been given a candidate's resume and the job description they are applying for.
      Generate exactly 10 interview questions tailored to this candidate and role.
      
      Return ONLY a JSON array. Each object must have this exact structure:
      {
        "id": "q1",
        "question": "The question text",
        "type": "technical" | "behavioral" | "conceptual" | "scenario",
        "difficulty": "easy" | "medium" | "hard",
        "expectedKeyPoints": ["point 1", "point 2", "point 3"]
      }
      
      Start with 2 easy, 4 medium, 4 hard. Mix types appropriately.
      
      Role: ${role}
      Resume: ${resume.substring(0, 3000)} // Truncated to avoid token limits if too long
      Job Description: ${jd.substring(0, 3000)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response?.text || "[]";
    const questions = JSON.parse(text || "[]");
    
    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error('Error generating questions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
