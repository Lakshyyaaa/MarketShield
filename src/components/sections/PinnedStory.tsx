"use client";

import React, { useRef, useState } from "react";
import { CutCornerContainer } from "../ui/CutCornerContainer";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, MotionValue } from "framer-motion";
import { CreditCard, Copy, Maximize2, MapPin, Apple } from "lucide-react";
import clsx from "clsx";

// Live Ticking Numeric Value component driven directly by scroll
const ScrollNumber: React.FC<{
  progress: MotionValue<number>;
  inputRange: [number, number];
  outputRange: [number, number];
  prefix?: string;
  suffix?: string;
  decimals?: number;
}> = ({ progress, inputRange, outputRange, prefix = "", suffix = "", decimals = 0 }) => {
  const value = useTransform(progress, inputRange, outputRange);
  const [current, setCurrent] = useState(outputRange[0]);

  useMotionValueEvent(value, "change", (v) => {
    setCurrent(v);
  });

  return (
    <span>
      {prefix}
      {decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString()}
      {suffix}
    </span>
  );
};

// Market Intelligence HUD Signal Card
const MarketSignalHudCard: React.FC<{
  label: string;
  value: React.ReactNode;
  subtext?: string;
  variant?: "default" | "alert" | "success" | "neutral";
  hasSolidBorder?: boolean;
  className?: string;
}> = ({ label, value, subtext, variant = "default", hasSolidBorder = false, className = "" }) => {
  return (
    <div
      className={clsx(
        "relative rounded-md bg-[#13230c]/90 backdrop-blur-md px-3 py-2 sm:px-3.5 sm:py-2.5 text-left font-mono shadow-xl transition-all",
        variant === "alert"
          ? "border border-red-500/60 bg-[#250d0d]/90 shadow-red-950/40"
          : variant === "success"
          ? "border border-emerald-400/60 bg-[#0d2314]/90"
          : hasSolidBorder
          ? "border-2 border-white/80 shadow-white/5"
          : "border border-lemongrass/40",
        className
      )}
    >
      {/* 4 Corner Crosshairs */}
      <span className="absolute -top-[2px] -left-[2px] w-2 h-2 border-t-2 border-l-2 border-white pointer-events-none" />
      <span className="absolute -top-[2px] -right-[2px] w-2 h-2 border-t-2 border-r-2 border-white pointer-events-none" />
      <span className="absolute -bottom-[2px] -left-[2px] w-2 h-2 border-b-2 border-l-2 border-white pointer-events-none" />
      <span className="absolute -bottom-[2px] -right-[2px] w-2 h-2 border-b-2 border-r-2 border-white pointer-events-none" />

      {/* Label */}
      <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold text-lemongrass/90 uppercase tracking-wider mb-0.5">
        <span className="text-[8px] text-[#52940b]">▶</span>
        <span>{label}</span>
      </div>

      {/* Value */}
      <div
        className={clsx(
          "text-[11px] sm:text-[12.5px] font-mono leading-tight font-bold tracking-tight",
          variant === "alert" ? "text-red-300" : variant === "success" ? "text-emerald-300" : "text-white"
        )}
      >
        {value}
      </div>
      {subtext && (
        <div className="text-[9px] sm:text-[10px] font-mono text-white/60 mt-0.5">
          {subtext}
        </div>
      )}
    </div>
  );
};

