"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10">
        <AlertCircle className="h-10 w-10 text-red-400" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-white">
        Something Went Wrong
      </h1>
      <p className="mt-2 max-w-md text-center text-sm text-zinc-500">
        An unexpected error occurred. This might be a temporary issue.
      </p>
      <button
        onClick={reset}
        className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 transition-colors"
      >
        <RotateCcw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}
