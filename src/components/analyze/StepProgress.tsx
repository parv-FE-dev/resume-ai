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

const stepOrder: AnalysisStep[] = [
  "upload",
  "job-description",
  "analyzing",
  "results",
];

export function StepProgress({ currentStep }: { currentStep: AnalysisStep }) {
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="flex items-center justify-center gap-1">
      {steps.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={step.key} className="flex items-center gap-1">
            <div className="flex items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.05 : 1,
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
                    className={isCurrent ? "text-white" : "text-zinc-500"}
                  >
                    {i + 1}
                  </span>
                )}
              </motion.div>
              <span
                className={`hidden text-sm font-medium sm:block ${
                  isCurrent || isCompleted ? "text-white" : "text-zinc-600"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Progress connector */}
            {i < steps.length - 1 && (
              <div className="relative h-1 w-8 overflow-hidden rounded-full bg-zinc-800 sm:w-12">
                <motion.div
                  initial={false}
                  animate={{
                    width: isCompleted ? "100%" : "0%",
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
