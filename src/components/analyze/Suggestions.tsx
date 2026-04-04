"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Suggestion } from "@/types";

interface SuggestionsProps {
  suggestions: Suggestion[];
}

const categoryIcons: Record<Suggestion["category"], string> = {
  content: "Content",
  format: "Format",
  keywords: "Keywords",
  structure: "Structure",
};

const priorityStyles = {
  high: "border-red-500/30 bg-red-500/10 text-red-400",
  medium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  low: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
};

export function Suggestions({ suggestions }: SuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">
          Actionable Suggestions
        </h3>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-lg border border-white/5 bg-white/[0.02] p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline" className="text-xs text-zinc-400">
                {categoryIcons[suggestion.category]}
              </Badge>
              <Badge className={`text-xs ${priorityStyles[suggestion.priority]}`}>
                {suggestion.priority}
              </Badge>
            </div>
            <h4 className="font-medium text-white">{suggestion.title}</h4>
            <p className="mt-1 text-sm text-zinc-400">
              {suggestion.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
