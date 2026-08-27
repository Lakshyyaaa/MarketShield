"use client";

import React, { useState } from "react";
import { CutCornerContainer } from "../ui/CutCornerContainer";
import { Button } from "../ui/Button";
import {
  Heart,
  Tag,
  Percent,
  Layers,
  Store,
  Building,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import clsx from "clsx";

export const RewardsAttributionFeature: React.FC = () => {
  const [selectedOffer, setSelectedOffer] = useState<number>(0);

  const OFFERS = [
    {
      title: "5% Local Dining & Cafes",
      merchant: "Sweetgreen • Broadway NYC",
      parent: "Sweetgreen, Inc.",
      category: "Food & Beverage",
      cashback: "$1.40 Back",
      amount: "$28.00",
      status: "Instant Reward Match",
    },
    {
      title: "3% Clean Energy EV Charging",
      merchant: "Tesla Supercharger • Kettleman City",
      parent: "Tesla, Inc.",
      category: "Automotive & Energy",
      cashback: "$0.72 Back",
      amount: "$24.00",
      status: "Direct Attribution",
    },
    {
      title: "10% Boutique Apparel Partner",
      merchant: "Everlane • Valencia St SF",
      parent: "Everlane, Inc.",
      category: "Apparel & Retail",
      cashback: "$12.50 Back",
      amount: "$125.00",
      status: "Partner Campaign Verified",
    },
  ];

  const current = OFFERS[selectedOffer];

  return (
    <section id="rewards" className="relative overflow-hidden bg-white text-black py-20 md:py-28 lg:py-36 border-b border-black/5">
      <div className="container-custom space-y-12 sm:space-y-16">
        {/* Centered Heading Block */}
        <div className="flex w-full flex-col items-center text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-x-2.5 mb-4 text-forest">
            <div className="w-7 h-7 rounded bg-forest/5 flex items-center justify-center text-forest">
              <Heart className="w-4 h-4 text-forest" />
            </div>
            <span className="text-13px-eyebrow-caps opacity-80 font-mono">
              Rewards &amp; Attribution
            </span>
          </div>

          <h2 className="text-40px-heading text-forest font-medium tracking-tight">
            Connect every purchase to the right reward
          </h2>

          <div className="mt-3 sm:mt-4 text-black/80 text-base sm:text-lg leading-relaxed font-normal">
            <p>
              Give marketing and product teams true merchant and location-level clarity, enabling hyper-targeted, high-engagement reward programs without messy data or guesswork.
            </p>
          </div>

          <div className="mt-6 sm:mt-7">
            <Button variant="whiteWithGrayBorder" size="medium" href="#contact">
              Learn more
            </Button>
          </div>
        </div>

        {/* Interactive Multi-Tier Merchant Graph Showcase */}
        <div className="max-w-4xl mx-auto">
          <CutCornerContainer
            cornerSizeDesktop={17}
            cornerSizeMobile={9}
            cornerBg="bg-white"
            className="bg-sage-1 border border-black/10 p-6 sm:p-8 shadow-xl"
          >
            {/* Offer Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4 mb-6">
              <div className="text-xs font-mono text-forest font-semibold uppercase flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-moss" />
                Select Campaign Attribution Scenario:
              </div>
              <div className="flex items-center gap-2">
                {OFFERS.map((offer, idx) => (
                  <button
                    key={offer.title}
                    onClick={() => setSelectedOffer(idx)}
                    className={clsx(
                      "px-3 py-1 text-xs font-mono rounded-md transition-all",
                      selectedOffer === idx
                        ? "bg-forest text-lemongrass font-bold shadow-sm"
                        : "bg-white text-black/70 hover:bg-white/80 border border-black/5"
                    )}
                  >
                    Campaign {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Hierarchy Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Level 1: Enterprise Parent */}
              <div className="bg-white p-5 rounded-xl border border-black/10 shadow-sm space-y-2">
                <div className="text-[11px] font-mono text-black/50 uppercase flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-forest" />
                  1. Ultimate Parent
                </div>
                <div className="text-base font-bold text-forest">{current.parent}</div>
                <div className="text-xs text-black/60 font-mono">Entity ID: #ENT-84920</div>
                <div className="pt-2 text-xs text-moss font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Corporate Tree Verified
                </div>
              </div>

              {/* Level 2: Sub-brand / Storefront */}
              <div className="bg-white p-5 rounded-xl border border-black/10 shadow-sm space-y-2">
                <div className="text-[11px] font-mono text-black/50 uppercase flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-forest" />
                  2. Local Store Location
                </div>
                <div className="text-base font-bold text-forest">{current.merchant}</div>
                <div className="text-xs text-black/60 font-mono">Category: {current.category}</div>
                <div className="pt-2 text-xs text-forest font-medium">
                  Geofence: <span className="font-semibold text-moss">Within 15ft Radius</span>
                </div>
              </div>

              {/* Level 3: Reward Execution */}
              <div className="bg-forest text-white p-5 rounded-xl border border-forest-light shadow-md space-y-2">
                <div className="text-[11px] font-mono text-lemongrass uppercase flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-lemongrass" />
                  3. Dynamic Reward Trigger
                </div>
                <div className="text-xl font-bold text-lemongrass">{current.cashback}</div>
                <div className="text-xs text-white/80">
                  {current.title} on {current.amount} purchase
                </div>
                <div className="pt-1 text-xs text-lemongrass/90 font-mono font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lemongrass" />
                  {current.status}
                </div>
              </div>
            </div>

            {/* Bottom Insight Footer */}
            <div className="mt-6 pt-4 border-t border-black/10 flex flex-wrap items-center justify-between text-xs text-black/60 font-mono">
              <span>99.9% Attribution Precision across 45,000+ brand programs</span>
              <span className="text-forest font-semibold">Zero Fraud Attribution Leakage</span>
            </div>
          </CutCornerContainer>
        </div>
      </div>
    </section>
  );
};
