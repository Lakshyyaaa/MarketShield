# MarketShield 🛡️
> **Intelligent Financial Market Intelligence, SEBI Regulatory Grievance Resolution & Capital Market Fraud Defense System**

MarketShield is a full-stack financial intelligence platform designed for Indian capital market investors, traders, and regulatory compliance. It pairs real-time market telemetry with regulatory reasoning (RAG) and active fraud detection.

---

## ✨ Key Features

### 1. 🏛️ SEBI Statutory Grievance & Regulatory Intelligence (CRAG)
* **Autonomous Dispute Resolution**: Instant statutory routing, evidence checklists, and escalation playbooks for broker disputes, Demat discrepancies, unauthorised trading, and IPO allotment grievances.
* **Master Regulatory Playbooks**: Powered by SEBI Act 1992, PFUTP Regulations 2003, Stock Broker Regulations 1992, and IA/RA statutory frameworks.
* **Evaluation Benchmark**: Evaluated against gold-standard regulatory cases with benchmark accuracy scoring.

### 2. 📈 Live Market Telemetry & Technical Radar
* **Real-time Indices**: Live tracking for NIFTY 50, SENSEX, BANK NIFTY, NIFTY IT, and NIFTY MIDCAP with intra-day sparklines.
* **Interactive Charting & Indicators**: Technical analysis featuring Candlestick overlays, RSI (Relative Strength Index), MACD, Bollinger Bands, SMA 20/50/200, and volume profile telemetry.
* **Financial Health Matrix**: Valuation ratios (P/E, P/B, EPS, Beta), dividend yield, and 52-week high/low range metrics.

### 3. 🔍 Scam & Fraud Intelligence Engine (Checkify)
* **Real-time Impersonation Analysis**: Deep-scan analysis for suspicious Telegram/WhatsApp trading groups, fake tipster channels, and unverified SEBI claims.
* **Domain & Security Verification**: Live WHOIS analysis, TLS certificate validation, typosquatting detection for Indian brokerage platforms, and suspicious UPI payment pattern recognition.
* **Statutory Breach Explanations**: Instant plain-language legal citations highlighting violations of SEBI regulations.

### 4. 🔐 Authentication & Persistent Workspace
* **Authentication**: NextAuth.js with Google OAuth 2.0 and credentials providers.
* **Cloud Database**: Integrated with Supabase PostgreSQL for case logs, scan history, and user settings.

---

## 🛠️ Architecture & Tech Stack

```
MarketShield/
├── src/                      # Next.js 14 App Router Frontend (React 18, TypeScript, Tailwind CSS)
├── backend/                  # FastAPI Python Service (Market Telemetry, yfinance, Groq RAG Engine)
├── Master Data Source/       # SEBI Statutory Regulations, Semantic Chunks & Golden Benchmarks
├── public/                   # Static assets, branding, and imagery
└── supabase_schema.sql       # Database schema for Supabase integration
```

* **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide React, NextAuth.js
* **Backend**: FastAPI, Uvicorn, Python 3.12, yfinance, Pandas, Requests, Cryptography, RapidFuzz, Groq LLM API
* **Database**: Supabase (PostgreSQL)

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: v18+ or v20+
* **Python**: 3.10+
* **npm** or **yarn** / **pnpm**

---

### 1. Clone the Repository
```bash
git clone https://github.com/Lakshyyaaa/MarketShield.git
cd MarketShield
```

### 2. Configure Environment Variables
Copy the sample environment files:
```bash
# Frontend environment variables
cp .env.example .env.local

# Backend environment variables
cp backend/.env.example backend/.env
```
Fill in your credentials in `.env.local` and `backend/.env`.

---

### 3. Setup and Run Backend (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend will be accessible at `http://localhost:8000` (Swagger docs: `http://localhost:8000/docs`)*

---

### 4. Setup and Run Frontend (Next.js)
Open a new terminal tab:
```bash
npm install
npm run dev
```
*Frontend will be accessible at `http://localhost:3000`*

---

## 📜 License
This project is licensed under the MIT License.
