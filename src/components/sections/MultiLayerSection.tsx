"use client";

import React, { useState } from "react";
import { CutCornerContainer } from "../ui/CutCornerContainer";
import { Button } from "../ui/Button";
import {
  Layers,
  TrendingUp,
  ShieldCheck,
  Scale,
  CheckCircle2,
  Cpu,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";

interface LayerTab {
  id: string;
  tag: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  metrics: { label: string; value: string }[];
  accentColor: string;
}

const LAYERS: LayerTab[] = [
  {
    id: "market",
    tag: "[MARKET]",
    title: "Live Market Intelligence & Community",
    description:
      "Real-time market data, interactive stock charts, AI-driven sentiment analysis, and investor discussions bringing complete market clarity.",
    icon: <TrendingUp className="w-5 h-5" />,
    features: [
      "Live stock prices & interactive technical charts",
      "AI-powered sentiment & opportunity scoring",
      "Investor community discussions & market perspectives",
    ],
    metrics: [
      { label: "Data Latency", value: "Real-Time" },
      { label: "Market Coverage", value: "Live Stocks & Indices" },
      { label: "AI Intelligence", value: "Risk & Opportunity Analysis" },
    ],
    accentColor: "text-lemongrass",
  },
  {
    id: "protect",
    tag: "[PROTECT]",
    title: "AI-Powered Fraud Detection & Verification",
    description:
      "Instant entity verification against SEBI databases, deepfake and impersonation detection, and coordinated scam network mapping.",
    icon: <ShieldCheck className="w-5 h-5" />,
    features: [
      "SEBI registered advisor & entity verification",
      "Deepfake & impersonation content detection",
      "Multi-channel scam cluster & relationship mapping",
    ],
    metrics: [
      { label: "Threat Scoring", value: "AI-Powered" },
      { label: "Verification", value: "SEBI & Entity Checks" },
      { label: "Fraud Detection", value: "Deepfake & Scam Signals" },
    ],
    accentColor: "text-lemongrass",
  },
  {
    id: "resolve",
    tag: "[RESOLVE]",
    title: "Investor Grievance & Dispute Redressal",
    description:
      "Conversational AI assistance to understand investor rights, prepare SEBI/SCORES dispute filings, and guide complaint resolution step by step.",
    icon: <Scale className="w-5 h-5" />,
    features: [
      "Conversational AI grievance copilot",
      "SEBI SCORES & broker dispute documentation",
      "Required proofs & step-by-step resolution path",
    ],
    metrics: [
      { label: "Guidance Flow", value: "Automated" },
      { label: "Form Coverage", value: "100% SEBI" },
      { label: "Case Structuring", value: "Instant" },
    ],
    accentColor: "text-lemongrass",
  },
];

export const MultiLayerSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const current = LAYERS[activeTab];

  return (
    <section id="architecture" className="relative overflow-hidden bg-white text-black py-20 md:py-28 lg:py-36 border-b border-black/5">
      <div className="container-custom space-y-12">
        {/* Main Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest/5 text-forest text-xs font-mono font-semibold border border-forest/10">
            <Cpu className="w-3.5 h-3.5 text-moss" />
            <span>THE MARKETSHIELD ECOSYSTEM</span>
          </div>
          <h2 className="text-48px-heading text-forest font-semibold tracking-tight font-display">
            Everything investors need. In one shield.
          </h2>
          <p className="text-black/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            MarketShield brings market intelligence, AI-powered protection, investor community, scam detection, decision support, and grievance assistance together in one unified platform.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-xl bg-sage-1 border border-black/10 max-w-full overflow-x-auto">
            {LAYERS.map((layer, idx) => (
              <button
                key={layer.id}
                onClick={() => setActiveTab(idx)}
                className={clsx(
                  "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-mono transition-all whitespace-nowrap",
                  activeTab === idx
                    ? "bg-forest text-lemongrass font-bold shadow-md"
                    : "text-black/70 hover:text-black hover:bg-white/60"
                )}
              >
                {layer.icon}
                <span>{layer.tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Layer Interactive Display */}
        <div className="max-w-6xl mx-auto">
          <CutCornerContainer
            cornerSizeDesktop={17}
            cornerSizeMobile={9}
            cornerBg="bg-white"
            className="bg-forest text-white p-8 md:p-12 lg:p-14 shadow-2xl relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Details */}
              <div className="lg:col-span-6 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 text-lemongrass text-xs font-mono uppercase bg-white/10 px-3 py-1 rounded-full">
                  {current.icon}
                  <span>{current.tag} Architecture</span>
                </div>

                <h3 className="text-32px-heading text-white font-medium tracking-tight">
                  {current.title}
                </h3>

                <p className="text-white/80 text-base sm:text-lg leading-relaxed">
                  {current.description}
                </p>

                {/* Feature Checklist */}
                <div className="space-y-2.5 pt-2">
                  {current.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-sm text-white/90">
                      <CheckCircle2 className="w-4.5 h-4.5 text-lemongrass shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button variant="lemongrass" size="medium" href="#contact">
                    Explore for {current.tag.replace(/[[\]]/g, "")}
                  </Button>
                </div>
              </div>

              {/* Right Column: Architectural Metrics & Live Visual */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-[#090f05] rounded-xl p-5 sm:p-6 border border-white/10 space-y-3.5 shadow-inner">
                  <div className="text-xs font-mono text-white/50 border-b border-white/10 pb-2.5 flex justify-between items-center">
                    <span className="uppercase tracking-wider">Platform Capabilities</span>
                    <span className="text-lemongrass font-bold">MarketShield</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {current.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-lg bg-white/5 border border-white/5"
                      >
                        <span className="text-xs text-white/70 font-mono whitespace-nowrap shrink-0">
                          {m.label}
                        </span>
                        <span className="text-xs sm:text-[13px] font-bold font-mono text-lemongrass text-right whitespace-nowrap">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-[11px] font-mono text-white/40 text-center">
                    Enterprise-Grade Intelligence • High-Precision Security &amp; Resolution
                  </div>
                </div>
              </div>
            </div>
          </CutCornerContainer>
        </div>
      </div>
    </section>
  );
};
