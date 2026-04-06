export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  remote: boolean;
  salary?: { min: number; max: number; currency: string };
  description: string;
  requirements: string[];
  source: string;
  sourceUrl: string;
  postedDate: string;
  matchScore: number;
  matchReasons: string[];
  saved: boolean;
  dismissed: boolean;
}

export interface JobSearchParams {
  query: string;
  location: string;
  remote: boolean;
  page?: number;
}

export interface JobFilters {
  remoteOnly: boolean;
  minSalary: number;
  minScore: number;
  sources: string[];
  sortBy: "score" | "date" | "salary";
}

export const DEFAULT_FILTERS: JobFilters = {
  remoteOnly: false,
  minSalary: 0,
  minScore: 0,
  sources: [],
  sortBy: "score",
};
