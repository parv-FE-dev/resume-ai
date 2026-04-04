import { analyzeResume } from "@/lib/resume-analyzer";

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return Response.json(
        { error: "Resume text and job description are required" },
        { status: 400 }
      );
    }

    const result = await analyzeResume(resumeText, jobDescription);

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Analysis error:", error);
    return Response.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
