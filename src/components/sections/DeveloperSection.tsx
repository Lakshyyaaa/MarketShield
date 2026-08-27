"use client";

import React, { useState } from "react";
import { CutCornerContainer } from "../ui/CutCornerContainer";
import { Button } from "../ui/Button";
import {
  Code2,
  Copy,
  Check,
  Play,
  Terminal,
  FileCode,
  Zap,
  CheckCircle2,
} from "lucide-react";
import clsx from "clsx";

export const DeveloperSection: React.FC = () => {
  const [activeLang, setActiveLang] = useState<"curl" | "typescript" | "python" | "go">("typescript");
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [lastLatency, setLastLatency] = useState("18ms");

  const CODE_SNIPPETS = {
    curl: `curl -X POST https://api.marketshield.ai/v1/enrich \\
  -H "Authorization: Bearer ms_live_94821a..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "raw_description": "SQ *BLUE BOTTLE COF #401 SFO CA 94103",
    "amount": 6.75,
    "currency": "USD",
    "mcc": "5814"
  }'`,
    typescript: `import { MarketShield } from "@marketshield/sdk";

const marketShield = new MarketShield({ apiKey: process.env.MARKET_SHIELD_API_KEY });

const enrichment = await marketShield.transactions.enrich({
  rawDescription: "SQ *BLUE BOTTLE COF #401 SFO CA 94103",
  amount: 6.75,
  currency: "USD",
  country: "US"
});

console.log(enrichment.merchant.canonicalName); // "Blue Bottle Coffee"
console.log(enrichment.merchant.coordinates);   // { lat: 37.7824, lng: -122.4071 }`,
    python: `from marketshield import MarketShieldClient

client = MarketShieldClient(api_key="ms_live_94821a...")

record = client.transactions.enrich(
    raw_description="SQ *BLUE BOTTLE COF #401 SFO CA 94103",
    amount=6.75,
    currency="USD"
)

print(record.merchant.name)         # "Blue Bottle Coffee"
print(record.risk.confidence_score) # 0.999`,
    go: `package main

import (
  "context"
  "fmt"
  "github.com/marketshield/marketshield-go"
)

func main() {
  client := marketshield.NewClient("ms_live_94821a...")
  res, _ := client.Enrich(context.Background(), &marketshield.EnrichParams{
    RawDescription: "SQ *BLUE BOTTLE COF #401 SFO CA 94103",
    Amount:         6.75,
  })
  fmt.Println(res.Merchant.Name) // Blue Bottle Coffee
}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestRun = () => {
    setIsRunning(true);
    const ms = Math.floor(Math.random() * 12) + 14;
    setTimeout(() => {
      setLastLatency(`${ms}ms`);
      setIsRunning(false);
    }, 400);
  };

  return (
    <section id="developers" className="relative overflow-hidden bg-white text-black py-20 md:py-28 lg:py-36 border-b border-black/5">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left Column: Text */}
          <div className="w-full lg:w-1/2 max-w-xl text-left">
            <div className="inline-flex items-center gap-x-2 mb-3.5">
              <span className="text-11px-eyebrow-caps text-black/70 font-mono">
                [Developers]
              </span>
            </div>

            <p className="text-28px-heading text-forest font-medium leading-snug">
              Integrate Market Shield’s API in minutes. No complex setup, no custom configuration — just high-performance enrichment that scales automatically.
            </p>

            <div className="mt-6 sm:mt-8">
              <Button variant="textLink" href="#contact">
                Explore our docs
              </Button>
            </div>

            {/* Quick Developer Checklist */}
            <div className="mt-10 space-y-2.5 text-xs text-black/70 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-moss" />
                <span>Client SDKs for Node.js, Python, Go, Java, and Ruby</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-moss" />
                <span>Webhooks with HMAC signature verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-moss" />
                <span>Deterministic sandbox testing fixtures</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive API Console with Cut Corners */}
          <div className="w-full lg:w-1/2 max-w-2xl">
            <CutCornerContainer
              cornerSizeDesktop={13}
              cornerSizeMobile={7}
              cornerBg="bg-white"
              className="bg-[#090f05] text-white p-6 shadow-2xl border border-white/10 rounded-2xl relative overflow-hidden font-mono text-xs"
            >
              {/* Console Top Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 mb-4">
                {/* Language Tabs */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-md">
                  {(["typescript", "curl", "python", "go"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={clsx(
                        "px-2.5 py-1 rounded transition-colors uppercase text-[10px] font-bold",
                        activeLang === lang
                          ? "bg-lemongrass text-forest shadow"
                          : "text-white/60 hover:text-white"
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTestRun}
                    disabled={isRunning}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-forest border border-lemongrass/40 text-lemongrass text-[11px] font-bold hover:bg-forest-light transition-all"
                  >
                    <Play className={clsx("w-3 h-3", isRunning && "animate-spin")} />
                    <span>{isRunning ? "Testing..." : "Send Request"}</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    aria-label="Copy snippet"
                    className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-lemongrass" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="p-4 bg-black/60 rounded-lg border border-white/5 overflow-x-auto text-[11px] text-emerald-300 leading-relaxed max-h-56">
                <pre>{CODE_SNIPPETS[activeLang]}</pre>
              </div>

              {/* Live Mock Response Box */}
              <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-white/50">
                  <span className="text-lemongrass flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Response (200 OK)
                  </span>
                  <span>Latency: <strong className="text-white font-bold">{lastLatency}</strong></span>
                </div>

                <div className="p-3 bg-black/80 rounded border border-lemongrass/20 text-[10px] text-white/80 leading-tight">
                  <pre className="overflow-x-auto text-emerald-400">
{`{
  "merchant": {
    "name": "Blue Bottle Coffee",
    "category": "Food & Beverage",
    "parent_entity": "Nestlé S.A.",
    "confidence_score": 0.999
  },
  "location": {
    "address": "66 Mint St, San Francisco, CA 94103",
    "lat": 37.7824,
    "lng": -122.4071
  }
}`}
                  </pre>
                </div>
              </div>
            </CutCornerContainer>
          </div>
        </div>
      </div>
    </section>
  );
};
