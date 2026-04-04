import { FileText, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="relative flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-emerald-600">
            <FileText className="h-3 w-3 text-white" />
            <Sparkles className="absolute -right-0.5 -top-0.5 h-2 w-2 text-emerald-300" />
          </div>
          <span className="text-sm font-medium text-zinc-400">ResumeAI</span>
        </div>

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
          <span className="mx-2 text-zinc-800">|</span>
          <a
            href="https://github.com/parvsharmaa/resume-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition-colors hover:text-emerald-400"
          >
            GitHub
          </a>
          <span className="mx-2 text-zinc-800">|</span>
          <span className="text-zinc-700">Powered by Claude AI</span>
        </p>
      </div>
    </footer>
  );
}
