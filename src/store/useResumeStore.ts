import { create } from "zustand";
import type {
  ResumeData,
  JobDescription,
  AnalysisResult,
  AnalysisStep,
  BulletAction,
  ResumeVersion,
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
  bulletActions: Map<number, BulletAction>;
  versions: ResumeVersion[];
  activeVersionId: string | null;

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
  setBulletAction: (action: BulletAction) => void;
  removeBulletAction: (index: number) => void;
  acceptAllBullets: () => void;
  rejectAllBullets: () => void;
  clearBulletActions: () => void;
  saveVersion: (label: string) => void;
  setActiveVersion: (id: string) => void;
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

function loadVersions(): ResumeVersion[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("resumeai-versions");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveVersions(versions: ResumeVersion[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("resumeai-versions", JSON.stringify(versions.slice(0, 20)));
  } catch {
    // localStorage full
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
  bulletActions: new Map<number, BulletAction>(),
  versions: [] as ResumeVersion[],
  activeVersionId: null as string | null,
};

export const useResumeStore = create<ResumeStore>()((set, get) => {
  // Load persisted state on creation (client-side only)
  const persisted = typeof window !== "undefined" ? loadLastAnalysis() : {};
  const history = typeof window !== "undefined" ? loadHistory() : [];
  const versions = typeof window !== "undefined" ? loadVersions() : [];

  return {
    ...initialState,
    ...persisted,
    history,
    versions,

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

    setBulletAction: (action) => {
      const map = new Map(get().bulletActions);
      map.set(action.index, action);
      set({ bulletActions: map });
    },
    removeBulletAction: (index) => {
      const map = new Map(get().bulletActions);
      map.delete(index);
      set({ bulletActions: map });
    },
    acceptAllBullets: () => {
      const analysis = get().analysis;
      if (!analysis) return;
      const map = new Map<number, BulletAction>();
      analysis.weakBullets.forEach((_, i) => {
        map.set(i, { index: i, decision: "accepted" });
      });
      set({ bulletActions: map });
    },
    rejectAllBullets: () => {
      const analysis = get().analysis;
      if (!analysis) return;
      const map = new Map<number, BulletAction>();
      analysis.weakBullets.forEach((_, i) => {
        map.set(i, { index: i, decision: "rejected" });
      });
      set({ bulletActions: map });
    },
    clearBulletActions: () => {
      set({ bulletActions: new Map() });
    },

    saveVersion: (label) => {
      const { resume, analysis, bulletActions, versions } = get();
      if (!resume) return;

      let content = resume.rawText;
      if (analysis) {
        const sortedActions = Array.from(bulletActions.values())
          .filter((a) => a.decision === "accepted" || a.decision === "edited")
          .sort((a, b) => b.index - a.index);
        for (const action of sortedActions) {
          const bullet = analysis.weakBullets[action.index];
          if (!bullet) continue;
          const replacement =
            action.decision === "edited" && action.editedText
              ? action.editedText
              : bullet.rewritten;
          content = content.replace(bullet.original, replacement);
        }
      }

      const version: ResumeVersion = {
        id: crypto.randomUUID(),
        label,
        content,
        changes: Array.from(bulletActions.values()),
        timestamp: Date.now(),
      };
      const newVersions = [...versions, version];
      saveVersions(newVersions);
      set({ versions: newVersions, activeVersionId: version.id });
    },
    setActiveVersion: (id) => {
      set({ activeVersionId: id });
    },
  };
});

export type { HistoryEntry };
