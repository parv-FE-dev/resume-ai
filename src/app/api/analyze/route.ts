import { createMockStream } from "@/lib/mock-analysis";

const DEMO_MODE = process.env.DEMO_MODE === "true";

function mockResponse() {
  return new Response(createMockStream(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription, jobTitle, company } = await req.json();

    if (!resumeText || !jobDescription) {
      return Response.json(
        { error: "Resume text and job description are required" },
        { status: 400 }
      );
    }

    // Demo mode or no API key: return mock analysis
    if (DEMO_MODE || !process.env.ANTHROPIC_API_KEY) {
      return mockResponse();
    }

    // Try real AI analysis
    try {
      const { analyzeResume } = await import("@/lib/resume-analyzer");

      const fullJD = [
        jobTitle && `Job Title: ${jobTitle}`,
        company && `Company: ${company}`,
        jobDescription,
      ]
        .filter(Boolean)
        .join("\n");

      const result = await analyzeResume(resumeText, fullJD);

      // Consume the stream and check for errors before returning
      const textStream = result.textStream;
      let fullText = "";
      
      for await (const chunk of textStream) {
        fullText += chunk;
      }

      if (!fullText.trim()) {
        console.log("Empty AI response, falling back to demo");
        return mockResponse();
      }

      // Return the collected text as a stream
      return new Response(fullText, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    } catch (apiError) {
      console.error("AI API error, falling back to demo:", (apiError as Error).message);
      return mockResponse();
    }
  } catch (error) {
    console.error("Analysis error:", error);
    return Response.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
