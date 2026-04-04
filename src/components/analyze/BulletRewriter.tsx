"use client";

import { motion } from "framer-motion";
import { PenLine, ArrowRight } from "lucide-react";
import type { WeakBullet } from "@/types";

interface BulletRewriterProps {
  bullets: WeakBullet[];
}

export function BulletRewriter({ bullets }: BulletRewriterProps) {
  if (bullets.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
      <div className="mb-4 flex items-center gap-2">
        <PenLine className="h-5 w-5 text-violet-400" />
        <h3 className="text-lg font-semibold text-white">
          Bullet Point Improvements
        </h3>
      </div>

      <div className="space-y-4">
        {bullets.map((bullet, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="space-y-3 rounded-lg border border-white/5 bg-white/[0.02] p-4"
          >
            <div>
              <span className="mb-1 inline-block text-xs font-medium text-zinc-500">
                {bullet.section}
              </span>
              <p className="text-sm text-zinc-400 line-through decoration-red-400/40">
                {bullet.original}
              </p>
              <p className="mt-1 text-xs text-red-400/60">{bullet.issue}</p>
            </div>

            <div className="flex items-center gap-2 text-zinc-600">
              <ArrowRight className="h-3 w-3" />
              <span className="text-xs">AI Rewrite</span>
            </div>

            <p className="text-sm font-medium text-emerald-400">
              {bullet.rewritten}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
