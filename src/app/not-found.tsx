import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-800">
        <FileQuestion className="h-10 w-10 text-zinc-500" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-white">Page Not Found</h1>
      <p className="mt-2 text-sm text-zinc-500">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="rounded-xl bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/chat"
          className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-400 transition-colors"
        >
          Talk to Agent
        </Link>
      </div>
    </div>
  );
}
