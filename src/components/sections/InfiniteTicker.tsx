"use client";

import React from "react";
import clsx from "clsx";

interface TickerItem {
  name: string;
  category?: string;
  badge?: string;
  isMetric?: boolean;
}

const TICKER_ITEMS: TickerItem[] = [
  { name: "FRAUD DETECTION", category: "AI-Powered Protection", badge: "Real-Time Analysis" },

  { name: "SEBI VERIFY", category: "Advisor Verification", badge: "Registration Check" },

  { name: "SCAM NETWORKS", category: "Threat Intelligence", badge: "Entity Mapping" },

  { name: "LIVE MARKETS", category: "Real-Time Market Data", badge: "Live Prices" },

  { name: "AI STOCKS", category: "Investment Intelligence", badge: "AI Analysis" },

  { name: "DEEPFAKE DETECTION", category: "Multimodal AI", badge: "Image · Video · Audio" },

  { name: "INVESTOR COMMUNITY", category: "Social Intelligence", badge: "Live Discussions" },

  { name: "SCAM DETECTOR", category: "AI Risk Analysis", badge: "Instant Risk Score" },

  { name: "MARKET INSIGHTS", category: "Stock Intelligence", badge: "Real-Time Signals" },

  { name: "GRIEVANCE ASSIST", category: "SEBI Support", badge: "AI-Guided Resolution" },

  { name: "RISK ENGINE", category: "Explainable AI", badge: "0–100 Risk Score" },

  { name: "FRAUD ALERTS", category: "Proactive Protection", badge: "Real-Time Alerts" },

  { name: "COMMUNITY REPORTS", category: "Crowdsourced Intelligence", badge: "User-Reported Scams" },

  { name: "MARKETSHIELD AI", category: "Investor Intelligence", badge: "One Unified Platform" },
];

export const InfiniteTicker: React.FC = () => {
  // Duplicate array 3 times to ensure infinite smooth seamless looping on any screen width
  const duplicatedItems = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="relative w-full overflow-hidden bg-white text-forest border-y border-forest/15 py-4 sm:py-5 select-none z-20">

      {/* Left and Right Subtle Fade Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

      {/* Infinite Seamless Scrolling Track */}
      <div className="flex w-max animate-ticker hover:[animation-play-state:paused] items-center">
        {duplicatedItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 sm:gap-4 px-3 sm:px-5 shrink-0 group cursor-default"
          >
            {/* Sage Green Pill (#f4faed) matching reference */}
            <div className="flex items-center gap-2.5 bg-[#f4faed] text-forest border border-forest/20 rounded-xl px-3.5 sm:px-4 py-2 shadow-xs transition-all duration-200 group-hover:bg-[#ebf6e2] group-hover:border-forest/40 group-hover:shadow-sm group-hover:scale-[1.03]">
              <span className="w-2 h-2 rounded-full bg-[#3f7308] group-hover:scale-125 transition-transform" />
              <span className="text-xs sm:text-[13px] font-mono font-bold tracking-wider text-forest">
                {item.name}
              </span>
              {item.badge && (
                <span className="text-[10px] sm:text-[11px] font-mono text-forest/80 font-medium bg-white/80 px-2 py-0.5 rounded border border-forest/15">
                  {item.badge}
                </span>
              )}
            </div>

            {/* Separator icon */}
            <span className="text-forest/30 text-xs select-none">✦</span>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes tickerLoop {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333333%);
          }
        }
        .animate-ticker {
          display: flex;
          width: max-content;
          animation: tickerLoop 30s linear infinite;
        }
      `}</style>
    </div>
  );
};
