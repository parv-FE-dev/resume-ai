"use client";

import { useRef, useCallback } from "react";
import { Send, Paperclip, FileText, X } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  onFileUpload?: (file: File) => void;
  uploadedFileName?: string | null;
  onClearFile?: () => void;
}

export function ChatInput({
  onSend,
  disabled,
  onFileUpload,
  uploadedFileName,
  onClearFile,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInput = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, []);

  const handleSend = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const text = el.value.trim();
    if (!text || disabled) return;
    onSend(text);
    el.value = "";
    el.style.height = "auto";
  }, [onSend, disabled]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onFileUpload) {
        onFileUpload(file);
      }
      // Reset input so the same file can be re-selected
      e.target.value = "";
    },
    [onFileUpload]
  );

  return (
    <div className="border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-4">
      {/* Uploaded file indicator */}
      {uploadedFileName && (
        <div className="mx-auto mb-2 flex max-w-3xl items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
          <FileText className="h-4 w-4 text-emerald-400" />
          <span className="flex-1 truncate text-sm text-emerald-300">
            {uploadedFileName}
          </span>
          {onClearFile && (
            <button
              onClick={onClearFile}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      <div className="mx-auto flex max-w-3xl items-end gap-3 rounded-xl border border-zinc-700/50 bg-zinc-900 px-4 py-3 focus-within:border-emerald-500/40 transition-colors">
        {onFileUpload && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-all hover:bg-zinc-800 hover:text-white disabled:opacity-30"
              aria-label="Upload resume PDF"
              title="Upload resume PDF"
            >
              <Paperclip className="h-4 w-4" />
            </button>
          </>
        )}
        <textarea
          ref={textareaRef}
          rows={1}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={
            disabled
              ? "Agent is thinking..."
              : "Tell me about your job search goals..."
          }
          className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={disabled}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white transition-all hover:bg-emerald-400 disabled:opacity-30 disabled:hover:bg-emerald-500"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
