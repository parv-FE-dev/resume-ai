import { create } from "zustand";
import type { Job, JobFilters } from "@/types/jobs";
import { DEFAULT_FILTERS } from "@/types/jobs";

const STORAGE_KEY = "resumeai-jobs";

interface PersistedJobState {
  savedJobs: Job[];
  dismissedIds: string[];
}

function loadPersisted(): PersistedJobState {
  if (typeof window === "undefined")
    return { savedJobs: [], dismissedIds: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { savedJobs: [], dismissedIds: [] };
  } catch {
    return { savedJobs: [], dismissedIds: [] };
  }
}

function persist(state: PersistedJobState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* full */
  }
}

interface JobStore {
  jobs: Job[];
  savedJobs: Job[];
  dismissedIds: string[];
  filters: JobFilters;
  isSearching: boolean;
  searchSource: "live" | "demo" | null;
  hasSearched: boolean;

  setJobs: (jobs: Job[]) => void;
  setSearching: (v: boolean) => void;
  setSearchSource: (s: "live" | "demo" | null) => void;
  setFilters: (filters: Partial<JobFilters>) => void;
  resetFilters: () => void;

  saveJob: (job: Job) => void;
  unsaveJob: (id: string) => void;
  dismissJob: (id: string) => void;
  undismissJob: (id: string) => void;

  getFilteredJobs: () => Job[];
}

export const useJobStore = create<JobStore>()((set, get) => {
  const persisted =
    typeof window !== "undefined" ? loadPersisted() : { savedJobs: [], dismissedIds: [] };

  return {
    jobs: [],
    savedJobs: persisted.savedJobs,
    dismissedIds: persisted.dismissedIds,
    filters: { ...DEFAULT_FILTERS },
    isSearching: false,
    searchSource: null,
    hasSearched: false,

    setJobs: (jobs) => {
      // Mark saved/dismissed status from persisted state
      const { savedJobs, dismissedIds } = get();
      const savedIds = new Set(savedJobs.map((j) => j.id));
      const marked = jobs.map((j) => ({
        ...j,
        saved: savedIds.has(j.id),
        dismissed: dismissedIds.includes(j.id),
      }));
      set({ jobs: marked, hasSearched: true });
    },

    setSearching: (isSearching) => set({ isSearching }),
    setSearchSource: (searchSource) => set({ searchSource }),

    setFilters: (partial) =>
      set({ filters: { ...get().filters, ...partial } }),

    resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),

    saveJob: (job) => {
      const savedJobs = [...get().savedJobs, { ...job, saved: true }];
      const jobs = get().jobs.map((j) =>
        j.id === job.id ? { ...j, saved: true } : j
      );
      set({ savedJobs, jobs });
      persist({ savedJobs, dismissedIds: get().dismissedIds });
    },

    unsaveJob: (id) => {
      const savedJobs = get().savedJobs.filter((j) => j.id !== id);
      const jobs = get().jobs.map((j) =>
        j.id === id ? { ...j, saved: false } : j
      );
      set({ savedJobs, jobs });
      persist({ savedJobs, dismissedIds: get().dismissedIds });
    },

    dismissJob: (id) => {
      const dismissedIds = [...get().dismissedIds, id];
      const jobs = get().jobs.map((j) =>
        j.id === id ? { ...j, dismissed: true } : j
      );
      set({ dismissedIds, jobs });
      persist({ savedJobs: get().savedJobs, dismissedIds });
    },

    undismissJob: (id) => {
      const dismissedIds = get().dismissedIds.filter((d) => d !== id);
      const jobs = get().jobs.map((j) =>
        j.id === id ? { ...j, dismissed: false } : j
      );
      set({ dismissedIds, jobs });
      persist({ savedJobs: get().savedJobs, dismissedIds });
    },

    getFilteredJobs: () => {
      const { jobs, filters, dismissedIds } = get();
      let filtered = jobs.filter((j) => !dismissedIds.includes(j.id));

      if (filters.remoteOnly) {
        filtered = filtered.filter((j) => j.remote);
      }
      if (filters.minSalary > 0) {
        filtered = filtered.filter(
          (j) => !j.salary || j.salary.max >= filters.minSalary
        );
      }
      if (filters.minScore > 0) {
        filtered = filtered.filter((j) => j.matchScore >= filters.minScore);
      }
      if (filters.sources.length > 0) {
        filtered = filtered.filter((j) =>
          filters.sources.includes(j.source)
        );
      }

      // Sort
      switch (filters.sortBy) {
        case "score":
          filtered.sort((a, b) => b.matchScore - a.matchScore);
          break;
        case "date":
          filtered.sort(
            (a, b) =>
              new Date(b.postedDate).getTime() -
              new Date(a.postedDate).getTime()
          );
          break;
        case "salary":
          filtered.sort(
            (a, b) => (b.salary?.max ?? 0) - (a.salary?.max ?? 0)
          );
          break;
      }

      return filtered;
    },
  };
});
