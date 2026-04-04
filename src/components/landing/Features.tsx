"use client";

import { motion } from "framer-motion";
import {
  Target,
  Search,
  PenLine,
  Zap,
  BarChart3,
  Download,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Match Scoring",
    description:
      "Get an instant compatibility score showing how well your resume matches the job description.",
  },
  {
    icon: Search,
    title: "Keyword Gap Analysis",
    description:
      "Identify critical keywords and skills missing from your resume that recruiters are looking for.",
  },
  {
    icon: PenLine,
    title: "Bullet Point Rewriting",
    description:
      "AI rewrites weak bullet points into impactful, quantified achievements that stand out.",
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description:
      "Real-time streaming results powered by Claude AI. Get comprehensive feedback in seconds.",
  },
  {
    icon: BarChart3,
    title: "Actionable Suggestions",
    description:
      "Prioritized recommendations organized by impact — know exactly what to fix first.",
  },
  {
    icon: Download,
    title: "Export Optimized Resume",
    description:
      "Download your improved resume with all AI suggestions applied, ready to submit.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function Features() {
  return (
    <section id="features" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to optimize your resume
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Powered by advanced AI to give you an unfair advantage in your job
            search.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:border-white/10 hover:bg-white/[0.04]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 ring-1 ring-white/10">
                <feature.icon className="h-5 w-5 text-violet-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
