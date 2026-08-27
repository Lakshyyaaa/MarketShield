"use client";

import React, { useState } from "react";
import { CutCornerContainer } from "../ui/CutCornerContainer";
import clsx from "clsx";

interface PartnerLogo {
  name: string;
  category: string;
  metric: string;
  symbol: string;
}

const PARTNERS: PartnerLogo[] = [
  { name: "Citizens Bank", category: "Top 15 US Bank", metric: "50M+ monthly enforcements", symbol: "🏛️ CITIZENS" },
  { name: "Cardless", category: "Cobranded Cards", metric: "35% faster onboarding", symbol: "💳 CARDLESS" },
  { name: "Cash App Pay", category: "Consumer Payments", metric: "99.9% clean categorization", symbol: "🟢 CASH APP" },
  { name: "Motive", category: "Fleet & Logistics", metric: "$30k avg fleet savings", symbol: "🚛 MOTIVE" },
  { name: "Bilt Rewards", category: "Loyalty & Real Estate", metric: "$5B+ neighborhood spend", symbol: "⚡ BILT" },
  { name: "Mercury", category: "Banking for Startups", metric: "200k+ business accounts", symbol: "🌊 MERCURY" },
  { name: "Coast", category: "Fleet Fuel Controls", metric: "<50ms real-time auth", symbol: "⚓ COAST" },
  { name: "Ramp", category: "Spend Management", metric: "Automated accounting sync", symbol: "📈 RAMP" },
  { name: "Brex", category: "Corporate Cards", metric: "Global merchant indexing", symbol: "🔶 BREX" },
  { name: "Lithic", category: "Card Issuing API", metric: "Sub-50ms webhooks", symbol: "💎 LITHIC" },
  { name: "Unit", category: "Banking-as-a-Service", metric: "100% verified geocoding", symbol: "🔷 UNIT" },
  { name: "Alloy", category: "Identity & Risk", metric: "Integrated fraud detection", symbol: "🛡️ ALLOY" },
  { name: "Modern Treasury", category: "Payment Operations", metric: "Direct ledger enrichment", symbol: "🏛️ MOD TREASURY" },
  { name: "Plaid", category: "Financial Infrastructure", metric: "Multi-rail resolution", symbol: "⚡ PLAID" },
];

export const LogoWall: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden bg-white text-black py-12 md:py-16 lg:py-20 border-b border-black/5">
      <div className="container-custom space-y-10 lg:space-y-12">
        {/* Section Eyebrow */}
        <p className="text-14px-eyebrow w-full text-center text-black/70 max-w-3xl mx-auto font-medium">
          Enriching billions of transactions for category-defining fintechs & Fortune 500 banks every month
        </p>

        {/* 14 Logo Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 lg:gap-5">
          {PARTNERS.map((partner, i) => (
            <div
              key={partner.name}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="relative group"
            >
              <div
                className={clsx(
                  "relative flex h-[72px] flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 cursor-default",
                  hoveredIdx === i
                    ? "bg-sage-1 border-forest/20 shadow-md scale-[1.03]"
                    : "bg-white border-black/8 hover:border-black/20"
                )}
              >
                <span className="text-xs font-mono font-bold tracking-wider text-forest/90 group-hover:text-forest transition-colors text-center truncate w-full">
                  {partner.symbol}
                </span>
                <span className="text-[10px] text-black/40 group-hover:text-forest/70 font-sans truncate w-full text-center mt-0.5">
                  {partner.category}
                </span>
              </div>

              {/* Hover Floating Insight Card */}
              {hoveredIdx === i && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none whitespace-nowrap">
                  <CutCornerContainer
                    cornerSizeDesktop={7}
                    className="bg-forest text-lemongrass text-[11px] font-mono py-1 px-2.5 shadow-xl border border-lemongrass/30"
                  >
                    {partner.metric}
                  </CutCornerContainer>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
