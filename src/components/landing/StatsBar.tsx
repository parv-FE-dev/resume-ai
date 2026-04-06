"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "6", label: "AI-Powered Workflows" },
  { value: "100%", label: "Automated Pipeline" },
  { value: "0", label: "Manual Spreadsheets" },
];

export function StatsBar() {
  return (
    <section className="relative px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 divide-y divide-white/5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex flex-col items-center gap-1 px-8 py-8"
              >
                <span className="text-3xl font-bold text-emerald-400 sm:text-4xl">
                  {stat.value}
                </span>
                <span className="text-sm text-zinc-500">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
