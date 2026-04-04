import { FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-emerald-600">
            <FileText className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-medium text-zinc-400">ResumeAI</span>
        </div>

        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-4">
          <p className="text-sm text-zinc-600">
            Built by{" "}
            <a
              href="https://parvsaxena.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition-colors hover:text-emerald-400"
            >
              Parv Saxena
            </a>
          </p>
          <span className="hidden text-zinc-800 sm:inline">&middot;</span>
          <p className="text-xs text-zinc-700">
            Next.js &bull; Claude AI &bull; Tailwind
          </p>
        </div>

        <a
          href="https://github.com/parvsharmaa/resume-ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-zinc-500 transition-colors hover:text-emerald-400"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
