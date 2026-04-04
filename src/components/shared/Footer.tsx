import { FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-blue-500">
            <FileText className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-medium text-zinc-400">ResumeAI</span>
        </div>
        <p className="text-sm text-zinc-600">
          &copy; {new Date().getFullYear()} ResumeAI. Built with AI.
        </p>
      </div>
    </footer>
  );
}
