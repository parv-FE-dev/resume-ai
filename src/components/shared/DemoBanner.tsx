"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import Link from "next/link";

export function DemoBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show banner if no API key is configured (detected by checking if chat works)
    // For now, show on all pages as portfolio demo indicator
    const isDismissed = sessionStorage.getItem("demo-banner-dismissed");
    if (!isDismissed) {
      setVisible(true);
    }
  }, []);

  if (!visible || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        className="fixed top-16 left-0 right-0 z-40 border-b border-amber-500/20 bg-amber-500/5 backdrop-blur-sm"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-xs text-amber-300 sm:text-sm">
              <strong>Demo Mode</strong> — This is a portfolio project by{" "}
              <Link
                href="https://parvsaxena.com"
                target="_blank"
                className="underline hover:text-amber-200"
              >
                Parv Saxena
              </Link>
              . Some features use mock data.
            </span>
          </div>
          <button
            onClick={() => {
              setDismissed(true);
              sessionStorage.setItem("demo-banner-dismissed", "true");
            }}
            className="rounded-lg p-1 text-amber-400/60 hover:text-amber-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
