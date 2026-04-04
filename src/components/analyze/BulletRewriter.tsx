"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PenLine, ArrowRight, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { WeakBullet } from "@/types";

interface BulletRewriterProps {
  bullets: WeakBullet[];
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="xs"
      onClick={handleCopy}
      className="h-6 gap-1 px-2 text-xs text-zinc-500 hover:text-white"
    >
      {copied ? (
        <Check className="h-3 w-3 text-emerald-400" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
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
            className="overflow-hidden rounded-lg border border-white/5 bg-white/[0.02]"
          >
            {/* Section label */}
            <div className="border-b border-white/5 px-4 py-2">
              <span className="text-xs font-medium text-zinc-500">
                {bullet.section}
              </span>
            </div>

            <div className="p-4">
              {/* Original */}
              <div className="rounded-lg bg-red-500/5 p-3">
                <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-red-400/60">
                  Original
                </div>
                <p className="text-sm text-zinc-400 line-through decoration-red-400/40">
                  {bullet.original}
                </p>
                <p className="mt-1.5 text-xs text-red-400/60">{bullet.issue}</p>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center py-2">
                <ArrowRight className="h-4 w-4 rotate-90 text-zinc-700" />
              </div>

              {/* Rewritten */}
              <div className="rounded-lg bg-emerald-500/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-400/60">
                    AI Rewrite
                  </span>
                  <CopyButton text={bullet.rewritten} />
                </div>
                <p className="mt-1 text-sm font-medium text-emerald-400">
                  {bullet.rewritten}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
