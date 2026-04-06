"use client";

import { SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { useJobStore } from "@/store/useJobStore";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "score" as const, label: "Match Score" },
  { value: "date" as const, label: "Date Posted" },
  { value: "salary" as const, label: "Salary" },
];

export function JobFilters() {
  const { filters, setFilters, resetFilters, jobs } = useJobStore();

  // Get unique sources from current results
  const sources = [...new Set(jobs.map((j) => j.source))];
  const hasActiveFilters =
    filters.remoteOnly ||
    filters.minScore > 0 ||
    filters.minSalary > 0 ||
    filters.sources.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Remote only toggle */}
        <button
          onClick={() => setFilters({ remoteOnly: !filters.remoteOnly })}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border",
            filters.remoteOnly
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
          )}
        >
          Remote Only
        </button>

        {/* Min score */}
        {[60, 70, 80].map((score) => (
          <button
            key={score}
            onClick={() =>
              setFilters({
                minScore: filters.minScore === score ? 0 : score,
              })
            }
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border",
              filters.minScore === score
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
            )}
          >
            {score}+ Match
          </button>
        ))}

        {/* Source filter */}
        {sources.map((source) => (
          <button
            key={source}
            onClick={() => {
              const current = filters.sources;
              const next = current.includes(source)
                ? current.filter((s) => s !== source)
                : [...current, source];
              setFilters({ sources: next });
            }}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border",
              filters.sources.includes(source)
                ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
            )}
          >
            {source}
          </button>
        ))}

        {/* Sort */}
        <div className="ml-auto flex items-center gap-1.5">
          <ArrowUpDown className="h-3.5 w-3.5 text-zinc-500" />
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters({
                sortBy: e.target.value as "score" | "date" | "salary",
              })
            }
            className="rounded-lg bg-zinc-900 border border-zinc-800 px-2 py-1.5 text-xs text-zinc-300 outline-none focus:border-zinc-700"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
