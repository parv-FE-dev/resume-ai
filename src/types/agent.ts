// Agent / Onboarding types for ResumeAI Agent

export interface JobSeekerProfile {
  targetRole: string;
  seniority: "junior" | "mid" | "senior" | "lead" | "staff" | "";
  experience: number;
  skills: string[];
  domain: string[];
  location: string;
  remote: boolean;
  salaryRange: { min: number; max: number; currency: string };
  companyStage: string[];
  dealbreakers: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export const EMPTY_PROFILE: JobSeekerProfile = {
  targetRole: "",
  seniority: "",
  experience: 0,
  skills: [],
  domain: [],
  location: "",
  remote: false,
  salaryRange: { min: 0, max: 0, currency: "INR" },
  companyStage: [],
  dealbreakers: [],
};

/** Fields the agent asks about, in order */
export const PROFILE_FIELDS: {
  key: keyof JobSeekerProfile;
  label: string;
}[] = [
  { key: "targetRole", label: "Target Role" },
  { key: "seniority", label: "Seniority" },
  { key: "experience", label: "Years of Experience" },
  { key: "skills", label: "Skills" },
  { key: "domain", label: "Preferred Domain" },
  { key: "location", label: "Location" },
  { key: "remote", label: "Remote Preference" },
  { key: "salaryRange", label: "Salary Range" },
  { key: "companyStage", label: "Company Stage" },
  { key: "dealbreakers", label: "Dealbreakers" },
];
