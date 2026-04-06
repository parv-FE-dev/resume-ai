import type { Job } from "./jobs";

export type ApplicationStatus =
  | "saved"
  | "applied"
  | "in-review"
  | "interview"
  | "rejected"
  | "offer";

export interface StatusChange {
  status: ApplicationStatus;
  date: string;
  note?: string;
}

export interface Application {
  id: string;
  jobId: string;
  job: Job;
  status: ApplicationStatus;
  resumeVersionId?: string;
  coverLetter?: string;
  appliedDate?: string;
  notes: string;
  followUpDate?: string;
  statusHistory: StatusChange[];
  createdAt: string;
}

export const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; emoji: string; color: string; bgColor: string; borderColor: string }
> = {
  saved: {
    label: "Saved",
    emoji: "📋",
    color: "text-zinc-400",
    bgColor: "bg-zinc-500/10",
    borderColor: "border-zinc-500/20",
  },
  applied: {
    label: "Applied",
    emoji: "📨",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  "in-review": {
    label: "In Review",
    emoji: "👀",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  interview: {
    label: "Interview",
    emoji: "🎤",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  rejected: {
    label: "Rejected",
    emoji: "❌",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  offer: {
    label: "Offer",
    emoji: "🎉",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
};

export const STATUS_ORDER: ApplicationStatus[] = [
  "saved",
  "applied",
  "in-review",
  "interview",
  "rejected",
  "offer",
];
