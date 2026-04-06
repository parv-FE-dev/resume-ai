import { streamText } from "ai";
import { anthropic } from "@/lib/ai";
import type { JobSeekerProfile } from "@/types/agent";

export const maxDuration = 60;

function buildProfileAnalysisPrompt(
  resumeText: string,
  profile: JobSeekerProfile
): string {
  const profileSummary = [
    `Target Role: ${profile.targetRole}`,
    `Seniority: ${profile.seniority}`,
    `Experience: ${profile.experience} years`,
    `Skills: ${profile.skills.join(", ")}`,
    `Domain: ${profile.domain.join(", ")}`,
    `Location: ${profile.location}`,
    `Remote: ${profile.remote ? "Yes" : "No"}`,
    profile.salaryRange.min > 0
      ? `Salary Range: ${profile.salaryRange.currency} ${profile.salaryRange.min.toLocaleString()} - ${profile.salaryRange.max.toLocaleString()}`
      : null,
    profile.companyStage.length > 0
      ? `Company Stage: ${profile.companyStage.join(", ")}`
      : null,
    profile.dealbreakers.length > 0
      ? `Dealbreakers: ${profile.dealbreakers.join(", ")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  return `## Resume
${resumeText}

## Target Career Profile
${profileSummary}

Analyze this resume against the career profile above. Assess how well the resume positions this candidate for their target role. Return your analysis as JSON.`;
}

const SYSTEM_PROMPT = `You are an expert resume analyst and career coach. Analyze the provided resume against the candidate's target career profile and return a detailed JSON analysis.

Your response must be valid JSON with this exact structure:
{
  "score": <number 0-100>,
  "summary": "<2-3 sentence overall assessment of how well the resume targets the desired role>",
  "keywordGaps": [
    {
      "keyword": "<missing keyword important for target role>",
      "importance": "high" | "medium" | "low",
      "context": "<why this keyword matters for the target role and domain>"
    }
  ],
  "weakBullets": [
    {
      "original": "<original bullet point from resume>",
      "issue": "<what's wrong — vague, no metrics, doesn't align with target role, etc.>",
      "rewritten": "<improved version that better targets the desired role>",
      "section": "<which resume section>"
    }
  ],
  "suggestions": [
    {
      "category": "content" | "format" | "keywords" | "structure",
      "title": "<short title>",
      "description": "<actionable advice specific to reaching their target role>",
      "priority": "high" | "medium" | "low"
    }
  ],
  "strengths": ["<strength 1>", "<strength 2>", ...]
}

Focus on:
- How well the resume positions the candidate for their TARGET role and seniority level
- Skills gaps between what's on the resume and what's needed
- Domain alignment (are they showing relevant domain experience?)
- Whether bullet points demonstrate the right level of impact for their target seniority
- Keywords that recruiters at their target companies would search for

Be specific, actionable, and constructive.`;

export async function POST(req: Request) {
  try {
    const { resumeText, profile } = await req.json();

    // Size limit: 50KB max for resume text
    if (typeof resumeText === "string" && resumeText.length > 50000) {
      return Response.json(
        { error: "Resume text too large (max 50KB)" },
        { status: 400 }
      );
    }

    if (!resumeText) {
      return Response.json(
        { error: "Resume text is required" },
        { status: 400 }
      );
    }

    if (!profile || !profile.targetRole) {
      return Response.json(
        { error: "Career profile with target role is required" },
        { status: 400 }
      );
    }

    const result = streamText({
      model: anthropic("claude-haiku-4-20250414"),
      system: SYSTEM_PROMPT,
      prompt: buildProfileAnalysisPrompt(resumeText, profile),
      temperature: 0.3,
      maxOutputTokens: 3000,
    });

    const stream = (await result).textStream;
    let fullText = "";

    for await (const chunk of stream) {
      fullText += chunk;
    }

    return new Response(fullText, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Profile analysis error:", error);
    return Response.json(
      { error: "Failed to analyze resume against profile" },
      { status: 500 }
    );
  }
}
