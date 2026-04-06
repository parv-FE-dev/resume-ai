"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Pencil, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResumeChange } from "@/store/useVersionStore";

interface SuggestionDiffProps {
  change: ResumeChange;
  index: number;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export function SuggestionDiff({
  change,
  index,
  onAccept,
  onReject,
  onEdit,
}: SuggestionDiffProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(change.suggested);
  const [expanded, setExpanded] = useState(true);

  const isAccepted = change.status === "accepted";
  const isRejected = change.status === "rejected";
  const isPending = change.status === "pending";

  const handleSaveEdit = () => {
    onEdit(change.id, editText);
    setEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className={cn(
        "rounded-xl border overflow-hidden transition-colors",
        isAccepted && "border-emerald-500/30 bg-emerald-500/5",
        isRejected && "border-zinc-700/30 bg-zinc-900/30 opacity-60",
        isPending && "border-zinc-700/50 bg-zinc-900/50"
      )}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
              isAccepted && "bg-emerald-500/20 text-emerald-400",
              isRejected && "bg-zinc-700/50 text-zinc-500",
              isPending && "bg-zinc-700/50 text-zinc-300"
            )}
          >
            {index + 1}
          </span>
          <div className="text-left">
            <p className="text-sm font-medium text-zinc-200">
              {change.section}
            </p>
            <p className="text-xs text-zinc-500">{change.issue}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAccepted && (
            <span className="text-xs font-medium text-emerald-400">
              Accepted
            </span>
          )}
          {isRejected && (
            <span className="text-xs font-medium text-zinc-500">Rejected</span>
          )}
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-zinc-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-zinc-500" />
          )}
        </div>
      </button>

      {/* Diff content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Original */}
              <div className="rounded-lg bg-red-500/5 border border-red-500/10 p-3">
                <p className="text-xs font-medium text-red-400 mb-1">
                  Original
                </p>
                <p className="text-sm text-zinc-400 line-through leading-relaxed">
                  {change.original}
                </p>
              </div>

              {/* Suggested */}
              <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3">
                <p className="text-xs font-medium text-emerald-400 mb-1">
                  Suggested
                </p>
                {editing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-400 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setEditText(change.suggested);
                        }}
                        className="rounded-lg bg-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-200 leading-relaxed">
                    {change.suggested}
                  </p>
                )}
              </div>

              {/* Actions */}
              {!editing && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAccept(change.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                      isAccepted
                        ? "bg-emerald-500 text-white"
                        : "bg-zinc-800 text-zinc-300 hover:bg-emerald-500/20 hover:text-emerald-400"
                    )}
                  >
                    <Check className="h-3.5 w-3.5" />
                    Accept
                  </button>
                  <button
                    onClick={() => onReject(change.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                      isRejected
                        ? "bg-red-500/20 text-red-400"
                        : "bg-zinc-800 text-zinc-300 hover:bg-red-500/20 hover:text-red-400"
                    )}
                  >
                    <X className="h-3.5 w-3.5" />
                    Reject
                  </button>
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
