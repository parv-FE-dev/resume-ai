"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { KeywordGap } from "@/types";

interface KeywordGapsProps {
  gaps: KeywordGap[];
}

const priorityStyles = {
  high: "border-red-500/30 bg-red-500/10 text-red-400",
  medium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  low: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
};

export function KeywordGaps({ gaps }: KeywordGapsProps) {
  if (gaps.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-400" />
        <h3 className="text-lg font-semibold text-white">Keyword Gaps</h3>
        <Badge variant="secondary" className="ml-auto text-xs">
          {gaps.length} missing
        </Badge>
      </div>

      <div className="space-y-3">
        {gaps.map((gap, i) => (
          <motion.div
            key={gap.keyword}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3"
          >
            <Badge className={`mt-0.5 shrink-0 ${priorityStyles[gap.importance]}`}>
              {gap.importance}
            </Badge>
            <div>
              <p className="font-medium text-white">{gap.keyword}</p>
              <p className="mt-0.5 text-sm text-zinc-500">{gap.context}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
