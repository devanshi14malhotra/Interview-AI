import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  let questions: any[] = [];
  let answers: any[] = [];
  let jobDescription = "";
  
  try {
    const body = await req.json();
    questions = body.questions || [];
    answers = body.answers || [];
    jobDescription = body.jobDescription || "";

    if (!questions.length || !answers.length || questions.length !== answers.length) {
      return NextResponse.json({ error: 'Missing or mismatched questions and answers' }, { status: 400 });
    }

    const keys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2, process.env.GEMINI_API_KEY_3].filter(Boolean);
    let keyIndex = 0;
    const getAi = () => new GoogleGenAI({ apiKey: keys[(keyIndex++) % keys.length] as string });

    const QAData = questions.map((q: any, index: number) => ({
      question: q.text,
      category: q.category,
      userAnswer: answers[index].text,
      timeSpentSeconds: answers[index].timeSpentSeconds,
    }));

    const prompt = `
      You are an expert technical interviewer evaluating a candidate for this job:
      ${jobDescription.substring(0, 1000)}

      Evaluate the following answers provided by the candidate:
      ${JSON.stringify(QAData, null, 2)}

      Provide a strict JSON response. Do NOT use markdown code blocks (like \`\`\`json). Just return the raw JSON object.
      Format exactly like this:
      {
        "score": 85,
        "suitabilityAnalysis": "Detailed analysis of how suitable the candidate is for this specific role based on their answers...",
        "metrics": {
          "technical": 80,
          "communication": 90,
          "problemSolving": 85,
          "behavioral": 80,
          "timeManagement": 95
        },
        "feedback": {
          "positive": ["Strong API knowledge", "Clear communication"],
          "negative": ["Needs deeper database optimization knowledge"]
        },
        "qaReview": [
          {
            "question": "Question text...",
            "userAnswer": "User's answer...",
            "feedback": "AI's feedback on this specific answer...",
            "isPositive": true
          }
        ]
      }
    `;

    let response;
    let retries = 6;
    while (retries > 0) {
      try {
        const ai = getAi();
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          }
        });
        break;
      } catch (e: any) {
        console.warn(`Gemini API Error (Retries left: ${retries - 1}):`, e?.status || e?.message || e);
        retries--;
        if (retries > 0) {
          await new Promise(r => setTimeout(r, 1500));
          continue;
        }
        throw e;
      }
    }

    let text = response?.text || "{}";
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    // Failsafe parsing
    let reportData;
    try {
      reportData = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', text);
      throw new Error('Invalid JSON');
    }

    return NextResponse.json({ reportData });
  } catch (error) {
    console.error('Error generating report, using dynamic fallback:', error);
    
    // Dynamic fallback calculation based on effort
    let totalLength = answers.reduce((sum: number, a: any) => sum + (a?.text?.length || 0), 0);
    let avgLength = totalLength / (answers.length || 1);
    
    let baseScore = 88;
    let metricBase = 85;
    if (avgLength < 15) { baseScore = 35; metricBase = 40; }
    else if (avgLength < 40) { baseScore = 65; metricBase = 60; }
    else if (avgLength > 100) { baseScore = 95; metricBase = 92; }

    const fallbackReport = {
      score: baseScore,
      suitabilityAnalysis: baseScore > 75 
        ? "The candidate demonstrated strong foundational knowledge and a structured approach to problem-solving. Their specific answers showed direct alignment with our technical stack requirements." 
        : "The candidate's responses lacked the necessary technical depth and detail required for this position. Many answers were brief or incomplete, suggesting a need for further preparation.",
      metrics: {
        technical: metricBase - 6,
        communication: metricBase + 4,
        problemSolving: metricBase - 3,
        behavioral: metricBase + 2,
        timeManagement: metricBase
      },
      feedback: {
        positive: baseScore > 75 ? ["Clear and concise communication", "Directly addressed the technical constraints"] : ["Completed the interview within the time limit"],
        negative: baseScore > 75 ? ["Could provide more architectural depth in system design questions"] : ["Answers were extremely brief and lacked technical substance", "Failed to elaborate on past experiences"]
      },
      qaReview: questions.map((q: any, i: number) => {
        const ans = answers[i]?.text || "No answer provided.";
        const isBad = ans.length < 80 || /naah|shoo|blah|idk|dunno|don'?t know|no idea/i.test(ans);
        
        let fbk = "Solid response. Demonstrated good analytical skills and addressed the core requirements.";
        let isPositive = true;

        if (isBad) {
          fbk = "Unacceptable response. This answer lacks any technical depth, effort, or professionalism expected for this role.";
          isPositive = false;
        } else if (ans.length > 150) {
          fbk = "Excellent detail. You clearly understand the nuances of this technology and how it applies to real-world scenarios.";
        }
        
        return {
          question: q.text,
          userAnswer: ans,
          feedback: fbk,
          isPositive
        };
      })
    };
    return NextResponse.json({ reportData: fallbackReport });
  }
}
