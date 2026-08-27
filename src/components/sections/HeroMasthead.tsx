"use client";

import React, { useRef } from "react";
import { CutCornerContainer } from "../ui/CutCornerContainer";
import { VerticalRuler, CenterStickyChevrons } from "../ui/VerticalRuler";
import { motion, useScroll, useTransform } from "framer-motion";

export const HeroMasthead: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll inside the Hero sequence container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Card 1 (Initial White Rectangle): Moves to RIGHT immediately from start of scroll (0 -> 0.5)
  const card1X = useTransform(scrollYProgress, [0, 0.45, 0.65], [0, 280, 520]);
  const card1Y = useTransform(scrollYProgress, [0, 0.45], [0, 0]);
  const card1Scale = useTransform(scrollYProgress, [0, 0.45, 0.65], [1, 0.96, 0.9]);
  const card1Opacity = useTransform(scrollYProgress, [0, 0.35, 0.55], [1, 0.7, 0]);
  const card1ZIndex = useTransform(scrollYProgress, [0, 0.3, 0.5], [30, 30, 10]);

  // Card 2 (Green Rectangle): Appears from left into CENTER (0 -> 0.45), then moves UP and disappears (0.55 -> 0.85)
  const card2X = useTransform(scrollYProgress, [0, 0.35, 0.65, 0.9], [-200, 0, 0, 0]);
  const card2Y = useTransform(scrollYProgress, [0, 0.45, 0.85], [0, 0, -260]);
  const card2Scale = useTransform(scrollYProgress, [0, 0.35, 0.65, 0.85], [0.92, 1, 1, 0.92]);
  // Opacity: 0 at top -> 1 at center stage -> 0 completely at step 3 (no lingering green card)
  const card2Opacity = useTransform(scrollYProgress, [0, 0.25, 0.55, 0.75], [0, 1, 1, 0]);
  const card2ZIndex = useTransform(scrollYProgress, [0, 0.25, 0.65], [10, 25, 10]);

  // Card 3 (New White Rectangle): Comes UP from bottom into CENTER (0.55 -> 0.9)
  const card3Y = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [300, 240, 0, 0]);
  const card3Scale = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0.92, 0.94, 1, 1]);
  const card3Opacity = useTransform(scrollYProgress, [0, 0.52, 0.75, 1], [0, 0, 1, 1]);

  return (
    <section ref={containerRef} className="relative bg-white text-black h-[220vh]">
      {/* Sticky Full-Viewport Hero Experience */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden py-3 px-3 sm:px-6 lg:px-8">

        {/* Vertical Tick Rulers along left and right gutters */}
        <VerticalRuler color="bg-black/35" />
        <CenterStickyChevrons />

        <div className="w-full flex flex-col justify-center max-w-[94rem] mx-auto z-10 my-auto">
          {/* Main Sage-1 Masthead Box with Cut Corners */}
          <CutCornerContainer
            cornerSizeDesktop={17}
            cornerSizeMobile={7}
            cornerBg="bg-white"
            className="bg-sage-1 py-6 sm:py-7 md:py-8 px-4 sm:px-6 lg:px-8 shadow-sm flex flex-col items-center justify-center -mx-2 sm:mx-0 overflow-hidden"
          >
            {/* Top Area: Main Headline */}
            <div className="text-center w-full max-w-5xl mx-auto mb-3 sm:mb-5">
              <h1 className="text-forest tracking-[-0.03em] font-semibold leading-[1.05] text-[1.95rem] sm:text-[2.75rem] md:text-[3.4rem] lg:text-[3.9rem] max-w-5xl mx-auto">
                The AI ecosystem
                <br className="hidden sm:inline" /> for modern investing
              </h1>
            </div>

            {/* Middle Central Animated Stage with Widened Rectangles & Stage Container */}
            <div className="relative w-full max-w-6xl my-auto py-1 flex items-center justify-center min-h-[350px] sm:min-h-[430px] md:min-h-[470px] lg:min-h-[500px]">

              {/* STAGE CONTAINER */}
              <div className="relative w-full max-w-[1000px] h-[340px] sm:h-[420px] md:h-[460px] lg:h-[490px] flex items-center justify-center">

                {/* 1. INITIAL GREEN RECTANGLE (Landing Card - Grievance Redressal & Action) */}
                <motion.div
                  style={{
                    x: card1X,
                    y: card1Y,
                    scale: card1Scale,
                    opacity: card1Opacity,
                    zIndex: card1ZIndex,
                  }}
                  className="absolute w-[94%] sm:w-[620px] md:w-[760px] lg:w-[880px] xl:w-[940px] h-[330px] sm:h-[410px] md:h-[450px] lg:h-[480px] bg-[#0c1808] rounded-2xl sm:rounded-3xl shadow-[0_24px_60px_rgba(10,20,5,0.38)] border border-lemongrass/40 flex flex-col items-center justify-between p-6 sm:p-8 md:p-10 lg:p-11 text-center text-white overflow-hidden"
                >
                  <div className="space-y-3 sm:space-y-4 md:space-y-5 flex flex-col items-center w-full my-auto">
                    <div className="inline-flex items-center px-3.5 py-1.5 rounded-md bg-white/10 text-lemongrass border border-lemongrass/30 text-[11px] sm:text-xs font-mono font-semibold tracking-wider">
                      <span>[GRIEVANCE REDRESSAL & ACTION]</span>
                    </div>

                    <h2 className="text-white font-bold tracking-tight leading-[1.18] text-xl sm:text-2xl md:text-3xl lg:text-[2.25rem] xl:text-[2.45rem] max-w-3xl mx-auto">
                      What happens when your investment goes wrong?
                    </h2>

                    {/* Stat Highlight Box */}
                    <div className="p-3.5 sm:p-4 md:p-4.5 rounded-xl bg-white/10 border border-lemongrass/30 flex items-center justify-center gap-4 sm:gap-6 max-w-xl mx-auto">
                      <div className="text-4xl sm:text-5xl md:text-6xl font-black text-lemongrass font-mono tracking-tight shrink-0">
                        6%
                      </div>
                      <div className="text-sm sm:text-base md:text-lg text-white/90 font-medium leading-snug text-left">
                        of the national sample was aware of SEBI&apos;s grievance-redressal mechanisms.
                      </div>
                    </div>

                    <p className="text-white/85 text-sm sm:text-base md:text-lg lg:text-[1.125rem] leading-relaxed max-w-2xl mx-auto font-normal">
                      Investors shouldn&apos;t have to navigate complex financial disputes alone. MarketShield helps users understand their issue, identify the right process, and navigate grievance resolution.
                    </p>
                  </div>

                  <div className="pt-2">
                    <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-lemongrass text-forest font-mono text-xs sm:text-sm md:text-base font-bold tracking-wide shadow-md">
                      <span className="font-extrabold">MarketShield</span>
                      <span className="text-forest/60">→</span>
                      <span>Understand. Navigate. Take action.</span>
                    </div>
                  </div>
                </motion.div>

                {/* 2. WHITE RECTANGLE (All-In-One Market Intelligence) */}
                <motion.div
                  style={{
                    x: card2X,
                    y: card2Y,
                    scale: card2Scale,
                    opacity: card2Opacity,
                    zIndex: card2ZIndex,
                  }}
                  className="absolute w-[94%] sm:w-[620px] md:w-[760px] lg:w-[880px] xl:w-[940px] h-[330px] sm:h-[410px] md:h-[450px] lg:h-[480px] bg-white rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(24,40,14,0.12)] border border-forest/20 flex flex-col items-center justify-between p-6 sm:p-8 md:p-10 lg:p-11 text-center overflow-hidden"
                >
                  <div className="space-y-3 sm:space-y-4 md:space-y-5 flex flex-col items-center w-full">
                    <div className="inline-flex items-center px-3.5 py-1.5 rounded-md bg-forest text-lemongrass text-[11px] sm:text-xs font-mono font-semibold tracking-wider">
                      <span>[ALL-IN-ONE MARKET INTELLIGENCE]</span>
                    </div>

                    <h2 className="text-forest font-bold tracking-tight leading-[1.18] text-xl sm:text-2xl md:text-3xl lg:text-[2.25rem] xl:text-[2.45rem] max-w-3xl mx-auto">
                      What if everything you need to understand the market was in one place?
                    </h2>

                    {/* Features Chips (Clean pills, no emojis) */}
                    <div className="flex flex-wrap justify-center gap-2 pt-1">
                      {["Live stock prices", "Real-time charts", "AI analysis", "Market sentiment", "Community insights", "Risk signals"].map((feat) => (
                        <span
                          key={feat}
                          className="px-3.5 py-1.5 rounded-lg bg-sage-1 text-forest border border-forest/20 font-mono text-xs sm:text-sm md:text-[0.9375rem] font-semibold"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>

                    <p className="text-black/80 text-sm sm:text-base md:text-lg lg:text-[1.125rem] leading-relaxed max-w-2xl mx-auto font-normal">
                      MarketShield brings the tools investors need to discover, analyse, discuss, and evaluate investments into one intelligent platform.
                    </p>
                  </div>

                  <div className="pt-2">
                    <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-forest text-lemongrass font-mono text-xs sm:text-sm md:text-base font-semibold tracking-wide shadow-sm">
                      <span className="font-bold">MarketShield</span>
                      <span className="text-white/60">→</span>
                      <span className="text-white font-medium">One platform. The entire investment picture.</span>
                    </div>
                  </div>
                </motion.div>

                {/* 3. GREEN / DARK RECTANGLE (End Card - Fraud & Scam Detection) */}
                <motion.div
                  style={{
                    y: card3Y,
                    scale: card3Scale,
                    opacity: card3Opacity,
                    zIndex: 40,
                  }}
                  className="absolute w-[94%] sm:w-[620px] md:w-[760px] lg:w-[880px] xl:w-[940px] h-[330px] sm:h-[410px] md:h-[450px] lg:h-[480px] bg-[#0c1808] rounded-2xl sm:rounded-3xl shadow-[0_24px_60px_rgba(10,20,5,0.38)] border border-lemongrass/40 flex flex-col items-center justify-between p-5 sm:p-7 md:p-9 lg:p-10 text-center text-white overflow-hidden"
                >
                  <div className="space-y-2.5 sm:space-y-3 md:space-y-3.5 flex flex-col items-center w-full my-auto">
                    <div className="inline-flex items-center px-3.5 py-1.5 rounded-md bg-white/10 text-lemongrass border border-lemongrass/30 text-[11px] sm:text-xs font-mono font-semibold tracking-wider">
                      <span>[FRAUD & SCAM DETECTION]</span>
                    </div>

                    <h2 className="text-white font-bold tracking-tight leading-[1.15] text-lg sm:text-2xl md:text-3xl lg:text-[2.15rem] max-w-3xl mx-auto">
                      Can you tell when an investment opportunity is actually a scam?
                    </h2>

                    {/* Threat Chips */}
                    <div className="flex flex-wrap justify-center gap-2 pt-0.5">
                      {["Deepfakes", "Fake Advisors", "Manipulated Content", "Fraudulent Links"].map((threat) => (
                        <span
                          key={threat}
                          className="px-3.5 py-1.5 rounded-lg bg-red-950/60 text-red-300 border border-red-500/40 font-mono text-xs sm:text-sm md:text-[0.875rem] font-semibold shadow-xs"
                        >
                          {threat}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-1.5 max-w-3xl mx-auto text-white/85 text-xs sm:text-sm md:text-base leading-relaxed">
                      <p>
                        Investors are increasingly making financial decisions in an environment where trust is difficult to verify.
                      </p>
                      <p className="font-semibold text-lemongrass">
                        One suspicious message can lead to an entire scam network.
                      </p>
                      <p className="text-white/70 text-[11px] sm:text-xs md:text-sm">
                        MarketShield uses AI to analyse content, verify identities, detect suspicious signals, and uncover connections between fraudulent accounts, links, websites, and communities.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-lemongrass text-forest font-mono text-xs sm:text-sm md:text-base font-bold tracking-wide shadow-md">
                      <span className="font-extrabold">MarketShield</span>
                      <span className="text-forest/60">→</span>
                      <span>Verify. Detect. Protect.</span>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>

          </CutCornerContainer>
        </div>

      </div>
    </section>
  );
};
