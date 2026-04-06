"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Zap,
  Clock,
  Calendar,
  Mail,
  Bell,
  Play,
  Loader2,
  History,
  Trash2,
  BriefcaseBusiness,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { useAutopilotStore } from "@/store/useAutopilotStore";
import { useAgentStore } from "@/store/useAgentStore";
import { useApplicationStore } from "@/store/useApplicationStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function SettingsPage() {
  const {
    config,
    updateConfig,
    toggleEnabled,
    digests,
    isRunning,
    setRunning,
    addDigest,
    addSeenJobIds,
    setLastRunDate,
    clearDigests,
    seenJobIds,
  } = useAutopilotStore();

  const profile = useAgentStore((s) => s.profile);
  const applications = useApplicationStore((s) => s.applications);

  const handleRunNow = useCallback(async () => {
    if (!profile.targetRole) {
      toast.error("Set up your profile first in Agent Chat!");
      return;
    }

    setRunning(true);
    try {
      const res = await fetch("/api/autopilot/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, seenJobIds }),
      });

      if (!res.ok) throw new Error("Run failed");

      const data = await res.json();

      // Build follow-up reminders
      const reminders = applications
        .filter(
          (a) =>
            a.status === "applied" &&
            a.followUpDate &&
            new Date(a.followUpDate) <= new Date()
        )
        .map((a) => ({
          jobTitle: a.job.title,
          company: a.job.company,
          appliedDate: a.appliedDate || a.createdAt,
        }));

      const digest = {
        id: crypto.randomUUID(),
        runDate: new Date().toISOString(),
        newJobs: data.newJobs,
        removedJobIds: [],
        followUpReminders: reminders,
        stats: data.stats,
      };

      addDigest(digest);
      addSeenJobIds(data.newJobIds);
      setLastRunDate(new Date().toISOString());

      toast.success(
        `Found ${data.stats.newMatches} new matches! Check the latest digest below.`
      );
    } catch {
      toast.error("Autopilot run failed. Try again.");
    } finally {
      setRunning(false);
    }
  }, [
    profile,
    seenJobIds,
    applications,
    addDigest,
    addSeenJobIds,
    setRunning,
    setLastRunDate,
  ]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-20 pt-24">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="h-6 w-6 text-emerald-400" />
            Settings
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Configure autopilot job search and notifications
          </p>
        </div>

        <div className="space-y-6">
          {/* Autopilot toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Zap className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Autopilot
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Automatically search for new jobs on a schedule
                  </p>
                </div>
              </div>
              <button
                onClick={toggleEnabled}
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors",
                  config.enabled ? "bg-emerald-500" : "bg-zinc-700"
                )}
              >
                <motion.div
                  className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
                  animate={{ left: config.enabled ? 22 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {config.enabled && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mt-5 space-y-4 border-t border-zinc-800 pt-5"
              >
                {/* Frequency */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-2">
                    <Clock className="h-3.5 w-3.5" />
                    Frequency
                  </label>
                  <div className="flex gap-2">
                    {(["daily", "weekly", "biweekly"] as const).map((freq) => (
                      <button
                        key={freq}
                        onClick={() => updateConfig({ frequency: freq })}
                        className={cn(
                          "rounded-lg border px-4 py-2 text-xs font-medium capitalize transition-colors",
                          config.frequency === freq
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-700"
                        )}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-2">
                    <Clock className="h-3.5 w-3.5" />
                    Time
                  </label>
                  <input
                    type="time"
                    value={config.time}
                    onChange={(e) => updateConfig({ time: e.target.value })}
                    className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-zinc-700"
                  />
                </div>

                {/* Day of week (for weekly/biweekly) */}
                {config.frequency !== "daily" && (
                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-2">
                      <Calendar className="h-3.5 w-3.5" />
                      Day
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {DAYS.map((day, i) => (
                        <button
                          key={day}
                          onClick={() => updateConfig({ dayOfWeek: i })}
                          className={cn(
                            "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                            config.dayOfWeek === i
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                              : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-700"
                          )}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notifications */}
                <div className="space-y-3">
                  <p className="text-xs font-medium text-zinc-400">
                    Notifications
                  </p>
                  <label className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 cursor-pointer hover:border-zinc-700 transition-colors">
                    <span className="flex items-center gap-2 text-sm text-zinc-300">
                      <Mail className="h-4 w-4 text-zinc-500" />
                      Email digest
                    </span>
                    <input
                      type="checkbox"
                      checked={config.notifyEmail}
                      onChange={(e) =>
                        updateConfig({ notifyEmail: e.target.checked })
                      }
                      className="accent-emerald-500"
                    />
                  </label>
                  {config.notifyEmail && (
                    <input
                      type="email"
                      value={config.email || ""}
                      onChange={(e) => updateConfig({ email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-zinc-700"
                    />
                  )}
                  <label className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 cursor-pointer hover:border-zinc-700 transition-colors">
                    <span className="flex items-center gap-2 text-sm text-zinc-300">
                      <Bell className="h-4 w-4 text-zinc-500" />
                      Browser push
                    </span>
                    <input
                      type="checkbox"
                      checked={config.notifyPush}
                      onChange={(e) =>
                        updateConfig({ notifyPush: e.target.checked })
                      }
                      className="accent-emerald-500"
                    />
                  </label>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Manual run */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Run Now
                </h3>
                <p className="text-xs text-zinc-500">
                  Manually trigger a job search based on your profile
                </p>
              </div>
              <button
                onClick={handleRunNow}
                disabled={isRunning}
                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-colors"
              >
                {isRunning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isRunning ? "Running..." : "Run Autopilot"}
              </button>
            </div>
          </motion.div>

          {/* Digest history */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-zinc-500" />
                <h3 className="text-sm font-semibold text-white">
                  Digest History
                </h3>
              </div>
              {digests.length > 0 && (
                <button
                  onClick={() => {
                    clearDigests();
                    toast("Digest history cleared");
                  }}
                  className="flex items-center gap-1 text-xs text-zinc-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </button>
              )}
            </div>

            {digests.length === 0 ? (
              <p className="text-sm text-zinc-600 text-center py-8">
                No autopilot runs yet. Click &quot;Run Autopilot&quot; to start!
              </p>
            ) : (
              <div className="space-y-3">
                {digests.map((digest) => (
                  <div
                    key={digest.id}
                    className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-zinc-500">
                        {new Date(digest.runDate).toLocaleString()}
                      </span>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <BriefcaseBusiness className="h-3 w-3" />
                          {digest.stats.newMatches} new
                        </span>
                        <span className="flex items-center gap-1 text-zinc-500">
                          <TrendingUp className="h-3 w-3" />
                          {digest.stats.avgScore} avg score
                        </span>
                      </div>
                    </div>

                    {/* Top matches */}
                    {digest.newJobs.length > 0 ? (
                      <div className="space-y-1.5">
                        {digest.newJobs.slice(0, 5).map((job) => (
                          <div
                            key={job.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-zinc-300 truncate">
                                {job.title}
                              </span>
                              <span className="text-xs text-zinc-600 shrink-0">
                                @ {job.company}
                              </span>
                            </div>
                            {job.matchScore > 0 && (
                              <span
                                className={cn(
                                  "shrink-0 text-xs font-bold",
                                  job.matchScore >= 80
                                    ? "text-emerald-400"
                                    : job.matchScore >= 60
                                      ? "text-yellow-400"
                                      : "text-zinc-500"
                                )}
                              >
                                {job.matchScore}
                              </span>
                            )}
                          </div>
                        ))}
                        {digest.newJobs.length > 5 && (
                          <p className="text-xs text-zinc-600">
                            +{digest.newJobs.length - 5} more matches
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-600">
                        No new matches this run
                      </p>
                    )}

                    {/* Follow-up reminders */}
                    {digest.followUpReminders.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-zinc-800">
                        <p className="text-xs font-medium text-amber-400 mb-1.5">
                          ⏰ Follow-up Reminders
                        </p>
                        {digest.followUpReminders.map((r, i) => (
                          <p key={i} className="text-xs text-zinc-500">
                            {r.jobTitle} @ {r.company} — applied{" "}
                            {new Date(r.appliedDate).toLocaleDateString()}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
