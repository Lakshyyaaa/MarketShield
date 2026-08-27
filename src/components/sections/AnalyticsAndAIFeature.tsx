"use client";

import React, { useState } from "react";
import { CutCornerContainer } from "../ui/CutCornerContainer";
import { Button } from "../ui/Button";
import { StatBadge } from "../ui/StatBadge";
import {
  Sparkles,
  Bot,
  UserCheck,
  Search,
  MessageSquare,
  BarChart3,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Send,
  HelpCircle,
  Phone,
} from "lucide-react";
import clsx from "clsx";

export const AnalyticsAndAIFeature: React.FC = () => {
  const [activeQuery, setActiveQuery] = useState<number>(0);

  const AI_QUERIES = [
    {
      prompt: "Find all recurring SaaS subscriptions over $500/mo across our commercial cardholders",
      response: "Identified 1,420 subscriptions totaling $1.82M/mo across AWS, Salesforce, GitHub, and Snowflake. 99.4% merchant confidence with auto-categorized tax and GL codes.",
      tags: ["SaaS Spend", "1,420 Entities", "18ms Resolution"],
    },
    {
      prompt: "Identify cardholders who frequently visit high-end boutique hotels for personalized loyalty perks",
      response: "Segmented 4,890 active accounts with 3+ stays at verified Luxury Merchant Tier properties (Aman, Four Seasons, Soho House) in the past 90 days.",
      tags: ["Luxury Travel Segment", "4,890 Users", "Attribution Ready"],
    },
  ];

  return (
    <section id="analytics" className="relative overflow-hidden bg-white text-black py-16 md:py-24 lg:py-32 border-b border-black/5">
      <div className="container-custom space-y-24 md:space-y-32">
        {/* TOP CARD: Analytics & AI (Dark Forest Container with Cut Corners) */}
        <CutCornerContainer
          cornerSizeDesktop={17}
          cornerSizeMobile={7}
          cornerBg="bg-white"
          className="bg-forest text-white p-8 md:p-14 lg:p-16 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle background tech texture */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #b2eb76 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 text-left space-y-5">
              <div className="inline-flex items-center gap-x-2.5 text-lemongrass">
                <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-lemongrass">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-13px-eyebrow-caps font-mono font-medium">
                  Analytics &amp; AI
                </span>
              </div>

              <h2 className="text-40px-heading text-white font-medium tracking-tight">
                Build intelligence on solid data
              </h2>

              <p className="text-white/80 text-base leading-relaxed">
                Provide consistent merchant context across cards, transfers, and third-party sources — powering personalized offers, automated GL bookkeeping, and AI agents that reason over ground truth.
              </p>

              <div className="pt-3">
                <Button variant="whiteBorder" size="medium" href="#contact">
                  Learn more
                </Button>
              </div>
            </div>

            {/* Right Interactive AI Agent Console */}
            <div className="lg:col-span-7 bg-[#090f05] rounded-xl border border-lemongrass/30 p-5 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-lemongrass">
                  <Bot className="w-4 h-4 text-lemongrass animate-pulse" />
                  <span>Market Shield Financial AI Agent</span>
                </div>
                <span className="text-[11px] font-mono text-white/50">Ground-Truth Enriched</span>
              </div>

              {/* Sample Queries */}
              <div className="flex gap-2">
                {AI_QUERIES.map((q, idx) => (
                  <button
                    key={q.prompt}
                    onClick={() => setActiveQuery(idx)}
                    className={clsx(
                      "px-3 py-1.5 rounded text-xs font-mono transition-colors text-left truncate flex-1",
                      activeQuery === idx
                        ? "bg-lemongrass text-forest font-bold"
                        : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                    )}
                  >
                    Prompt {idx + 1}
                  </button>
                ))}
              </div>

              {/* Chat / Query Terminal */}
              <div className="space-y-3 pt-2 font-mono text-xs">
                {/* User Message */}
                <div className="bg-white/5 p-3.5 rounded-lg border border-white/10 text-white/90">
                  <div className="text-[10px] text-white/40 mb-1">&gt; USER QUERY</div>
                  <div>&ldquo;{AI_QUERIES[activeQuery].prompt}&rdquo;</div>
                </div>

                {/* AI Agent Response */}
                <div className="bg-forest/80 p-3.5 rounded-lg border border-lemongrass/40 text-lemongrass">
                  <div className="text-[10px] text-lemongrass/60 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-lemongrass" />
                    MARKET SHIELD ENRICHED INSIGHT
                  </div>
                  <div className="text-white text-xs leading-relaxed">
                    {AI_QUERIES[activeQuery].response}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-white/10">
                    {AI_QUERIES[activeQuery].tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-black/40 text-[10px] text-lemongrass font-mono border border-lemongrass/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CutCornerContainer>

        {/* BOTTOM SUB-SECTION: User Experience & Dispute Deflection */}
        <div id="user-exp" className="flex flex-col-reverse lg:flex-row-reverse items-center justify-between gap-12 lg:gap-16">
          {/* Right Column: Copy & Stat Badge */}
          <div className="w-full lg:w-1/2 max-w-xl text-left">
            <div className="inline-flex items-center gap-x-2.5 mb-4 text-forest">
              <div className="w-7 h-7 rounded bg-forest/5 flex items-center justify-center text-forest">
                <UserCheck className="w-4 h-4" />
              </div>
              <span className="text-13px-eyebrow-caps opacity-80 font-mono">
                User Experience
              </span>
            </div>

            <h2 className="text-40px-heading text-forest tracking-tight font-medium">
              Move disputes to the merchant
            </h2>

            <div className="mt-4 text-black/80 text-base sm:text-lg leading-relaxed">
              <p>
                Give customers the clarity they need to recognize charges or contact the merchant directly — before a chargeback or dispute ever reaches your support team.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Button variant="whiteWithGrayBorder" size="medium" href="#contact">
                Learn more
              </Button>
            </div>

            {/* Geolocation Stat Badge with Cut Corners */}
            <div className="mt-12">
              <StatBadge
                value={95}
                suffix="%"
                description="physical transactions matched with an exact geolocation"
                bg="bg-sage-1"
                cornerBg="bg-white"
              />
            </div>
          </div>

          {/* Left Column: Interactive Mobile Banking Transaction Detail Mockup */}
          <div className="w-full lg:w-1/2 max-w-md mx-auto">
            <CutCornerContainer
              cornerSizeDesktop={17}
              cornerSizeMobile={9}
              cornerBg="bg-white"
              className="bg-white p-6 shadow-2xl border border-black/10 rounded-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-black/10 pb-3">
                <span className="text-xs font-mono text-black/50 uppercase">Banking App UI Preview</span>
                <span className="text-[11px] font-mono text-moss bg-sage-2 px-2 py-0.5 rounded font-bold">
                  Market Shield In-App Enriched
                </span>
              </div>

              {/* Transaction Header */}
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-sage-1/60 border border-black/5">
                <div className="w-12 h-12 rounded-xl bg-forest text-2xl flex items-center justify-center text-lemongrass font-bold shrink-0">
                  ☕
                </div>
                <div>
                  <div className="font-bold text-black text-base">Blue Bottle Coffee</div>
                  <div className="text-xs text-black/60">66 Mint St • San Francisco, CA</div>
                  <div className="text-sm font-bold text-forest mt-0.5">$6.75 USD • Completed</div>
                </div>
              </div>

              {/* Map & Geolocation Preview */}
              <div className="relative h-28 w-full rounded-lg bg-emerald-900/10 border border-black/10 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#3f7308_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative z-10 flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-full shadow border border-black/10 text-xs font-mono text-forest">
                  <MapPin className="w-3.5 h-3.5 text-moss" />
                  37.7824° N, 122.4071° W
                </div>
              </div>

              {/* Direct Merchant Actions (Dispute Deflection) */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <a
                  href="#contact"
                  className="p-2.5 rounded-lg border border-black/10 bg-white hover:bg-sage-1 text-black font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-moss" />
                  Call Merchant
                </a>
                <a
                  href="#contact"
                  className="p-2.5 rounded-lg border border-black/10 bg-white hover:bg-sage-1 text-black font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-moss" />
                  View Receipt
                </a>
              </div>
            </CutCornerContainer>
          </div>
        </div>
      </div>
    </section>
  );
};
