"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUp,
} from "lucide-react";

/* ── Mini UI components rendered inline to show actual feature previews ── */

function ScoreGaugePreview() {
  const circumference = 2 * Math.PI * 42;
  const score = 85;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="flex items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] p-8">
      <div className="relative">
        <svg width="160" height="160" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            strokeWidth="6"
            className="stroke-zinc-800"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className="stroke-emerald-400"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-emerald-400">{score}</span>
          <span className="text-[10px] text-zinc-600">/ 100</span>
        </div>
      </div>
    </div>
  );
}

function KeywordBadgesPreview() {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-400" />
        <span className="text-sm font-medium text-white">Missing Keywords</span>
        <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-400">
          6 gaps
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          { kw: "CI/CD", priority: "high" },
          { kw: "Kubernetes", priority: "high" },
          { kw: "GraphQL", priority: "high" },
          { kw: "TypeScript", priority: "medium" },
          { kw: "Agile", priority: "medium" },
          { kw: "REST APIs", priority: "low" },
        ].map((item) => (
          <span
            key={item.kw}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              item.priority === "high"
                ? "border-red-500/20 bg-red-500/10 text-red-400"
                : item.priority === "medium"
                  ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                  : "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
            }`}
          >
            {item.kw}
          </span>
        ))}
      </div>
    </div>
  );
}

function BulletDiffPreview() {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
      {[
        {
          before: "Managed a team of developers",
          after: "Led cross-functional team of 8 engineers delivering 3 major features ahead of schedule, reducing time-to-market by 25%",
        },
        {
          before: "Built APIs for the product",
          after: "Designed and shipped RESTful API layer serving 2M+ daily requests with 99.97% uptime and p95 latency under 50ms",
        },
      ].map((item, i) => (
        <div key={i} className="space-y-2">
          <p className="text-xs text-zinc-500 line-through decoration-red-400/30">
            {item.before}
          </p>
          <div className="flex items-center gap-2">
            <ArrowUp className="h-3 w-3 rotate-90 text-emerald-400 flex-shrink-0" />
            <p className="text-xs font-medium text-emerald-400">{item.after}</p>
          </div>
          {i < 1 && <div className="border-t border-white/5" />}
        </div>
      ))}
    </div>
  );
}

function SuggestionListPreview() {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
      <div className="space-y-3">
        {[
          {
            priority: "high",
            category: "Keywords",
            title: "Add CI/CD and DevOps skills",
            desc: "The job posting emphasizes CI/CD pipelines — mention your experience with GitHub Actions or Jenkins.",
          },
          {
            priority: "high",
            category: "Experience",
            title: "Quantify your impact",
            desc: "Add metrics to 3 bullet points that currently lack measurable outcomes.",
          },
          {
            priority: "medium",
            category: "Format",
            title: "Reorder skills section",
            desc: "Move technical skills above soft skills to match ATS scanning patterns.",
          },
        ].map((s) => (
          <div
            key={s.title}
            className="flex gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3"
          >
            <span
              className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${
                s.priority === "high" ? "bg-red-400" : "bg-amber-400"
              }`}
            />
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-semibold text-white">
                  {s.title}
                </span>
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] text-zinc-500">
                  {s.category}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-500">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Feature sections with alternating layout ── */

const features = [
  {
    title: "ATS Match Score",
    description:
      "Get an instant compatibility score showing exactly how your resume stacks up against the job description. Know whether to apply or optimize first.",
    component: ScoreGaugePreview,
  },
  {
    title: "Keyword Gap Analysis",
    description:
      "Identify critical keywords the ATS is scanning for that are missing from your resume. Color-coded by priority so you know what to add first.",
    component: KeywordBadgesPreview,
  },
  {
    title: "AI Bullet Rewrites",
    description:
      "Weak, vague bullet points are automatically rewritten into quantified, impactful achievements that hiring managers actually want to read.",
    component: BulletDiffPreview,
  },
  {
    title: "Priority Action Items",
    description:
      "Get a prioritized list of exactly what to fix, organized by impact. No more guessing — follow the list and watch your score climb.",
    component: SuggestionListPreview,
  },
];

export function WhatYouGet() {
  return (
    <section id="features" className="relative px-6 py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            What you get
          </h2>
          <p className="mt-4 text-lg text-zinc-500">
            Every feature is designed to maximize your interview callback rate.
          </p>
        </motion.div>

        <div className="space-y-20">
          {features.map((feature, i) => {
            const isReversed = i % 2 === 1;
            const Component = feature.component;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className={`grid items-center gap-10 lg:grid-cols-2 ${
                  isReversed ? "lg:direction-rtl" : ""
                }`}
              >
                {/* Text */}
                <div className={`${isReversed ? "lg:order-2" : ""}`}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-white lg:text-3xl">
                    {feature.title}
                  </h3>
                  <p className="text-base leading-relaxed text-zinc-400">
                    {feature.description}
                  </p>
                </div>

                {/* Component preview */}
                <div className={`${isReversed ? "lg:order-1" : ""}`}>
                  <Component />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
