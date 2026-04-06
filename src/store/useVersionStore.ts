import { create } from "zustand";

export interface ResumeChange {
  id: string;
  original: string;
  suggested: string;
  section: string;
  issue: string;
  status: "pending" | "accepted" | "rejected";
}

export interface ResumeVersion {
  id: string;
  version: number;
  label: string;
  content: string;
  changes: ResumeChange[];
  createdAt: number;
}

const STORAGE_KEY = "resumeai-versions";

function loadVersions(): ResumeVersion[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveVersions(versions: ResumeVersion[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(versions.slice(0, 10)));
  } catch {
    /* full */
  }
}

interface VersionStore {
  versions: ResumeVersion[];
  activeVersionId: string | null;
  changes: ResumeChange[];

  // Version management
  addVersion: (version: Omit<ResumeVersion, "id" | "createdAt">) => string;
  setActiveVersion: (id: string) => void;
  getActiveVersion: () => ResumeVersion | null;

  // Change tracking
  setChanges: (changes: ResumeChange[]) => void;
  acceptChange: (id: string) => void;
  rejectChange: (id: string) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  updateChange: (id: string, newText: string) => void;
  getAcceptedCount: () => number;
  getTotalCount: () => number;

  // Apply changes and create new version
  applyChanges: (originalContent: string) => string;
  createVersionFromChanges: (originalContent: string, label: string) => string;

  reset: () => void;
}

export const useVersionStore = create<VersionStore>()((set, get) => {
  const versions = typeof window !== "undefined" ? loadVersions() : [];

  return {
    versions,
    activeVersionId: versions.length > 0 ? versions[0].id : null,
    changes: [],

    addVersion: (versionData) => {
      const id = crypto.randomUUID();
      const version: ResumeVersion = {
        ...versionData,
        id,
        createdAt: Date.now(),
      };
      const versions = [version, ...get().versions].slice(0, 10);
      set({ versions, activeVersionId: id });
      saveVersions(versions);
      return id;
    },

    setActiveVersion: (id) => set({ activeVersionId: id }),

    getActiveVersion: () => {
      const { versions, activeVersionId } = get();
      return versions.find((v) => v.id === activeVersionId) ?? null;
    },

    setChanges: (changes) => set({ changes }),

    acceptChange: (id) => {
      const changes = get().changes.map((c) =>
        c.id === id ? { ...c, status: "accepted" as const } : c
      );
      set({ changes });
    },

    rejectChange: (id) => {
      const changes = get().changes.map((c) =>
        c.id === id ? { ...c, status: "rejected" as const } : c
      );
      set({ changes });
    },

    acceptAll: () => {
      const changes = get().changes.map((c) => ({
        ...c,
        status: "accepted" as const,
      }));
      set({ changes });
    },

    rejectAll: () => {
      const changes = get().changes.map((c) => ({
        ...c,
        status: "rejected" as const,
      }));
      set({ changes });
    },

    updateChange: (id, newText) => {
      const changes = get().changes.map((c) =>
        c.id === id
          ? { ...c, suggested: newText, status: "accepted" as const }
          : c
      );
      set({ changes });
    },

    getAcceptedCount: () =>
      get().changes.filter((c) => c.status === "accepted").length,

    getTotalCount: () => get().changes.length,

    applyChanges: (originalContent) => {
      let content = originalContent;
      const accepted = get().changes.filter((c) => c.status === "accepted");
      for (const change of accepted) {
        content = content.replace(change.original, change.suggested);
      }
      return content;
    },

    createVersionFromChanges: (originalContent, label) => {
      const content = get().applyChanges(originalContent);
      const accepted = get().changes.filter((c) => c.status === "accepted");
      const versionNum = get().versions.length + 1;
      return get().addVersion({
        version: versionNum,
        label,
        content,
        changes: accepted,
      });
    },

    reset: () => {
      set({ changes: [], versions: [], activeVersionId: null });
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
  };
});
