import { Navbar } from "@/components/shared/Navbar";
import { Hero } from "@/components/landing/Hero";
import { BeforeAfter } from "@/components/landing/BeforeAfter";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { StatsBar } from "@/components/landing/StatsBar";
import { WhatYouGet } from "@/components/landing/WhatYouGet";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/shared/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <Hero />
      <BeforeAfter />
      <HowItWorks />
      <StatsBar />
      <WhatYouGet />
      <CTA />
      <Footer />
    </div>
  );
}
