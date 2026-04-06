# ResumeAI — AI Career Agent

> From resume to offer letter — on autopilot. An AI-powered career agent that optimizes your resume, discovers matching jobs, generates cover letters, and tracks applications end to end.

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Claude AI](https://img.shields.io/badge/Claude-AI-orange?style=flat-square)](https://anthropic.com)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-6-black?style=flat-square)](https://sdk.vercel.ai/)

## 🎯 What It Does

**ResumeAI** is not just another resume analyzer — it's a full AI career agent with 6 interconnected workflows:

### 1. 💬 Conversational Onboarding
Chat naturally with the AI agent about your career goals. It builds a structured profile (target role, skills, salary, preferences) through conversation — not forms.

### 2. 📄 Smart Resume Analysis
Upload your PDF and the agent analyzes it against your career profile — not just a single JD. Get match scoring, keyword gap detection, and strength identification.

### 3. ✏️ AI Bullet Rewrites
Each weak bullet gets a suggested rewrite. Accept ✅, reject ❌, or edit ✏️ each suggestion individually. Batch actions. Version management. Export optimized resume as PDF.

### 4. 🔍 Job Discovery
Auto-matched jobs via SerpAPI (Google Jobs). Match scoring algorithm, filters (remote, salary, source, score), save/dismiss, expandable "why this matches" per job.

### 5. 📋 Application Tracker
Kanban board: Saved → Applied → In Review → Interview → Rejected → Offer. Per-application cover letter generation (3 tones), notes, status timeline, follow-up reminders.

### 6. 🤖 Autopilot
Scheduled job searches that run automatically. Configurable frequency (daily/weekly/biweekly), digest history with new matches and follow-up reminders. Vercel Cron ready.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| AI | Claude via Vercel AI SDK v6 (streaming, tool calling) |
| Job Search | SerpAPI (Google Jobs) |
| State | Zustand + localStorage persistence |
| Styling | Tailwind CSS 4 |
| UI | shadcn/ui + Framer Motion |
| PDF | Browser print API (ATS-friendly) |
| Deploy | Vercel |

## 🏗️ Architecture Highlights

- **Agent Loop**: Claude with multi-step tool calling for profile extraction
- **Streaming UI**: Real-time token streaming with typing indicators
- **Client Persistence**: All state persisted in localStorage — no database needed for v1
- **Graceful Degradation**: Mock data fallback when API keys aren't configured (demo mode)
- **Progressive Enhancement**: Profile card fills in real-time as the agent learns about you

## 🚀 Getting Started

```bash
git clone https://github.com/parvsaxena/resume-ai.git
cd resume-ai
npm install
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY and optionally SERPAPI_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/          # Resume analysis (JD-based)
│   │   ├── analyze-profile/  # Resume analysis (profile-based)
│   │   ├── autopilot/run/    # Cron-ready autopilot endpoint
│   │   ├── chat/             # Agent chat with tool calling
│   │   ├── jobs/
│   │   │   ├── cover-letter/ # AI cover letter generation
│   │   │   └── search/       # Job search (SerpAPI + mock)
│   │   └── parse-pdf/        # PDF text extraction
│   ├── analyze/              # Resume analysis page
│   ├── chat/                 # Agent chat page
│   ├── dashboard/            # Application tracker (kanban)
│   ├── jobs/                 # Job discovery page
│   └── settings/             # Autopilot configuration
├── components/
│   ├── analyze/              # Analysis UI components
│   ├── chat/                 # Chat bubbles, input, profile card
│   ├── dashboard/            # Kanban board, application detail
│   ├── jobs/                 # Job cards, filters
│   ├── landing/              # Landing page sections
│   ├── shared/               # Navbar, Footer, DemoBanner
│   └── ui/                   # shadcn/ui components
├── store/                    # Zustand stores (agent, resume, jobs, versions, applications, autopilot)
├── types/                    # TypeScript interfaces
└── lib/                      # AI config, utilities, mock data
```

## 🎨 Design

- **Theme**: Dark mode, VS Code-inspired, developer-focused
- **Colors**: Zinc backgrounds, emerald accents, glassmorphism cards
- **Animations**: Framer Motion throughout — scroll reveals, typing indicators, score rings, staggered lists
- **Mobile**: Fully responsive with mobile navigation

## 📊 Key Technical Decisions

1. **Claude Haiku for cost optimization** — sufficient quality for resume analysis and onboarding at a fraction of the cost
2. **Vercel AI SDK v6 tool calling** — agent autonomously extracts structured data from natural conversation
3. **localStorage over database** — keeps v1 simple, zero infrastructure, instant persistence
4. **SerpAPI for job search** — most comprehensive Google Jobs access, clean API
5. **Browser print for PDF** — avoids heavy PDF libraries, ATS-friendly output

## 👤 Author

**Parv Saxena** — Senior Frontend Engineer
- Portfolio: [parvsaxena.com](https://parvsaxena.com)
- GitHub: [@parvsaxena](https://github.com/parvsaxena)

## License

MIT
