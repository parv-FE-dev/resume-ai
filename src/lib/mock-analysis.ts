import type { AnalysisResult } from "@/types";

export const MOCK_ANALYSIS: AnalysisResult = {
  score: 72,
  summary:
    "Your resume demonstrates strong frontend engineering skills with relevant React and TypeScript experience. However, it lacks specific AI/ML integration examples and quantified impact metrics that this senior role requires. With targeted improvements to keyword alignment and bullet point specificity, you could significantly increase your match score.",
  keywordGaps: [
    {
      keyword: "AI integration",
      importance: "high",
      context:
        "The job description emphasizes AI-first product development. Your resume doesn't mention any AI/ML integration experience.",
    },
    {
      keyword: "System design",
      importance: "high",
      context:
        "Senior roles require system-level thinking. Add examples of architecture decisions you've made.",
    },
    {
      keyword: "Performance optimization",
      importance: "medium",
      context:
        "The role mentions building performant UIs. Include specific metrics like load time improvements or bundle size reductions.",
    },
    {
      keyword: "Team leadership",
      importance: "medium",
      context:
        "Senior engineers are expected to mentor. Mention any tech leads, code review practices, or mentoring you've done.",
    },
    {
      keyword: "CI/CD",
      importance: "low",
      context:
        "DevOps familiarity is a plus. Mention any pipeline setup or deployment automation experience.",
    },
    {
      keyword: "Streaming/real-time",
      importance: "medium",
      context:
        "AI products often involve streaming UIs. Highlight any WebSocket, SSE, or real-time data experience.",
    },
  ],
  weakBullets: [
    {
      original: "Worked on the frontend of the main product",
      issue:
        "Too vague — no specifics about what was built, technologies used, or impact achieved.",
      rewritten:
        "Architected and built the core dashboard UI using React 18 and TypeScript, serving 50K+ daily active users with sub-200ms interaction times.",
      section: "Experience",
    },
    {
      original: "Improved website performance",
      issue:
        "Missing quantification — how much improvement? What techniques were used?",
      rewritten:
        "Reduced Largest Contentful Paint by 40% through code splitting, lazy loading, and image optimization, improving Core Web Vitals score from 65 to 92.",
      section: "Experience",
    },
    {
      original: "Collaborated with the backend team on API integration",
      issue:
        "Passive language and lacks ownership. Doesn't show technical depth.",
      rewritten:
        "Designed and implemented a type-safe API client layer with React Query, reducing frontend API bugs by 60% and enabling optimistic updates across 15+ endpoints.",
      section: "Experience",
    },
    {
      original: "Built reusable components for the design system",
      issue:
        "Good start but needs scale and impact metrics.",
      rewritten:
        "Led the development of a 40+ component design system using Radix UI and Tailwind CSS, adopted by 3 product teams and reducing UI development time by 35%.",
      section: "Experience",
    },
  ],
  suggestions: [
    {
      category: "content",
      title: "Add AI/ML project experience",
      description:
        "Include at least one project involving AI API integration (OpenAI, Claude, etc.), streaming responses, or ML model deployment. This is critical for AI-first companies.",
      priority: "high",
    },
    {
      category: "keywords",
      title: "Mirror job description language",
      description:
        "Use exact phrases from the JD like 'AI-first', 'production-grade', and 'scalable frontend architecture' in your experience bullets.",
      priority: "high",
    },
    {
      category: "content",
      title: "Quantify every achievement",
      description:
        "Replace vague descriptions with specific numbers: users served, performance gains, team size, revenue impact, or deployment frequency.",
      priority: "high",
    },
    {
      category: "structure",
      title: "Add a Technical Skills section",
      description:
        "Create a dedicated skills section highlighting: React, Next.js, TypeScript, Tailwind, AI SDK, REST/GraphQL, testing frameworks.",
      priority: "medium",
    },
    {
      category: "format",
      title: "Lead with strongest experience",
      description:
        "Reorder bullets within each role to lead with the most impressive/relevant achievement first. Front-load impact.",
      priority: "medium",
    },
    {
      category: "content",
      title: "Add open source or side projects",
      description:
        "Include 1-2 portfolio projects that demonstrate AI integration, complex state management, or real-time features. Link to live demos.",
      priority: "medium",
    },
  ],
  strengths: [
    "Strong React and TypeScript foundation with 5 years of hands-on experience",
    "Experience with modern frameworks (Next.js, Vite) shows awareness of current ecosystem",
    "Demonstrated ability to work across the full frontend stack",
    "Clean career progression showing growth from mid-level to senior responsibilities",
  ],
};

// Simulate streaming by yielding chunks with delays
export function createMockStream(): ReadableStream {
  const jsonString = JSON.stringify(MOCK_ANALYSIS);
  const encoder = new TextEncoder();
  let index = 0;
  const chunkSize = 15; // characters per chunk

  return new ReadableStream({
    async pull(controller) {
      if (index >= jsonString.length) {
        controller.close();
        return;
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 20));

      const chunk = jsonString.slice(index, index + chunkSize);
      controller.enqueue(encoder.encode(chunk));
      index += chunkSize;
    },
  });
}
