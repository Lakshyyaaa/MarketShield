"use client";

import React, { useState, useEffect } from "react";
import { CutCornerContainer } from "../ui/CutCornerContainer";
import {
  ShieldCheck,
  MapPin,
  Building,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import clsx from "clsx";

// Base waveform profile: Starts at 0, sharp volatile surges and plunges, attains stability at the end
const BASE_MARKET_CURVE = [
  0,                                      // 1. Starts strictly at 0
  28, 62, 85, 74,                         // 2. Sharp rise 1
  44, 20, 16, 50,                         // 3. Sharp plunge 1
  82, 100, 68, 34,                        // 4. Sharp surge 2 & steep drop
  64, 92, 104, 76,                        // 5. Sharp rocket 3 & drop
  54, 78, 90, 78,                         // 6. Wave dampening
  70, 86, 81, 85,                         // 7. Converging
  84.0, 83.8, 84.3, 83.9, 84.2, 84.0, 84.2, 84.1, 84.0  // 8. Attains stability at end
];

// Live Market Streaming Graph Component for Sample 1 (Starts at 0, sharp volatile waves, stabilizes at end)
const LiveMarketGraph: React.FC = () => {
  const [points, setPoints] = useState<number[]>(BASE_MARKET_CURVE);
  const [price, setPrice] = useState(248.72);
  const [change, setChange] = useState(2.41);
  const [tickCount, setTickCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickCount((prev) => prev + 1);

      setPoints(() => {
        return BASE_MARKET_CURVE.map((baseVal, idx) => {
          if (idx === 0) return 0; // Anchored strictly at 0
          // Middle points: sharp dynamic breathing
          if (idx < 25) {
            const jitter = Math.sin(tickCount * 0.4 + idx) * 2.8;
            return Math.max(10, Math.min(108, baseVal + jitter));
          }
          // End points: stabilized equilibrium with tight micro-ticks
          const stableJitter = Math.sin(tickCount * 0.6 + idx) * 0.45;
          return Number((baseVal + stableJitter).toFixed(2));
        });
      });

      setPrice((prev) => {
        const delta = (Math.random() - 0.48) * 0.45;
        return Number((248.72 + delta).toFixed(2));
      });

      setChange((prev) => {
        const delta = (Math.random() - 0.48) * 0.05;
        return Number((2.41 + delta).toFixed(2));
      });
    }, 180);

    return () => clearInterval(interval);
  }, [tickCount]);

  // SVG dimensions
  const width = 600;
  const height = 180;
  const stepX = width / (points.length - 1);

  const pathD = points.reduce((acc, val, i) => {
    const x = i * stepX;
    // Map value to SVG Y
    const y = height - (val / 110) * (height - 35) - 15;
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, "");

  const fillD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  const lastPointY = height - (points[points.length - 1] / 110) * (height - 35) - 15;

  return (
    <div className="space-y-4">
      {/* Graph Container - Exact fixed height h-[345px] */}
      <div className="relative bg-[#090f05] rounded-xl border border-white/15 p-4 sm:p-5 overflow-hidden shadow-2xl h-[345px] flex flex-col justify-between">
        {/* Graph Header Labels */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10 text-[11px] font-mono shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-lemongrass font-bold">
              <span className="w-2 h-2 rounded-full bg-lemongrass animate-ping" />
              LIVE
            </span>
            <span className="text-white/40">|</span>
            <span className="text-white/70 font-semibold">PRICE: ${price.toFixed(2)}</span>
            <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              +{change.toFixed(2)}%
            </span>
          </div>

          <div className="flex items-center gap-2 text-white/50 text-[10px]">
            <span className="inline-flex items-center gap-1 text-lemongrass/90 bg-white/5 px-2 py-0.5 rounded border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-lemongrass" />
              AI RISK SIGNAL: NORMAL
            </span>
          </div>
        </div>

        {/* Dynamic SVG Animated Wave Chart */}
        <div className="relative w-full flex-1 min-h-0 my-1">
          {/* Subtle Grid Coordinates Background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, #b2eb76 1px, transparent 1px),
                linear-gradient(to bottom, #b2eb76 1px, transparent 1px)
              `,
              backgroundSize: "40px 30px",
            }}
          />

          {/* Graph Axis Labels */}
          <div className="absolute left-1 top-2 text-[9px] font-mono text-white/30">▲ PRICE</div>
          <div className="absolute right-2 bottom-1 text-[9px] font-mono text-white/30">TIME →</div>
          <div className="absolute left-1 bottom-1 text-[9px] font-mono text-white/30">0</div>

          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="chartFillGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b2eb76" stopOpacity="0.30" />
                <stop offset="60%" stopColor="#18280e" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#090f05" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gradient Area Fill */}
            <path d={fillD} fill="url(#chartFillGradient)" />

            {/* Sharp Pointy Glowing Trend Line (Miter corners & square joints) */}
            <path
              d={pathD}
              fill="none"
              stroke="#b2eb76"
              strokeWidth="2.2"
              strokeLinecap="square"
              strokeLinejoin="miter"
              strokeMiterlimit="10"
              className="transition-all duration-150"
            />

            {/* AI Anomaly Spike Marker Point 1 */}
            <g transform={`translate(${stepX * 14}, ${height - (points[14] / 110) * (height - 35) - 15})`}>
              <circle r="7" fill="#b2eb76" fillOpacity="0.3" className="animate-ping" />
              <polygon points="0,-4 3,3 -3,3" fill="#b2eb76" />
            </g>

            {/* AI Anomaly Spike Marker Point 2 */}
            <g transform={`translate(${stepX * 22}, ${height - (points[22] / 110) * (height - 35) - 15})`}>
              <circle r="7" fill="#b2eb76" fillOpacity="0.3" className="animate-ping" />
              <polygon points="0,-4 3,3 -3,3" fill="#b2eb76" />
            </g>

            {/* Latest Head Live Dot */}
            <g transform={`translate(${width}, ${lastPointY})`}>
              <circle r="9" fill="#b2eb76" fillOpacity="0.4" className="animate-ping" />
              <rect x="-3" y="-3" width="6" height="6" fill="#b2eb76" stroke="#ffffff" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      </div>

      {/* Bottom Stats Grid - Uniform Solid Dark Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
        <div className="p-3 rounded-lg bg-[#090f05] border border-white/12 space-y-0.5 shadow-sm">
          <div className="text-[10px] text-white/50 uppercase font-semibold">LIVE PRICE</div>
          <div className="text-white font-extrabold text-sm tracking-tight">${price.toFixed(2)}</div>
        </div>

        <div className="p-3 rounded-lg bg-[#090f05] border border-emerald-500/30 space-y-0.5 shadow-sm">
          <div className="text-[10px] text-emerald-400 font-semibold uppercase">CHANGE</div>
          <div className="text-emerald-300 font-extrabold text-sm tracking-tight">+{change.toFixed(2)}%</div>
        </div>

        <div className="p-3 rounded-lg bg-[#090f05] border border-white/12 space-y-0.5 shadow-sm">
          <div className="text-[10px] text-white/50 uppercase font-semibold">VOLATILITY</div>
          <div className="text-white font-bold text-sm tracking-wide">LOW</div>
        </div>

        <div className="p-3 rounded-lg bg-[#090f05] border border-emerald-500/40 space-y-0.5 shadow-sm">
          <div className="text-[10px] text-lemongrass uppercase font-semibold">RISK SIGNAL</div>
          <div className="text-emerald-400 font-bold text-sm tracking-wide">NORMAL</div>
        </div>
      </div>
    </div>
  );
};

const SCAN_TASKS = [
  "ANALYZING CONTENT...",
  "VERIFYING ENTITY...",
  "CHECKING SEBI STATUS...",
  "DETECTING MANIPULATION...",
  "MAPPING RISK SIGNALS...",
];

const SCAN_SIGNALS = [
  { label: "ENTITY IDENTIFIED", icon: "✓", color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/40" },
  { label: "SEBI DATABASE CHECKED", icon: "✓", color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/40" },
  { label: "SUSPICIOUS CLAIMS", icon: "⚠", color: "text-amber-400 border-amber-500/40 bg-amber-950/40" },
  { label: "IMPERSONATION SIGNAL", icon: "⚠", color: "text-red-400 border-red-500/40 bg-red-950/40" },
  { label: "HIGH-RISK PATTERN", icon: "⚠", color: "text-red-400 border-red-500/50 bg-red-950/50" },
];

// Sample 2 Threat Detection & Risk Scan Component (Exact height matched)
const ThreatDetectionScanner: React.FC = () => {
  const [phase, setPhase] = useState<number>(0); // 0: Input, 1: Scanning, 2: Signals, 3: Final Score
  const [scanTaskIndex, setScanTaskIndex] = useState(0);
  const [unlockedSignals, setUnlockedSignals] = useState<number>(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // 7.8-second master animation loop
    const runLoop = () => {
      // Phase 0: Input appears
      setPhase(0);
      setUnlockedSignals(0);
      setScore(0);
      setScanTaskIndex(0);

      // Phase 1: Scanner sweeps + tasks cycle (at 800ms)
      const t1 = setTimeout(() => {
        setPhase(1);
      }, 800);

      // Cycle scanning tasks
      const taskInterval = setInterval(() => {
        setScanTaskIndex((prev) => (prev + 1) % SCAN_TASKS.length);
      }, 400);

      // Phase 2: Signals light up one by one (at 2600ms)
      const t2 = setTimeout(() => {
        clearInterval(taskInterval);
        setPhase(2);
        // Light up each signal with 280ms stagger
        for (let i = 1; i <= SCAN_SIGNALS.length; i++) {
          setTimeout(() => {
            setUnlockedSignals(i);
          }, i * 280);
        }
      }, 2600);

      // Phase 3: Final Animated Score (at 4400ms)
      const t3 = setTimeout(() => {
        setPhase(3);
        // Animate score from 0 to 91
        let current = 0;
        const scoreInterval = setInterval(() => {
          current += 3;
          if (current >= 91) {
            current = 91;
            clearInterval(scoreInterval);
          }
          setScore(current);
        }, 25);
      }, 4400);

      return () => {
        clearTimeout(t1);
        clearInterval(taskInterval);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    };

    const cleanup = runLoop();
    const masterInterval = setInterval(runLoop, 7800);

    return () => {
      cleanup();
      clearInterval(masterInterval);
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Scanner Visual Container - Exact fixed height h-[345px] */}
      <div className="bg-[#090f05] rounded-xl border border-white/15 p-3.5 sm:p-4 font-mono text-xs text-white/90 shadow-2xl relative overflow-hidden h-[345px] flex flex-col justify-between">
        {/* Subtle Radar / Cyber Grid Background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #b2eb76 1px, transparent 1px), linear-gradient(to bottom, #b2eb76 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px] relative z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-lemongrass font-bold">THREAT &amp; RISK SCANNER</span>
          </div>
          <span className="text-white/40 font-mono text-[10px]">#SEBI-CROSSMATCH</span>
        </div>

        {/* Step 1 & 2: Input Box with Sweeping Thin Laser Scanner */}
        <div className="relative p-2.5 rounded-lg bg-black/75 border border-white/15 overflow-hidden z-10 shrink-0">
          {/* Laser Scanner Beam */}
          {phase >= 1 && (
            <div
              className="absolute top-0 bottom-0 w-[2.5px] bg-lemongrass shadow-[0_0_12px_#b2eb76,0_0_24px_#b2eb76] z-20 pointer-events-none animate-[scanLaser_2s_ease-in-out_infinite]"
              style={{
                filter: "drop-shadow(0 0 8px #b2eb76)",
              }}
            />
          )}

          <div className="flex items-center justify-between text-[9.5px] text-white/50 mb-0.5">
            <span className="text-lemongrass font-bold">&gt; TARGET INPUT</span>
            <span className="text-white/40 font-mono">LIVE URI</span>
          </div>
          <div className="text-white font-extrabold text-xs sm:text-[13px] tracking-wide font-mono flex items-center gap-1.5">
            <span className="text-white/50">https://</span>
            <span className="text-white">instagram.com/abc-investments</span>
          </div>

          {/* Scanning Progress Ticker */}
          <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px]">
            <span className="text-white/60">SCANNER STATUS:</span>
            <span className="text-lemongrass font-bold flex items-center gap-1 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-lemongrass animate-pulse" />
              {phase >= 1 ? SCAN_TASKS[scanTaskIndex] : "QUEUED FOR AUDIT"}
            </span>
          </div>
        </div>

        {/* Step 3: Sequential Risk Signals */}
        <div className="space-y-1 z-10 relative shrink-0">
          <div className="text-[9.5px] text-white/50 uppercase font-semibold flex items-center justify-between">
            <span>&gt; RISK SIGNALS EXTRACTED</span>
            <span className="text-lemongrass font-mono">{unlockedSignals}/5 VERIFIED</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {SCAN_SIGNALS.map((sig, i) => {
              const isVisible = unlockedSignals > i;
              return (
                <div
                  key={sig.label}
                  className={clsx(
                    "px-2.5 py-1.5 rounded border text-[10px] font-mono font-semibold flex items-center justify-between transition-all duration-300",
                    isVisible
                      ? sig.color
                      : "border-white/5 bg-white/[0.02] text-white/20"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <span className={clsx(isVisible ? "font-bold" : "opacity-20")}>
                      {sig.icon}
                    </span>
                    <span className="truncate">{sig.label}</span>
                  </span>
                  {isVisible && (
                    <span className="text-[8.5px] uppercase tracking-wider opacity-80 shrink-0">
                      FLAGGED
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 4: Final Animated Score & Progressive Fill Bar */}
        <div
          className={clsx(
            "p-2.5 sm:p-3 rounded-xl border transition-all duration-500 relative z-10 shrink-0",
            phase === 3
              ? "bg-[#1c0808] border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.25)]"
              : "bg-black/40 border-white/10 opacity-70"
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
            <div className="flex items-center gap-2">
              <span className="text-[9.5px] text-red-400 font-semibold uppercase tracking-wider">
                &gt; RISK SCORE:
              </span>
              <span className="text-xl font-black text-red-400 font-mono">
                {score} <span className="text-xs text-white/40 font-normal">/ 100</span>
              </span>
            </div>

            {phase === 3 ? (
              <div className="px-2.5 py-0.5 rounded-full bg-red-500/25 text-red-300 border border-red-500/50 font-bold text-[10px] flex items-center gap-1 animate-pulse">
                <span>⚠</span>
                <span>HIGH RISK DETECTED</span>
              </div>
            ) : (
              <div className="text-white/40 text-[9.5px] font-mono">CALCULATING...</div>
            )}
          </div>

          {/* Progressive Risk Bar */}
          <div className="w-full h-2 rounded-full bg-black/60 border border-white/10 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-red-500 to-red-600 transition-all duration-75 shadow-lg"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Summary Grid - Uniform Solid Dark Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
        <div className="p-3 rounded-lg bg-[#090f05] border border-white/12 space-y-0.5 shadow-sm">
          <div className="text-[10px] text-white/50 uppercase font-semibold">TARGET</div>
          <div className="text-white font-bold text-xs truncate">ABC INVESTMENTS</div>
        </div>

        <div className="p-3 rounded-lg bg-[#090f05] border border-white/12 space-y-0.5 shadow-sm">
          <div className="text-[10px] text-white/50 uppercase font-semibold">SEBI STATUS</div>
          <div className="text-red-400 font-bold text-xs">UNREGISTERED</div>
        </div>

        <div className="p-3 rounded-lg bg-[#090f05] border border-red-500/30 space-y-0.5 shadow-sm">
          <div className="text-[10px] text-red-400 font-semibold uppercase">RISK SCORE</div>
          <div className="text-red-400 font-extrabold text-sm tracking-tight">{score} / 100</div>
        </div>

        <div className="p-3 rounded-lg bg-[#090f05] border border-red-500/40 space-y-0.5 shadow-sm">
          <div className="text-[10px] text-red-300 uppercase font-semibold">THREAT LEVEL</div>
          <div className="text-red-400 font-bold text-sm tracking-wide">HIGH RISK</div>
        </div>
      </div>
    </div>
  );
};

const TRENDING_STOCKS = ["NIFTY 50", "RELIANCE", "BANK NIFTY", "HDFC BANK"];

// Sample 3 Community Feed & Live Discussions Component (White background & live fluctuating metrics)
const CommunityFeedVisualizer: React.FC = () => {
  const [upvotes, setUpvotes] = useState(248);
  const [discussions, setDiscussions] = useState(1284);
  const [activeInvestors, setActiveInvestors] = useState(342);
  const [scamReports, setScamReports] = useState(24);
  const [trendingIdx, setTrendingIdx] = useState(0);
  const [scamState, setScamState] = useState<"reported" | "analyzing" | "flagged">("reported");
  const [showReply, setShowReply] = useState(false);

  useEffect(() => {
    // Upvotes live increments
    const upvoteInterval = setInterval(() => {
      setUpvotes((prev) => prev + (Math.random() > 0.4 ? 1 : 0));
    }, 1800);

    // Discussions counter: randomly increasing or decreasing
    const discussionInterval = setInterval(() => {
      setDiscussions((prev) => {
        const delta = Math.random() > 0.45 ? 1 : -1;
        return Math.max(1270, Math.min(1310, prev + delta));
      });
    }, 1900);

    // Active investors counter: randomly increasing or decreasing
    const investorInterval = setInterval(() => {
      setActiveInvestors((prev) => {
        const delta = Math.random() > 0.48 ? 1 : -1;
        return Math.max(330, Math.min(360, prev + delta));
      });
    }, 2200);

    // Scam reports counter: randomly increasing or decreasing
    const scamReportsInterval = setInterval(() => {
      setScamReports((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(20, Math.min(30, prev + delta));
      });
    }, 3200);

    // Trending indicator hopper
    const trendingInterval = setInterval(() => {
      setTrendingIdx((prev) => (prev + 1) % TRENDING_STOCKS.length);
    }, 2200);

    // Moderation flow loop: REPORT -> AI ANALYZING -> FLAGGED
    const runModerationLoop = () => {
      setScamState("reported");
      setShowReply(false);

      const t1 = setTimeout(() => {
        setShowReply(true);
        setScamState("analyzing");
      }, 1800);

      const t2 = setTimeout(() => {
        setScamState("flagged");
      }, 3800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    };

    const cleanupMod = runModerationLoop();
    const masterModInterval = setInterval(runModerationLoop, 7500);

    return () => {
      clearInterval(upvoteInterval);
      clearInterval(discussionInterval);
      clearInterval(investorInterval);
      clearInterval(scamReportsInterval);
      clearInterval(trendingInterval);
      cleanupMod();
      clearInterval(masterModInterval);
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Community Visual Container - Clean White Background */}
      <div className="bg-white rounded-xl border border-black/10 p-3.5 sm:p-4 font-mono text-xs text-black/90 shadow-lg relative overflow-hidden h-[345px] flex flex-col justify-between">
        {/* Subtle Light Grid Pattern */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Top Header & Trending Bar */}
        <div className="flex flex-wrap items-center justify-between pb-2 border-b border-black/10 text-[11px] relative z-10 shrink-0 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-forest font-black tracking-tight">COMMUNITY STREAM</span>
            <span className="text-black/20 hidden sm:inline">|</span>
            <span className="text-forest font-bold text-[10px] hidden sm:inline flex items-center gap-1">
              ● <span className="text-emerald-600 font-extrabold">{activeInvestors}</span> INVESTORS ACTIVE
            </span>
          </div>

          {/* Trending Stock Pill */}
          <div className="flex items-center gap-1 text-[10px]">
            <span className="text-black/40 uppercase font-semibold">TRENDING:</span>
            <div className="flex items-center gap-1">
              {TRENDING_STOCKS.map((stock, idx) => (
                <span
                  key={stock}
                  className={clsx(
                    "px-2 py-0.5 rounded text-[9.5px] transition-all duration-300 font-bold",
                    trendingIdx === idx
                      ? "bg-forest text-lemongrass shadow-sm"
                      : "bg-black/5 text-black/60 hover:bg-black/10"
                  )}
                >
                  {stock}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Feed Area */}
        <div className="space-y-2 relative z-10 flex-1 flex flex-col justify-center my-0.5">
          {/* Post 1: Analysis Post with Live Upvotes & Dynamic Reply */}
          <div className="p-2.5 rounded-lg bg-[#f8faf6] border border-black/8 shadow-sm space-y-1.5 transition-all">
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2">
                <span className="text-forest font-black">&gt; NIFTY 50</span>
                <span className="text-black/50">@rahul_trader</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[8.5px] border border-emerald-300 font-bold">
                  VERIFIED
                </span>
              </div>
              <span className="text-black/40 text-[9.5px]">Just now</span>
            </div>

            <p className="text-black/90 font-medium text-xs leading-relaxed font-sans">
              &quot;Momentum is building across banking stocks. Watching HDFC &amp; ICICI closely.&quot;
            </p>

            <div className="flex items-center justify-between pt-1 text-[10.5px] border-t border-black/5 font-mono">
              <div className="flex items-center gap-3">
                <span className="text-forest font-bold flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  <span className="text-emerald-600">↑</span> {upvotes}
                </span>
                <span className="text-black/60 flex items-center gap-1">
                  <span>💬</span> 42
                </span>
              </div>
              <span className="text-[9.5px] text-forest/70 font-semibold">● {activeInvestors} INVESTORS ACTIVE</span>
            </div>

            {/* Dynamic Sliding Reply Underneath */}
            {showReply && (
              <div className="pt-1.5 pl-3 border-l-2 border-forest/30 text-[10.5px] text-black/80 animate-in fade-in slide-in-from-top-1 duration-300 flex items-center justify-between font-sans">
                <span>
                  <strong className="text-forest font-mono">@vikram_k:</strong> &quot;Agree, PSU banks showing strong volume too.&quot;
                </span>
                <span className="text-[9px] text-black/40 font-mono">1s ago</span>
              </div>
            )}
          </div>

          {/* Post 2: Scam Report & Live Auto-Moderation Flow */}
          <div
            className={clsx(
              "p-2.5 rounded-lg border transition-all duration-500 space-y-1",
              scamState === "flagged"
                ? "bg-red-50/80 border-red-300 shadow-sm"
                : scamState === "analyzing"
                ? "bg-amber-50/80 border-amber-300"
                : "bg-black/[0.02] border-black/8"
            )}
          >
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="text-red-600 font-bold">&gt; SUSPICIOUS POST</span>
                <span className="text-black/50">@quick_wealth_tips</span>
              </div>

              {/* Status Pill Animation */}
              {scamState === "reported" && (
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 text-[9px] font-bold">
                  [1 COMMUNITY REPORT]
                </span>
              )}
              {scamState === "analyzing" && (
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-forest border border-emerald-300 text-[9px] font-bold animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest animate-ping" />
                  [AI ANALYZING...]
                </span>
              )}
              {scamState === "flagged" && (
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-300 text-[9px] font-bold animate-pulse flex items-center gap-1">
                  <span>⚠</span>
                  [FLAGGED: HIGH RISK]
                </span>
              )}
            </div>

            <p className={clsx("text-xs font-sans", scamState === "flagged" ? "text-red-800 line-through opacity-60" : "text-black/80")}>
              &quot;Guaranteed 200% returns in 3 days! Join VIP telegram channel for calls...&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Floating/Summary Metrics - Uniform Solid Dark Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
        <div className="p-3 rounded-lg bg-[#090f05] border border-white/12 space-y-0.5 shadow-sm">
          <div className="text-[10px] text-white/50 uppercase font-semibold">DISCUSSIONS</div>
          <div className="text-white font-extrabold text-sm tracking-tight">{discussions.toLocaleString()}</div>
        </div>

        <div className="p-3 rounded-lg bg-[#090f05] border border-emerald-500/30 space-y-0.5 shadow-sm">
          <div className="text-[10px] text-emerald-400 font-semibold uppercase">ACTIVE INVESTORS</div>
          <div className="text-emerald-300 font-extrabold text-sm tracking-tight">{activeInvestors}</div>
        </div>

        <div className="p-3 rounded-lg bg-[#090f05] border border-red-500/30 space-y-0.5 shadow-sm">
          <div className="text-[10px] text-red-400 font-semibold uppercase">SCAM REPORTS</div>
          <div className="text-red-400 font-bold text-sm tracking-wide">{scamReports} FLAGGED</div>
        </div>

        <div className="p-3 rounded-lg bg-[#090f05] border border-emerald-500/40 space-y-0.5 shadow-sm">
          <div className="text-[10px] text-lemongrass uppercase font-semibold">AI MODERATION</div>
          <div className="text-emerald-400 font-bold text-sm tracking-wide">REAL-TIME</div>
        </div>
      </div>
    </div>
  );
};

// Sample 4 Scam Network Intelligence Component (Animated Graph & Coordinated Fraud Mapping)
const ScamNetworkGraphVisualizer: React.FC = () => {
  const [phase, setPhase] = useState<number>(0); // 0: Root node, 1: Expanding network, 2: Cluster revealed
  const [connectedCount, setConnectedCount] = useState(12);

  useEffect(() => {
    // Dynamic entity counter fluctuation
    const entityInterval = setInterval(() => {
      setConnectedCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(10, Math.min(16, prev + delta));
      });
    }, 2800);

    // Network Graph Animation Loop
    const runGraphLoop = () => {
      setPhase(0);

      const t1 = setTimeout(() => {
        setPhase(1);
      }, 1200);

      const t2 = setTimeout(() => {
        setPhase(2);
      }, 3400);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    };

    const cleanupGraph = runGraphLoop();
    const masterGraphInterval = setInterval(runGraphLoop, 7500);

    return () => {
      clearInterval(entityInterval);
      cleanupGraph();
      clearInterval(masterGraphInterval);
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Network Graph Container - Exact fixed height h-[345px] */}
      <div className="bg-[#090f05] rounded-xl border border-white/15 p-3.5 sm:p-4 font-mono text-xs text-white/90 shadow-2xl relative overflow-hidden h-[345px] flex flex-col justify-between">
        {/* Subtle Radar / Cyber Grid Background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #b2eb76 1px, transparent 1px), linear-gradient(to bottom, #b2eb76 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px] relative z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-red-400 font-bold">SCAM NETWORK GRAPH</span>
          </div>
          <span className="text-white/40 font-mono text-[10px]">#GRAPH-RESOLVER</span>
        </div>

        {/* Animated Network Graph Diagram */}
        <div className="relative flex-1 flex items-center justify-center my-0.5 z-10">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 200">
            {/* Animated Connector Lines from Center */}
            {phase >= 1 && (
              <g stroke="#b2eb76" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse opacity-70">
                {/* Center to Top (Instagram) */}
                <line x1="250" y1="100" x2="250" y2="35" />
                {/* Center to Left (Website) */}
                <line x1="250" y1="100" x2="105" y2="100" />
                {/* Center to Right (Telegram) */}
                <line x1="250" y1="100" x2="395" y2="100" />
                {/* Center to Bottom (Advisor) */}
                <line x1="250" y1="100" x2="250" y2="165" />
                {/* Cross Interconnections when in Phase 2 */}
                {phase === 2 && (
                  <g stroke="#ef4444" strokeWidth="1.2" opacity="0.6">
                    <line x1="105" y1="100" x2="250" y2="35" />
                    <line x1="395" y1="100" x2="250" y2="35" />
                    <line x1="105" y1="100" x2="250" y2="165" />
                    <line x1="395" y1="100" x2="250" y2="165" />
                  </g>
                )}
              </g>
            )}
          </svg>

          {/* Top Node: INSTAGRAM */}
          <div
            className={clsx(
              "absolute top-1 left-1/2 -translate-x-1/2 transition-all duration-500",
              phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
            )}
          >
            <div className="px-3 py-1 rounded bg-[#1c0d0d] border border-red-500/40 text-red-300 font-bold text-[10.5px] flex items-center gap-1.5 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              INSTAGRAM
            </div>
          </div>

          {/* Left Node: WEBSITE */}
          <div
            className={clsx(
              "absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 transition-all duration-500",
              phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
            )}
          >
            <div className="px-3 py-1 rounded bg-[#1c0d0d] border border-red-500/40 text-red-300 font-bold text-[10.5px] flex items-center gap-1.5 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              WEBSITE
            </div>
          </div>

          {/* Center Hub Node: SUSPICIOUS ACCOUNT / SCAM NETWORK */}
          <div className="relative z-20 text-center">
            {phase < 2 ? (
              <div className="px-3.5 py-2 rounded-xl bg-black/80 border border-lemongrass/40 text-white font-extrabold text-xs shadow-lg space-y-0.5">
                <div className="text-lemongrass text-[9px] font-mono tracking-wider">&gt; ORIGIN</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-lemongrass animate-ping" />
                  <span>SUSPICIOUS ACCOUNT</span>
                </div>
              </div>
            ) : (
              <div className="px-4 py-2.5 rounded-xl bg-[#2a0b0b] border-2 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.35)] text-white space-y-1 animate-in zoom-in-95 duration-300">
                <div className="text-red-400 font-black text-xs sm:text-sm tracking-wider flex items-center justify-center gap-1.5">
                  <span>⚠</span>
                  <span>SCAM NETWORK</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-[10.5px] font-mono">
                  <span className="text-white/80">RISK: <strong className="text-red-400 font-black">91 / 100</strong></span>
                  <span className="text-white/30">•</span>
                  <span className="text-red-300 font-bold">5 ENTITIES</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Node: TELEGRAM */}
          <div
            className={clsx(
              "absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 transition-all duration-500",
              phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
            )}
          >
            <div className="px-3 py-1 rounded bg-[#1c0d0d] border border-red-500/40 text-red-300 font-bold text-[10.5px] flex items-center gap-1.5 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              TELEGRAM
            </div>
          </div>

          {/* Bottom Node: ADVISOR */}
          <div
            className={clsx(
              "absolute bottom-1 left-1/2 -translate-x-1/2 transition-all duration-500",
              phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
            )}
          >
            <div className="px-3 py-1 rounded bg-[#1c0d0d] border border-red-500/40 text-red-300 font-bold text-[10.5px] flex items-center gap-1.5 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              ADVISOR
            </div>
          </div>
        </div>

        {/* Status Callout Strip */}
        <div className="p-2 rounded-lg bg-black/60 border border-white/10 flex items-center justify-between text-[10px] shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-white/70">GRAPH STATUS:</span>
            <span className="text-red-400 font-bold font-mono">
              {phase === 0 ? "SCANNING SEED..." : phase === 1 ? "EXPANDING CLUSTER NODES..." : "COORDINATED FRAUD DETECTED"}
            </span>
          </div>
          <span className="text-white/40 font-mono">5 CONNECTED ENTITIES</span>
        </div>
      </div>

      {/* Bottom Floating/Summary Metrics - Uniform Solid Dark Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
        <div className="p-3 rounded-lg bg-[#090f05] border border-white/12 space-y-0.5 shadow-sm">
          <div className="text-[10px] text-white/50 uppercase font-semibold">ENTITIES</div>
          <div className="text-white font-extrabold text-sm tracking-tight">{connectedCount} CONNECTED</div>
        </div>

        <div className="p-3 rounded-lg bg-[#090f05] border border-emerald-500/30 space-y-0.5 shadow-sm">
          <div className="text-[10px] text-emerald-400 font-semibold uppercase">RISK SIGNALS</div>
          <div className="text-emerald-300 font-extrabold text-sm tracking-tight">5 VERIFIED</div>
        </div>

        <div className="p-3 rounded-lg bg-[#090f05] border border-red-500/30 space-y-0.5 shadow-sm">
          <div className="text-[10px] text-red-400 font-semibold uppercase">NETWORK RISK</div>
          <div className="text-red-400 font-extrabold text-sm tracking-tight">91 / 100</div>
        </div>

        <div className="p-3 rounded-lg bg-[#090f05] border border-red-500/40 space-y-0.5 shadow-sm">
          <div className="text-[10px] text-red-300 uppercase font-semibold">THREAT TYPE</div>
          <div className="text-red-400 font-bold text-sm tracking-wide">SCAM CLUSTER</div>
        </div>
      </div>
    </div>
  );
};

const SAMPLE_METAS = [
  {
    engineName: "Live Stream & Market Engine",
    latency: "Real-Time (12ms)",
    badgeColor: "bg-lemongrass",
    tabName: "Sample 1",
  },
  {
    engineName: "Deepfake & Fraud Scanner",
    latency: "AI-Powered (38ms)",
    badgeColor: "bg-red-400",
    tabName: "Sample 2",
  },
  {
    engineName: "Community Stream & Moderation",
    latency: "Real-Time (18ms)",
    badgeColor: "bg-emerald-400",
    tabName: "Sample 3",
  },
  {
    engineName: "Threat Graph & Cluster Mapping",
    latency: "Multi-Layer (42ms)",
    badgeColor: "bg-red-500",
    tabName: "Sample 4",
  },
];

export const InteractiveTransactionVisualizer: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [, setIsEnriching] = useState(false);

  // Auto-advance after animation finishes + 2.5s buffer (8.5s total per sample)
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveIdx((prev) => (prev + 1) % 4);
    }, 8500);

    return () => clearTimeout(timer);
  }, [activeIdx]);

  const handleSelect = (idx: number) => {
    setIsEnriching(true);
    setActiveIdx(idx);
    setTimeout(() => setIsEnriching(false), 300);
  };

  const currentMeta = SAMPLE_METAS[activeIdx] || SAMPLE_METAS[0];

  return (
    <section id="visualizer" className="relative overflow-hidden bg-sage-1/40 py-20 md:py-28 border-b border-black/5">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest/5 text-forest text-xs font-mono font-semibold border border-forest/10">
            <Cpu className="w-3.5 h-3.5 text-moss" />
            <span>LIVE MARKET INTELLIGENCE ENGINE</span>
          </div>
          <h2 className="text-40px-heading text-forest font-semibold tracking-tight">
            See market intelligence in real-time
          </h2>
          <p className="text-black/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Track live market movement, risk signals, entity verification, and anomaly detection as data streams through MarketShield.
          </p>
        </div>

        <div className="w-full max-w-[66rem] mx-auto">
          <CutCornerContainer
            cornerSizeDesktop={13}
            cornerSizeMobile={7}
            cornerBg="bg-sage-1"
            className="bg-white border border-black/10 shadow-xl overflow-hidden text-left"
          >
            {/* Top Control Bar - Dynamic per active sample */}
            <div className="bg-[#0e1709] px-3.5 sm:px-4 py-2.5 sm:py-3 text-white flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className={clsx("w-2.5 h-2.5 rounded-full animate-pulse", currentMeta.badgeColor)} />
                <span className="text-11px-eyebrow-caps text-lemongrass font-mono">
                  {currentMeta.engineName}
                </span>
                <span className="text-xs text-white/50 hidden sm:inline">•</span>
                <span className="text-xs text-white/60 font-mono hidden sm:inline">
                  Latency: <span className="text-white font-semibold">{currentMeta.latency}</span>
                </span>
              </div>

              {/* Preset Selector Tabs */}
              <div className="flex items-center gap-1 sm:gap-1.5 bg-white/5 p-1 rounded-md max-w-full overflow-x-auto">
                {SAMPLE_METAS.map((meta, i) => (
                  <button
                    key={meta.tabName}
                    onClick={() => handleSelect(i)}
                    className={clsx(
                      "px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs rounded transition-all font-mono whitespace-nowrap",
                      activeIdx === i
                        ? "bg-lemongrass text-forest font-semibold shadow"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {meta.tabName}
                  </button>
                ))}
              </div>
            </div>

            {/* Sample Content Area */}
            {activeIdx === 0 ? (
              /* Sample 1: LIVE MARKET & RISK MONITOR */
              <div className="p-4 sm:p-7 md:p-8 bg-white space-y-4 sm:space-y-5">
                <div className="space-y-1.5">
                  <div className="text-11px-eyebrow-caps text-forest/70 font-mono font-semibold">
                    [SAMPLE 01 // LIVE MARKET]
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-[1.65rem] font-bold text-forest tracking-tight font-display">
                    LIVE MARKET &amp; RISK MONITOR
                  </h3>
                  <p className="text-xs sm:text-sm text-black/75 leading-relaxed font-sans max-w-3xl">
                    Real-time market movement, enriched with AI-powered intelligence. Track live price movement, market trends, volatility, and risk signals as they change.
                  </p>
                </div>

                <LiveMarketGraph />
              </div>
            ) : activeIdx === 1 ? (
              /* Sample 2: THREAT DETECTION & RISK SCANNER */
              <div className="p-4 sm:p-7 md:p-8 bg-white space-y-4 sm:space-y-5">
                <div className="space-y-1.5">
                  <div className="text-11px-eyebrow-caps text-red-700 font-mono font-semibold">
                    [SAMPLE 02 // THREAT DETECTION &amp; VERIFICATION]
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-[1.65rem] font-bold text-forest tracking-tight font-display">
                    AI-POWERED FRAUD &amp; ENTITY RISK SCANNER
                  </h3>
                  <p className="text-xs sm:text-sm text-black/75 leading-relaxed font-sans max-w-3xl">
                    Automated multi-layer verification: scan social content, detect deepfakes and impersonation, cross-match SEBI records, and calculate real-time threat scores.
                  </p>
                </div>

                <ThreatDetectionScanner />
              </div>
            ) : activeIdx === 2 ? (
              /* Sample 3: COMMUNITY & MARKET DISCUSSIONS */
              <div className="p-4 sm:p-7 md:p-8 bg-white space-y-4 sm:space-y-5">
                <div className="space-y-1.5">
                  <div className="text-11px-eyebrow-caps text-forest/70 font-mono font-semibold">
                    [SAMPLE 03 // COMMUNITY INTELLIGENCE]
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-[1.65rem] font-bold text-forest tracking-tight font-display">
                    INVESTOR COMMUNITY &amp; MARKET DISCUSSIONS
                  </h3>
                  <p className="text-xs sm:text-sm text-black/75 leading-relaxed font-sans max-w-3xl">
                    Turn collective investor activity into actionable market intelligence. Share stock analysis, exchange market perspectives, and report suspicious fraud in real time.
                  </p>
                </div>

                <CommunityFeedVisualizer />
              </div>
            ) : (
              /* Sample 4: SCAM NETWORK INTELLIGENCE */
              <div className="p-4 sm:p-7 md:p-8 bg-white space-y-4 sm:space-y-5">
                <div className="space-y-1.5">
                  <div className="text-11px-eyebrow-caps text-red-700 font-mono font-semibold">
                    [SAMPLE 04 // SCAM NETWORK INTELLIGENCE]
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-[1.65rem] font-bold text-forest tracking-tight font-display">
                    UNCOVER THE NETWORK BEHIND THE SCAM
                  </h3>
                  <p className="text-xs sm:text-sm text-black/75 leading-relaxed font-sans max-w-3xl">
                    One suspicious account can reveal an entire network. MarketShield connects advisors, social accounts, websites, links, phone numbers, and payment identifiers to identify coordinated scam activity.
                  </p>
                </div>

                <ScamNetworkGraphVisualizer />
              </div>
            )}
          </CutCornerContainer>
        </div>
      </div>
    </section>
  );
};
