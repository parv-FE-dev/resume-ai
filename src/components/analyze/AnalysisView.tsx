"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  RotateCcw,
  Copy,
  Check,
  BarChart3,
  Search,
  PenLine,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreCard } from "./ScoreCard";
import { KeywordGaps } from "./KeywordGaps";
import { BulletRewriter } from "./BulletRewriter";
import { Suggestions } from "./Suggestions";
import { RewritePanel } from "./RewritePanel";
import { VersionSelector } from "./VersionSelector";
import { PDFExportButton } from "./PDFExport";
import { useResumeStore } from "@/store/useResumeStore";
import { useVersionStore } from "@/store/useVersionStore";
import { toast } from "sonner";

type TabKey = "overview" | "keywords" | "bullets" | "suggestions" | "rewrite";

const tabs: { key: TabKey; label: string; icon: typeof BarChart3 }[] = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "keywords", label: "Keywords", icon: Search },
  { key: "rewrite", label: "Rewrite", icon: PenLine },
  { key: "suggestions", label: "Suggestions", icon: Lightbulb },
];

export function AnalysisView() {
  const { analysis, resume, reset } = useResumeStore();
  const versionStore = useVersionStore();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [copiedAll, setCopiedAll] = useState(false);

  if (!analysis) return null;

  const scoreColor =
    analysis.score >= 80
      ? "text-emerald-400"
      : analysis.score >= 60
        ? "text-yellow-400"
        : "text-red-400";

  const handleCopyAll = async () => {
    const text = analysis.suggestions
      .map((s) => `[${s.priority.toUpperCase()}] ${s.title}: ${s.description}`)
      .join("\n");
    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    toast.success("All suggestions copied to clipboard");
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleStartOver = () => {
    reset();
    toast("Started over — ready for a new analysis");
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {/* Sticky summary bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-20 z-30 -mx-2 rounded-xl border border-white/5 bg-zinc-950/90 px-5 py-3 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className={`text-2xl font-bold ${scoreColor}`}>
              {analysis.score}
            </span>
            <div className="hidden sm:block h-6 w-px bg-white/10" />
            <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-500">
              <span>
                <span className="font-medium text-red-400">{analysis.keywordGaps.length}</span> gaps
              </span>
              <span>
                <span className="font-medium text-emerald-400">{analysis.weakBullets.length}</span> rewrites
              </span>
              <span>
                <span className="font-medium text-amber-400">{analysis.suggestions.length}</span> tips
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <VersionSelector />
            {resume?.rawText && <PDFExportButton resumeText={resume.rawText} />}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStartOver}
              className="gap-1.5 text-xs text-zinc-500 hover:text-white"
            >
              <RotateCcw className="h-3 w-3" />
              New
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ScoreCard score={analysis.score} summary={analysis.summary} />
      </motion.div>

      {/* Pill Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex gap-2"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                : "bg-white/[0.04] text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-300"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">Summary</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {analysis.summary}
              </p>
            </div>

            {/* Strengths */}
            {analysis.strengths.length > 0 && (
              <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02] p-6">
                <h3 className="mb-3 text-lg font-semibold text-emerald-400">
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {analysis.strengths.map((s, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-zinc-400"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                <p className="text-2xl font-bold text-red-400">
                  {analysis.keywordGaps.length}
                </p>
                <p className="mt-1 text-xs text-zinc-500">Keyword Gaps</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">
                  {analysis.weakBullets.length}
                </p>
                <p className="mt-1 text-xs text-zinc-500">Bullet Rewrites</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                <p className="text-2xl font-bold text-amber-400">
                  {analysis.suggestions.length}
                </p>
                <p className="mt-1 text-xs text-zinc-500">Suggestions</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "keywords" && (
          <KeywordGaps gaps={analysis.keywordGaps} />
        )}

        {activeTab === "rewrite" && (
          <RewritePanel
            weakBullets={analysis.weakBullets}
            resumeText={resume?.rawText ?? ""}
            onExportPDF={() => {
              const btn = document.querySelector('[data-pdf-export]') as HTMLButtonElement;
              btn?.click();
            }}
          />
        )}

        {activeTab === "suggestions" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyAll}
                className="gap-2 text-zinc-400 hover:text-white"
              >
                {copiedAll ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copiedAll ? "Copied!" : "Copy All Suggestions"}
              </Button>
            </div>
            <Suggestions suggestions={analysis.suggestions} />
          </div>
        )}
      </motion.div>
    </div>
  );
}
