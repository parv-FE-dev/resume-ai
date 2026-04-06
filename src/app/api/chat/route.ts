import { streamText, tool, stepCountIs } from "ai";
import { anthropic } from "@/lib/ai";
import { z } from "zod";
import type { JobSeekerProfile } from "@/types/agent";

export const maxDuration = 60;

function buildSystemPrompt(profile: JobSeekerProfile): string {
  const filledFields = Object.entries(profile)
    .filter(([, v]) => {
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === "object" && v !== null)
        return Object.values(v).some((x) => x !== 0 && x !== "");
      return v !== "" && v !== 0 && v !== false;
    })
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join("\n");

  return `You are an AI Career Agent helping someone find their next job. Right now you're in onboarding mode — learning about their goals.

RULES:
- Ask ONE question at a time. Never dump multiple questions.
- Be warm, concise, and conversational. Use occasional emoji.
- After each user response, call the update_profile tool to save extracted data.
- You can update multiple fields from a single response if the user provides multiple pieces of info.
- If the user's answer is ambiguous, confirm your interpretation before saving.
- STAY ON TOPIC: You are ONLY a career agent. If the user asks off-topic questions (general knowledge, trivia, coding help, etc.), politely redirect them back to their job search. Example: "Ha, good question! But I'm your career agent — let's stay focused on landing you that dream job 🎯 So, [next onboarding question]?"
- Never answer questions unrelated to job searching, resumes, careers, or professional development.

QUESTION ORDER (adapt naturally, skip if already known):
1. Target role + seniority level
2. Years of experience + main tech stack / skills
3. Preferred industry or domain (AI, fintech, healthtech, etc.)
4. Location preference (remote, hybrid, specific city)
5. Expected salary range
6. Company stage preference (startup, Series A-C, enterprise)
7. Any dealbreakers

CURRENT PROFILE STATE:
${filledFields || "Empty — just getting started."}

When ALL key fields are filled (targetRole, skills, location at minimum), summarize the profile and tell the user they can now upload their resume or ask you to search for jobs. Set onboarding_complete to true.

STYLE: Think smart career advisor, not corporate HR bot. Be direct and helpful.`;
}

export async function POST(req: Request) {
  const body = await req.json();
  const { messages, profile } = body;

  // Input validation
  if (!Array.isArray(messages) || messages.length > 100) {
    return Response.json(
      { error: "Invalid or too many messages" },
      { status: 400 }
    );
  }

  const result = streamText({
    model: anthropic("claude-haiku-4-20250414"),
    system: buildSystemPrompt(profile),
    messages,
    tools: {
      update_profile: tool({
        description:
          "Update the job seeker's profile with information extracted from the conversation. Call this after each user message to save structured data.",
        inputSchema: z.object({
          field: z.enum([
            "targetRole",
            "seniority",
            "experience",
            "skills",
            "domain",
            "location",
            "remote",
            "salaryRange",
            "companyStage",
            "dealbreakers",
          ]),
          value: z.union([
            z.string(),
            z.number(),
            z.boolean(),
            z.array(z.string()),
            z.object({
              min: z.number(),
              max: z.number(),
              currency: z.string(),
            }),
          ]),
        }),
      }),
      onboarding_complete: tool({
        description:
          "Mark onboarding as complete when you have enough profile information (at minimum: targetRole, skills, location).",
        inputSchema: z.object({
          complete: z.boolean(),
        }),
      }),
    },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
