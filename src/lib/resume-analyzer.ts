import { streamText } from "ai";
import { model, ANALYSIS_SYSTEM_PROMPT, buildAnalysisPrompt } from "./ai";

export async function analyzeResume(
  resumeText: string,
  jobDescription: string
) {
  const result = streamText({
    model,
    system: ANALYSIS_SYSTEM_PROMPT,
    prompt: buildAnalysisPrompt(resumeText, jobDescription),
    temperature: 0.3,
    maxOutputTokens: 2000,
  });

  return result;
}
