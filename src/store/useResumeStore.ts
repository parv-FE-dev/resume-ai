import { create } from "zustand";
import type {
  ResumeData,
  JobDescription,
  AnalysisResult,
  AnalysisStep,
} from "@/types";

interface ResumeStore {
  resume: ResumeData | null;
  jobDescription: JobDescription | null;
  analysis: AnalysisResult | null;
  currentStep: AnalysisStep;
  isAnalyzing: boolean;
  error: string | null;

  setResume: (resume: ResumeData) => void;
  setJobDescription: (jd: JobDescription) => void;
  setAnalysis: (analysis: AnalysisResult) => void;
  setCurrentStep: (step: AnalysisStep) => void;
  setIsAnalyzing: (value: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  resume: null,
  jobDescription: null,
  analysis: null,
  currentStep: "upload" as AnalysisStep,
  isAnalyzing: false,
  error: null,
};

export const useResumeStore = create<ResumeStore>()((set) => ({
  ...initialState,

  setResume: (resume) => set({ resume, error: null }),
  setJobDescription: (jobDescription) => set({ jobDescription, error: null }),
  setAnalysis: (analysis) => set({ analysis, isAnalyzing: false }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setError: (error) => set({ error, isAnalyzing: false }),
  reset: () => set(initialState),
}));
