import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResumeAI — AI-Powered Resume Optimizer",
  description:
    "Upload your resume, paste a job description, and get instant AI analysis with match scoring, keyword gaps, and rewritten bullet points.",
  keywords: [
    "resume analyzer",
    "AI resume",
    "resume optimizer",
    "job description match",
    "ATS optimization",
    "keyword gap analysis",
    "resume score",
  ],
  openGraph: {
    title: "ResumeAI — AI-Powered Resume Optimizer",
    description:
      "Upload your resume, paste a job description, and get instant AI analysis with match scoring, keyword gaps, and rewritten bullet points.",
    type: "website",
    siteName: "ResumeAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeAI — AI-Powered Resume Optimizer",
    description:
      "Get instant AI analysis with match scoring, keyword gaps, and rewritten bullet points.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-zinc-950 text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
