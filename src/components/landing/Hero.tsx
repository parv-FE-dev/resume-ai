"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

function AnalysisPreviewCard() {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference * (1 - 0.78);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, rotateY: -8 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
      className="relative w-full max-w-md"
    >
      {/* Glow behind the card */}
      <div className="absolute -inset-4 rounded-3xl bg-emerald-500/10 blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/90 p-6 backdrop-blur-xl shadow-2xl shadow-emerald-500/5">
        {/* Header bar */}
        <div className="mb-5 flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
          <span className="ml-2 text-[10px] font-medium text-zinc-600">
            resume-analysis.json
          </span>
        </div>

        {/* Score gauge */}
        <div className="mb-5 flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <svg width="80" height="80" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                strokeWidth="7"
                className="stroke-zinc-800"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                strokeWidth="7"
                strokeLinecap="round"
                className="stroke-emerald-400"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              <span className="text-xl font-bold text-emerald-400">78</span>
            </motion.div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">ATS Match Score</p>
            <p className="text-xs text-zinc-500">
              Strong technical fit — needs keyword optimization
            </p>
          </div>
        </div>

        {/* Keyword badges */}
        <div className="mb-4">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
            Keywords
          </p>
          <div className="flex flex-wrap gap-1.5">
            {["React", "TypeScript", "Node.js"].map((kw) => (
              <span
                key={kw}
                className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400"
              >
                {kw} ✓
              </span>
            ))}
            {["Kubernetes", "CI/CD"].map((kw) => (
              <span
                key={kw}
                className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-[11px] font-medium text-red-400"
              >
                {kw} ✗
              </span>
            ))}
          </div>
        </div>

        {/* Sample rewrite */}
        <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
          <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
            AI Rewrite
          </p>
          <p className="text-[11px] leading-relaxed text-zinc-500 line-through decoration-red-400/40">
            &quot;Worked on frontend development&quot;
          </p>
          <p className="mt-1 text-[11px] font-medium leading-relaxed text-emerald-400">
            &quot;Architected React dashboard serving 50K+ DAU with sub-200ms
            interactions&quot;
          </p>
        </div>

        {/* Scanning line animation */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="animate-scan absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-16">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-emerald-500/8 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-emerald-600/6 blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,.15) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-16">
        {/* Left side — 60% */}
        <div className="flex-[3] text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Stat badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm text-emerald-400"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Your AI-powered career agent
            </motion.div>

            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              From Resume to{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                Offer Letter
              </span>{" "}
              — On Autopilot
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400 lg:text-xl"
            >
              An AI career agent that learns your goals, optimizes your resume,
              finds matching jobs in real-time, generates cover letters, and
              tracks your applications — end to end.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row lg:justify-start justify-center"
            >
              <Link
                href="/chat"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 text-base font-semibold text-white transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                Start Your Job Search
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-white/10 px-8 text-base font-medium text-zinc-300 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-white"
              >
                See What It Does
                <ChevronDown className="h-4 w-4" />
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Right side — 40% */}
        <div className="flex-[2] flex justify-center lg:justify-end">
          <AnalysisPreviewCard />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-zinc-600" />
        </motion.div>
      </motion.div>
    </section>
  );
}
