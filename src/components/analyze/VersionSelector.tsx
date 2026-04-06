"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, History, Check } from "lucide-react";
import { useVersionStore } from "@/store/useVersionStore";
import { cn } from "@/lib/utils";

export function VersionSelector() {
  const { versions, activeVersionId, setActiveVersion } = useVersionStore();
  const [open, setOpen] = useState(false);

  if (versions.length === 0) return null;

  const active = versions.find((v) => v.id === activeVersionId);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-zinc-700/50 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 hover:border-zinc-600 transition-colors"
      >
        <History className="h-4 w-4 text-zinc-500" />
        <span>{active?.label ?? "Versions"}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-zinc-500 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-11 z-50 w-64 rounded-xl border border-zinc-700/50 bg-zinc-900 p-2 shadow-xl"
          >
            {versions.map((version) => (
              <button
                key={version.id}
                onClick={() => {
                  setActiveVersion(version.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  version.id === activeVersionId
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-zinc-300 hover:bg-zinc-800"
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {version.label}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {version.changes.length > 0
                      ? `${version.changes.length} changes`
                      : "Original"}{" "}
                    · {new Date(version.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {version.id === activeVersionId && (
                  <Check className="h-4 w-4 shrink-0" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
