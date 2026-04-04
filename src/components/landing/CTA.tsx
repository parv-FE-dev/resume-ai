"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

export function CTA() {
  return (
    <section className="relative px-6 py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full bg-violet-500/8 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto max-w-4xl"
      >
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/20 via-blue-600/10 to-violet-600/20 p-px">
          <div className="rounded-3xl bg-zinc-950/90 px-8 py-16 text-center backdrop-blur-xl sm:px-16">
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500">
              <Zap className="h-6 w-6 text-white" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Ready to land more interviews?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
              Stop guessing what recruiters want. Let AI analyze your resume
              against any job description and tell you exactly what to improve.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/analyze"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-blue-500 px-8 text-base font-medium text-white transition-all hover:from-violet-400 hover:to-blue-400 hover:shadow-lg hover:shadow-violet-500/25"
              >
                Start Free Analysis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/10 px-8 text-base font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                Learn More
              </Link>
            </div>

            <p className="mt-6 text-sm text-zinc-600">
              No sign-up required. Free to use. Powered by Claude AI.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
