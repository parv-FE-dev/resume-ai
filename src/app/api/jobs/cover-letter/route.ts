import { streamText } from "ai";
import { anthropic } from "@/lib/ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { job, profile, resumeText, tone } = await req.json();

    if (!job?.title || !profile?.targetRole) {
      return Response.json(
        { error: "Job and profile are required" },
        { status: 400 }
      );
    }

    const validTones = ["professional", "casual", "technical"];
    const safeTone = validTones.includes(tone) ? tone : "professional";

    const toneGuide =
      safeTone === "casual"
        ? "Write in a casual-confident, friendly tone. Be personable but professional."
        : safeTone === "technical"
          ? "Write in a technical, detail-oriented tone. Lead with technical accomplishments."
          : "Write in a polished, professional tone. Formal but not stiff.";

    const result = streamText({
      model: anthropic("claude-haiku-4-20250414"),
      system: `You are an expert cover letter writer. Write compelling, personalized cover letters that get interviews.

Rules:
- Keep it concise (250-350 words)
- ${toneGuide}
- Reference the specific company and role
- Connect the candidate's experience to the job requirements
- Show genuine interest in the company's mission
- End with a confident call to action
- Do NOT use generic filler phrases like "I am writing to express my interest"
- Start with a hook that grabs attention`,
      prompt: `Write a cover letter for this job application:

## Job
Title: ${job.title}
Company: ${job.company}
Description: ${job.description || "N/A"}
Requirements: ${job.requirements?.join(", ") || "N/A"}

## Candidate Profile
Role: ${profile.targetRole}
Experience: ${profile.experience} years
Skills: ${profile.skills.join(", ")}
Domain: ${profile.domain.join(", ")}

## Resume Summary
${resumeText ? resumeText.slice(0, 2000) : "Not provided"}

Write the cover letter now. Output ONLY the letter text, no headers or meta.`,
      temperature: 0.7,
      maxOutputTokens: 1500,
    });

    return (await result).toTextStreamResponse();
  } catch (error) {
    console.error("Cover letter error:", error);
    return Response.json(
      { error: "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
