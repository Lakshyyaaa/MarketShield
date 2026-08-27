"use client";

import React, { useState } from "react";
import { CutCornerContainer } from "../ui/CutCornerContainer";
import { Button } from "../ui/Button";
import { StatBadge } from "../ui/StatBadge";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Zap,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import clsx from "clsx";

export const RiskAuthFeature: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<"legit" | "fraud">("legit");

  return (
    <section id="risk-auth" className="relative overflow-hidden bg-white text-black py-20 md:py-28 lg:py-36 border-b border-black/5">
      <div className="container-custom">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left Column: Text & Stat Badge */}
          <div className="w-full lg:w-1/2 max-w-xl text-left">
            <div className="inline-flex items-center gap-x-2.5 mb-4 text-forest">
              <div className="w-7 h-7 rounded bg-forest/5 flex items-center justify-center text-forest">
                <Lock className="w-4 h-4" />
              </div>
              <span className="text-13px-eyebrow-caps opacity-80 font-mono">
                Risk &amp; Authorization
              </span>
            </div>

            <h2 className="text-40px-heading text-forest tracking-tight font-medium">
              Make every authorization smarter
            </h2>

            <div className="mt-4 text-black/80 text-base sm:text-lg leading-relaxed">
              <p>
                Return enriched merchant and location data in under 50 milliseconds — helping risk engines make faster, more accurate authorization decisions and eliminate false declines.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Button variant="whiteWithGrayBorder" size="medium" href="#contact">
                Learn more
              </Button>
            </div>

            {/* P99 Latency Cut-Corner Stat Badge */}
            <div className="mt-12">
              <StatBadge
                prefix="<"
                value={50}
                suffix="ms"
                description="P99 enrichment latency"
                bg="bg-sage-1"
                cornerBg="bg-white"
              />
            </div>
          </div>

          {/* Right Column: Interactive Real-Time Decisioning Mock Visual */}
          <div className="w-full lg:w-1/2 max-w-2xl">
            <CutCornerContainer
              cornerSizeDesktop={17}
              cornerSizeMobile={9}
              cornerBg="bg-white"
              className="bg-forest text-white p-6 sm:p-8 shadow-2xl border border-forest-light relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-lemongrass animate-ping" />
                  <span className="text-xs font-mono text-lemongrass font-semibold uppercase tracking-wider">
                    Sub-50ms Auth Decision Engine
                  </span>
                </div>

                {/* Scenario Toggle */}
                <div className="flex items-center bg-black/40 p-1 rounded-lg border border-white/10 text-xs font-mono">
                  <button
                    onClick={() => setActiveScenario("legit")}
                    className={clsx(
                      "px-2.5 py-1 rounded transition-colors",
                      activeScenario === "legit"
                        ? "bg-lemongrass text-forest font-bold"
                        : "text-white/60 hover:text-white"
                    )}
                  >
                    Legitimate Auth
                  </button>
                  <button
                    onClick={() => setActiveScenario("fraud")}
                    className={clsx(
                      "px-2.5 py-1 rounded transition-colors",
                      activeScenario === "fraud"
                        ? "bg-red-500 text-white font-bold"
                        : "text-white/60 hover:text-white"
                    )}
                  >
                    Velocity Anomaly
                  </button>
                </div>
              </div>

              {/* Transaction Stream Item */}
              <div className="bg-[#090f05] rounded-xl p-5 border border-white/10 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[11px] font-mono text-white/50">CARD AUTH REQUEST (VISA DUAL-MESSAGE)</div>
                    <div className="text-base font-bold text-white mt-0.5">
                      {activeScenario === "legit" ? "APPLE STORE #R102 • 5TH AVE NYC" : "SUSPICIOUS ATM WITHDRAWAL #981"}
                    </div>
                    <div className="text-xs text-white/70 mt-0.5">
                      Card ending in •••• 4910 • $1,299.00 USD
                    </div>
                  </div>

                  {activeScenario === "legit" ? (
                    <span className="px-3 py-1 bg-lemongrass/20 text-lemongrass border border-lemongrass/40 text-xs font-mono font-bold rounded-full flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      APPROVE (42ms)
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-mono font-bold rounded-full flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      BLOCK / DECLINE
                    </span>
                  )}
                </div>

                {/* Sub-50ms Latency Stage Breakdown */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="flex justify-between text-xs font-mono text-white/70">
                    <span>Enrichment Breakdown:</span>
                    <span className="text-lemongrass font-bold">Total: {activeScenario === "legit" ? "42ms" : "38ms"}</span>
                  </div>

                  {/* Latency Bars */}
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between bg-white/5 p-2 rounded">
                      <span className="text-white/80">1. Merchant Identity Resolution</span>
                      <span className="text-lemongrass">12ms (99.9% Match)</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 p-2 rounded">
                      <span className="text-white/80">2. Real-time Geocoding & Terminal Mapping</span>
                      <span className="text-lemongrass">16ms (Exact Radius)</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 p-2 rounded">
                      <span className="text-white/80">3. Behavior & Risk Model Scoring</span>
                      <span className="text-lemongrass">14ms (Score: {activeScenario === "legit" ? "0.02" : "0.94"})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Assurance Note */}
              <div className="mt-4 flex items-center justify-between text-xs text-white/60 font-mono">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-lemongrass" />
                  Zero False-Decline Latency Penalty
                </span>
                <span>ISO 8583 Compliant</span>
              </div>
            </CutCornerContainer>
          </div>
        </div>
      </div>
    </section>
  );
};
