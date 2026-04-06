export interface AutopilotConfig {
  enabled: boolean;
  frequency: "daily" | "weekly" | "biweekly";
  time: string; // "09:00"
  dayOfWeek?: number; // 0-6 for weekly/biweekly
  notifyEmail: boolean;
  notifyPush: boolean;
  email?: string;
}

export interface DigestJob {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  matchScore: number;
  sourceUrl: string;
  source: string;
}

export interface Digest {
  id: string;
  runDate: string;
  newJobs: DigestJob[];
  removedJobIds: string[];
  followUpReminders: { jobTitle: string; company: string; appliedDate: string }[];
  stats: {
    totalFound: number;
    newMatches: number;
    avgScore: number;
  };
}

export const DEFAULT_AUTOPILOT_CONFIG: AutopilotConfig = {
  enabled: false,
  frequency: "weekly",
  time: "09:00",
  dayOfWeek: 1, // Monday
  notifyEmail: false,
  notifyPush: false,
};
