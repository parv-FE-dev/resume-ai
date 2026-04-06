"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative px-6 py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 translate-y-1/3 rounded-full bg-emerald-500/8 blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto max-w-4xl"
      >
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-emerald-600/20 p-px">
          <div className="rounded-3xl bg-zinc-950/95 px-8 py-20 text-center backdrop-blur-xl sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Your Next Job Is One{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                Conversation
              </span>{" "}
              Away
            </h2>

            <div className="mt-10 flex flex-col items-center gap-4">
              <Link
                href="/chat"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-10 text-lg font-semibold text-white transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                Talk to Your Career Agent
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="text-sm text-zinc-600">
                Free &bull; No signup required &bull; AI-powered end to end
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
