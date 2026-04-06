import { create } from "zustand";
import type { AutopilotConfig, Digest } from "@/types/autopilot";
import { DEFAULT_AUTOPILOT_CONFIG } from "@/types/autopilot";

const CONFIG_KEY = "resumeai-autopilot-config";
const DIGESTS_KEY = "resumeai-digests";
const SEEN_KEY = "resumeai-seen-jobs";

function loadConfig(): AutopilotConfig {
  if (typeof window === "undefined") return { ...DEFAULT_AUTOPILOT_CONFIG };
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? JSON.parse(raw) : { ...DEFAULT_AUTOPILOT_CONFIG };
  } catch {
    return { ...DEFAULT_AUTOPILOT_CONFIG };
  }
}

function saveConfig(config: AutopilotConfig) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch {
    /* full */
  }
}

function loadDigests(): Digest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DIGESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDigests(digests: Digest[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DIGESTS_KEY, JSON.stringify(digests.slice(0, 30)));
  } catch {
    /* full */
  }
}

function loadSeenJobIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSeenJobIds(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(ids.slice(-500)));
  } catch {
    /* full */
  }
}

interface AutopilotStore {
  config: AutopilotConfig;
  digests: Digest[];
  seenJobIds: string[];
  isRunning: boolean;
  lastRunDate: string | null;

  updateConfig: (partial: Partial<AutopilotConfig>) => void;
  toggleEnabled: () => void;
  addDigest: (digest: Digest) => void;
  addSeenJobIds: (ids: string[]) => void;
  setRunning: (v: boolean) => void;
  setLastRunDate: (date: string) => void;
  clearDigests: () => void;
}

export const useAutopilotStore = create<AutopilotStore>()((set, get) => {
  const config = typeof window !== "undefined" ? loadConfig() : { ...DEFAULT_AUTOPILOT_CONFIG };
  const digests = typeof window !== "undefined" ? loadDigests() : [];
  const seenJobIds = typeof window !== "undefined" ? loadSeenJobIds() : [];

  return {
    config,
    digests,
    seenJobIds,
    isRunning: false,
    lastRunDate: null,

    updateConfig: (partial) => {
      const config = { ...get().config, ...partial };
      set({ config });
      saveConfig(config);
    },

    toggleEnabled: () => {
      const config = { ...get().config, enabled: !get().config.enabled };
      set({ config });
      saveConfig(config);
    },

    addDigest: (digest) => {
      const digests = [digest, ...get().digests].slice(0, 30);
      set({ digests });
      saveDigests(digests);
    },

    addSeenJobIds: (ids) => {
      const seenJobIds = [...new Set([...get().seenJobIds, ...ids])].slice(-500);
      set({ seenJobIds });
      saveSeenJobIds(seenJobIds);
    },

    setRunning: (isRunning) => set({ isRunning }),

    setLastRunDate: (lastRunDate) => set({ lastRunDate }),

    clearDigests: () => {
      set({ digests: [] });
      if (typeof window !== "undefined") {
        localStorage.removeItem(DIGESTS_KEY);
      }
    },
  };
});
