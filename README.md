# InterviewAI

InterviewAI is an advanced, AI-powered mock interview platform designed to simulate a strict, proctored technical interview environment. By leveraging generative AI, the platform provides highly personalized interview questions based on the candidate's resume and target job description, followed by a comprehensive suitability analysis and feedback report.

Live App link : https://interview-ai-dm.vercel.app/ 

## Features

- Dynamic Question Generation: Automatically generates customized technical, behavioral, and problem-solving questions by natively parsing the candidate's uploaded PDF resume and comparing it against the provided job description.
- Strict Proctoring & Anti-Cheating: Enforces a strict interview setting with a persistent, picture-in-picture live camera feed. Uses aggressive focus monitoring (window blur and mouse-leave detection) to instantly flag tab-switching or focus-loss as a "Face Not Detected" violation, triggering visual and high-volume auditory warnings.
- API Key Load Balancing: Dynamically rotates between multiple Google Gemini API keys to gracefully handle high traffic, 429 quota limits, and 503 server unavailability during live demonstrations.
- Dynamic Fallback System: If the AI API fails completely due to hackathon quota limits, a custom regex parser instantly scans the candidate's PDF resume for technical keywords (React, Python, Node, etc.) and injects them into a robust set of fallback questions, ensuring 100% demo uptime and authentic-looking resume questions.
- Real-Time Adaptive Feedback: Evaluates the candidate's answers in real-time, scoring them across multiple metrics including technical depth, communication, and time management.
- Comprehensive Suitability Analysis: Delivers a detailed final report, complete with a hire/no-hire recommendation, strengths and weaknesses analysis, and itemized feedback for every question answered.
- Secure Local Parsing: Processes initial resume data locally before secure API transmission, ensuring candidate privacy.

## How to Run the App

### Prerequisites

Ensure you have Node.js (v18 or higher) and npm installed on your machine. You will also need a Google Gemini API key.

### Setup Instructions

1. Clone the repository and navigate into the project directory:
   ```bash
   git clone <repository-url>
   cd interview-ai
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Configure your environment variables:
   Create a `.env.local` file in the root directory and add your Google Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to begin the interview process.

## Future Developments

We are actively building the ultimate Anti-Cheating & AI Voice engine to expand InterviewAI's capabilities:

- Fully Voice AI Powered: Integration of speech-to-text and text-to-speech engines. The AI will audibly ask questions, allowing candidates to reply naturally using their voice.
- Advanced Anti-Cheating: Implementation of active eye-tracking, tab-switching detection, and facial recognition to ensure absolute integrity during the interview.
- Object Detection (Anti-Proxy): Real-time room scanning to detect unauthorized phones, secondary devices, or proxy individuals in the frame.
- Contextual NLP Parsing: Deep semantic parsing of verbal answers, factoring in tone, confidence, and hesitations for highly accurate behavioral scoring.

---

*Built for the Hack2Hire Hackathon (using Google Antigravity)*
