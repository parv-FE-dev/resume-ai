"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreCard } from "./ScoreCard";
import { KeywordGaps } from "./KeywordGaps";
import { BulletRewriter } from "./BulletRewriter";
import { Suggestions } from "./Suggestions";
import { useResumeStore } from "@/store/useResumeStore";

export function AnalysisView() {
  const { analysis, setCurrentStep, reset } = useResumeStore();

  if (!analysis) return null;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ScoreCard score={analysis.score} summary={analysis.summary} />
      </motion.div>

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
        >
          <h3 className="mb-3 text-lg font-semibold text-white">Strengths</h3>
          <ul className="space-y-2">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                {s}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <KeywordGaps gaps={analysis.keywordGaps} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <BulletRewriter bullets={analysis.weakBullets} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Suggestions suggestions={analysis.suggestions} />
      </motion.div>

      <div className="flex justify-between pt-4">
        <Button
          variant="ghost"
          onClick={reset}
          className="gap-2 text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Start Over
        </Button>
        <Button className="gap-2 bg-white text-black hover:bg-zinc-200">
          <Download className="h-4 w-4" />
          Export Resume
        </Button>
      </div>
    </div>
  );
}
