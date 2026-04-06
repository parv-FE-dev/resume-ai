"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Send,
  MessageSquare,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { ApplicationDetail } from "@/components/dashboard/ApplicationDetail";
import { useApplicationStore } from "@/store/useApplicationStore";

export default function DashboardPage() {
  const { applications, getStats } = useApplicationStore();
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const stats = getStats();

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-emerald-400" />
            Application Tracker
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Track your job applications from saved to offer
          </p>
        </div>

        {/* Stats cards */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
          >
            <div className="flex items-center gap-2 text-zinc-500">
              <BriefcaseBusiness className="h-4 w-4" />
              <span className="text-xs">Total</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-white">{stats.total}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
          >
            <div className="flex items-center gap-2 text-blue-400">
              <Send className="h-4 w-4" />
              <span className="text-xs">Applied</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-white">
              {stats.applied}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
          >
            <div className="flex items-center gap-2 text-purple-400">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">Interviews</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-white">
              {stats.interviews}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
          >
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Response Rate</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-white">
              {stats.responseRate}%
            </p>
          </motion.div>
        </div>

        {/* Kanban board */}
        {applications.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800">
              <Trophy className="h-8 w-8 text-zinc-600" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-white">
                No Applications Yet
              </h2>
              <p className="mt-1 max-w-md text-sm text-zinc-500">
                Save jobs from the Jobs page, then track them here as you apply.
                Your kanban board will show all stages from saved to offer.
              </p>
            </div>
          </div>
        ) : (
          <KanbanBoard onSelectApplication={setSelectedAppId} />
        )}

        {/* Application detail modal */}
        <AnimatePresence>
          {selectedAppId && (
            <ApplicationDetail
              applicationId={selectedAppId}
              onClose={() => setSelectedAppId(null)}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
