"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { CutCornerContainer } from "../ui/CutCornerContainer";
import {
  Zap,
  ShieldCheck,
  Building2,
  MapPin,
  Sparkles,
  Layers,
  Cpu,
  ArrowRight,
  Terminal,
  Activity,
  CheckCircle2,
  Clock,
  Fingerprint,
} from "lucide-react";
import clsx from "clsx";

interface FeatureStep {
  id: string;
  stepNumber: string;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  techSpecs: string[];
  mockup: React.ReactNode;
}

const FEATURES: FeatureStep[] = [
  {
    id: "market-intelligence",
    stepNumber: "01",
    badge: "[STEP 01 // MARKET INTELLIGENCE]",
    title: "Live Market Intelligence & AI Analysis",
    tagline: "Live Stock Prices & Interactive Charts",
    description:
      "MarketShield brings live market data, stock prices, interactive charts, sentiment, and AI-powered analysis together to help investors understand the market in real time.",
    metricLabel: "Market Data",
    metricValue: "Real-Time",
    techSpecs: [
      "Live Stock Prices & Interactive Charts",
      "AI-Powered Stock Analysis",
      "Market Sentiment & Risk Signals",
    ],
    mockup: (
      <div className="bg-[#090f05] rounded-xl p-4 sm:p-5 font-mono text-xs text-white/90 border border-white/15 shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#b2eb76] animate-ping" />
            <span className="text-[#b2eb76] font-bold">MARKET INTELLIGENCE</span>
          </div>
          <span className="font-mono text-[10px] text-white/40">NSE: RELIANCE</span>
        </div>

        <div className="space-y-2.5 text-[11px]">
          {/* Stock Header Card */}
          <div className="p-3 rounded-lg bg-white/5 border border-white/15 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-white/50 mb-0.5">SECURITY</div>
              <div className="text-white font-extrabold text-[13px] tracking-tight">RELIANCE INDUSTRIES</div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-[13px]">₹1,462.80</div>
              <div className="text-emerald-400 font-bold text-[11px]">+2.41%</div>
            </div>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-2 gap-2">
            {/* AI Score */}
            <div className="p-2.5 rounded-lg bg-forest/80 border border-lemongrass/30 space-y-1">
              <div className="text-[9.5px] text-lemongrass font-semibold uppercase tracking-wider">&gt; AI SCORE</div>
              <div className="text-white font-extrabold text-[14px]">82 <span className="text-white/50 text-[11px]">/ 100</span></div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-lemongrass h-full rounded-full w-[82%]" />
              </div>
            </div>

            {/* Sentiment */}
            <div className="p-2.5 rounded-lg bg-[#0d2314] border border-emerald-500/40 space-y-1">
              <div className="text-[9.5px] text-emerald-400 font-semibold uppercase tracking-wider">&gt; SENTIMENT</div>
              <div className="text-emerald-300 font-extrabold text-[14px] flex items-center gap-1.5">
                <span>▲</span>
                <span>BULLISH</span>
              </div>
              <div className="text-[9px] text-emerald-400/80">Strong buyer momentum</div>
            </div>
          </div>

          {/* Recommendation Footer */}
          <div className="p-2.5 rounded-lg bg-black/60 border border-lemongrass/40 flex items-center justify-between">
            <div className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">&gt; RECOMMENDATION</div>
            <div className="px-2.5 py-1 rounded bg-lemongrass/20 text-lemongrass border border-lemongrass/40 font-bold text-[11px]">
              WATCH / CONSIDER
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "protection-verification",
    stepNumber: "02",
    badge: "[STEP 02 // PROTECTION & VERIFICATION]",
    title: "AI-Powered Fraud Detection & Verification",
    tagline: "SEBI Advisor & Entity Verification",
    description:
      "MarketShield analyses suspicious content, detects deepfakes and impersonation, and verifies financial advisors and entities to help investors identify who and what they can trust.",
    metricLabel: "Risk Analysis",
    metricValue: "AI-Powered",
    techSpecs: [
      "SEBI Advisor & Entity Verification",
      "Deepfake & Impersonation Detection",
      "Scam & Suspicious Content Analysis",
    ],
    mockup: (
      <div className="bg-[#090f05] rounded-xl p-4 sm:p-5 font-mono text-xs text-white/90 border border-white/15 shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span className="text-red-400 font-bold">MARKETSHIELD PROTECTION ENGINE</span>
          </div>
          <span className="font-mono text-[10px] text-white/40">AUDIT #PE-9042</span>
        </div>

        <div className="space-y-2.5 text-[11px]">
          {/* Entity Header */}
          <div className="p-2.5 rounded-lg bg-black/60 border border-white/15 flex items-center justify-between">
            <span className="text-white/60 text-[10px]">&gt; ENTITY</span>
            <span className="text-white font-extrabold text-[12.5px]">ABC FINANCIAL SERVICES</span>
          </div>

          {/* Grid: SEBI Status & Content Analysis */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-forest/80 border border-emerald-500/40 space-y-1">
              <div className="text-[9.5px] text-emerald-400 font-semibold uppercase tracking-wider">&gt; SEBI STATUS</div>
              <div className="text-emerald-300 font-extrabold text-[12px] flex items-center gap-1">
                <span>✓</span>
                <span>VERIFIED</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#250d0d] border border-red-500/40 space-y-1">
              <div className="text-[9.5px] text-red-400 font-semibold uppercase tracking-wider">&gt; CONTENT ANALYSIS</div>
              <div className="text-red-300 font-extrabold text-[12px] flex items-center gap-1">
                <span>⚠</span>
                <span>SUSPICIOUS</span>
              </div>
            </div>
          </div>

          {/* Risk Score & Threat Banner */}
          <div className="p-3 rounded-lg bg-[#1f0b0b] border border-red-500/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-[10px] font-semibold uppercase tracking-wider">&gt; RISK SCORE</span>
              <span className="text-red-400 font-black text-[15px]">91 / 100</span>
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full rounded-full w-[91%]" />
            </div>
            <div className="pt-1 border-t border-red-500/20 flex items-center justify-between text-[10.5px]">
              <span className="text-red-200/70">THREAT ASSESSMENT:</span>
              <span className="text-red-300 font-bold tracking-wide">HIGH RISK DETECTED</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "community-intelligence",
    stepNumber: "03",
    badge: "[STEP 03 // COMMUNITY INTELLIGENCE]",
    title: "Investor Community & Market Discussions",
    tagline: "Stock Discussions & Market Analysis",
    description:
      "Connect with other investors to share market analysis, discuss stocks, exchange ideas, and report suspicious activity — turning community conversations into another layer of investor intelligence.",
    metricLabel: "Community Activity",
    metricValue: "Real-Time",
    techSpecs: [
      "Stock Discussions & Market Analysis",
      "Posts, Replies & Community Interaction",
      "Community-Based Scam Reporting",
    ],
    mockup: (
      <div className="bg-[#090f05] rounded-xl p-4 sm:p-5 font-mono text-xs text-white/90 border border-white/15 shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lemongrass animate-ping" />
            <span className="text-lemongrass font-bold">MARKETSHIELD COMMUNITY</span>
          </div>
          <span className="font-mono text-[10px] text-white/40">#LIVE-FEED</span>
        </div>

        <div className="space-y-2.5 text-[11px]">
          {/* Post Card */}
          <div className="p-3 rounded-lg bg-black/60 border border-white/15 space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-lemongrass font-semibold">&gt; NIFTY 50</span>
              <span className="text-white/40 font-mono">2m ago</span>
            </div>
            <p className="text-white font-medium text-[12px] leading-relaxed">
              &quot;Market momentum looking strong this week.&quot;
            </p>
            <div className="flex items-center gap-4 pt-1 text-[11px] text-white/70 font-mono">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span>↑</span> 248
              </span>
              <span className="text-white/60 flex items-center gap-1">
                <span>💬</span> 42
              </span>
            </div>
          </div>

          {/* Trending Bar */}
          <div className="p-2.5 rounded-lg bg-forest/80 border border-lemongrass/30 space-y-1">
            <div className="text-[9.5px] text-lemongrass font-semibold uppercase tracking-wider">&gt; TRENDING</div>
            <div className="text-white font-bold text-[11px] tracking-wide">
              RELIANCE <span className="text-lemongrass">•</span> NIFTY <span className="text-lemongrass">•</span> BANK NIFTY
            </div>
          </div>

          {/* Live Active Footer */}
          <div className="p-2.5 rounded-lg bg-[#0d2314] border border-emerald-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 font-bold text-[11.5px] tracking-wide">
                342 INVESTORS ACTIVE
              </span>
            </div>
            <span className="text-[10px] text-emerald-400/70 font-mono">REAL-TIME</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "risk-decision",
    stepNumber: "04",
    badge: "[STEP 04 // RISK & DECISION]",
    title: "AI-Powered Investment Risk & Decision Engine",
    tagline: "Stock Risk & Opportunity Scoring",
    description:
      "MarketShield combines real-time market signals, stock fundamentals, sentiment, and AI analysis to generate an explainable risk assessment and investment suggestion for every stock.",
    metricLabel: "Decision Confidence",
    metricValue: "AI-Powered",
    techSpecs: [
      "Stock Risk & Opportunity Scoring",
      "Buy / Watch / Avoid Suggestions",
      "Real-Time Market & Sentiment Analysis",
    ],
    mockup: (
      <div className="bg-[#090f05] rounded-xl p-4 sm:p-5 font-mono text-xs text-white/90 border border-white/15 shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lemongrass animate-ping" />
            <span className="text-lemongrass font-bold">MARKETSHIELD AI ENGINE</span>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/30">
            CONFIDENCE: 84%
          </span>
        </div>

        <div className="space-y-2.5 text-[11px]">
          {/* Security Card */}
          <div className="p-2.5 rounded-lg bg-black/60 border border-white/15 flex items-center justify-between">
            <span className="text-white/60 text-[10px]">&gt; TARGET</span>
            <span className="text-white font-extrabold text-[12.5px]">RELIANCE INDUSTRIES</span>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Price */}
            <div className="p-2 rounded-lg bg-forest/80 border border-white/10 space-y-0.5">
              <div className="text-[9px] text-white/50 font-semibold">PRICE</div>
              <div className="text-white font-bold text-[11px]">₹1,462.80</div>
              <div className="text-emerald-400 font-bold text-[9.5px]">+2.41%</div>
            </div>

            {/* AI Risk Score */}
            <div className="p-2 rounded-lg bg-[#0d2314] border border-emerald-500/30 space-y-0.5">
              <div className="text-[9px] text-emerald-400/80 font-semibold">RISK SCORE</div>
              <div className="text-white font-black text-[11px]">18 / 100</div>
              <div className="text-emerald-300 font-bold text-[9.5px]">LOW RISK</div>
            </div>

            {/* Sentiment */}
            <div className="p-2 rounded-lg bg-forest/80 border border-white/10 space-y-0.5">
              <div className="text-[9px] text-white/50 font-semibold">SENTIMENT</div>
              <div className="text-emerald-300 font-bold text-[11px]">▲ BULLISH</div>
              <div className="text-white/60 text-[9.5px]">STRONG</div>
            </div>
          </div>

          {/* AI Decision Box */}
          <div className="p-3 rounded-lg bg-[#0c1f0d] border border-lemongrass/50 flex items-center justify-between">
            <div>
              <div className="text-[9.5px] text-lemongrass/80 font-semibold uppercase tracking-wider">&gt; AI DECISION</div>
              <div className="text-lemongrass font-extrabold text-[13px] tracking-wide flex items-center gap-1 mt-0.5">
                <span>✓</span>
                <span>CONSIDER</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9.5px] text-white/50 font-semibold uppercase">CONFIDENCE</div>
              <div className="text-white font-extrabold text-[13px]">84%</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "ai-assistance",
    stepNumber: "05",
    badge: "[STEP 05 // AI ASSISTANCE]",
    title: "Your AI-Powered Investor Copilot",
    tagline: "Ask Questions About Stocks & Markets",
    description:
      "MarketShield's AI assistant helps investors understand stocks, market movements, suspicious content, risk signals, and investment-related questions through a conversational interface.",
    metricLabel: "Response Time",
    metricValue: "Real-Time",
    techSpecs: [
      "Ask Questions About Stocks & Markets",
      "Explain Risk, Fraud & Investment Signals",
      "Personalized AI-Powered Insights",
    ],
    mockup: (
      <div className="bg-[#090f05] rounded-xl p-4 sm:p-5 font-mono text-xs text-white/90 border border-white/15 shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lemongrass animate-ping" />
            <span className="text-lemongrass font-bold">MARKETSHIELD AI</span>
          </div>
          <span className="font-mono text-[10px] text-white/40">#COPILOT-READY</span>
        </div>

        <div className="space-y-2 text-[11px]">
          {/* User Prompt */}
          <div className="p-2.5 rounded-lg bg-black/60 border border-white/15">
            <div className="text-[9px] text-lemongrass font-semibold mb-1">&gt; USER</div>
            <code className="text-white font-medium text-[11.5px]">&quot;Should I invest in RELIANCE right now?&quot;</code>
          </div>

          {/* Flow indicator */}
          <div className="flex justify-center items-center gap-1.5 text-lemongrass text-[10px] font-bold">
            <span>↓</span>
            <span>ANALYSING</span>
          </div>

          {/* Signal Matrix */}
          <div className="p-2.5 rounded-lg bg-forest/80 border border-lemongrass/30 grid grid-cols-3 gap-2 text-center text-[10.5px]">
            <div>
              <div className="text-[9px] text-white/50">LIVE PRICE</div>
              <div className="text-white font-bold">₹1,462.80</div>
            </div>
            <div>
              <div className="text-[9px] text-white/50">SENTIMENT</div>
              <div className="text-emerald-300 font-bold">BULLISH</div>
            </div>
            <div>
              <div className="text-[9px] text-white/50">RISK SCORE</div>
              <div className="text-lemongrass font-bold">18 / 100</div>
            </div>
          </div>

          {/* AI Response Card */}
          <div className="p-3 rounded-lg bg-[#0c1f0d] border border-lemongrass/40 space-y-1">
            <div className="text-[9.5px] text-lemongrass font-bold">&gt; MARKETSHIELD</div>
            <p className="text-white/95 text-[11.5px] leading-relaxed font-sans font-medium">
              &quot;Reliance currently shows positive market signals with moderate risk. Here are the key factors to consider...&quot;
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "scam-network",
    stepNumber: "06",
    badge: "[STEP 06 // SCAM NETWORK INTELLIGENCE]",
    title: "Uncovering the Network Behind the Scam",
    tagline: "Entity & Relationship Mapping",
    description:
      "MarketShield connects suspicious people, advisors, companies, links, social accounts, and reported incidents to reveal relationships and identify broader scam networks.",
    metricLabel: "Threat Visibility",
    metricValue: "Multi-Layer",
    techSpecs: [
      "Entity & Relationship Mapping",
      "Connected Account & Link Analysis",
      "Community-Reported Scam Signals",
    ],
    mockup: (
      <div className="bg-[#090f05] rounded-xl p-4 sm:p-5 font-mono text-xs text-white/90 border border-white/15 shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-red-400 font-bold">MARKETSHIELD THREAT GRAPH</span>
          </div>
          <span className="font-mono text-[10px] text-white/40">#CLUSTER-99</span>
        </div>

        <div className="space-y-2 text-center text-[11px]">
          {/* Root node */}
          <div className="inline-block px-3.5 py-1.5 rounded-lg bg-black/70 border border-white/20 text-white font-extrabold text-[12px] shadow-sm">
            ABC ADVISOR
          </div>

          {/* Connectors Downward */}
          <div className="flex justify-center items-center text-white/40 text-[10px] leading-none">
            │
          </div>
          <div className="relative flex justify-between items-center px-4 max-w-[280px] mx-auto text-white/30 text-[10px]">
            <div className="absolute top-0 left-6 right-6 border-t border-white/20" />
            <div className="w-full flex justify-between pt-1">
              <span>↓</span>
              <span>↓</span>
              <span>↓</span>
            </div>
          </div>

          {/* Middle 3 Nodes */}
          <div className="grid grid-cols-3 gap-2 pt-0.5">
            <div className="p-1.5 rounded bg-[#1f0d0d] border border-red-500/30 text-red-300 font-bold text-[10px]">
              INSTAGRAM
            </div>
            <div className="p-1.5 rounded bg-[#1f0d0d] border border-red-500/30 text-red-300 font-bold text-[10px]">
              WEBSITE
            </div>
            <div className="p-1.5 rounded bg-[#1f0d0d] border border-red-500/30 text-red-300 font-bold text-[10px]">
              TELEGRAM
            </div>
          </div>

          {/* Converging connector */}
          <div className="flex justify-center items-center text-red-400/60 text-[10px] py-0.5">
            └──────→ ↓ ←──────┘
          </div>

          {/* Scam Network Node */}
          <div className="p-2.5 rounded-lg bg-[#2a0b0b] border border-red-500/60 space-y-1.5 shadow-lg">
            <div className="text-red-400 font-black text-[13px] tracking-wider uppercase">
              ⚠ SCAM NETWORK
            </div>
            <div className="pt-1.5 border-t border-red-500/30 flex items-center justify-between text-[11px]">
              <span className="text-white/70">RISK SCORE: <strong className="text-red-400">91 / 100</strong></span>
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold text-[10px]">
                HIGH RISK
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "grievance-resolution",
    stepNumber: "07",
    badge: "[STEP 07 // GRIEVANCE & RESOLUTION]",
    title: "From Investor Dispute to Guided Resolution",
    tagline: "AI-Powered Grievance Assistant",
    description:
      "MarketShield helps investors describe their issue and understand the appropriate grievance process, required forms, supporting documents, and next steps for resolving disputes.",
    metricLabel: "Resolution Path",
    metricValue: "Guided Flow",
    techSpecs: [
      "AI-Powered Grievance Assistant",
      "SEBI Complaint & Form Guidance",
      "Dispute Documentation & Next Steps",
    ],
    mockup: (
      <div className="bg-[#090f05] rounded-xl p-4 sm:p-5 font-mono text-xs text-white/90 border border-white/15 shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lemongrass animate-ping" />
            <span className="text-lemongrass font-bold">MARKETSHIELD GRIEVANCE ASSIST</span>
          </div>
          <span className="font-mono text-[10px] text-white/40">#SCORES-READY</span>
        </div>

        <div className="space-y-2.5 text-[11px]">
          {/* Issue Statement */}
          <div className="p-2.5 rounded-lg bg-black/60 border border-white/15">
            <div className="text-[9px] text-lemongrass font-semibold mb-1">&gt; ISSUE</div>
            <code className="text-white font-medium text-[11.5px]">&quot;Broker has not returned my funds.&quot;</code>
          </div>

          {/* Issue Type & Process Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-forest/80 border border-white/10 space-y-0.5">
              <div className="text-[9px] text-white/50 font-semibold uppercase">ISSUE TYPE</div>
              <div className="text-white font-bold text-[11px]">BROKER DISPUTE</div>
            </div>

            <div className="p-2 rounded-lg bg-forest/80 border border-lemongrass/30 space-y-0.5">
              <div className="text-[9px] text-lemongrass/80 font-semibold uppercase">PROCESS</div>
              <div className="text-lemongrass font-extrabold text-[11px]">SEBI / SCORES</div>
            </div>
          </div>

          {/* Required Documents Card */}
          <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 space-y-1">
            <div className="text-[9.5px] text-white/60 font-semibold uppercase tracking-wider">&gt; REQUIRED DOCUMENTS</div>
            <div className="space-y-0.5 text-[10.5px]">
              <div className="flex items-center gap-1.5 text-emerald-300">
                <span>✓</span>
                <span>Transaction Proof</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300">
                <span>✓</span>
                <span>Broker Communication</span>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          <div className="p-2.5 rounded-lg bg-[#0d2314] border border-emerald-500/40 flex items-center justify-between">
            <span className="text-white/70 text-[10px] uppercase font-semibold">&gt; STATUS</span>
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[11px]">
              GUIDANCE READY
            </span>
          </div>
        </div>
      </div>
    ),
  },
];

export const FeatureFlowLines: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Measure scroll progress through this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  // Calculate flow height scale for the vertical line progress indicator
  const progressLineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="pipeline"
      ref={sectionRef}
      className="relative overflow-hidden bg-white text-black py-20 md:py-32 border-b border-black/5"
    >
      {/* Background Micro Tech Grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #18280e 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20 md:mb-28">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest/5 text-forest text-xs font-mono font-semibold border border-forest/10">
            <Activity className="w-3.5 h-3.5 text-moss" />
            <span>THE MARKETSHIELD INTELLIGENCE ENGINE</span>
          </div>

          <h2 className="text-48px-heading text-forest font-semibold tracking-tight">
            How MarketShield protects and empowers investors
          </h2>

          <p className="text-black/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            From live market intelligence and AI-powered analysis to fraud detection, community insights, and grievance assistance MarketShield brings every layer of the investor journey together in one platform.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE FLOW SPINE WITH BLACK LINE & WHITE MARKS                      */}
        {/* ========================================================================= */}
        <div className="relative">
          {/* THE CENTRAL VERTICAL BLACK SPINE (Desktop Center, Mobile Left) */}
          <div className="absolute top-0 bottom-0 left-4 sm:left-6 lg:left-1/2 -translate-x-1/2 w-[22px] flex flex-col items-center pointer-events-none z-20">

            {/* The Solid Deep Black Flow Channel Line */}
            <div className="relative w-[6px] h-full bg-[#090f05] rounded-full shadow-[0_0_12px_rgba(9,15,5,0.25)] flex flex-col justify-between overflow-hidden">

              {/* Repeating Precision White Tick Marks along the entire black line */}
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  backgroundImage: `
                    linear-gradient(to bottom, #ffffff 2px, transparent 2px, transparent 14px, rgba(255,255,255,0.4) 14px, transparent 16px, transparent 28px)
                  `,
                  backgroundSize: "6px 28px",
                }}
              />

              {/* Glowing Dynamic Scroll Fill Line (Reveals active progress as you scroll down) */}
              <motion.div
                style={{ height: progressLineHeight }}
                className="w-full bg-gradient-to-b from-[#b2eb76] via-[#52940b] to-[#b2eb76] shadow-[0_0_14px_#b2eb76]"
              />
            </div>

            {/* Glowing Laser Tracer Node along the spine */}
            <motion.div
              style={{ top: progressLineHeight }}
              className="absolute -translate-y-1/2 w-5 h-5 rounded-full bg-[#090f05] border-2 border-white shadow-[0_0_12px_#b2eb76] flex items-center justify-center pointer-events-none"
            >
              <span className="w-2 h-2 rounded-full bg-[#b2eb76] animate-pulse" />
            </motion.div>
          </div>

          {/* FEATURE STEPS (Alternating left/right around the black spine) */}
          <div className="space-y-12 sm:space-y-16 md:space-y-28 relative">
            {FEATURES.map((feat, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={feat.id}
                  className={clsx(
                    "relative grid grid-cols-1 lg:grid-cols-12 items-center gap-6 sm:gap-8 lg:gap-14",
                    "pl-9 sm:pl-14 lg:pl-0"
                  )}
                >
                  {/* Spine Checkpoint Marker with White Marks and Step Number */}
                  <div className="absolute left-4 sm:left-6 lg:left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#090f05] border-2 border-white shadow-xl flex items-center justify-center text-white font-mono text-[11px] sm:text-xs font-bold ring-2 sm:ring-4 ring-black/5">
                      <span className="text-[#b2eb76]">{feat.stepNumber}</span>
                    </div>
                  </div>

                  {/* Left Column (Content when even, Mockup when odd) */}
                  <div
                    className={clsx(
                      "lg:col-span-6 space-y-3.5 sm:space-y-4 text-left",
                      isEven ? "lg:pr-12 lg:text-left" : "lg:order-2 lg:pl-12 lg:text-left"
                    )}
                  >
                    <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-md bg-forest text-lemongrass text-[10px] sm:text-[11px] font-mono font-semibold tracking-wider max-w-full truncate">
                      <span className="truncate">{feat.badge}</span>
                    </div>

                    <h3 className="text-28px-heading text-forest font-semibold tracking-tight">
                      {feat.title}
                    </h3>

                    <p className="text-black/75 text-sm sm:text-base leading-relaxed">
                      {feat.description}
                    </p>

                    {/* Metric pill & specs */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sage-1 border border-black/10 font-mono text-xs text-forest font-bold">
                        <Clock className="w-3.5 h-3.5 text-moss" />
                        <span>{feat.metricLabel}: <strong className="text-forest">{feat.metricValue}</strong></span>
                      </div>
                    </div>

                    {/* Checklist */}
                    <div className="space-y-1.5 pt-1 text-xs text-black/80 font-mono">
                      {feat.techSpecs.map((spec) => (
                        <div key={spec} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-moss shrink-0" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column (Mockup when even, Content when odd) */}
                  <div
                    className={clsx(
                      "lg:col-span-6 w-full max-w-full overflow-hidden",
                      isEven ? "lg:pl-8" : "lg:order-1 lg:pr-8"
                    )}
                  >
                    <CutCornerContainer
                      cornerSizeDesktop={13}
                      cornerSizeMobile={7}
                      cornerBg="bg-white"
                      className="bg-white p-2 sm:p-3 shadow-xl border border-black/10 hover:shadow-2xl transition-shadow duration-300 w-full max-w-full overflow-hidden"
                    >
                      {feat.mockup}
                    </CutCornerContainer>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Pipeline Benchmark Bar */}
        <div className="mt-24 p-6 sm:p-8 rounded-2xl bg-forest text-white border border-black/10 shadow-2xl relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #b2eb76 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-1.5 max-w-xl">
              <div className="text-11px-eyebrow-caps text-lemongrass font-mono">
                [END-TO-END INVESTOR PROTECTION]
              </div>
              <div className="text-xl sm:text-2xl font-bold font-display text-white">
                One platform for every stage of the investor journey
              </div>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                From discovering opportunities and analysing markets to detecting scams, connecting with investors, and resolving disputes — MarketShield brings intelligence, protection, and assistance together.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
              <div className="px-5 py-3 rounded-xl bg-black/40 border border-lemongrass/30 text-center min-w-[130px]">
                <div className="text-lemongrass text-2xl font-black">7</div>
                <div className="text-[9.5px] text-white/70 uppercase font-semibold leading-tight mt-0.5">
                  CORE INTELLIGENCE LAYERS
                </div>
              </div>
              <div className="px-5 py-3 rounded-xl bg-black/40 border border-lemongrass/30 text-center min-w-[130px]">
                <div className="text-lemongrass text-base font-extrabold tracking-wide">REAL-TIME</div>
                <div className="text-[9.5px] text-white/70 uppercase font-semibold leading-tight mt-0.5">
                  MARKET & RISK SIGNALS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
