# ResumeAI - AI-Powered Resume Optimizer

> Upload your resume, paste a job description, and get instant AI analysis with match scoring, keyword gaps, and rewritten bullet points that get you interviews.

<!-- Add screenshot here -->
<!-- ![ResumeAI Screenshot](./public/screenshot.png) -->

## Features

- **Match Scoring** - Instant 0-100 compatibility score with animated ring visualization
- **Keyword Gap Analysis** - Identifies missing keywords grouped by importance (high/medium/low)
- **Bullet Point Rewriting** - AI rewrites weak bullets into quantified, impactful achievements
- **Actionable Suggestions** - Prioritized recommendations by category (content, format, keywords, structure)
- **Strengths Highlighting** - Shows what your resume already does well
- **Real-time Streaming** - Watch the AI analyze in real-time with live text streaming
- **PDF Upload** - Drag & drop PDF upload with server-side text extraction
- **Analysis History** - Past analyses saved in localStorage for quick reference
- **Dark Mode** - Premium dark theme throughout

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 + custom OKLch theme
- **UI Components**: shadcn/ui with Base UI primitives
- **Animations**: Framer Motion
- **State Management**: Zustand
- **AI**: Anthropic Claude via Vercel AI SDK
- **PDF Parsing**: pdf-parse
- **Toasts**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/parvsharmaa/resume-ai.git
cd resume-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Tailwind + dark theme variables
│   ├── analyze/
│   │   └── page.tsx        # Multi-step analysis workflow
│   └── api/
│       ├── analyze/
│       │   └── route.ts    # AI analysis endpoint (streaming)
│       └── parse-pdf/
│           └── route.ts    # PDF text extraction endpoint
├── components/
│   ├── landing/            # Hero, Features, HowItWorks, CTA, DemoPreview
│   ├── analyze/            # StepProgress, ResumeInput, JobDescInput,
│   │                       # AnalysisView, ScoreCard, KeywordGaps,
│   │                       # BulletRewriter, Suggestions
│   ├── shared/             # Navbar, Footer
│   ├── ui/                 # shadcn/ui components
│   └── providers.tsx       # Client-side providers (Toaster)
├── store/
│   └── useResumeStore.ts   # Zustand store with localStorage persistence
├── lib/
│   ├── ai.ts               # Anthropic Claude config & prompts
│   ├── resume-analyzer.ts  # Streaming analysis function
│   ├── pdf-parser.ts       # PDF text extraction
│   └── utils.ts            # Utility functions
└── types/
    └── index.ts            # TypeScript interfaces
```

## How It Works

1. **Upload Resume** - Paste text or upload a PDF (extracted server-side)
2. **Paste Job Description** - Add the target job posting with optional title/company
3. **AI Analysis** - Claude analyzes your resume against the JD in real-time
4. **Review Results** - Navigate tabbed results: Overview, Keywords, Bullets, Suggestions

## License

MIT

---

Built by [Parv Saxena](https://github.com/parvsharmaa)
