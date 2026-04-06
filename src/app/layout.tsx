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
  title: "ResumeAI — AI Career Agent | Resume to Offer on Autopilot",
  description:
    "An AI career agent that optimizes your resume, finds matching jobs, generates cover letters, and tracks applications — from first chat to offer letter.",
  keywords: [
    "AI career agent",
    "resume optimizer",
    "job search automation",
    "AI resume analysis",
    "job matching",
    "cover letter generator",
    "application tracker",
    "autopilot job search",
  ],
  openGraph: {
    title: "ResumeAI — AI Career Agent",
    description:
      "From resume to offer letter on autopilot. AI-powered resume optimization, job discovery, cover letters, and application tracking.",
    type: "website",
    siteName: "ResumeAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeAI — AI Career Agent",
    description:
      "AI-powered career agent: resume optimization, job matching, cover letters, and application tracking.",
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
