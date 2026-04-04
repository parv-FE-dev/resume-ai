"use client";

import { motion } from "framer-motion";
import { FileUp, Target, Sparkles } from "lucide-react";

const steps = [
  {
    icon: FileUp,
    title: "Paste or Upload Resume",
    description: "Drop your PDF or paste resume text",
  },
  {
    icon: Target,
    title: "Add Job Description",
    description: "Paste the role you're targeting",
  },
  {
    icon: Sparkles,
    title: "Get AI Analysis in Seconds",
    description: "Score, keywords, rewrites & suggestions",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-6 py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="mx-auto max-w-4xl">
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
          <p className="mt-4 text-lg text-zinc-500">
            Three steps. Under two minutes. Zero guesswork.
          </p>
        </motion.div>

        {/* Horizontal pipeline */}
        <div className="relative flex flex-col items-center gap-8 md:flex-row md:gap-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative flex flex-1 flex-col items-center text-center"
            >
              {/* Connecting arrow (between steps, not after last) */}
              {i < steps.length - 1 && (
                <div className="pointer-events-none absolute left-[calc(50%+40px)] top-8 hidden w-[calc(100%-80px)] md:block">
                  <div className="h-px w-full bg-gradient-to-r from-emerald-500/30 to-emerald-500/10" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 border-y-4 border-l-6 border-y-transparent border-l-emerald-500/30" />
                </div>
              )}

              {/* Icon circle */}
              <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/20">
                <step.icon className="h-7 w-7 text-emerald-400" />
                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                  {i + 1}
                </div>
              </div>

              <h3 className="mb-1 text-base font-semibold text-white">
                {step.title}
              </h3>
              <p className="max-w-[200px] text-sm text-zinc-500">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Animated scanning demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16"
        >
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-6">
            {/* Fake resume lines */}
            <div className="space-y-3">
              {[
                { w: "w-3/4", label: "John Doe — Software Engineer" },
                { w: "w-1/2", label: "john@example.com | San Francisco, CA" },
                { w: "w-full", label: "" },
                { w: "w-2/5", label: "EXPERIENCE" },
                {
                  w: "w-full",
                  label:
                    "Led development of microservices architecture handling 1M+ requests/day",
                },
                { w: "w-11/12", label: "Implemented CI/CD pipeline reducing deployment time by 70%" },
                { w: "w-full", label: "" },
                { w: "w-1/3", label: "SKILLS" },
                { w: "w-4/5", label: "React, TypeScript, Node.js, PostgreSQL, AWS, Docker" },
              ].map((line, i) =>
                line.label ? (
                  <div key={i} className={`${line.w}`}>
                    <span className="text-xs text-zinc-600">{line.label}</span>
                  </div>
                ) : (
                  <div key={i} className="h-3" />
                )
              )}
            </div>

            {/* Scanning line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-full">
              <div className="animate-scan absolute inset-x-0 h-8 bg-gradient-to-b from-emerald-400/10 via-emerald-400/5 to-transparent" />
            </div>

            {/* Label */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-zinc-950/80 px-3 py-1 backdrop-blur-sm">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-[10px] font-medium text-emerald-400">
                AI Analyzing...
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
