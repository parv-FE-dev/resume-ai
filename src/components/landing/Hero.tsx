"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 pt-16">
      {/* Background gradient effects — emerald tinted */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/8 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-emerald-600/6 blur-[100px]" />
        <div className="absolute left-0 top-1/2 h-[300px] w-[300px] -translate-x-1/4 rounded-full bg-amber-500/4 blur-[80px]" />
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

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-[10%] top-[25%] hidden rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 backdrop-blur-sm lg:block">
          ATS Score: 92
        </div>
        <div className="absolute right-[12%] top-[30%] hidden rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 backdrop-blur-sm lg:block">
          95% Match
        </div>
        <div className="absolute bottom-[30%] left-[8%] hidden rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 backdrop-blur-sm lg:block">
          Keywords Found: 18
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex max-w-4xl flex-col items-center text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-8 flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm text-emerald-400 backdrop-blur-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          AI-Powered Resume Optimization
        </motion.div>

        {/* Resume ASCII art */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-6 font-mono text-[10px] leading-tight text-emerald-500/30 sm:text-xs"
        >
          <pre>{`┌─────────────────┐
│  ■■■■■■ ■■■■■■  │
│  ■■■■ ■■■ ■■■■  │
│  ──────────────  │
│  ■■■■■■■■■■■■■  │
│  ■■■■■■ ■■■■■■  │
│  ■■■■■■■ ■■■■■  │
└─────────────────┘`}</pre>
        </motion.div>

        {/* Heading */}
        <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl">
          Land Your Dream Job with{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-400 bg-clip-text text-transparent">
            AI-Powered
          </span>{" "}
          Resume Analysis
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl"
        >
          Get your ATS compatibility score, uncover missing keywords, and
          receive AI-rewritten bullet points — all optimized to get you
          more interviews.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/analyze"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-8 text-base font-medium text-white transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
          >
            Analyze Your Resume
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-white/10 px-8 text-base font-medium text-zinc-300 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-white"
          >
            See How It Works
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-12 text-sm text-zinc-600"
        >
          Trusted by 10,000+ job seekers worldwide
        </motion.p>
      </motion.div>
    </section>
  );
}
