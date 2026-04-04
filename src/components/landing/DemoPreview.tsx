"use client";

import { motion } from "framer-motion";
import { Target, AlertTriangle, PenLine, TrendingUp } from "lucide-react";

export function DemoPreview() {
  return (
    <section id="demo" className="relative px-6 py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            See what you get
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            A comprehensive AI analysis of your resume in seconds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/10 via-transparent to-blue-500/10 p-px"
        >
          <div className="rounded-2xl bg-zinc-950/95 p-6 backdrop-blur-xl sm:p-8">
            {/* Mock score header */}
            <div className="mb-6 flex flex-col items-center gap-6 sm:flex-row">
              <div className="relative flex-shrink-0">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" strokeWidth="6" className="stroke-zinc-800" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                    className="stroke-emerald-400"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * (1 - 0.78)}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-emerald-400">78</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Match Score: 78/100</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Strong technical alignment with room to improve keyword coverage and quantify achievements in the experience section.
                </p>
              </div>
            </div>

            {/* Mock results grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-white">Keyword Gaps</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["CI/CD", "Kubernetes", "GraphQL", "TypeScript"].map((kw) => (
                    <span key={kw} className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-xs text-red-400">
                      {kw}
                    </span>
                  ))}
                  {["Agile", "REST APIs"].map((kw) => (
                    <span key={kw} className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-0.5 text-xs text-yellow-400">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-medium text-white">Strengths</span>
                </div>
                <ul className="space-y-1.5">
                  {["Strong React experience", "Relevant project portfolio", "Clean formatting"].map((s) => (
                    <li key={s} className="flex items-center gap-2 text-xs text-zinc-400">
                      <span className="h-1 w-1 rounded-full bg-emerald-400" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 sm:col-span-2">
                <div className="mb-3 flex items-center gap-2">
                  <PenLine className="h-4 w-4 text-violet-400" />
                  <span className="text-sm font-medium text-white">AI Bullet Rewrite</span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500 line-through decoration-red-400/40">
                    &quot;Worked on frontend development using React and JavaScript&quot;
                  </p>
                  <p className="text-xs font-medium text-emerald-400">
                    &quot;Architected and delivered 15+ React components reducing page load time by 40%, serving 50K+ monthly active users&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Subtle overlay to hint its a preview */}
            <div className="mt-6 flex items-center justify-center">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-zinc-500">
                <Target className="h-3 w-3" />
                Sample analysis preview
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
