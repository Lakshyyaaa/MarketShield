import React from "react";
import { Header } from "@/components/navigation/Header";
import { HeroMasthead } from "@/components/sections/HeroMasthead";
import { InfiniteTicker } from "@/components/sections/InfiniteTicker";
import { PinnedStory } from "@/components/sections/PinnedStory";
import { FeatureFlowLines } from "@/components/sections/FeatureFlowLines";
import { InteractiveTransactionVisualizer } from "@/components/sections/InteractiveTransactionVisualizer";
import { MultiLayerSection } from "@/components/sections/MultiLayerSection";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white selection:bg-lemongrass selection:text-forest">
      {/* Sticky Top Header Navigation */}
      <Header />

      <main className="flex-1">
        {/* Section 1: Hero Masthead */}
        <HeroMasthead />

        {/* Infinitely Looping Marquee Ticker */}
        <InfiniteTicker />

        {/* Section 2: Pinned Scroll Story */}
        <PinnedStory />

        {/* Section 3: Interactive Feature Flow Lines */}
        <FeatureFlowLines />

        {/* Section 4: Real-Time Interactive Transaction Visualizer */}
        <InteractiveTransactionVisualizer />

        {/* Section 5: Multi-Layer Architecture by Industry */}
        <MultiLayerSection />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
