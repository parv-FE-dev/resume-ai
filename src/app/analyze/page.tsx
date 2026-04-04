"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { StepProgress } from "@/components/analyze/StepProgress";
import { ResumeInput } from "@/components/analyze/ResumeInput";
import { JobDescInput } from "@/components/analyze/JobDescInput";
import { AnalysisView } from "@/components/analyze/AnalysisView";
import { Navbar } from "@/components/shared/Navbar";
import type { AnalysisResult } from "@/types";
import { useEffect } from "react";

function AnalyzingState() {
  const { resume, jobDescription, setAnalysis, setCurrentStep, setError } =
    useResumeStore();

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
          }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Analysis failed");

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error("No response stream");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
        }

        const analysis: AnalysisResult = JSON.parse(fullText);
        setAnalysis(analysis);
        setCurrentStep("results");
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
          setCurrentStep("job-description");
        }
      }
    }

    run();
    return () => controller.abort();
  }, [resume, jobDescription, setAnalysis, setCurrentStep, setError]);

  return (
    <div className="flex flex-col items-center gap-6 py-20">
      <Loader2 className="h-10 w-10 animate-spin text-violet-400" />
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white">
          Analyzing your resume...
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          AI is comparing your resume against the job description
        </p>
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  const { currentStep } = useResumeStore();

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-28">
        <div className="mb-12">
          <StepProgress currentStep={currentStep} />
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
            {currentStep === "analyzing" && <AnalyzingState />}
            {currentStep === "results" && <AnalysisView />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
