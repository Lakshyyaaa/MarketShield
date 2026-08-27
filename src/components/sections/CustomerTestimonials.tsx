"use client";

import React, { useState } from "react";
import { CutCornerContainer } from "../ui/CutCornerContainer";
import { Button } from "../ui/Button";
import { Quote, ArrowRight, ChevronLeft, ChevronRight, Building, Award } from "lucide-react";
import clsx from "clsx";

interface CaseStudy {
  id: string;
  company: string;
  logoText: string;
  storyTitle: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  stats: { prefix?: string; value: string; suffix?: string; description: string }[];
  themeClass: string;
  accentBadge: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "bilt",
    company: "Bilt Rewards",
    logoText: "⚡ BILT",
    storyTitle: "How Bilt Delivers Hyper-Localized Rewards with Transaction Enrichment",
    quote:
      "Market Shield's granular merchant data allows us to deliver new and innovative rewards on the more than $5 billion in neighborhood spend happening on our platform.",
    authorName: "Brandt Smallwood",
    authorTitle: "President, Bilt Rewards",
    stats: [
      {
        prefix: "$",
        value: "5",
        suffix: "B+",
        description: "rewarded by Bilt using Market Shield for accurate, hyper-local attribution",
      },
      {
        value: "45,000",
        suffix: "+",
        description: "Local businesses in Bilt's rewards network, accurately matched using Market Shield",
      },
    ],
    themeClass: "bg-[#2b2408] text-white border-amber-500/20",
    accentBadge: "text-amber-300 bg-amber-950/60 border-amber-400/30",
  },
  {
    id: "coast",
    company: "Coast Pay",
    logoText: "⚓ COAST",
    storyTitle: "How Coast Uses Real-Time Location Data to Control Fleet Card Spend",
    quote:
      "We needed real-time controls that didn't create false declines. Market Shield's merchant and location data lets us approve legitimate fuel purchases while blocking misuse, and helps save our customers tens of thousands of dollars.",
    authorName: "Daniel Simon",
    authorTitle: "Co-founder & CEO, Coast",
    stats: [
      {
        prefix: "$",
        value: "30,000",
        description: "in average annual savings reported by Coast customers with fleets of 10+ vehicles",
      },
      {
        prefix: "<",
        value: "50",
        suffix: "ms",
        description: "speed at which Market Shield returns precise latitude and longitude for each transaction",
      },
    ],
    themeClass: "bg-[#291708] text-white border-orange-500/20",
    accentBadge: "text-orange-300 bg-orange-950/60 border-orange-400/30",
  },
  {
    id: "mercury",
    company: "Mercury",
    logoText: "🌊 MERCURY",
    storyTitle: "How Mercury Scaled Financial Workflows with Automated Transaction Enrichment",
    quote:
      "When we can correctly identify the type of spend that’s happening at a company, we can set up rules to automatically categorize those transactions. This alone saves thousands of hours for our customers each month.",
    authorName: "Anish Bhayani",
    authorTitle: "Engineering Manager, Mercury",
    stats: [
      {
        prefix: "> ",
        value: "99",
        suffix: "%",
        description: "enrichment accuracy results in verified categorization for Mercury's 200,000+ customers",
      },
      {
        value: "1 in 3",
        description: "U.S. venture-backed startups rely on transaction data enriched by Market Shield",
      },
    ],
    themeClass: "bg-forest text-white border-forest-light",
    accentBadge: "text-lemongrass bg-forest-dark border-lemongrass/30",
  },
];

export const CustomerTestimonials: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const prevSlide = () => {
    setActiveIdx((prev) => (prev === 0 ? CASE_STUDIES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIdx((prev) => (prev === 1 ? 2 : (prev + 1) % CASE_STUDIES.length));
  };

  const study = CASE_STUDIES[activeIdx];

  return (
    <section id="customers" className="relative overflow-hidden bg-sage-1 text-black py-16 md:py-24 lg:py-32 border-b border-black/5">
      <div className="container-custom space-y-12">
        {/* Header & Slide Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div>
            <div className="text-11px-eyebrow-caps text-black/60 font-mono mb-2">
              [Case Studies &amp; Customer Proof]
            </div>
            <h2 className="text-40px-heading text-forest font-medium tracking-tight">
              Proven across payments and beyond
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="textLink" href="#contact">
              See all case studies
            </Button>
            <div className="flex items-center gap-1.5 ml-4">
              <button
                onClick={prevSlide}
                aria-label="Previous case study"
                className="w-10 h-10 rounded-full border border-black/10 bg-white hover:bg-black/5 flex items-center justify-center transition-colors text-black"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next case study"
                className="w-10 h-10 rounded-full border border-black/10 bg-white hover:bg-black/5 flex items-center justify-center transition-colors text-black"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CASE_STUDIES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActiveIdx(i)}
              className={clsx(
                "px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap",
                activeIdx === i
                  ? "bg-forest text-lemongrass shadow-sm"
                  : "bg-white text-black/70 hover:bg-white/80 border border-black/5"
              )}
            >
              {c.company}
            </button>
          ))}
        </div>

        {/* Featured Case Study Card with Cut Corners */}
        <CutCornerContainer
          cornerSizeDesktop={17}
          cornerSizeMobile={9}
          cornerBg="bg-sage-1"
          className={clsx("p-8 md:p-12 lg:p-14 shadow-2xl transition-all duration-300", study.themeClass)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Quote & Speaker */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold font-mono tracking-wider">{study.logoText}</span>
                <span className={clsx("text-[11px] font-mono px-2.5 py-0.5 rounded-full border", study.accentBadge)}>
                  Verified Customer Story
                </span>
              </div>

              <blockquote className="text-xl sm:text-2xl md:text-3xl font-display font-medium leading-snug tracking-tight">
                &ldquo;{study.quote}&rdquo;
              </blockquote>

              <div className="pt-2">
                <div className="font-bold text-base text-white">{study.authorName}</div>
                <div className="text-xs sm:text-sm text-white/70 font-sans mt-0.5">{study.authorTitle}</div>
              </div>
            </div>

            {/* Right: Key Stats */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-black/30 rounded-2xl p-6 border border-white/10 space-y-6">
                <div className="text-xs font-mono text-white/60 uppercase tracking-wider border-b border-white/10 pb-2 flex items-center justify-between">
                  <span>Impact Metrics</span>
                  <Award className="w-4 h-4 text-lemongrass" />
                </div>

                {study.stats.map((stat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="text-40px-heading font-display font-bold text-lemongrass">
                      {stat.prefix}
                      {stat.value}
                      {stat.suffix}
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed font-sans">{stat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CutCornerContainer>
      </div>
    </section>
  );
};
