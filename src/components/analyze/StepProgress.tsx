"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { AnalysisStep } from "@/types";

const steps: { key: AnalysisStep; label: string }[] = [
  { key: "upload", label: "Resume" },
  { key: "job-description", label: "Job Description" },
  { key: "analyzing", label: "Analysis" },
  { key: "results", label: "Results" },
];

const stepOrder: AnalysisStep[] = ["upload", "job-description", "analyzing", "results"];

export function StepProgress({ currentStep }: { currentStep: AnalysisStep }) {
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={step.key} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1 : 0.9,
                  backgroundColor: isCompleted
                    ? "rgb(16, 185, 129)"
                    : isCurrent
                      ? "rgb(16, 185, 129)"
                      : "rgb(39, 39, 42)",
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium"
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <span
                    className={
                      isCurrent ? "text-white" : "text-zinc-500"
                    }
                  >
                    {i + 1}
                  </span>
                )}
              </motion.div>
              <span
                className={`hidden text-sm font-medium sm:block ${
                  isCurrent || isCompleted
                    ? "text-white"
                    : "text-zinc-600"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-px w-8 sm:w-12 ${
                  isCompleted ? "bg-emerald-500" : "bg-zinc-800"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
