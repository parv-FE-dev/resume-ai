"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Ready to land more interviews?
        </h2>
        <p className="mt-4 max-w-xl text-lg text-zinc-400">
          Stop guessing what recruiters want. Let AI analyze your resume against
          any job description and tell you exactly what to improve.
        </p>
        <Link
          href="/analyze"
          className="mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 text-base font-medium text-black transition-colors hover:bg-zinc-200"
        >
          Start Free Analysis
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-4 text-sm text-zinc-600">
          No sign-up required. Free to use.
        </p>
      </motion.div>
    </section>
  );
}
