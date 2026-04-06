"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  isStreaming?: boolean;
}

/** Minimal markdown: **bold**, [links](url), bullet lists */
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    if (i > 0) elements.push(<br key={`br-${i}`} />);

    const isBullet = /^[-•*]\s/.test(line.trim());
    const content = isBullet ? line.trim().replace(/^[-•*]\s/, "") : line;

    const parts: React.ReactNode[] = [];
    const regex = /(\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\))/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex)
        parts.push(content.slice(lastIndex, match.index));
      if (match[2]) {
        parts.push(
          <strong key={`b-${i}-${match.index}`} className="font-semibold">
            {match[2]}
          </strong>
        );
      } else if (match[3] && match[4]) {
        parts.push(
          <a
            key={`a-${i}-${match.index}`}
            href={match[4]}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-emerald-400 hover:text-emerald-300"
          >
            {match[3]}
          </a>
        );
      }
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < content.length) parts.push(content.slice(lastIndex));

    if (isBullet) {
      elements.push(
        <span key={`li-${i}`} className="flex gap-1.5 ml-1">
          <span className="text-emerald-400 shrink-0">•</span>
          <span>{parts}</span>
        </span>
      );
    } else {
      elements.push(<span key={`l-${i}`}>{parts}</span>);
    }
  });

  return elements;
}

export function ChatMessageBubble({
  content,
  role,
  isStreaming,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
    >
      {/* Agent avatar */}
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-emerald-600 text-white rounded-2xl rounded-br-sm"
            : "bg-zinc-800/80 border border-zinc-700/50 text-zinc-100 rounded-2xl rounded-bl-sm"
        )}
      >
        {renderMarkdown(content)}
        {isStreaming && (
          <span className="inline-block w-[2px] h-4 bg-emerald-400 ml-0.5 animate-pulse align-middle" />
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-zinc-300">
          <User className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  );
}
