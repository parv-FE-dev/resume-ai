"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MapPin,
  Building2,
  ThumbsDown,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Job } from "@/types/jobs";

interface JobCardProps {
  job: Job;
  index: number;
  onSave: (job: Job) => void;
  onUnsave: (id: string) => void;
  onDismiss: (id: string) => void;
}

function formatSalary(salary: { min: number; max: number; currency: string }) {
  const fmt = (n: number) => {
    if (salary.currency === "INR") return `₹${(n / 100000).toFixed(0)}L`;
    return `${salary.currency} ${(n / 1000).toFixed(0)}K`;
  };
  return `${fmt(salary.min)} – ${fmt(salary.max)}`;
}

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  if (score >= 60) return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
  return "text-red-400 bg-red-500/10 border-red-500/20";
}

function daysAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export function JobCard({
  job,
  index,
  onSave,
  onUnsave,
  onDismiss,
}: JobCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className="group rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all hover:shadow-lg hover:shadow-emerald-500/5"
    >
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-white truncate">
                {job.title}
              </h3>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                {job.company}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </span>
              {job.remote && (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Wifi className="h-3.5 w-3.5" />
                  Remote
                </span>
              )}
            </div>
          </div>

          {/* Match score badge */}
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-lg font-bold",
              scoreColor(job.matchScore)
            )}
          >
            {job.matchScore}
          </div>
        </div>

        {/* Tags row */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {job.salary && (
            <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-300">
              {formatSalary(job.salary)}
            </span>
          )}
          <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-500">
            {job.source}
          </span>
          <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-500">
            {daysAgo(job.postedDate)}
          </span>
        </div>

        {/* Match reasons preview */}
        {job.matchReasons.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.matchReasons.slice(0, 2).map((reason, i) => (
              <span
                key={i}
                className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400"
              >
                {reason}
              </span>
            ))}
            {job.matchReasons.length > 2 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                +{job.matchReasons.length - 2} more
              </button>
            )}
          </div>
        )}

        {/* Expandable section */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3 border-t border-zinc-800 pt-4">
                {/* All match reasons */}
                <div>
                  <p className="text-xs font-medium text-zinc-500 mb-2">
                    Why this matches
                  </p>
                  <ul className="space-y-1.5">
                    {job.matchReasons.map((reason, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-zinc-300"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Description */}
                <div>
                  <p className="text-xs font-medium text-zinc-500 mb-1.5">
                    Description
                  </p>
                  <p className="text-sm text-zinc-400 leading-relaxed line-clamp-4">
                    {job.description}
                  </p>
                </div>

                {/* Requirements */}
                {job.requirements.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500 mb-1.5">
                      Requirements
                    </p>
                    <ul className="space-y-1">
                      {job.requirements.map((req, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-zinc-400"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => (job.saved ? onUnsave(job.id) : onSave(job))}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                job.saved
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-zinc-800 text-zinc-400 hover:bg-emerald-500/10 hover:text-emerald-400"
              )}
            >
              {job.saved ? (
                <BookmarkCheck className="h-3.5 w-3.5" />
              ) : (
                <Bookmark className="h-3.5 w-3.5" />
              )}
              {job.saved ? "Saved" : "Save"}
            </button>
            <button
              onClick={() => onDismiss(job.id)}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              Not Interested
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              {expanded ? (
                <>
                  Less <ChevronUp className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  Details <ChevronDown className="h-3.5 w-3.5" />
                </>
              )}
            </button>
            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-400 transition-colors"
            >
              Apply
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
