"use client";

import { motion } from "framer-motion";
import { Upload, FileText, Sparkles, ChevronRight } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Resume",
    description: "Paste your resume text or upload a PDF. We extract and parse it instantly.",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: FileText,
    step: "02",
    title: "Paste Job Description",
    description: "Copy and paste the job posting you're targeting so AI knows what to optimize for.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Get AI Analysis",
    description: "Receive match scoring, keyword gaps, rewritten bullets, and actionable suggestions.",
    color: "from-emerald-500 to-emerald-600",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-6 py-32">
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
            Three simple steps to a better resume. Takes under two minutes.
          </p>
        </motion.div>

        <div className="relative flex flex-col items-center gap-0 lg:flex-row lg:items-start lg:gap-0">
          {steps.map((s, i) => (
            <div key={s.step} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="relative flex w-[280px] flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div className={`relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} shadow-lg`}>
                  <s.icon className="h-7 w-7 text-white" />
                  <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-bold text-white ring-2 ring-zinc-800">
                    {i + 1}
                  </div>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{s.description}</p>
              </motion.div>

              {/* Arrow connector */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.2, duration: 0.3 }}
                  className="mx-4 hidden lg:flex"
                >
                  <div className="flex items-center gap-1">
                    <div className="h-px w-8 bg-gradient-to-r from-white/20 to-white/5" />
                    <ChevronRight className="h-4 w-4 text-zinc-600" />
                    <div className="h-px w-8 bg-gradient-to-r from-white/5 to-white/20" />
                  </div>
                </motion.div>
              )}

              {/* Mobile arrow */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="my-4 flex rotate-90 lg:hidden"
                >
                  <ChevronRight className="h-5 w-5 text-zinc-600" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
