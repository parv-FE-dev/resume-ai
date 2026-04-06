import { create } from "zustand";
import type { Job } from "@/types/jobs";
import type { Application, ApplicationStatus } from "@/types/application";

const STORAGE_KEY = "resumeai-applications";

function load(): Application[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(apps: Application[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch {
    /* full */
  }
}

interface ApplicationStore {
  applications: Application[];

  addApplication: (job: Job) => string;
  removeApplication: (id: string) => void;
  updateStatus: (id: string, status: ApplicationStatus, note?: string) => void;
  updateNotes: (id: string, notes: string) => void;
  setCoverLetter: (id: string, coverLetter: string) => void;
  setResumeVersionId: (id: string, versionId: string) => void;
  setFollowUpDate: (id: string, date: string) => void;

  getByStatus: (status: ApplicationStatus) => Application[];
  getById: (id: string) => Application | undefined;
  getStats: () => {
    total: number;
    applied: number;
    interviews: number;
    offers: number;
    responseRate: number;
  };
}

export const useApplicationStore = create<ApplicationStore>()((set, get) => {
  const applications = typeof window !== "undefined" ? load() : [];

  return {
    applications,

    addApplication: (job) => {
      const id = crypto.randomUUID();
      const app: Application = {
        id,
        jobId: job.id,
        job,
        status: "saved",
        notes: "",
        statusHistory: [
          { status: "saved", date: new Date().toISOString() },
        ],
        createdAt: new Date().toISOString(),
      };
      const apps = [app, ...get().applications];
      set({ applications: apps });
      save(apps);
      return id;
    },

    removeApplication: (id) => {
      const apps = get().applications.filter((a) => a.id !== id);
      set({ applications: apps });
      save(apps);
    },

    updateStatus: (id, status, note) => {
      const apps = get().applications.map((a) => {
        if (a.id !== id) return a;
        const change = {
          status,
          date: new Date().toISOString(),
          note,
        };
        return {
          ...a,
          status,
          appliedDate:
            status === "applied" && !a.appliedDate
              ? new Date().toISOString()
              : a.appliedDate,
          followUpDate:
            status === "applied"
              ? new Date(Date.now() + 7 * 86400000).toISOString()
              : a.followUpDate,
          statusHistory: [...a.statusHistory, change],
        };
      });
      set({ applications: apps });
      save(apps);
    },

    updateNotes: (id, notes) => {
      const apps = get().applications.map((a) =>
        a.id === id ? { ...a, notes } : a
      );
      set({ applications: apps });
      save(apps);
    },

    setCoverLetter: (id, coverLetter) => {
      const apps = get().applications.map((a) =>
        a.id === id ? { ...a, coverLetter } : a
      );
      set({ applications: apps });
      save(apps);
    },

    setResumeVersionId: (id, resumeVersionId) => {
      const apps = get().applications.map((a) =>
        a.id === id ? { ...a, resumeVersionId } : a
      );
      set({ applications: apps });
      save(apps);
    },

    setFollowUpDate: (id, followUpDate) => {
      const apps = get().applications.map((a) =>
        a.id === id ? { ...a, followUpDate } : a
      );
      set({ applications: apps });
      save(apps);
    },

    getByStatus: (status) =>
      get().applications.filter((a) => a.status === status),

    getById: (id) => get().applications.find((a) => a.id === id),

    getStats: () => {
      const apps = get().applications;
      const applied = apps.filter((a) =>
        ["applied", "in-review", "interview", "rejected", "offer"].includes(
          a.status
        )
      ).length;
      const interviews = apps.filter((a) =>
        ["interview", "offer"].includes(a.status)
      ).length;
      const offers = apps.filter((a) => a.status === "offer").length;
      const responseRate =
        applied > 0
          ? Math.round(
              (apps.filter((a) =>
                ["in-review", "interview", "offer"].includes(a.status)
              ).length /
                applied) *
                100
            )
          : 0;

      return {
        total: apps.length,
        applied,
        interviews,
        offers,
        responseRate,
      };
    },
  };
});
