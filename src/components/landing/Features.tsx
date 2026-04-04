"use client";

import { motion } from "framer-motion";
import {
  Target,
  Search,
  PenLine,
  Zap,
  TrendingUp,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "ATS Match Score",
    description:
      "Get an instant compatibility score showing how well your resume matches the job description and ATS requirements.",
  },
  {
    icon: Search,
    title: "Keyword Gap Analysis",
    description:
      "Identify critical keywords and skills missing from your resume that recruiters and ATS systems are scanning for.",
  },
  {
    icon: PenLine,
    title: "AI Bullet Rewriting",
    description:
      "AI rewrites weak bullet points into impactful, quantified achievements that stand out to hiring managers.",
  },
  {
    icon: TrendingUp,
    title: "Priority Suggestions",
    description:
      "Prioritized recommendations organized by impact — know exactly what to fix first for maximum results.",
  },
  {
    icon: Shield,
    title: "ATS-Friendly Formatting",
    description:
      "Ensure your resume passes automated screening with formatting tips that ATS systems can parse correctly.",
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description:
      "Real-time streaming results powered by Claude AI. Get comprehensive feedback in seconds, not hours.",
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
              className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-emerald-500/20 hover:bg-emerald-500/[0.03]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/20">
                <feature.icon className="h-5 w-5 text-emerald-400" />
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
