import { MOCK_JOBS } from "@/lib/mock-jobs";
import type { DigestJob } from "@/types/autopilot";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { profile, seenJobIds = [] } = await req.json();

    if (!profile?.targetRole) {
      return Response.json(
        { error: "Profile with targetRole required" },
        { status: 400 }
      );
    }

    let allJobs: DigestJob[] = [];

    // Try live search
    if (process.env.SERPAPI_KEY) {
      try {
        const query = `${profile.targetRole} ${profile.skills?.slice(0, 3).join(" ") || ""}`;
        const params = new URLSearchParams({
          engine: "google_jobs",
          q: profile.remote ? `${query} remote` : query,
          location: profile.location || "India",
          api_key: process.env.SERPAPI_KEY,
        });

        const res = await fetch(`https://serpapi.com/search?${params}`);
        if (res.ok) {
          const data = await res.json();
          const results = data.jobs_results || [];
          allJobs = results.slice(0, 20).map(
            (
              item: {
                job_id?: string;
                title?: string;
                company_name?: string;
                location?: string;
                via?: string;
                apply_options?: { link?: string }[];
              },
              i: number
            ) => ({
              id: item.job_id || `auto-${i}-${Date.now()}`,
              title: item.title || "Untitled",
              company: item.company_name || "Unknown",
              location: item.location || "",
              remote: item.location?.toLowerCase().includes("remote") || false,
              matchScore: 0,
              sourceUrl: item.apply_options?.[0]?.link || "#",
              source: item.via?.replace("via ", "") || "Google Jobs",
            })
          );
        }
      } catch (err) {
        console.error("Autopilot SerpAPI error:", err);
      }
    }

    // Fallback to mock
    if (allJobs.length === 0) {
      allJobs = MOCK_JOBS.map((j) => ({
        id: j.id,
        title: j.title,
        company: j.company,
        location: j.location,
        remote: j.remote,
        matchScore: j.matchScore,
        sourceUrl: j.sourceUrl,
        source: j.source,
      }));
    }

    // Deduplicate against seen jobs
    const seenSet = new Set(seenJobIds);
    const newJobs = allJobs.filter((j) => !seenSet.has(j.id));
    const newJobIds = newJobs.map((j) => j.id);

    // Stats
    const avgScore =
      newJobs.length > 0
        ? Math.round(
            newJobs.reduce((sum, j) => sum + j.matchScore, 0) / newJobs.length
          )
        : 0;

    return Response.json({
      newJobs: newJobs.slice(0, 15),
      newJobIds,
      stats: {
        totalFound: allJobs.length,
        newMatches: newJobs.length,
        avgScore,
      },
    });
  } catch (error) {
    console.error("Autopilot run error:", error);
    return Response.json(
      { error: "Autopilot run failed" },
      { status: 500 }
    );
  }
}

// Vercel Cron handler (GET for cron triggers)
export async function GET() {
  return Response.json({
    message: "Autopilot cron endpoint. Use POST with profile data to run.",
    status: "ready",
  });
}
