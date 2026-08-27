"use client";

import React, { useState } from "react";
import Image from "next/image";
import { VerticalRuler } from "../ui/VerticalRuler";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer id="contact" className="relative overflow-hidden bg-forest text-white">
      {/* Vertical Tick Rulers in dark forest footer */}
      <VerticalRuler color="bg-sage-5" />

      {/* MAIN FOOTER NAVIGATION */}
      <div className="container-custom py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-2 space-y-6">
            <a href="#" className="inline-block group">
              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded-lg bg-white/95 shadow-sm transition-transform duration-200 group-hover:scale-105">
                  <Image
                    src="/Logo_transparent.webp"
                    alt="MarketShield"
                    width={36}
                    height={40}
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <span className="text-xl font-bold tracking-tight text-white uppercase font-sans">
                  Market <span className="text-lemongrass">Shield</span>
                </span>
              </div>
            </a>

            <p className="text-sm text-white/70 max-w-sm leading-relaxed">
              The AI-powered investor protection platform turning market data, community intelligence, and financial signals into actionable insight.
            </p>

            {/* Newsletter form */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-mono text-white/60">Stay ahead of market risks</div>
              <form onSubmit={handleSubscribe} className="flex max-w-sm gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-white/10 border border-white/15 rounded-lg px-3.5 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-lemongrass flex-1 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-lemongrass text-forest font-semibold text-xs hover:bg-lemongrass-hover transition-colors shrink-0"
                >
                  {subscribed ? "Subscribed!" : "Subscribe"}
                </button>
              </form>
            </div>
          </div>

          {/* Column 1 — Platform */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide">Platform</h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li><a href="#pipeline" className="hover:text-lemongrass transition-colors">Market Intelligence</a></li>
              <li><a href="#pipeline" className="hover:text-lemongrass transition-colors">AI Analysis</a></li>
              <li><a href="#pipeline" className="hover:text-lemongrass transition-colors">Fraud Detection</a></li>
              <li><a href="#visualizer" className="hover:text-lemongrass transition-colors">Risk Scoring</a></li>
              <li><a href="#visualizer" className="hover:text-lemongrass transition-colors">Market Data</a></li>
            </ul>
          </div>

          {/* Column 2 — Protect */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide">Protect</h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li><a href="#pipeline" className="hover:text-lemongrass transition-colors">Advisor Verification</a></li>
              <li><a href="#visualizer" className="hover:text-lemongrass transition-colors">Scam Detection</a></li>
              <li><a href="#architecture" className="hover:text-lemongrass transition-colors">Deepfake Detection</a></li>
              <li><a href="#visualizer" className="hover:text-lemongrass transition-colors">Community Grievances</a></li>
              <li><a href="#architecture" className="hover:text-lemongrass transition-colors">Investor Protection</a></li>
            </ul>
          </div>

          {/* Column 3 — Resolve */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide">Resolve</h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li><a href="#pipeline" className="hover:text-lemongrass transition-colors">AI Assistant</a></li>
              <li><a href="#architecture" className="hover:text-lemongrass transition-colors">Grievance Support</a></li>
              <li><a href="#contact" className="hover:text-lemongrass transition-colors">Case Tracking</a></li>
              <li><a href="#pipeline" className="hover:text-lemongrass transition-colors">Evidence Analysis</a></li>
              <li><a href="#architecture" className="hover:text-lemongrass transition-colors">Resolution Guidance</a></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM STATUS & LEGAL BAR */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/50">
          {/* Status badge */}
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MarketShield Platform • Investor Intelligence &amp; Protection</span>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center gap-6">
            <a href="#contact" className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="text-white/20">·</span>
            <a href="#contact" className="hover:text-white transition-colors">Terms of Service</a>
            <span className="text-white/20">·</span>
            <a href="#contact" className="hover:text-white transition-colors">Disclaimer</a>
          </div>

          {/* Copyright */}
          <div>© 2026 Market Shield. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};
