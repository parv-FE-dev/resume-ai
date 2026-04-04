"use client";

import { motion } from "framer-motion";
import { Upload, FileSearch, Sparkles, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Resume",
    description:
      "Paste your resume text or upload a PDF. We extract and parse it instantly.",
  },
  {
    icon: FileSearch,
    step: "02",
    title: "Add the Job Description",
    description:
      "Paste the job posting you're targeting. Our AI identifies what matters most.",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "AI Analyzes & Optimizes",
    description:
      "GPT-4o compares your resume against the JD, scoring fit and finding gaps.",
  },
  {
    icon: CheckCircle2,
    step: "04",
    title: "Get Results & Export",
    description:
      "Review your score, fix gaps, accept AI rewrites, and export your optimized resume.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-6 py-32">
      {/* Subtle divider glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Four simple steps to a better resume. Takes under two minutes.
          </p>
        </motion.div>

        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line */}
          <div className="pointer-events-none absolute left-0 right-0 top-14 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent lg:block" />

          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-zinc-950 shadow-lg shadow-violet-500/5">
                <s.icon className="h-6 w-6 text-violet-400" />
              </div>
              <span className="mb-2 font-mono text-xs font-medium text-violet-400/60">
                {s.step}
              </span>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
