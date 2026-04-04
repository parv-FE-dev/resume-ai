"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useResumeStore } from "@/store/useResumeStore";

export function JobDescInput() {
  const [text, setText] = useState("");
  const { setJobDescription, setCurrentStep } = useResumeStore();

  const handleSubmit = () => {
    if (!text.trim()) return;
    setJobDescription({ rawText: text.trim() });
    setCurrentStep("analyzing");
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">
          Paste the job description
        </h2>
        <p className="mt-2 text-zinc-400">
          Copy and paste the full job posting you want to target.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2">
          <Briefcase className="h-4 w-4 text-blue-400" />
          <span className="text-sm text-zinc-400">Job description</span>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the full job description here..."
          className="min-h-[300px] resize-none border-0 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-0"
        />
      </div>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep("upload")}
          className="gap-2 text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="gap-2 bg-white text-black hover:bg-zinc-200 disabled:opacity-40"
        >
          Analyze Resume
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
