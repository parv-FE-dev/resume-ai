import { createOpenAI } from "@ai-sdk/openai";

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const model = openai("gpt-4o");

export const ANALYSIS_SYSTEM_PROMPT = `You are an expert resume analyst and career coach. Analyze the provided resume against the job description and return a detailed JSON analysis.

Your response must be valid JSON with this exact structure:
{
  "score": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "keywordGaps": [
    {
      "keyword": "<missing keyword>",
      "importance": "high" | "medium" | "low",
      "context": "<why this keyword matters for the role>"
    }
  ],
  "weakBullets": [
    {
      "original": "<original bullet point>",
      "issue": "<what's wrong with it>",
      "rewritten": "<improved version>",
      "section": "<which resume section>"
    }
  ],
  "suggestions": [
    {
      "category": "content" | "format" | "keywords" | "structure",
      "title": "<short title>",
      "description": "<actionable advice>",
      "priority": "high" | "medium" | "low"
    }
  ],
  "strengths": ["<strength 1>", "<strength 2>", ...]
}

Be specific, actionable, and constructive. Focus on maximizing the candidate's chances of getting an interview.`;

export function buildAnalysisPrompt(
  resumeText: string,
  jobDescription: string
): string {
  return `## Resume
${resumeText}

## Job Description
${jobDescription}

Analyze this resume against the job description. Return your analysis as JSON.`;
}
