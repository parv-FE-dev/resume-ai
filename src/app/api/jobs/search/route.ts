import { MOCK_JOBS } from "@/lib/mock-jobs";
import type { Job } from "@/types/jobs";

export async function POST(req: Request) {
  try {
    const { query, location, remote, profile } = await req.json();

    // If SerpAPI key exists, use real search
    if (process.env.SERPAPI_KEY) {
      try {
        const jobs = await searchWithSerpAPI(query, location, remote);
        return Response.json({ jobs, source: "live" });
      } catch (err) {
        console.error("SerpAPI error, falling back to mock:", err);
      }
    }

    // Mock fallback — filter and return mock jobs
    let jobs = [...MOCK_JOBS];

    if (remote) {
      jobs = jobs.filter((j) => j.remote);
    }

    if (location) {
      const loc = location.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.location.toLowerCase().includes(loc) ||
          j.remote
      );
    }

    // Sort by match score
    jobs.sort((a, b) => b.matchScore - a.matchScore);

    return Response.json({ jobs, source: "demo" });
  } catch (error) {
    console.error("Job search error:", error);
    return Response.json(
      { error: "Failed to search jobs" },
      { status: 500 }
    );
  }
}

async function searchWithSerpAPI(
  query: string,
  location: string,
  remote: boolean
): Promise<Job[]> {
  const searchQuery = remote ? `${query} remote` : query;
  const params = new URLSearchParams({
    engine: "google_jobs",
    q: searchQuery,
    location: location || "India",
    api_key: process.env.SERPAPI_KEY!,
  });

  const res = await fetch(`https://serpapi.com/search?${params}`);
  if (!res.ok) throw new Error(`SerpAPI returned ${res.status}`);

  const data = await res.json();
  const results = data.jobs_results || [];

  return results.slice(0, 15).map(
    (
      item: {
        job_id?: string;
        title?: string;
        company_name?: string;
        location?: string;
        description?: string;
        detected_extensions?: {
          posted_at?: string;
          salary?: string;
        };
        apply_options?: { link?: string }[];
        via?: string;
      },
      i: number
    ) => ({
      id: item.job_id || `serp-${i}-${Date.now()}`,
      title: item.title || "Untitled",
      company: item.company_name || "Unknown",
      location: item.location || "",
      remote:
        item.location?.toLowerCase().includes("remote") ||
        item.description?.toLowerCase().includes("remote") ||
        false,
      description: item.description || "",
      requirements: [],
      source: item.via?.replace("via ", "") || "Google Jobs",
      sourceUrl: item.apply_options?.[0]?.link || "#",
      postedDate: new Date().toISOString(),
      matchScore: 0, // Will be scored client-side or by a scoring endpoint
      matchReasons: [],
      saved: false,
      dismissed: false,
    })
  );
}
