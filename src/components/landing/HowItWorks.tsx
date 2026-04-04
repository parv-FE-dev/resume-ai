"use client";

import { motion } from "framer-motion";
import { FileUp, Briefcase, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: FileUp,
    step: "01",
    title: "Upload Your Resume",
    description: "Paste your resume text or upload a PDF. We extract and parse it instantly.",
  },
  {
    icon: Briefcase,
    step: "02",
    title: "Add Job Description",
    description: "Copy and paste the job posting you're targeting so AI knows what to optimize for.",
  },
  {
    icon: BarChart3,
    step: "03",
    title: "Get AI Analysis",
    description: "Receive match scoring, keyword gaps, rewritten bullets, and actionable suggestions.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-6 py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="mx-auto max-w-3xl">
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

        {/* Vertical timeline stepper */}
        <div className="relative">
          {/* Dashed connector line */}
          <div className="absolute left-6 top-0 h-full w-px border-l-2 border-dashed border-emerald-500/20 sm:left-8" />

          <div className="space-y-12">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="relative flex gap-6 sm:gap-8"
              >
                {/* Numbered circle */}
                <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-lg font-bold text-white shadow-lg shadow-emerald-500/20 sm:h-16 sm:w-16 sm:text-xl">
                  {i + 1}
                </div>

                {/* Content */}
                <div className="flex-1 pb-2 pt-1 sm:pt-3">
                  <div className="mb-2 flex items-center gap-3">
                    <s.icon className="h-5 w-5 text-emerald-400" />
                    <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-500">{s.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
