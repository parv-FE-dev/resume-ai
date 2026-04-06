"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
import { ChatMessageBubble } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { ProfileCard } from "@/components/chat/ProfileCard";
import { useAgentStore } from "@/store/useAgentStore";
import {
  Sparkles,
  RotateCcw,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";

// Greeting sent by the agent on first visit
const GREETING =
  "Hey! 👋 I'm your AI Career Agent. I'll help you find the perfect role, optimize your resume, and even apply to jobs for you.\n\nBut first, let's build your profile. **What role are you targeting?**";

export default function ChatPage() {
  const {
    profile,
    isDemoMode,
    updateProfile,
    setOnboardingComplete,
    resetChat,
    loadDemoMode,
  } = useAgentStore();

  const [showSidebar, setShowSidebar] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasGreeted = useRef(false);

  // Vercel AI SDK v6 chat hook
  const { messages, sendMessage, status, setMessages, addToolResult } =
    useChat({
      transport: new DefaultChatTransport({
        api: "/api/chat",
        body: { profile },
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onToolCall: async ({ toolCall }: any) => {
        if (toolCall.toolName === "update_profile" && toolCall.args) {
          const { field, value } = toolCall.args;
          updateProfile(
            field as keyof typeof profile,
            value as (typeof profile)[keyof typeof profile]
          );
        }
        if (toolCall.toolName === "onboarding_complete") {
          setOnboardingComplete(true);
        }
      },
    });

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  // Send greeting on first visit (if no messages)
  useEffect(() => {
    if (messages.length === 0 && !hasGreeted.current && !isDemoMode) {
      hasGreeted.current = true;
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          parts: [{ type: "text" as const, text: GREETING }],
        } as any,
      ]);
    }
  }, [messages.length, isDemoMode, setMessages]);

  // Load demo mode messages
  useEffect(() => {
    if (isDemoMode) {
      const store = useAgentStore.getState();
      setMessages(
        store.messages.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          parts: [{ type: "text" as const, text: m.content }],
        } as any))
      );
    }
  }, [isDemoMode, setMessages]);

  const handleSend = useCallback(
    (text: string) => {
      sendMessage({ role: "user", content: text } as any);
    },
    [sendMessage]
  );

  const handleReset = useCallback(() => {
    resetChat();
    hasGreeted.current = false;
    setMessages([]);
    // Re-trigger greeting
    setTimeout(() => {
      setMessages([
        {
          id: "greeting-" + Date.now(),
          role: "assistant",
          parts: [{ type: "text" as const, text: GREETING }],
        } as any,
      ]);
    }, 100);
  }, [resetChat, setMessages]);

  // Extract text content from message parts
  const getMessageText = (msg: (typeof messages)[0]) => {
    if ((msg as any).content) return (msg as any).content;
    if (msg.parts) {
      return msg.parts
        .filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("");
    }
    return "";
  };

  return (
    <div className="flex h-screen flex-col bg-zinc-950">
      <Navbar />

      {/* Demo mode banner */}
      {isDemoMode && (
        <div className="flex items-center justify-center gap-3 border-b border-amber-500/20 bg-amber-500/5 px-4 py-2 mt-16">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span className="text-sm text-amber-300">
            Demo Mode — This is sample data to show how the agent works.
          </span>
          <button
            onClick={handleReset}
            className="text-sm font-medium text-amber-400 underline hover:text-amber-300 transition-colors"
          >
            Start Fresh
          </button>
        </div>
      )}

      <div
        className={`flex flex-1 overflow-hidden ${isDemoMode ? "" : "mt-16"}`}
      >
        {/* Chat area */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mx-auto max-w-3xl space-y-4">
              {messages.map((msg) => {
                const text = getMessageText(msg);
                if (!text) return null;
                return (
                  <ChatMessageBubble
                    key={msg.id}
                    content={text}
                    role={msg.role as "user" | "assistant"}
                    isStreaming={
                      isLoading &&
                      msg.id === messages[messages.length - 1]?.id &&
                      msg.role === "assistant"
                    }
                  />
                );
              })}

              <AnimatePresence>
                {isLoading &&
                  (messages.length === 0 ||
                    messages[messages.length - 1]?.role !== "assistant") && (
                    <TypingIndicator />
                  )}
              </AnimatePresence>
            </div>
          </div>

          {/* Input */}
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>

        {/* Sidebar */}
        <div className="relative hidden md:block">
          {/* Toggle */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="absolute -left-10 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
          >
            {showSidebar ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </button>

          {showSidebar && (
            <div className="w-80 border-l border-zinc-800 bg-zinc-950 p-4 overflow-y-auto h-full">
              <ProfileCard />

              {/* Quick actions */}
              <div className="mt-4 space-y-2">
                {!isDemoMode && (
                  <button
                    onClick={loadDemoMode}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                  >
                    <Sparkles className="h-4 w-4" />
                    Load Demo
                  </button>
                )}
                {messages.length > 1 && (
                  <button
                    onClick={handleReset}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Start Over
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
