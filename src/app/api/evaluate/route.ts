import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { question, expectedKeyPoints, answer, timeTaken, timeLimit } = await req.json();

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
      You are an objective interview evaluator. Score the following answer strictly.
      
      Return ONLY a JSON object with this exact structure:
      {
        "accuracy": <0-20 score>,
        "clarity": <0-20 score>,
        "depth": <0-20 score>,
        "relevance": <0-20 score>,
        "timeEfficiency": <0-20 score>,
        "comments": {
          "accuracy": "1 sentence comment",
          "clarity": "1 sentence comment",
          "depth": "1 sentence comment",
          "relevance": "1 sentence comment",
          "timeEfficiency": "1 sentence comment"
        },
        "totalScore": <0-100 sum of above scores>
      }
      
      Question: ${question}
      Expected key points: ${JSON.stringify(expectedKeyPoints)}
      Candidate's answer: ${answer || "[No Answer Provided]"}
      Time taken: ${timeTaken} seconds out of ${timeLimit} seconds allowed.
      Note: If timeTaken is close to or over timeLimit, significantly penalize timeEfficiency.
      If answer is empty or just gibberish, scores should be 0.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text();
    const evaluation = JSON.parse(text || "{}");
    
    return NextResponse.json({ evaluation });
  } catch (error: any) {
    console.error('Error evaluating answer:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
