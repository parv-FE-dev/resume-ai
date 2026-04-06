"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Sparkles,
  MessageSquare,
  Search,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileNav } from "./MobileNav";

const NAV_ITEMS = [
  { href: "/chat", label: "Agent Chat", icon: MessageSquare },
  { href: "/analyze", label: "Resume", icon: FileText },
  { href: "/jobs", label: "Jobs", icon: Search },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
            <FileText className="h-4 w-4 text-white" />
            <Sparkles className="absolute -right-1 -top-1 h-3 w-3 text-emerald-300" />
          </div>
          <span className="text-lg font-semibold text-white">
            Resume<span className="text-emerald-400">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 font-medium"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </nav>
  );
}
