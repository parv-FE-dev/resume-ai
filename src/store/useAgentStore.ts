import { create } from "zustand";
import type { JobSeekerProfile, ChatMessage } from "@/types/agent";
import { EMPTY_PROFILE } from "@/types/agent";

// ---------------------------------------------------------------------------
// Demo data — pre-filled profile + mock conversation
// ---------------------------------------------------------------------------

const DEMO_PROFILE: JobSeekerProfile = {
  targetRole: "Senior Frontend Engineer",
  seniority: "senior",
  experience: 5,
  skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Zustand"],
  domain: ["AI", "SaaS", "Developer Tools"],
  location: "Bengaluru / Remote",
  remote: true,
  salaryRange: { min: 3000000, max: 4500000, currency: "INR" },
  companyStage: ["Series A", "Series B", "Series C"],
  dealbreakers: ["No equity", "Mandatory 6-day work week"],
};

const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: "demo-1",
    role: "assistant",
    content:
      "Hey! 👋 I'm your AI Career Agent. I'll help you find the perfect role — but first I need to understand what you're looking for.\n\nLet's start simple: **What role are you targeting?**",
    timestamp: Date.now() - 60000 * 5,
  },
  {
    id: "demo-2",
    role: "user",
    content: "Senior Frontend Engineer, ideally at an AI company",
    timestamp: Date.now() - 60000 * 4,
  },
  {
    id: "demo-3",
    role: "assistant",
    content:
      "Great choice! Senior Frontend at AI companies is a hot space right now. 🔥\n\n**How many years of experience do you have, and what's your main tech stack?**",
    timestamp: Date.now() - 60000 * 3,
  },
  {
    id: "demo-4",
    role: "user",
    content:
      "5+ years. React, TypeScript, Next.js, Tailwind, Zustand. I've also worked with OpenAI and Claude APIs.",
    timestamp: Date.now() - 60000 * 2,
  },
  {
    id: "demo-5",
    role: "assistant",
    content:
      "Solid stack — the AI API experience is a great differentiator. ✅\n\nI've saved your profile so far. Here's what I have:\n\n- **Role:** Senior Frontend Engineer\n- **Experience:** 5+ years\n- **Skills:** React, TypeScript, Next.js, Tailwind, Zustand\n- **Domain:** AI, SaaS, Developer Tools\n- **Location:** Bengaluru / Remote\n- **Salary:** ₹30–45 LPA\n- **Company Stage:** Series A–C\n\nYour profile is complete! 🎉 You can now **upload your resume** and I'll analyze it against your goals, or ask me to **search for matching jobs**.",
    timestamp: Date.now() - 60000 * 1,
  },
];

// ---------------------------------------------------------------------------
// Persistence helpers
// ---------------------------------------------------------------------------

const STORAGE_KEY = "resumeai-agent";

interface PersistedState {
  profile: JobSeekerProfile;
  messages: ChatMessage[];
  isOnboardingComplete: boolean;
}

function loadPersisted(): Partial<PersistedState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persist(state: PersistedState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* localStorage full */
  }
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface AgentStore {
  profile: JobSeekerProfile;
  messages: ChatMessage[];
  isOnboardingComplete: boolean;
  isStreaming: boolean;
  isDemoMode: boolean;

  updateProfile: (
    field: keyof JobSeekerProfile,
    value: JobSeekerProfile[keyof JobSeekerProfile]
  ) => void;
  addMessage: (msg: ChatMessage) => void;
  appendToLastAssistant: (chunk: string) => void;
  setStreaming: (v: boolean) => void;
  setOnboardingComplete: (v: boolean) => void;
  resetChat: () => void;
  loadDemoMode: () => void;
}

export const useAgentStore = create<AgentStore>()((set, get) => {
  const persisted = typeof window !== "undefined" ? loadPersisted() : {};

  return {
    profile: persisted.profile ?? { ...EMPTY_PROFILE },
    messages: persisted.messages ?? [],
    isOnboardingComplete: persisted.isOnboardingComplete ?? false,
    isStreaming: false,
    isDemoMode: false,

    updateProfile: (field, value) => {
      const profile = { ...get().profile, [field]: value };
      set({ profile });
      persist({
        profile,
        messages: get().messages,
        isOnboardingComplete: get().isOnboardingComplete,
      });
    },

    addMessage: (msg) => {
      const messages = [...get().messages, msg];
      set({ messages });
      persist({
        profile: get().profile,
        messages,
        isOnboardingComplete: get().isOnboardingComplete,
      });
    },

    appendToLastAssistant: (chunk) => {
      const msgs = [...get().messages];
      const last = msgs[msgs.length - 1];
      if (last?.role === "assistant") {
        msgs[msgs.length - 1] = { ...last, content: last.content + chunk };
        set({ messages: msgs });
      }
    },

    setStreaming: (isStreaming) => set({ isStreaming }),

    setOnboardingComplete: (isOnboardingComplete) => {
      set({ isOnboardingComplete });
      persist({
        profile: get().profile,
        messages: get().messages,
        isOnboardingComplete,
      });
    },

    resetChat: () => {
      set({
        profile: { ...EMPTY_PROFILE },
        messages: [],
        isOnboardingComplete: false,
        isStreaming: false,
        isDemoMode: false,
      });
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    },

    loadDemoMode: () => {
      set({
        profile: { ...DEMO_PROFILE },
        messages: [...DEMO_MESSAGES],
        isOnboardingComplete: true,
        isStreaming: false,
        isDemoMode: true,
      });
    },
  };
});
