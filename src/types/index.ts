export interface ResumeData {
  rawText: string;
  fileName?: string;
  uploadedAt?: Date;
}

export interface JobDescription {
  rawText: string;
  title?: string;
  company?: string;
}

export interface AnalysisResult {
  score: number;
  summary: string;
  keywordGaps: KeywordGap[];
  weakBullets: WeakBullet[];
  suggestions: Suggestion[];
  strengths: string[];
}

export interface KeywordGap {
  keyword: string;
  importance: "high" | "medium" | "low";
  context: string;
}

export interface WeakBullet {
  original: string;
  issue: string;
  rewritten: string;
  section: string;
}

export interface Suggestion {
  category: "content" | "format" | "keywords" | "structure";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

export type AnalysisStep = "upload" | "job-description" | "analyzing" | "results";

export interface AppState {
  resume: ResumeData | null;
  jobDescription: JobDescription | null;
  analysis: AnalysisResult | null;
  currentStep: AnalysisStep;
  isAnalyzing: boolean;
  error: string | null;
}
