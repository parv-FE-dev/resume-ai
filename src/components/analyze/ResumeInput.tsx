"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, FileText, ArrowRight, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useResumeStore } from "@/store/useResumeStore";
import { toast } from "sonner";

export function ResumeInput() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setResume, setCurrentStep } = useResumeStore();

  const handleFile = useCallback(async (file: File) => {
    if (file.type === "application/pdf") {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/parse-pdf", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to parse PDF");
        setText(data.text);
        setFileName(file.name);
        toast.success("Resume uploaded", { description: `Extracted text from ${file.name}` });
      } catch (err) {
        toast.error("PDF parsing failed", {
          description: err instanceof Error ? err.message : "Could not extract text from PDF",
        });
      } finally {
        setUploading(false);
      }
    } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const content = await file.text();
      setText(content);
      setFileName(file.name);
      toast.success("Resume uploaded", { description: file.name });
    } else {
      toast.error("Unsupported file type", { description: "Please upload a PDF or TXT file." });
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleClear = () => {
    setText("");
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    setResume({ rawText: text.trim(), fileName: fileName ?? undefined });
    setCurrentStep("job-description");
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Paste your resume</h2>
        <p className="mt-2 text-zinc-400">
          Paste your resume text below or drag and drop a PDF file.
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed transition-colors ${
          dragActive
            ? "border-emerald-500 bg-emerald-500/5"
            : "border-white/10 hover:border-white/20"
        }`}
      >
        {!text && !uploading && (
          <div className="flex flex-col items-center gap-3 py-12 text-zinc-500">
            <Upload className="h-8 w-8" />
            <p className="text-sm">Drag & drop a PDF or click to type below</p>
          </div>
        )}

        {uploading && (
          <div className="flex flex-col items-center gap-3 py-12 text-zinc-400">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
            <p className="text-sm">Extracting text from PDF...</p>
          </div>
        )}

        {text && (
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-zinc-400">
                {fileName || "Resume content"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={handleClear}
              className="h-6 w-6 p-0 text-zinc-500 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {!uploading && (
          <Textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (fileName) setFileName(null);
            }}
            placeholder="Paste your resume text here..."
            className={`min-h-[300px] resize-none border-0 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-0 ${
              !text ? "absolute inset-0 opacity-0" : ""
            }`}
          />
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="absolute inset-0 cursor-pointer opacity-0"
          style={{ display: text || uploading ? "none" : "block" }}
        />
      </div>

      {/* Character count */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-600">
          {text.length > 0 ? `${text.length.toLocaleString()} characters` : ""}
        </span>
        <Button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="gap-2 bg-emerald-500 text-white hover:bg-emerald-400 disabled:opacity-40"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
