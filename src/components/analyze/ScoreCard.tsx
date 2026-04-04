"use client";

import { motion } from "framer-motion";

interface ScoreCardProps {
  score: number;
  summary: string;
}

export function ScoreCard({ score, summary }: ScoreCardProps) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  const scoreColor =
    score >= 80
      ? "text-emerald-400"
      : score >= 60
        ? "text-yellow-400"
        : "text-red-400";

  const strokeColor =
    score >= 80
      ? "stroke-emerald-400"
      : score >= 60
        ? "stroke-yellow-400"
        : "stroke-red-400";

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/5 bg-white/[0.02] p-8 sm:flex-row">
      {/* Animated ring */}
      <div className="relative flex-shrink-0">
        <svg width="128" height="128" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r="54"
            fill="none"
            strokeWidth="8"
            className="stroke-zinc-800"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="54"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={strokeColor}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            transform="rotate(-90 64 64)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-3xl font-bold ${scoreColor}`}
          >
            {score}
          </motion.span>
        </div>
      </div>

      <div className="text-center sm:text-left">
        <h3 className="text-xl font-semibold text-white">Match Score</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{summary}</p>
      </div>
    </div>
  );
}
