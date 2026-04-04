import { createMockStream, MOCK_ANALYSIS } from "@/lib/mock-analysis";
import { getCached, setCache, getCacheKey } from "@/lib/cache";
import { checkRateLimit, incrementUsage } from "@/lib/rate-limiter";

const DEMO_MODE = process.env.DEMO_MODE === "true";

function getClientIP(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function rateLimitHeaders(remaining: number, resetAt: number) {
  return {
    "X-RateLimit-Limit": "3",
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(resetAt),
  };
}

export async function POST(request: Request) {
  try {
    const { resumeText, jobDescription, jobTitle, company } =
      await request.json();

    if (!resumeText || !jobDescription) {
      return Response.json(
        { error: "Resume text and job description are required" },
        { status: 400 }
      );
    }

    // Rate limiting
    const ip = getClientIP(request);
    const { allowed, remaining, resetAt } = checkRateLimit(ip);

    if (!allowed) {
      return Response.json(
        {
          error: "Daily limit reached",
          message:
            "You have used all 3 free analyses today. Come back tomorrow or upgrade for unlimited access.",
          resetAt,
          upgradeUrl: "/pricing",
        },
        {
          status: 429,
          headers: rateLimitHeaders(0, resetAt),
        }
      );
    }

    // Check cache
    const cacheKey = getCacheKey(resumeText, jobDescription);
    const cached = getCached(cacheKey);

    if (cached) {
      incrementUsage(ip);
      const rl = checkRateLimit(ip);
      return new Response(cached, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Cache": "HIT",
          ...rateLimitHeaders(rl.remaining, rl.resetAt),
        },
      });
    }

    // Cache miss — count usage
    incrementUsage(ip);
    const rlAfter = checkRateLimit(ip);
    const rlHeaders = rateLimitHeaders(rlAfter.remaining, rlAfter.resetAt);

    // Demo mode or no API key: return mock analysis
    if (DEMO_MODE || !process.env.ANTHROPIC_API_KEY) {
      const mockText = JSON.stringify(MOCK_ANALYSIS);
      setCache(cacheKey, mockText);

      return new Response(createMockStream(), {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Cache": "MISS",
          ...rlHeaders,
        },
      });
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

      const textStream = result.textStream;
      let fullText = "";

      for await (const chunk of textStream) {
        fullText += chunk;
      }

      if (!fullText.trim()) {
        console.log("Empty AI response, falling back to demo");
        const mockText = JSON.stringify(MOCK_ANALYSIS);
        setCache(cacheKey, mockText);
        return new Response(createMockStream(), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "X-Cache": "MISS",
            ...rlHeaders,
          },
        });
      }

      setCache(cacheKey, fullText);

      return new Response(fullText, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Cache": "MISS",
          ...rlHeaders,
        },
      });
    } catch (apiError) {
      console.error(
        "AI API error, falling back to demo:",
        (apiError as Error).message
      );
      const mockText = JSON.stringify(MOCK_ANALYSIS);
      setCache(cacheKey, mockText);
      return new Response(createMockStream(), {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Cache": "MISS",
          ...rlHeaders,
        },
      });
    }
  } catch (error) {
    console.error("Analysis error:", error);
    return Response.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
