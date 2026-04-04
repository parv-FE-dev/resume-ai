"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const pairs = [
  {
    before: "Worked on frontend development using React",
    after: "Architected React dashboard serving 50K+ DAU with sub-200ms interactions, reducing bounce rate by 35%",
    section: "Experience — Frontend Developer",
  },
  {
    before: "Helped improve application performance",
    after: "Optimized critical rendering path reducing LCP from 4.2s to 1.1s across 12 high-traffic pages, improving Core Web Vitals score to 95+",
    section: "Experience — Software Engineer",
  },
  {
    before: "Responsible for testing and bug fixes",
    after: "Implemented comprehensive E2E test suite with Playwright covering 200+ user flows, reducing production incidents by 60% quarter-over-quarter",
    section: "Experience — QA Lead",
  },
];

export function BeforeAfter() {
  return (
    <section id="before-after" className="relative px-6 py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            AI That Rewrites Like a{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              Senior Engineer
            </span>
          </h2>
          <p className="mt-4 text-lg text-zinc-500">
            Vague bullets get you rejected. Quantified achievements get you hired.
          </p>
        </motion.div>

        <div className="space-y-6">
          {pairs.map((pair, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group"
            >
              {/* Section label */}
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-600">
                {pair.section}
              </p>

              <div className="grid gap-4 md:grid-cols-[1fr,auto,1fr] md:items-center">
                {/* Before */}
                <div className="rounded-xl border border-red-500/15 bg-red-500/[0.04] p-5 transition-all group-hover:border-red-500/25">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-md bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
                      Before
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-400 line-through decoration-red-400/30">
                    &quot;{pair.before}&quot;
                  </p>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10"
                  >
                    <ArrowRight className="h-4 w-4 text-emerald-400" />
                  </motion.div>
                </div>

                {/* After */}
                <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] p-5 transition-all group-hover:border-emerald-500/25">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      After
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-emerald-300/90">
                    &quot;{pair.after}&quot;
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
