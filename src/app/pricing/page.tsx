"use client";

import { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PricingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 pb-20 pt-32 text-center">
        <h1 className="text-4xl font-bold text-white">Pricing</h1>
        <p className="mt-2 text-lg text-emerald-400">Coming Soon</p>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <p className="text-zinc-300">
            We are working on premium plans with unlimited analyses, priority
            processing, and more.
          </p>

          <div className="mt-8">
            <p className="mb-3 text-sm font-medium text-zinc-400">
              Get notified when we launch
            </p>
            {submitted ? (
              <p className="text-sm text-emerald-400">
                Thanks! We&apos;ll be in touch.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="flex gap-2 justify-center"
              >
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-64 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                />
                <Button
                  type="submit"
                  className="bg-emerald-500 text-white hover:bg-emerald-400"
                >
                  Notify Me
                </Button>
              </form>
            )}
          </div>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block text-sm text-zinc-500 hover:text-white transition-colors"
        >
          &larr; Back to home
        </Link>
      </main>
    </div>
  );
}
