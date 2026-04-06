"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCheck, XCircle, Download, FileText } from "lucide-react";
import { SuggestionDiff } from "./SuggestionDiff";
import { useVersionStore, type ResumeChange } from "@/store/useVersionStore";
import type { WeakBullet } from "@/types";

interface RewritePanelProps {
  weakBullets: WeakBullet[];
  resumeText: string;
  onExportPDF: () => void;
}

export function RewritePanel({
  weakBullets,
  resumeText,
  onExportPDF,
}: RewritePanelProps) {
  const {
    changes,
    setChanges,
    acceptChange,
    rejectChange,
    updateChange,
    acceptAll,
    rejectAll,
    getAcceptedCount,
    getTotalCount,
    createVersionFromChanges,
    versions,
  } = useVersionStore();

  // Initialize changes from analysis weakBullets
  useEffect(() => {
    if (weakBullets.length > 0 && changes.length === 0) {
      const newChanges: ResumeChange[] = weakBullets.map((bullet, i) => ({
        id: `change-${i}-${Date.now()}`,
        original: bullet.original,
        suggested: bullet.rewritten,
        section: bullet.section,
        issue: bullet.issue,
        status: "pending" as const,
      }));
      setChanges(newChanges);

      // Auto-create v1 (original) if no versions exist
      if (versions.length === 0 && resumeText) {
        useVersionStore.getState().addVersion({
          version: 1,
          label: "Original",
          content: resumeText,
          changes: [],
        });
      }
    }
  }, [weakBullets, changes.length, setChanges, versions.length, resumeText]);

  const acceptedCount = getAcceptedCount();
  const totalCount = getTotalCount();
  const hasAccepted = acceptedCount > 0;

  const handleSaveVersion = () => {
    const versionNum = versions.length + 1;
    createVersionFromChanges(resumeText, `Optimized v${versionNum - 1}`);
  };

  if (changes.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Header with batch actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">
              Rewrite Suggestions
            </h3>
            <p className="text-xs text-zinc-500">
              {acceptedCount} of {totalCount} accepted
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={acceptAll}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Accept All
          </button>
          <button
            onClick={rejectAll}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:bg-zinc-700 transition-colors"
          >
            <XCircle className="h-3.5 w-3.5" />
            Reject All
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-emerald-500"
          initial={{ width: 0 }}
          animate={{
            width: `${totalCount > 0 ? (acceptedCount / totalCount) * 100 : 0}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Suggestion cards */}
      <div className="space-y-3">
        {changes.map((change, i) => (
          <SuggestionDiff
            key={change.id}
            change={change}
            index={i}
            onAccept={acceptChange}
            onReject={rejectChange}
            onEdit={updateChange}
          />
        ))}
      </div>

      {/* Bottom actions */}
      {hasAccepted && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"
        >
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-400">
              {acceptedCount} change{acceptedCount !== 1 ? "s" : ""} ready to
              apply
            </p>
            <p className="text-xs text-zinc-500">
              Save as a new version or export as PDF
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveVersion}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Save Version
            </button>
            <button
              onClick={onExportPDF}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-400 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
