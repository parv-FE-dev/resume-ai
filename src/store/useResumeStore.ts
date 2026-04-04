import { create } from "zustand";
import type {
  ResumeData,
  JobDescription,
  AnalysisResult,
  AnalysisStep,
} from "@/types";

interface HistoryEntry {
  id: string;
  timestamp: number;
  resumeSnippet: string;
  jobTitle: string;
  score: number;
  analysis: AnalysisResult;
  resume: ResumeData;
  jobDescription: JobDescription;
}

interface ResumeStore {
  resume: ResumeData | null;
  jobDescription: JobDescription | null;
  analysis: AnalysisResult | null;
  currentStep: AnalysisStep;
  isAnalyzing: boolean;
  streamingText: string;
  error: string | null;
  history: HistoryEntry[];

  setResume: (resume: ResumeData) => void;
  setJobDescription: (jd: JobDescription) => void;
  setAnalysis: (analysis: AnalysisResult) => void;
  setCurrentStep: (step: AnalysisStep) => void;
  setIsAnalyzing: (value: boolean) => void;
  setStreamingText: (text: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  loadFromHistory: (entry: HistoryEntry) => void;
  clearHistory: () => void;
}

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("resumeai-history");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: HistoryEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("resumeai-history", JSON.stringify(history.slice(0, 20)));
  } catch {
    // localStorage full or unavailable
  }
}

function loadLastAnalysis(): Partial<ResumeStore> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("resumeai-last");
    if (!raw) return {};
    const data = JSON.parse(raw);
    if (data.analysis) {
      return {
        resume: data.resume,
        jobDescription: data.jobDescription,
        analysis: data.analysis,
        currentStep: "results" as AnalysisStep,
      };
    }
  } catch {
    // ignore
  }
  return {};
}

function persistLast(state: {
  resume: ResumeData | null;
  jobDescription: JobDescription | null;
  analysis: AnalysisResult | null;
}) {
  if (typeof window === "undefined") return;
  try {
    if (state.analysis) {
      localStorage.setItem("resumeai-last", JSON.stringify(state));
    }
  } catch {
    // ignore
  }
}

const initialState = {
  resume: null as ResumeData | null,
  jobDescription: null as JobDescription | null,
  analysis: null as AnalysisResult | null,
  currentStep: "upload" as AnalysisStep,
  isAnalyzing: false,
  streamingText: "",
  error: null as string | null,
  history: [] as HistoryEntry[],
};

export const useResumeStore = create<ResumeStore>()((set, get) => {
  // Load persisted state on creation (client-side only)
  const persisted = typeof window !== "undefined" ? loadLastAnalysis() : {};
  const history = typeof window !== "undefined" ? loadHistory() : [];

  return {
    ...initialState,
    ...persisted,
    history,

    setResume: (resume) => set({ resume, error: null }),
    setJobDescription: (jobDescription) => set({ jobDescription, error: null }),
    setAnalysis: (analysis) => {
      const state = get();
      const resume = state.resume;
      const jobDescription = state.jobDescription;

      // Save to localStorage
      persistLast({ resume, jobDescription, analysis });

      // Add to history
      if (resume && jobDescription) {
        const entry: HistoryEntry = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          resumeSnippet: resume.rawText.slice(0, 100),
          jobTitle: jobDescription.title || "Untitled",
          score: analysis.score,
          analysis,
          resume,
          jobDescription,
        };
        const newHistory = [entry, ...state.history].slice(0, 20);
        saveHistory(newHistory);
        set({ analysis, isAnalyzing: false, streamingText: "", history: newHistory });
      } else {
        set({ analysis, isAnalyzing: false, streamingText: "" });
      }
    },
    setCurrentStep: (currentStep) => set({ currentStep }),
    setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
    setStreamingText: (streamingText) => set({ streamingText }),
    setError: (error) => set({ error, isAnalyzing: false, streamingText: "" }),
    reset: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("resumeai-last");
      }
      set({
        ...initialState,
        history: get().history,
      });
    },
    loadFromHistory: (entry) => {
      set({
        resume: entry.resume,
        jobDescription: entry.jobDescription,
        analysis: entry.analysis,
        currentStep: "results",
        isAnalyzing: false,
        streamingText: "",
        error: null,
      });
    },
    clearHistory: () => {
      saveHistory([]);
      set({ history: [] });
    },
  };
});

export type { HistoryEntry };
