"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, RotateCcw, Clock, Trash2 } from "lucide-react";
import { useResumeStore, type HistoryEntry } from "@/store/useResumeStore";
import { StepProgress } from "@/components/analyze/StepProgress";
import { ResumeInput } from "@/components/analyze/ResumeInput";
import { JobDescInput } from "@/components/analyze/JobDescInput";
import { AnalysisView } from "@/components/analyze/AnalysisView";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { AnalysisResult } from "@/types";

function AnalyzingState() {
  const {
    resume,
    jobDescription,
    streamingText,
    setStreamingText,
    setAnalysis,
    setCurrentStep,
    setError,
  } = useResumeStore();

  useEffect(() => {
    if (!resume || !jobDescription) return;

    const controller = new AbortController();
    let fullText = "";

    async function run() {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resumeText: resume!.rawText,
            jobDescription: jobDescription!.rawText,
            jobTitle: jobDescription!.title,
            company: jobDescription!.company,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({ error: "Analysis failed" }));
          throw new Error(data.error || "Analysis failed");
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error("No response stream");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
          setStreamingText(fullText);
        }

        // Try to parse JSON from the streamed text
        // The AI might wrap it in markdown code blocks
        let jsonText = fullText.trim();
        const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          jsonText = jsonMatch[1].trim();
        }

        const analysis: AnalysisResult = JSON.parse(jsonText);
        setAnalysis(analysis);
        setCurrentStep("results");
        toast.success("Analysis complete!");
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        const message =
          err instanceof Error ? err.message : "Something went wrong";

        // Try parsing what we have if it's a JSON parse error
        if (fullText && message.includes("JSON")) {
          setError(
            "The AI response could not be parsed. Please try again."
          );
        } else {
          setError(message);
        }
        setCurrentStep("analyzing");
      }
    }

    run();
    return () => controller.abort();
  }, [resume, jobDescription, setAnalysis, setCurrentStep, setError, setStreamingText]);

  return null;
}

function StreamingDisplay() {
  const { streamingText, error, setError, setCurrentStep } = useResumeStore();

  const handleRetry = () => {
    setError(null);
    setCurrentStep("analyzing");
  };

  if (error) {
    return (
      <div className="flex flex-col items-center gap-6 py-20">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
          <AlertCircle className="h-7 w-7 text-red-400" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">
            Analysis Failed
          </h2>
          <p className="mt-2 max-w-md text-sm text-zinc-500">{error}</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={() => {
              setError(null);
              setCurrentStep("job-description");
            }}
            className="gap-2 text-zinc-400"
          >
            Go Back
          </Button>
          <Button
            onClick={handleRetry}
            className="gap-2 bg-emerald-500 text-white hover:bg-emerald-400"
          >
            <RotateCcw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-16">
      {/* Thinking animation */}
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 ring-1 ring-emerald-500/20">
          <Loader2 className="h-7 w-7 animate-spin text-emerald-400" />
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white">
          Analyzing your resume...
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          AI is comparing your resume against the job description
        </p>
      </div>

      {/* Progress bar animation */}
      <div className="w-full max-w-xs overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          className="h-1 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          initial={{ width: "0%" }}
          animate={{ width: streamingText ? "85%" : "30%" }}
          transition={{ duration: streamingText ? 2 : 8, ease: "easeOut" }}
        />
      </div>

      {/* Streaming text preview */}
      {streamingText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-zinc-500">
                AI is generating...
              </span>
            </div>
            <pre className="max-h-40 overflow-auto whitespace-pre-wrap font-mono text-xs text-zinc-500">
              {streamingText.slice(-500)}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function HistorySidebar() {
  const { history, loadFromHistory, clearHistory, currentStep } = useResumeStore();
  const [open, setOpen] = useState(false);

  if (history.length === 0 || currentStep === "analyzing") return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="gap-2 text-zinc-500 hover:text-white"
      >
        <Clock className="h-4 w-4" />
        History ({history.length})
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 top-10 z-50 w-80 rounded-xl border border-white/10 bg-zinc-950 p-3 shadow-2xl"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">
                Past Analyses
              </span>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  clearHistory();
                  setOpen(false);
                  toast("History cleared");
                }}
                className="h-6 gap-1 px-2 text-xs text-zinc-600 hover:text-red-400"
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </Button>
            </div>
            <div className="max-h-60 space-y-1.5 overflow-auto">
              {history.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => {
                    loadFromHistory(entry);
                    setOpen(false);
                    toast("Loaded previous analysis");
                  }}
                  className="w-full rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-left transition-colors hover:bg-white/[0.05]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">
                      {entry.jobTitle}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        entry.score >= 80
                          ? "text-emerald-400"
                          : entry.score >= 60
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {entry.score}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-zinc-600">
                    {entry.resumeSnippet}
                  </p>
                  <p className="mt-0.5 text-[10px] text-zinc-700">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AnalyzePage() {
  const { currentStep } = useResumeStore();

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-28">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex-1">
            <StepProgress currentStep={currentStep} />
          </div>
          <HistorySidebar />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === "upload" && <ResumeInput />}
            {currentStep === "job-description" && <JobDescInput />}
            {currentStep === "analyzing" && (
              <>
                <AnalyzingState />
                <StreamingDisplay />
              </>
            )}
            {currentStep === "results" && <AnalysisView />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
