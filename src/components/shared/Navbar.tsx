"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Sparkles } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">Resume</span>
          <Sparkles className="h-3.5 w-3.5 -ml-1.5 text-emerald-400" />
          <span className="text-lg font-semibold text-white -ml-1.5">AI</span>
        </Link>

        <div className="flex items-center gap-6">
          {isLanding && (
            <div className="hidden items-center gap-5 sm:flex">
              <a href="#features" className="text-sm text-zinc-400 transition-colors hover:text-emerald-400">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-zinc-400 transition-colors hover:text-emerald-400">
                How It Works
              </a>
              <a href="#demo" className="text-sm text-zinc-400 transition-colors hover:text-emerald-400">
                Demo
              </a>
            </div>
          )}
          <Link
            href="/analyze"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-emerald-500 px-4 text-sm font-medium text-white transition-all hover:bg-emerald-400 hover:shadow-md hover:shadow-emerald-500/20"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