// Phase 1 CAD Viewfinder Bracket component
const CadHudCard: React.FC<{
  label: string;
  lines: React.ReactNode[];
  hasSolidBorder?: boolean;
  className?: string;
}> = ({ label, lines, hasSolidBorder = false, className = "" }) => {
  return (
    <div
      className={clsx(
        "relative rounded-xs bg-[#16270e]/85 backdrop-blur-xs p-2.5 sm:p-3 text-left font-mono shadow-lg",
        hasSolidBorder
          ? "border-2 border-white/80 shadow-white/5"
          : "border border-forest-light/50",
        className
      )}
    >
      {/* 4 Corner Crosshairs */}
      <span className="absolute -top-[2px] -left-[2px] w-2 h-2 border-t-2 border-l-2 border-white pointer-events-none" />
      <span className="absolute -top-[2px] -right-[2px] w-2 h-2 border-t-2 border-r-2 border-white pointer-events-none" />
      <span className="absolute -bottom-[2px] -left-[2px] w-2 h-2 border-b-2 border-l-2 border-white pointer-events-none" />
      <span className="absolute -bottom-[2px] -right-[2px] w-2 h-2 border-b-2 border-r-2 border-white pointer-events-none" />

      {/* Label */}
      <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold text-lemongrass/90 uppercase tracking-wider mb-1">
        <span className="text-[8px] text-[#52940b]">▶</span>
        <span>{label}</span>
      </div>

      {/* Content lines */}
      <div className="text-[10px] sm:text-[11.5px] font-mono text-white/90 leading-tight uppercase space-y-0.5 font-medium">
        {lines.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
    </div>
  );
};

// Phase 1 Transaction Pill Card
const TransactionPillCard: React.FC<{
  iconBg: string;
  merchant: string;
  category: string;
  amount: React.ReactNode;
  hasSolidBorder?: boolean;
  className?: string;
}> = ({ iconBg, merchant, category, amount, hasSolidBorder = false, className = "" }) => {
  return (
    <div
      className={clsx(
        "relative rounded-xl bg-[#111e0b]/95 backdrop-blur-md p-2.5 sm:p-3 flex items-center justify-between gap-3 shadow-xl text-left",
        hasSolidBorder
          ? "border-2 border-white shadow-white/10"
          : "border border-white/30",
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={clsx(
            "w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs",
            iconBg
          )}
        >
          <CreditCard className="w-4 h-4 text-forest font-bold" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] sm:text-[12.5px] font-mono font-bold text-white truncate">
            {merchant}
          </div>
          <div className="text-[9.5px] sm:text-[10.5px] font-mono text-white/70 truncate mt-0.5">
            {category}
          </div>
        </div>
      </div>

      <div className="text-right shrink-0 font-mono text-[12px] sm:text-[13.5px] font-bold text-white tracking-tight pl-2">
        {amount}
      </div>
    </div>
  );
};

// Phase 2 White Blueprint CAD Card
const BlueprintCadCard: React.FC<{
  label: string;
  lines: (string | React.ReactNode)[];
  variant?: "default" | "alert" | "success";
  className?: string;
}> = ({ label, lines, variant = "default", className = "" }) => {
  return (
    <div
      className={clsx(
        "relative rounded-sm bg-white/95 border p-2.5 sm:p-3 text-left font-mono shadow-sm backdrop-blur-xs",
        variant === "alert"
          ? "border-red-500/60 bg-red-50/40"
          : variant === "success"
          ? "border-emerald-600/50 bg-emerald-50/40"
          : "border-black/40",
        className
      )}
    >
      {/* 4 Corner Crosshairs */}
      <span className="absolute -top-[2px] -left-[2px] w-2 h-2 border-t-2 border-l-2 border-black/90 pointer-events-none" />
      <span className="absolute -top-[2px] -right-[2px] w-2 h-2 border-t-2 border-r-2 border-black/90 pointer-events-none" />
      <span className="absolute -bottom-[2px] -left-[2px] w-2 h-2 border-b-2 border-l-2 border-black/90 pointer-events-none" />
      <span className="absolute -bottom-[2px] -right-[2px] w-2 h-2 border-b-2 border-r-2 border-black/90 pointer-events-none" />

      {/* Label */}
      <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold text-black/70 uppercase tracking-wider mb-1">
        <span className="text-[8px] text-[#52940b]">▶</span>
        <span>{label}</span>
      </div>

      {/* Content lines */}
      <div className="text-[10.5px] sm:text-[11.5px] font-mono text-black uppercase leading-snug space-y-0.5 font-bold">
        {lines.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
    </div>
  );
};

export const PinnedStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 24,
    restDelta: 0.001,
  });

  // =========================================================================
  // PHASE 1 (0.0 -> 0.32): DARK FOREST HERO SEQUENTIAL ONE-BY-ONE POP-OUTS
  // Alternating pairs (Top -> Below -> Top-Left -> Bottom-Right -> Left -> Right -> Top-Right -> Bottom-Left)
  // All points equidistant from center with live scrolling numbers
  // =========================================================================

  // 1. FIRST: Top (North - AI Score) [0.02 -> 0.08]
  const card1X = useTransform(smoothProgress, [0.02, 0.08], [0, 0]);
  const card1Y = useTransform(smoothProgress, [0.02, 0.08], [0, -155]);
  const card1Scale = useTransform(smoothProgress, [0.02, 0.07], [0.25, 1]);
  const card1Opacity = useTransform(smoothProgress, [0.02, 0.05, 0.27, 0.32], [0, 1, 1, 0]);

  // 2. SECOND: Below (South - Risk Score) [0.05 -> 0.11]
  const card2X = useTransform(smoothProgress, [0.05, 0.11], [0, 0]);
  const card2Y = useTransform(smoothProgress, [0.05, 0.11], [0, 155]);
  const card2Scale = useTransform(smoothProgress, [0.05, 0.10], [0.25, 1]);
  const card2Opacity = useTransform(smoothProgress, [0.05, 0.08, 0.27, 0.32], [0, 1, 1, 0]);

  // 3. THIRD: Top-Left (North-West - Live Price) [0.08 -> 0.14]
  const card3X = useTransform(smoothProgress, [0.08, 0.14], [0, -360]);
  const card3Y = useTransform(smoothProgress, [0.08, 0.14], [0, -145]);
  const card3Scale = useTransform(smoothProgress, [0.08, 0.13], [0.25, 1]);
  const card3Opacity = useTransform(smoothProgress, [0.08, 0.11, 0.27, 0.32], [0, 1, 1, 0]);

  // 4. FOURTH: Bottom-Right (South-East - Community) [0.11 -> 0.17]
  const card4X = useTransform(smoothProgress, [0.11, 0.17], [0, 360]);
  const card4Y = useTransform(smoothProgress, [0.11, 0.17], [0, 145]);
  const card4Scale = useTransform(smoothProgress, [0.11, 0.16], [0.25, 1]);
  const card4Opacity = useTransform(smoothProgress, [0.11, 0.14, 0.27, 0.32], [0, 1, 1, 0]);

  // 5. FIFTH: Middle-Left (West - SEBI Status) [0.14 -> 0.20]
  const card5X = useTransform(smoothProgress, [0.14, 0.20], [0, -410]);
  const card5Y = useTransform(smoothProgress, [0.14, 0.20], [0, 0]);
  const card5Scale = useTransform(smoothProgress, [0.14, 0.19], [0.25, 1]);
  const card5Opacity = useTransform(smoothProgress, [0.14, 0.17, 0.27, 0.32], [0, 1, 1, 0]);

  // 6. SIXTH: Middle-Right (East - Scam Signal) [0.17 -> 0.23]
  const card6X = useTransform(smoothProgress, [0.17, 0.23], [0, 410]);
  const card6Y = useTransform(smoothProgress, [0.17, 0.23], [0, 0]);
  const card6Scale = useTransform(smoothProgress, [0.17, 0.22], [0.25, 1]);
  const card6Opacity = useTransform(smoothProgress, [0.17, 0.20, 0.27, 0.32], [0, 1, 1, 0]);

  // 7. SEVENTH: Top-Right (North-East - Market Index) [0.20 -> 0.26]
  const card7X = useTransform(smoothProgress, [0.20, 0.26], [0, 360]);
  const card7Y = useTransform(smoothProgress, [0.20, 0.26], [0, -145]);
  const card7Scale = useTransform(smoothProgress, [0.20, 0.25], [0.25, 1]);
  const card7Opacity = useTransform(smoothProgress, [0.20, 0.23, 0.27, 0.32], [0, 1, 1, 0]);

  // 8. EIGHTH: Bottom-Left (South-West - Scam Alert) [0.23 -> 0.29]
  const card8X = useTransform(smoothProgress, [0.23, 0.29], [0, -360]);
  const card8Y = useTransform(smoothProgress, [0.23, 0.29], [0, 145]);
  const card8Scale = useTransform(smoothProgress, [0.23, 0.28], [0.25, 1]);
  const card8Opacity = useTransform(smoothProgress, [0.23, 0.26, 0.27, 0.32], [0, 1, 1, 0]);

  // Phase 1 Headline Opacity & Shift
  const headline1Opacity = useTransform(smoothProgress, [0.0, 0.24, 0.30], [1, 1, 0]);
  const headline1Y = useTransform(smoothProgress, [0.24, 0.30], [0, -25]);

  // =========================================================================
  // TRANSITION: DARK CARD CONTAINER DISSOLVES TO FULL-WIDTH PURE WHITE CANVAS
  // =========================================================================
  // The dark card frame & cut-corner shadow fade out completely as Phase 2 opens!
  const darkCardContainerOpacity = useTransform(smoothProgress, [0.25, 0.36], [1, 0]);
  const gridLinesOpacity = useTransform(smoothProgress, [0.30, 0.40, 0.58, 0.68], [0, 1, 1, 0]);

  // =========================================================================
  // PHASE 2 BLUEPRINT POPOUTS (ONE-BY-ONE SEQUENTIAL EMERGENCE WITH LIVE NUMBERS)
  // Alternating positions around the central blueprint headline
  // =========================================================================

  // 1. FIRST: Top-Left (Live Stock Data) [0.34 -> 0.40]
  const p2StockOpacity = useTransform(smoothProgress, [0.34, 0.38, 0.64, 0.70], [0, 1, 1, 0]);
  const p2StockY = useTransform(smoothProgress, [0.34, 0.40, 0.64, 0.70], [25, 0, 0, -25]);
  const p2StockScale = useTransform(smoothProgress, [0.34, 0.39], [0.35, 1]);

  // 2. SECOND: Bottom-Right (Community Activity) [0.38 -> 0.44]
  const p2CommunityOpacity = useTransform(smoothProgress, [0.38, 0.42, 0.64, 0.70], [0, 1, 1, 0]);
  const p2CommunityY = useTransform(smoothProgress, [0.38, 0.44, 0.64, 0.70], [25, 0, 0, 25]);
  const p2CommunityScale = useTransform(smoothProgress, [0.38, 0.43], [0.35, 1]);

  // 3. THIRD: Top-Right (SEBI Verification) [0.42 -> 0.48]
  const p2SebiOpacity = useTransform(smoothProgress, [0.42, 0.46, 0.64, 0.70], [0, 1, 1, 0]);
  const p2SebiY = useTransform(smoothProgress, [0.42, 0.48, 0.64, 0.70], [25, 0, 0, -25]);
  const p2SebiScale = useTransform(smoothProgress, [0.42, 0.47], [0.35, 1]);

  // 4. FOURTH: Bottom-Left Upper (AI Risk Score) [0.46 -> 0.52]
  const p2RiskOpacity = useTransform(smoothProgress, [0.46, 0.50, 0.64, 0.70], [0, 1, 1, 0]);
  const p2RiskY = useTransform(smoothProgress, [0.46, 0.52, 0.64, 0.70], [25, 0, 0, 25]);
  const p2RiskScale = useTransform(smoothProgress, [0.46, 0.51], [0.35, 1]);

  // 5. FIFTH: Middle-Right (Scam Detection) [0.50 -> 0.56]
  const p2ScamOpacity = useTransform(smoothProgress, [0.50, 0.54, 0.64, 0.70], [0, 1, 1, 0]);
  const p2ScamY = useTransform(smoothProgress, [0.50, 0.56, 0.64, 0.70], [25, 0, 0, -25]);
  const p2ScamScale = useTransform(smoothProgress, [0.50, 0.55], [0.35, 1]);

  // 6. SIXTH: Bottom-Left Lower (Market Sentiment) [0.54 -> 0.60]
  const p2SentimentOpacity = useTransform(smoothProgress, [0.54, 0.58, 0.64, 0.70], [0, 1, 1, 0]);
  const p2SentimentY = useTransform(smoothProgress, [0.54, 0.60, 0.64, 0.70], [25, 0, 0, 25]);
  const p2SentimentScale = useTransform(smoothProgress, [0.54, 0.59], [0.35, 1]);

  // =========================================================================
  // PHASE 2 & 3 HEADLINE: COMPLETELY OUTSIDE THE BOX ON PURE WHITE BACKGROUND
  // =========================================================================
  const headline2Opacity = useTransform(smoothProgress, [0.30, 0.38, 1.0], [0, 1, 1]);
  // As user scrolls, the text moves down smoothly across the page canvas to meet upcoming section!
  const headline2Y = useTransform(smoothProgress, [0.30, 0.38, 0.56, 1.0], [25, 0, 0, 200]);

  return (
    <section ref={containerRef} className="relative bg-white text-black h-[380vh]">
      {/* Sticky Fullscreen Pinned Viewport */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* ========================================================================= */}
        {/* PHASE 1: DARK FOREST FRAMED CUT-CORNER CONTAINER (DISSOLVES AT PHASE 2)   */}
        {/* ========================================================================= */}
        <motion.div
          style={{ opacity: darkCardContainerOpacity }}
          className="absolute inset-0 flex items-center justify-center py-4 sm:py-6 px-4 sm:px-8 pointer-events-none z-10"
        >
          <div className="relative w-full h-full max-w-[80rem] max-h-[76vh] flex items-center justify-center pointer-events-auto">
            <CutCornerContainer
              cornerSizeDesktop={16}
              cornerSizeMobile={7}
              cornerBg="bg-white"
              className="size-full bg-forest text-white shadow-2xl relative flex items-center justify-center p-4 sm:p-5 md:p-6 overflow-hidden"
            >
              {/* Subtle background tech grid */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, #b2eb76 1px, transparent 0)",
                  backgroundSize: "32px 32px",
                }}
              />

              {/* 8 Phase 1 Popouts (Sequential One-by-One Alternating Radial Orbit) */}
              
              {/* 1. FIRST: Top (North - AI Score) */}
              <motion.div
                style={{ x: card1X, y: card1Y, scale: card1Scale, opacity: card1Opacity }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] sm:w-[175px] md:w-[185px] z-10 pointer-events-none"
              >
                <MarketSignalHudCard
                  label="AI SCORE"
                  value={
                    <span>
                      <ScrollNumber progress={smoothProgress} inputRange={[0.02, 0.08]} outputRange={[32, 82]} />
                      {" / 100 • BULLISH"}
                    </span>
                  }
                  variant="default"
                  hasSolidBorder={true}
                />
              </motion.div>

              {/* 2. SECOND: Below (South - Risk Score) */}
              <motion.div
                style={{ x: card2X, y: card2Y, scale: card2Scale, opacity: card2Opacity }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] sm:w-[175px] md:w-[185px] z-10 pointer-events-none"
              >
                <MarketSignalHudCard
                  label="RISK SCORE"
                  value={
                    <span>
                      <ScrollNumber progress={smoothProgress} inputRange={[0.05, 0.11]} outputRange={[64, 18]} />
                      {" / 100 • LOW RISK"}
                    </span>
                  }
                  variant="default"
                  hasSolidBorder={true}
                />
              </motion.div>

              {/* 3. THIRD: Top-Left (North-West - Live Price) */}
              <motion.div
                style={{ x: card3X, y: card3Y, scale: card3Scale, opacity: card3Opacity }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] sm:w-[175px] md:w-[185px] z-10 pointer-events-none"
              >
                <MarketSignalHudCard
                  label="LIVE PRICE"
                  value={
                    <span>
                      RELIANCE • ₹
                      <ScrollNumber progress={smoothProgress} inputRange={[0.08, 0.14]} outputRange={[1410.5, 1462.8]} decimals={2} />
                    </span>
                  }
                  variant="success"
                  hasSolidBorder={true}
                />
              </motion.div>

              {/* 4. FOURTH: Bottom-Right (South-East - Community) */}
              <motion.div
                style={{ x: card4X, y: card4Y, scale: card4Scale, opacity: card4Opacity }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[155px] sm:w-[170px] md:w-[180px] z-10 pointer-events-none"
              >
                <MarketSignalHudCard
                  label="COMMUNITY"
                  value={
                    <span>
                      <ScrollNumber progress={smoothProgress} inputRange={[0.11, 0.17]} outputRange={[420, 1284]} />
                      {" ACTIVE"}
                    </span>
                  }
                  variant="default"
                  hasSolidBorder={true}
                />
              </motion.div>

              {/* 5. FIFTH: Middle-Left (West - SEBI Status) */}
              <motion.div
                style={{ x: card5X, y: card5Y, scale: card5Scale, opacity: card5Opacity }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[155px] sm:w-[170px] md:w-[180px] z-10 pointer-events-none"
              >
                <MarketSignalHudCard
                  label="SEBI STATUS"
                  value="✓ VERIFIED"
                  variant="success"
                />
              </motion.div>

              {/* 6. SIXTH: Middle-Right (East - Scam Signal) */}
              <motion.div
                style={{ x: card6X, y: card6Y, scale: card6Scale, opacity: card6Opacity }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[155px] sm:w-[170px] md:w-[180px] z-10 pointer-events-none"
              >
                <MarketSignalHudCard
                  label="SCAM SIGNAL"
                  value={
                    <span>
                      ⚠ HIGH RISK (
                      <ScrollNumber progress={smoothProgress} inputRange={[0.17, 0.23]} outputRange={[45, 91]} />
                      %)
                    </span>
                  }
                  variant="alert"
                  hasSolidBorder={true}
                />
              </motion.div>

              {/* 7. SEVENTH: Top-Right (North-East - Market Index) */}
              <motion.div
                style={{ x: card7X, y: card7Y, scale: card7Scale, opacity: card7Opacity }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] sm:w-[175px] md:w-[185px] z-10 pointer-events-none"
              >
                <MarketSignalHudCard
                  label="MARKET INDEX"
                  value={
                    <span>
                      NIFTY 50 • +
                      <ScrollNumber progress={smoothProgress} inputRange={[0.20, 0.26]} outputRange={[0.28, 1.42]} decimals={2} />
                      %
                    </span>
                  }
                  variant="success"
                  hasSolidBorder={true}
                />
              </motion.div>

              {/* 8. EIGHTH: Bottom-Left (South-West - Scam Alert) */}
              <motion.div
                style={{ x: card8X, y: card8Y, scale: card8Scale, opacity: card8Opacity }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] sm:w-[175px] md:w-[185px] z-10 pointer-events-none"
              >
                <MarketSignalHudCard
                  label="SCAM ALERT"
                  value={
                    <span>
                      TELEGRAM • <ScrollNumber progress={smoothProgress} inputRange={[0.23, 0.29]} outputRange={[1, 14]} /> DETECTED
                    </span>
                  }
                  variant="alert"
                />
              </motion.div>

              {/* Phase 1 Centered Headline */}
              <motion.div
                style={{ opacity: headline1Opacity, y: headline1Y }}
                className="absolute inset-0 flex items-center justify-center z-20 px-4 sm:px-6 text-center pointer-events-none"
              >
                <h2 className="text-white font-medium leading-[1.22] tracking-[-0.03em] text-[1.3rem] sm:text-[1.6rem] md:text-[1.85rem] lg:text-[2.05rem] max-w-[460px] mx-auto drop-shadow-md text-center">
                  Investors make decisions every day,{" "}
                  <span className="text-lemongrass font-semibold block mt-1.5">
                    but the signals they need are scattered across the market.
                  </span>
                </h2>
              </motion.div>
            </CutCornerContainer>
          </div>
        </motion.div>


        {/* ========================================================================= */}
        {/* PHASE 2 & 3: FULL-WIDTH CLEAN WHITE CANVAS WITH BLUEPRINT GRID LINES       */}
        {/* ========================================================================= */}

        {/* Blueprint Grid (Expands to full screen width) */}
        <motion.div
          style={{ opacity: gridLinesOpacity }}
          className="absolute inset-0 z-20 pointer-events-none"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(180, 200, 175, 0.38) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(180, 200, 175, 0.38) 1px, transparent 1px)
              `,
              backgroundSize: "44px 44px",
            }}
          />
        </motion.div>

        {/* Phase 2 Blueprint Popout Cards (Sequential One-By-One Alternating Emergence - Fitted within single frame) */}
        <div className="absolute inset-0 z-30 pointer-events-none max-w-[70rem] mx-auto px-3 sm:px-6">
          
          {/* 1. FIRST: Top-Left (Live Stock Data) */}
          <motion.div
            style={{ opacity: p2StockOpacity, y: p2StockY, scale: p2StockScale }}
            className="absolute left-3 sm:left-6 md:left-8 top-[65px] sm:top-[75px] md:top-[85px] w-[170px] sm:w-[190px] md:w-[210px] pointer-events-auto"
          >
            <BlueprintCadCard
              label="Live Stock Data"
              lines={[
                <span key="1" className="text-black font-extrabold">RELIANCE</span>,
                <span key="2" className="text-[#14230b] font-bold">
                  ₹<ScrollNumber progress={smoothProgress} inputRange={[0.34, 0.40]} outputRange={[1418.5, 1462.8]} decimals={2} />
                </span>,
                <span key="3" className="text-[#3f7308] font-bold">
                  +<ScrollNumber progress={smoothProgress} inputRange={[0.34, 0.40]} outputRange={[0.65, 2.41]} decimals={2} />%
                </span>,
              ]}
              variant="success"
            />
          </motion.div>

          {/* 2. SECOND: Bottom-Right (Community Activity) */}
          <motion.div
            style={{ opacity: p2CommunityOpacity, y: p2CommunityY, scale: p2CommunityScale }}
            className="absolute right-3 sm:right-6 md:right-8 bottom-[60px] sm:bottom-[70px] md:bottom-[80px] w-[185px] sm:w-[205px] md:w-[225px] pointer-events-auto"
          >
            <BlueprintCadCard
              label="Community Activity"
              lines={[
                <span key="1" className="text-black font-extrabold">NIFTY 50</span>,
                <span key="2" className="text-black/90 font-bold">
                  <ScrollNumber progress={smoothProgress} inputRange={[0.38, 0.44]} outputRange={[350, 1284]} /> DISCUSSIONS
                </span>,
                <span key="3" className="text-[#3f7308] font-bold">
                  <ScrollNumber progress={smoothProgress} inputRange={[0.38, 0.44]} outputRange={[60, 342]} /> ACTIVE
                </span>,
              ]}
              variant="default"
            />
          </motion.div>

          {/* 3. THIRD: Top-Right (SEBI Verification) */}
          <motion.div
            style={{ opacity: p2SebiOpacity, y: p2SebiY, scale: p2SebiScale }}
            className="absolute right-3 sm:right-6 md:right-8 top-[65px] sm:top-[75px] md:top-[85px] w-[170px] sm:w-[190px] md:w-[210px] pointer-events-auto"
          >
            <BlueprintCadCard
              label="SEBI Verification"
              lines={[
                <span key="1" className="text-black font-extrabold">ADVISOR</span>,
                <span key="2" className="text-[#3f7308] font-bold">✓ VERIFIED</span>,
                <span key="3" className="text-black/80 font-semibold">
                  ACTIVE (ID: #<ScrollNumber progress={smoothProgress} inputRange={[0.42, 0.48]} outputRange={[1020, 8820]} />)
                </span>,
              ]}
              variant="success"
            />
          </motion.div>

          {/* 4. FOURTH: Bottom-Left Upper (AI Risk Score) */}
          <motion.div
            style={{ opacity: p2RiskOpacity, y: p2RiskY, scale: p2RiskScale }}
            className="absolute left-3 sm:left-6 md:left-8 bottom-[160px] sm:bottom-[175px] md:bottom-[190px] w-[170px] sm:w-[190px] md:w-[210px] pointer-events-auto"
          >
            <BlueprintCadCard
              label="AI Risk Score"
              lines={[
                <span key="1" className="text-black font-extrabold">RISK SCORE</span>,
                <span key="2" className="text-[#14230b] font-bold">
                  <ScrollNumber progress={smoothProgress} inputRange={[0.46, 0.52]} outputRange={[58, 18]} />/100
                </span>,
                <span key="3" className="text-[#3f7308] font-bold">LOW RISK</span>,
              ]}
              variant="default"
            />
          </motion.div>

          {/* 5. FIFTH: Middle-Right (Scam Detection) */}
          <motion.div
            style={{ opacity: p2ScamOpacity, y: p2ScamY, scale: p2ScamScale }}
            className="absolute right-3 sm:right-6 md:right-8 top-[175px] sm:top-[190px] md:top-[205px] w-[170px] sm:w-[190px] md:w-[210px] pointer-events-auto"
          >
            <BlueprintCadCard
              label="Scam Detection"
              lines={[
                <span key="1" className="text-black font-extrabold">TELEGRAM</span>,
                <span key="2" className="text-red-600 font-bold">⚠ HIGH RISK</span>,
                <span key="3" className="text-red-700 font-bold">
                  <ScrollNumber progress={smoothProgress} inputRange={[0.50, 0.56]} outputRange={[35, 91]} />/100
                </span>,
              ]}
              variant="alert"
            />
          </motion.div>

          {/* 6. SIXTH: Bottom-Left Lower (Market Sentiment) */}
          <motion.div
            style={{ opacity: p2SentimentOpacity, y: p2SentimentY, scale: p2SentimentScale }}
            className="absolute left-3 sm:left-6 md:left-8 bottom-[60px] sm:bottom-[70px] md:bottom-[80px] w-[170px] sm:w-[190px] md:w-[210px] pointer-events-auto"
          >
            <BlueprintCadCard
              label="Market Sentiment"
              lines={[
                <span key="1" className="text-black font-extrabold">NIFTY 50</span>,
                <span key="2" className="text-[#3f7308] font-bold">BULLISH</span>,
                <span key="3" className="text-[#3f7308] font-bold">
                  +<ScrollNumber progress={smoothProgress} inputRange={[0.54, 0.60]} outputRange={[0.25, 1.42]} decimals={2} />%
                </span>,
              ]}
              variant="success"
            />
          </motion.div>
        </div>


        {/* ========================================================================= */}
        {/* PHASE 2 & 3 HEADLINE: COMPLETELY OUTSIDE THE CARD BOX ON THE WHITE CANVAS */}
        {/* ========================================================================= */}
        <motion.div
          style={{
            opacity: headline2Opacity,
            y: headline2Y,
          }}
          className="absolute inset-0 flex items-center justify-center z-40 px-6 sm:px-12 text-center pointer-events-none"
        >
          <h2 className="text-[#090f05] font-bold leading-[1.12] tracking-[-0.03em] text-[1.55rem] sm:text-[2.05rem] md:text-[2.45rem] lg:text-[2.85rem] max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto text-center drop-shadow-xs">
            MarketShield brings clarity to modern investing in real time, connecting intelligence, protection, and community at every layer.
          </h2>
        </motion.div>

      </div>
    </section>
  );
};
