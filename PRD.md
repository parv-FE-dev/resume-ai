# 📄 Product Requirements Document — ResumeAI

## Overview
**ResumeAI** is an AI-powered resume analyzer and optimizer that helps job seekers tailor their resumes to specific job descriptions. Users upload their resume, paste a target job description, and receive instant AI-driven analysis including match scoring, keyword gap detection, bullet point rewrites, and actionable suggestions.

## Problem Statement
Job seekers spend hours manually comparing their resumes against job descriptions, often missing critical keywords and failing to quantify their achievements. ATS (Applicant Tracking Systems) reject ~75% of resumes before a human sees them. There's no fast, intelligent tool that gives actionable, JD-specific resume feedback in real-time.

## Target Users
- **Primary:** Active job seekers (software engineers, product managers, designers) applying to 10+ jobs
- **Secondary:** Career coaches, resume reviewers, university career centers
- **Tertiary:** Recruiters wanting to evaluate resume-JD fit quickly

## Goals & Success Metrics
| Goal | Metric | Target |
|------|--------|--------|
| User engagement | Analyses completed per session | ≥ 2 |
| Retention | Return within 7 days | ≥ 30% |
| Perceived value | "Would recommend" (NPS) | ≥ 50 |
| Performance | Time to first analysis result | < 8 seconds |

---

## Core Features

### P0 — Must Have (MVP)

#### 1. Resume Input
- Paste resume as plain text
- Upload PDF with automatic text extraction
- Character count and validation (min 100 chars)
- Drag & drop support

#### 2. Job Description Input
- Paste full job description text
- Optional: Job title and company name fields
- Validation (min 50 chars)

#### 3. AI Analysis Engine
- **Match Score (0-100):** Overall compatibility score with color-coded ring visualization
- **Keyword Gap Analysis:** Missing keywords from JD grouped by importance (high/medium/low)
- **Bullet Point Rewriting:** Identify weak bullets, explain issues, provide AI-rewritten alternatives
- **Actionable Suggestions:** Prioritized recommendations categorized by content, format, keywords, structure
- **Strengths:** What the resume already does well

#### 4. Results Dashboard
- Animated score ring with count-up effect
- Tab navigation: Overview | Keywords | Bullets | Suggestions
- Copy individual rewrites or all suggestions
- Start over / analyze another JD

#### 5. Streaming UX
- Real-time text streaming while AI generates response
- Smooth transition from streaming → structured results
- Retry on failure with user-friendly error messages

### P1 — Should Have

#### 6. Analysis History
- Save past analyses to localStorage
- History sidebar/dropdown showing previous resume-JD pairs
- Click to restore a previous analysis
- Clear history option

#### 7. Export
- Download optimized resume as text/markdown
- Copy all AI suggestions to clipboard
- Print-friendly results view

#### 8. Dark/Light Mode
- Default: dark theme (premium feel)
- Toggle via ThemeProvider (next-themes)
- Persisted preference

### P2 — Nice to Have

#### 9. Compare Mode
- Side-by-side: Original resume vs AI-optimized version
- Highlight changes with diff colors

#### 10. Multi-JD Targeting
- Analyze same resume against multiple job descriptions
- Compare scores across JDs in a summary table

#### 11. Resume Templates
- Offer 2-3 resume structure templates based on industry
- Suggest restructuring if current format is suboptimal

#### 12. Share Results
- Generate shareable link or screenshot-friendly card
- Social sharing (LinkedIn, Twitter)

---

## Technical Architecture

### Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, SSR/SSG) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui + Radix |
| State | Zustand |
| Animation | Framer Motion |
| AI | Vercel AI SDK + Anthropic Claude Sonnet |
| PDF Parsing | pdf-parse (server-side) |
| Deployment | Vercel |

### API Routes
| Route | Method | Description |
|-------|--------|-------------|
| `/api/analyze` | POST | Stream AI analysis (resume + JD → structured JSON) |
| `/api/parse-pdf` | POST | Extract text from uploaded PDF |

### Data Flow
```
User uploads resume → Store in Zustand
User pastes JD → Store in Zustand
User clicks "Analyze" → POST /api/analyze
API streams Claude response → Display real-time
Stream complete → Parse JSON → Render structured results
Results saved to localStorage for history
```

### State Shape (Zustand)
```typescript
interface ResumeStore {
  resume: ResumeData | null
  jobDescription: JobDescription | null
  analysis: AnalysisResult | null
  currentStep: 'upload' | 'job-description' | 'analyzing' | 'results'
  isAnalyzing: boolean
  error: string | null
  history: HistoryEntry[]
}
```

---

## Design Guidelines
- **Aesthetic:** Dark, premium, minimal — inspired by Linear, Vercel, Raycast
- **Colors:** Zinc/neutral base, violet/blue accents, semantic colors for scores (green/yellow/red)
- **Typography:** Inter or system font stack, clear hierarchy
- **Motion:** Subtle, purposeful animations (entrance, score counting, tab transitions)
- **Mobile:** Fully responsive, touch-friendly tap targets

## Non-Functional Requirements
- **Performance:** First Contentful Paint < 1.5s, analysis start < 500ms after click
- **Accessibility:** WCAG 2.1 AA (keyboard nav, screen reader labels, color contrast)
- **Security:** API key server-side only, no PII stored server-side, rate limiting on API routes
- **SEO:** Proper meta tags, OG images, semantic HTML

---

## Milestones

| Phase | Scope | Timeline |
|-------|-------|----------|
| Phase 1 | Core MVP (P0 features) | Day 1-2 |
| Phase 2 | Polish + History (P1) | Day 2-3 |
| Phase 3 | Differentiators (P2) | Day 3-4 |
| Phase 4 | Deploy + README + Demo | Day 4 |

## Open Questions
1. Should we add user accounts (Clerk/NextAuth) for cloud-saved history?
2. Rate limiting strategy — per IP? Per session?
3. Should we support other AI providers as fallback (OpenAI, Gemini)?
4. Resume format output — just text, or generate styled PDF?

---

*Author: Parv Saxena | Last Updated: April 2026*
