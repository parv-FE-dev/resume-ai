# ResumeAI

AI-powered resume analyzer and optimizer. Upload your resume, paste a job description, and get instant AI analysis with match scoring, keyword gaps, and rewritten bullet points.

## Features

- **Match Scoring** — Instant compatibility score between your resume and the target job
- **Keyword Gap Analysis** — Identify missing keywords and skills recruiters are looking for
- **Bullet Point Rewriting** — AI rewrites weak bullets into quantified, impactful achievements
- **Actionable Suggestions** — Prioritized recommendations organized by impact
- **Streaming AI Responses** — Real-time analysis powered by GPT-4o
- **PDF Upload** — Upload PDF resumes with automatic text extraction
- **Export** — Download your optimized resume

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui
- **AI**: Vercel AI SDK + OpenAI GPT-4o
- **State**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **PDF Parsing**: pdf-parse

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API
│   ├── analyze/            # Multi-step analysis flow
│   └── api/analyze/        # Streaming AI analysis endpoint
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── landing/            # Landing page sections
│   ├── analyze/            # Analysis flow components
│   └── shared/             # Navbar, Footer, ThemeToggle
├── lib/                    # AI config, PDF parsing, utilities
├── store/                  # Zustand state management
└── types/                  # TypeScript interfaces
```

## License

MIT
