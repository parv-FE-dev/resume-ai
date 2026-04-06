"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  Sparkles,
  Bookmark,
  BriefcaseBusiness,
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { JobCard } from "@/components/jobs/JobCard";
import { JobFilters } from "@/components/jobs/JobFilters";
import { useJobStore } from "@/store/useJobStore";
import { useAgentStore } from "@/store/useAgentStore";
import { useApplicationStore } from "@/store/useApplicationStore";
import { toast } from "sonner";

type ViewTab = "results" | "saved";

export default function JobsPage() {
  const {
    isSearching,
    setSearching,
    setJobs,
    setSearchSource,
    searchSource,
    hasSearched,
    getFilteredJobs,
    savedJobs,
    saveJob,
    unsaveJob,
    dismissJob,
  } = useJobStore();

  const profile = useAgentStore((s) => s.profile);
  const addApplication = useApplicationStore((s) => s.addApplication);

  const [activeTab, setActiveTab] = useState<ViewTab>("results");
  const [customQuery, setCustomQuery] = useState("");

  const filteredJobs = getFilteredJobs();

  const handleSearch = useCallback(
    async (query?: string) => {
      setSearching(true);
      try {
        const searchQuery =
          query ||
          customQuery ||
          `${profile.targetRole} ${profile.skills.slice(0, 3).join(" ")}`;

        const res = await fetch("/api/jobs/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: searchQuery,
            location: profile.location,
            remote: profile.remote,
            profile,
          }),
        });

        if (!res.ok) throw new Error("Search failed");

        const data = await res.json();
        setJobs(data.jobs);
        setSearchSource(data.source);

        if (data.source === "demo") {
          toast("Demo mode — showing sample job listings", {
            icon: "✨",
          });
        } else {
          toast.success(`Found ${data.jobs.length} matching jobs!`);
        }
      } catch {
        toast.error("Failed to search jobs. Please try again.");
      } finally {
        setSearching(false);
      }
    },
    [
      customQuery,
      profile,
      setJobs,
      setSearching,
      setSearchSource,
    ]
  );

  const handleAutoSearch = useCallback(() => {
    if (!profile.targetRole) {
      toast.error(
        "Complete your profile first! Go to Agent Chat to set up your target role."
      );
      return;
    }
    handleSearch();
  }, [profile.targetRole, handleSearch]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Job Discovery</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Find jobs that match your profile and skills
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-6 flex gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 focus-within:border-emerald-500/40 transition-colors">
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={
                profile.targetRole
                  ? `${profile.targetRole} ${profile.skills.slice(0, 2).join(", ")}...`
                  : "Senior Frontend Engineer React TypeScript..."
              }
              className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 outline-none"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="rounded-xl bg-zinc-800 px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 transition-colors"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Search"
            )}
          </button>
          <button
            onClick={handleAutoSearch}
            disabled={isSearching}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Auto-Match
          </button>
        </div>

        {/* Demo banner */}
        {searchSource === "demo" && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-2"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-xs text-amber-300">
              Demo Mode — showing sample job listings. Add a SerpAPI key for
              live results.
            </span>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="mb-4 flex items-center gap-1 border-b border-zinc-800 pb-px">
          <button
            onClick={() => setActiveTab("results")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "results"
                ? "border-emerald-500 text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <BriefcaseBusiness className="h-4 w-4" />
            Results
            {filteredJobs.length > 0 && (
              <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs">
                {filteredJobs.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "saved"
                ? "border-emerald-500 text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Bookmark className="h-4 w-4" />
            Saved
            {savedJobs.length > 0 && (
              <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-xs">
                {savedJobs.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {!hasSearched ? (
                /* Empty state */
                <div className="flex flex-col items-center gap-4 py-20">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
                    <Search className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-white">
                      Find Your Next Role
                    </h2>
                    <p className="mt-1 max-w-md text-sm text-zinc-500">
                      {profile.targetRole
                        ? `Click "Auto-Match" to find ${profile.targetRole} jobs matching your profile`
                        : "Set up your profile in Agent Chat first, then come back to search for matching jobs"}
                    </p>
                  </div>
                  {profile.targetRole && (
                    <button
                      onClick={handleAutoSearch}
                      className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-400 transition-colors"
                    >
                      <Sparkles className="h-4 w-4" />
                      Find Matching Jobs
                    </button>
                  )}
                </div>
              ) : isSearching ? (
                /* Loading */
                <div className="flex flex-col items-center gap-4 py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
                  <p className="text-sm text-zinc-400">
                    Searching for matching jobs...
                  </p>
                </div>
              ) : filteredJobs.length === 0 ? (
                /* No results */
                <div className="flex flex-col items-center gap-4 py-20">
                  <p className="text-sm text-zinc-500">
                    No jobs match your current filters. Try adjusting them.
                  </p>
                </div>
              ) : (
                /* Results */
                <div className="space-y-4">
                  <JobFilters />
                  <div className="space-y-3">
                    {filteredJobs.map((job, i) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        index={i}
                        onSave={(j) => {
                          saveJob(j);
                          addApplication(j);
                          toast.success(`Saved ${j.title} — added to tracker!`);
                        }}
                        onUnsave={unsaveJob}
                        onDismiss={dismissJob}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "saved" && (
            <motion.div
              key="saved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {savedJobs.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-20">
                  <Bookmark className="h-8 w-8 text-zinc-600" />
                  <p className="text-sm text-zinc-500">
                    No saved jobs yet. Search and save jobs you&apos;re
                    interested in.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedJobs.map((job, i) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      index={i}
                      onSave={saveJob}
                      onUnsave={unsaveJob}
                      onDismiss={dismissJob}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
