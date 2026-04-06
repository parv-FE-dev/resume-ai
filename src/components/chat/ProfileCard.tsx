"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, ChevronDown, ChevronUp, User } from "lucide-react";
import { useState } from "react";
import { useAgentStore } from "@/store/useAgentStore";
import { PROFILE_FIELDS } from "@/types/agent";

function formatValue(key: string, value: unknown): string | null {
  if (value === "" || value === 0 || value === false) return null;
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : null;
  if (key === "salaryRange") {
    const sr = value as { min: number; max: number; currency: string };
    if (sr.min === 0 && sr.max === 0) return null;
    const fmt = (n: number) => {
      if (sr.currency === "INR") return `₹${(n / 100000).toFixed(0)}L`;
      return `${sr.currency} ${n.toLocaleString()}`;
    };
    return `${fmt(sr.min)} – ${fmt(sr.max)}`;
  }
  if (key === "remote") return value ? "Yes" : null;
  return String(value);
}

export function ProfileCard() {
  const profile = useAgentStore((s) => s.profile);
  const [collapsed, setCollapsed] = useState(false);

  const fields = PROFILE_FIELDS.map((f) => ({
    ...f,
    value: formatValue(f.key, profile[f.key]),
  }));

  const filled = fields.filter((f) => f.value !== null).length;
  const total = fields.length;
  const pct = Math.round((filled / total) * 100);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center justify-between px-5 py-4 hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <User className="h-4 w-4" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">Your Profile</p>
            <p className="text-xs text-zinc-400">
              {filled}/{total} fields · {pct}% complete
            </p>
          </div>
        </div>
        {collapsed ? (
          <ChevronDown className="h-4 w-4 text-zinc-500" />
        ) : (
          <ChevronUp className="h-4 w-4 text-zinc-500" />
        )}
      </button>

      {/* Progress bar */}
      <div className="mx-5 h-1 rounded-full bg-zinc-800 overflow-hidden">
        <motion.div
          className="h-full bg-emerald-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Fields */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 space-y-3">
              {fields.map((field, i) => (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  className="flex items-start gap-3"
                >
                  {field.value ? (
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400" />
                  ) : (
                    <Circle className="h-4 w-4 mt-0.5 shrink-0 text-zinc-600" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-zinc-500 mb-0.5">{field.label}</p>
                    <p
                      className={
                        field.value
                          ? "text-sm text-zinc-200 break-words"
                          : "text-sm text-zinc-600 italic"
                      }
                    >
                      {field.value ?? "Not yet discussed"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
