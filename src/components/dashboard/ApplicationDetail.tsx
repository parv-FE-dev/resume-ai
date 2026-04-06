"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  X,
  Building2,
  MapPin,
  ExternalLink,
  FileText,
  Loader2,
  Copy,
  Check,
  Clock,
} from "lucide-react";
import { useApplicationStore } from "@/store/useApplicationStore";
import { useAgentStore } from "@/store/useAgentStore";
import { useResumeStore } from "@/store/useResumeStore";
import {
  STATUS_CONFIG,
  STATUS_ORDER,
  type ApplicationStatus,
} from "@/types/application";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ApplicationDetailProps {
  applicationId: string;
  onClose: () => void;
}

export function ApplicationDetail({
  applicationId,
  onClose,
}: ApplicationDetailProps) {
  const {
    getById,
    updateStatus,
    updateNotes,
    setCoverLetter,
  } = useApplicationStore();
  const profile = useAgentStore((s) => s.profile);
  const resume = useResumeStore((s) => s.resume);

  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState<"professional" | "casual" | "technical">(
    "professional"
  );
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState("");

  const app = getById(applicationId);
  if (!app) return null;

  const handleGenerateCoverLetter = useCallback(async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/jobs/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job: app.job,
          profile,
          resumeText: resume?.rawText || "",
          tone,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let text = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          setCoverLetter(app.id, text);
        }
      }

      toast.success("Cover letter generated!");
    } catch {
      toast.error("Failed to generate cover letter");
    } finally {
      setIsGenerating(false);
    }
  }, [app, profile, resume, tone, setCoverLetter]);

  const handleCopy = useCallback(async () => {
    if (app.coverLetter) {
      await navigator.clipboard.writeText(app.coverLetter);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  }, [app.coverLetter]);

  const handleSaveNotes = () => {
    updateNotes(app.id, notesText);
    setEditingNotes(false);
    toast.success("Notes saved");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm p-5">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {app.job.title}
            </h2>
            <div className="mt-1 flex items-center gap-3 text-sm text-zinc-400">
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {app.job.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {app.job.location}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Status selector */}
          <div>
            <p className="text-xs font-medium text-zinc-500 mb-2">Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_ORDER.map((status) => {
                const config = STATUS_CONFIG[status];
                const isActive = app.status === status;
                return (
                  <button
                    key={status}
                    onClick={() => updateStatus(app.id, status)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                      isActive
                        ? `${config.bgColor} ${config.borderColor} ${config.color}`
                        : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-700"
                    )}
                  >
                    <span>{config.emoji}</span>
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-zinc-500">Cover Letter</p>
              <div className="flex items-center gap-2">
                <select
                  value={tone}
                  onChange={(e) =>
                    setTone(
                      e.target.value as "professional" | "casual" | "technical"
                    )
                  }
                  className="rounded-lg bg-zinc-900 border border-zinc-800 px-2 py-1 text-xs text-zinc-400 outline-none"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual-Confident</option>
                  <option value="technical">Technical</option>
                </select>
                <button
                  onClick={handleGenerateCoverLetter}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-colors"
                >
                  {isGenerating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <FileText className="h-3.5 w-3.5" />
                  )}
                  {app.coverLetter ? "Regenerate" : "Generate"}
                </button>
              </div>
            </div>
            {app.coverLetter ? (
              <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {app.coverLetter}
                </p>
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 rounded-lg bg-zinc-800 p-1.5 text-zinc-500 hover:text-white transition-colors"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-6 text-center">
                <p className="text-xs text-zinc-600">
                  Click &quot;Generate&quot; to create a tailored cover letter
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-zinc-500">Notes</p>
              {!editingNotes && (
                <button
                  onClick={() => {
                    setNotesText(app.notes);
                    setEditingNotes(true);
                  }}
                  className="text-xs text-zinc-500 hover:text-white transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
            {editingNotes ? (
              <div className="space-y-2">
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  rows={3}
                  placeholder="Add notes about this application..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-zinc-700 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNotes}
                    className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-400 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingNotes(false)}
                    className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-500 italic">
                {app.notes || "No notes yet"}
              </p>
            )}
          </div>

          {/* Status timeline */}
          <div>
            <p className="text-xs font-medium text-zinc-500 mb-3">Timeline</p>
            <div className="space-y-3">
              {[...app.statusHistory].reverse().map((change, i) => {
                const config = STATUS_CONFIG[change.status];
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "h-2.5 w-2.5 rounded-full shrink-0 mt-1.5",
                          i === 0 ? "bg-emerald-400" : "bg-zinc-700"
                        )}
                      />
                      {i < app.statusHistory.length - 1 && (
                        <div className="w-px flex-1 bg-zinc-800 mt-1" />
                      )}
                    </div>
                    <div className="pb-3">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-sm font-medium", config.color)}>
                          {config.emoji} {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3 text-zinc-600" />
                        <span className="text-xs text-zinc-600">
                          {new Date(change.date).toLocaleString()}
                        </span>
                      </div>
                      {change.note && (
                        <p className="mt-1 text-xs text-zinc-500">
                          {change.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Apply link */}
          <a
            href={app.job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-400 transition-colors"
          >
            Apply on {app.job.source}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
