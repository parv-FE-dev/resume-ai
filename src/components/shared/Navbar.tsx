"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">ResumeAI</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/analyze"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
