"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">ResumeAI</span>
        </Link>

        <div className="flex items-center gap-6">
          {isLanding && (
            <div className="hidden items-center gap-5 sm:flex">
              <a href="#features" className="text-sm text-zinc-400 transition-colors hover:text-white">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-zinc-400 transition-colors hover:text-white">
                How It Works
              </a>
              <a href="#demo" className="text-sm text-zinc-400 transition-colors hover:text-white">
                Demo
              </a>
            </div>
          )}
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
