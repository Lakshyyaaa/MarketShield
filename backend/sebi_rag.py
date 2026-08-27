import os
import glob
import json
import re
import math
import urllib.request
from collections import Counter, defaultdict
from typing import List, Dict, Any, Optional

# Base directory for Master Data Source (Flexible for standalone and nested layouts)
candidate_dirs = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "Master Data Source")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Master Data Source")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "data"))
]
BASE_DIR = next((d for d in candidate_dirs if os.path.exists(d)), candidate_dirs[1])

def load_master_data():
    chunks = []
    chunk_dir = os.path.join(BASE_DIR, '05_Semantic_Chunks_RAG_Ready')
    chunk_files = sorted(glob.glob(os.path.join(chunk_dir, '*.md')))
    for filepath in chunk_files:
        filename = os.path.basename(filepath)
        with open(filepath, 'r', encoding='utf-8') as f:
            chunks.append({'chunk_id': filename.replace('.md', ''), 'content': f.read()})
            
    authorities = []
    auth_path = os.path.join(BASE_DIR, '03_Playbooks_and_Jurisdiction', 'authorities.json')
    if os.path.exists(auth_path):
        with open(auth_path, 'r', encoding='utf-8') as f:
            authorities = json.load(f).get('authorities', [])
            
    playbooks = []
    pb_path = os.path.join(BASE_DIR, '03_Playbooks_and_Jurisdiction', 'retail_grievance_playbooks.json')
    if os.path.exists(pb_path):
        with open(pb_path, 'r', encoding='utf-8') as f:
            playbooks = json.load(f).get('playbooks', [])
            
    benchmark = []
    bench_path = os.path.join(BASE_DIR, '06_Evaluation_Benchmark', 'golden_benchmark_50.jsonl')
    if os.path.exists(bench_path):
        with open(bench_path, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip():
                    benchmark.append(json.loads(line))
                    
    return chunks, authorities, playbooks, benchmark


class NativeHybridRetriever:
    def __init__(self, chunks: List[Dict[str, Any]]):
        self.chunks = chunks
        self.doc_count = len(chunks)
        self.df = defaultdict(int)
        self.doc_tfs = []
        self.doc_norms = []
        
        for chunk in chunks:
            tokens = self._tokenize(chunk['content'])
            tf = Counter(tokens)
            self.doc_tfs.append(tf)
            for token in tf.keys():
                self.df[token] += 1
                
        self.idf = {}
        for token, freq in self.df.items():
            self.idf[token] = math.log((self.doc_count + 1) / (freq + 1)) + 1.0
            
        for tf in self.doc_tfs:
            norm_sq = sum((count * self.idf[t]) ** 2 for t, count in tf.items())
            self.doc_norms.append(math.sqrt(norm_sq) if norm_sq > 0 else 1.0)
            
    def _tokenize(self, text: str) -> List[str]:
        return re.findall(r'\b[a-zA-Z0-9_-]{2,}\b', text.lower())
        
    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        q_tokens = self._tokenize(query)
        q_tf = Counter(q_tokens)
        q_vec = {t: count * self.idf.get(t, 0.0) for t, count in q_tf.items() if t in self.idf}
        q_norm = math.sqrt(sum(v ** 2 for v in q_vec.values()))
        if q_norm == 0:
            return []
            
        scores = []
        for idx, tf in enumerate(self.doc_tfs):
            dot_product = sum(q_vec[t] * (tf[t] * self.idf[t]) for t in q_vec if t in tf)
            sim = dot_product / (q_norm * self.doc_norms[idx])
            scores.append((idx, sim))
            
        scores.sort(key=lambda x: x[1], reverse=True)
        results = []
        for idx, score in scores[:top_k]:
            results.append({
                'chunk_id': self.chunks[idx]['chunk_id'],
                'score': float(score),
                'content': self.chunks[idx]['content']
            })
        return results


# =============================================================================
# STATUTORY COMPLIANCE PLAYBOOKS & REGULATORY REPOSITORY (FROM MASTER DATA SOURCE)
# =============================================================================
STATUTORY_DOSSIERS = {
    "physical_share_demat": {
        "category": "Physical Securities & Folio Operations",
        "severity": "MEDIUM",
        "severity_reason": "Standard asset conversion procedure; no immediate deadline forfeiture, but requires strict RTA documentation.",
        "authority": "SEBI / Registered Registrar and Share Transfer Agents (RTAs) & Depositories (NSDL/CDSL)",
        "portal": "Company RTA Portal & Depository Participant (DP) Portal",
        "summary": "Conversion of physical share certificates into electronic demat holdings via SEBI standardized Form ISR-1 and Form ISR-4.",
        "evidence_checklist": [
            "Original physical share certificates (undamaged, verifying folio, distinct numbers, and certificate numbers)",
            "Self-attested copy of PAN Card of all registered holders",
            "Proof of Address (Aadhaar / Passport / Voter ID) self-attested",
            "Cancelled Cheque leaf with pre-printed account holder name (or Bank Attested Passbook with IFSC)",
            "Client Master List (CML) of the active Demat account issued by Depository Participant (Zerodha/NSDL/CDSL) with DP seal",
            "Demat Request Form (DRF) duly filled and signed by all registered holders exactly as per RTA records"
        ],
        "resolution_dossier": [
            "Step 1: KYC Updation via Form ISR-1 — If PAN, bank account, email, mobile, or address are not registered with the RTA, complete and submit Form ISR-1 to the company's RTA.",
            "Step 2: Signature Confirmation (if variance) — If signature differs from RTA records, submit Form ISR-2 attested by the branch manager of your bank along with original cancelled cheque.",
            "Step 3: Execution of Form ISR-4 & DRF — Submit Form ISR-4 (Request for Issue of Letter of Confirmation) along with the original share certificates, Demat Request Form (DRF), and Client Master List (CML) to your Depository Participant (DP / Zerodha).",
            "Step 4: RTA Verification & LOC Issuance — The DP lodges the electronic demat request and dispatches physical certificates to the RTA. The RTA verifies documents within 30 calendar days and issues a Letter of Confirmation (LOC).",
            "Step 5: Electronic Demat Credit — The LOC is valid for 120 calendar days. The DP verifies the LOC and facilitates direct electronic credit of shares into your Zerodha demat account."
        ],
        "timelines": "RTA processing: 30 days; LOC Demat credit validity: 120 calendar days; Post-120 days uncredited shares are moved to Issuer Suspense Escrow Demat Account.",
        "escalation_path": "RTA -> Company Secretarial Team -> SEBI SCORES 2.0 (scores.sebi.gov.in) -> SMART ODR (smartodr.in)",
        "citations": [
            "SEBI Master Circular for Registrars to an Issue and Share Transfer Agents (SEBI/HO/MIRSD/POD-1/P/CIR/2024/37)",
            "SEBI Circular SEBI/HO/MIRSD/MIRSD_RTAMB/P/CIR/2022/8 (Issuance of Securities in Dematerialized form in case of Investor Service Requests)",
            "SEBI Circular SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2023/37 (Mandatory Furnishing of PAN, KYC Details and Nomination by Holders of Physical Securities)"
        ]
    },
    "share_transmission_no_nominee": {
        "category": "Physical Securities & Folio Operations",
        "severity": "HIGH",
        "severity_reason": "Asset transfer upon demise of sole holder without nomination; involves estate succession and statutory threshold limits.",
        "authority": "SEBI / Company RTA & Depository Participant",
        "portal": "RTA Transmission Desk / SCORES 2.0",
        "summary": "Transmission of physical/demat securities in favor of legal heirs where the deceased sole holder left no registered nomination.",
        "evidence_checklist": [
            "Original or notarized copy of the Death Certificate issued by the competent municipal/civil authority",
            "Form ISR-5 (Request for Transmission of Securities by Legal Heirs)",
            "Self-attested PAN and Address proof of all legal heir(s)",
            "Form ISR-1 (KYC registration) & Form ISR-2 (Bank attestation) for the claiming legal heir",
            "Client Master List (CML) of the legal heir's active demat account",
            "For holdings <= Rs 5 Lakh (Physical) or <= Rs 15 Lakh (Demat): Notarized Indemnity Bond (Annexure-D) + Affidavit of legal heirship (Annexure-E) + NOC from non-claiming legal heirs (Annexure-C)",
            "For holdings > Rs 5 Lakh (Physical) or > Rs 15 Lakh (Demat): Court-issued Succession Certificate, Probated Will, or Letters of Administration"
        ],
        "resolution_dossier": [
            "Step 1: Ascertain Portfolio Market Valuation — Calculate market value of the shares as on the application date to determine if it falls under the simplified threshold (<= Rs 5 Lakh physical, <= Rs 15 Lakh demat) or requires court succession documents.",
            "Step 2: Prepare Form ISR-5 and Statutory Annexures — Complete Form ISR-5. Execute the Indemnity Bond on non-judicial stamp paper and execute notarized affidavits / NOCs from all surviving legal heirs.",
            "Step 3: Dossier Submission to RTA — Dispatch the complete transmission dossier along with original physical share certificates (or demat statement) to the Company's RTA via speed post.",
            "Step 4: RTA Processing & Letter of Confirmation (LOC) — The RTA is mandated to process complete transmission requests within 21 to 30 calendar days and issue a Letter of Confirmation (LOC).",
            "Step 5: Credit to Demat Account — The legal heir submits the LOC along with a Demat Request Form (DRF) to their Depository Participant within 120 days for electronic credit of shares."
        ],
        "timelines": "Simplified Threshold: Up to Rs 5,00,000 (Physical) / Up to Rs 15,00,000 (Demat); RTA processing limit: 30 days; LOC Demat validity: 120 days.",
        "escalation_path": "Company RTA -> Company Nodal/Compliance Officer -> SEBI SCORES 2.0 -> SMART ODR Conciliation",
        "citations": [
            "SEBI Circular SEBI/HO/MIRSD/MIRSD_RTAMB/P/CIR/2022/65 (Simplification of procedure and standardization of formats of documents for transmission of securities)",
            "SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015 — Regulation 39 & 40",
            "SEBI Master Circular for RTAs (2024) — Chapter on Transmission of Securities"
        ]
    },
    "unauthorized_broker_trade": {
        "category": "Emergency Broker Disputes & Trading Glitches",
        "severity": "CRITICAL",
        "severity_reason": "Active unauthorized derivatives/cash trade exposure with compounding market risk and margin liability requiring emergency 24-hr action.",
        "authority": "SEBI / Stock Exchanges (NSE / BSE) & SMART ODR",
        "portal": "NSE NICE Plus / BSE e-Grievance / SCORES 2.0 / SMART ODR",
        "summary": "Execution of unapproved orders by stock broker without explicit telephonic voice recording, written authorization, or authenticated digital confirmation.",
        "evidence_checklist": [
            "Contract Notes and Daily Activity Logs showing unauthorized trade timestamps, price, symbol, and volume",
            "Telephonic Call Records & SMS logs showing absence of client order placement instructions",
            "Formal demand for Mandatory Pre-Trade Order Confirmation Voice Recording under SEBI regulations",
            "Trading Terminal Login IP Logs, Device IDs, and OTP delivery records for the trade date",
            "Bank Ledger / Demat Ledger statement showing unauthorized margin debit or position loss",
            "Copy of the 24-hour Written Dispute Notice served to the Broker Compliance Officer"
        ],
        "resolution_dossier": [
            "Step 1: Immediate Emergency Written Notice (Within 24 Hours) — Send a formal dispute email to the Broker's Designated Compliance Officer and Grievance Desk stating explicit non-consent and demanding immediate squaring off / reversal of positions.",
            "Step 2: Revoke Trading & Pledging Access — Request immediate revocation of Demat Debit and Pledging Instruction (DDPI) or Power of Attorney (POA) and change all trading passwords.",
            "Step 3: Demand Pre-Trade Voice Recording / Proof — Under SEBI rules, the burden of proof is on the broker to produce pre-trade voice recordings or 2FA OTP logs. If broker fails to provide proof within 48 hours, proceed to exchange escalation.",
            "Step 4: Escalate to Stock Exchange Investor Grievance Portal — File an online complaint on NSE Investor Centre (NICE Plus) or BSE e-Grievance portal attaching all dispute logs within 15 days.",
            "Step 5: Exchange GRC & SMART ODR Arbitration — If unresolved by the Member Grievance Redressal Committee (GRC), escalate to SMART ODR (smartodr.in) for online conciliation and independent arbitration."
        ],
        "timelines": "Emergency reporting: Within 24 hours; Broker response: 48 hours; Exchange GRC: 15-30 days; SMART ODR Conciliation: 21 days; Arbitration: 30-60 days.",
        "escalation_path": "Broker Compliance Officer -> Stock Exchange (NSE/BSE Investor Grievance Cell) -> SEBI SCORES 2.0 -> SMART ODR Platform (smartodr.in)",
        "citations": [
            "SEBI Master Circular for Stock Brokers (SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2024/54) — Mandatory recording of investor order instructions",
            "SEBI Circular CIR/HO/MIRSD/DOP/CIR/P/2018/54 (Prevention of Unauthorised Trading by Stock Brokers)",
            "SEBI Master Circular on Online Dispute Resolution (SMART ODR) — SEBI/HO/OIAE/OIAE_IAD-1/P/CIR/2023/145"
        ]
    },
    "iepf_unclaimed_dividend_shares": {
        "category": "Corporate Actions & IEPF Recovery",
        "severity": "HIGH",
        "severity_reason": "Shares and accrued dividends transferred to Government IEPF Authority under Section 124(6); requires statutory online filing and Nodal verification.",
        "authority": "Investor Education and Protection Fund (IEPF) Authority, Ministry of Corporate Affairs (MCA)",
        "portal": "MCA Portal (mca.gov.in) & IEPF Portal (iepf.gov.in)",
        "summary": "Claiming unpaid dividends and underlying shares transferred to IEPF Authority after 7 consecutive years of non-payment.",
        "evidence_checklist": [
            "Original Share Certificates (for physical holdings) or Demat Client Master List (CML) with depository seal",
            "Self-attested Copy of PAN Card and Aadhaar Card (matching MCA profile)",
            "Duly completed and signed e-Form IEPF-5 with system-generated Service Request Number (SRN)",
            "Original Advance Stamped Receipt signed with a Rs 1 Revenue Stamp",
            "Original Indemnity Bond executed on non-judicial stamp paper of prescribed state stamp duty",
            "Original Cancelled Cheque leaf showing claimant name, account number, and bank IFSC",
            "Proof of Entitlement (dividend counterfoils, letter of allotment, or RTA share entitlement certificate)"
        ],
        "resolution_dossier": [
            "Step 1: Create MCA Portal Login & Fill e-Form IEPF-5 — Register as an Individual User on the MCA portal (mca.gov.in). Access e-Form IEPF-5, enter Company CIN, Folio Number / DP-Client ID, unclaimed dividend amounts, and number of shares claimed.",
            "Step 2: Upload e-Form IEPF-5 & Generate SRN — Upload the signed PDF form with MCA user ID. The system generates an SRN and a printable acknowledgment challan.",
            "Step 3: Prepare Physical Claim Dossier — Compile the physical packet: Printed signed IEPF-5, SRN Challan, Advance Stamped Receipt, Indemnity Bond, share certificates / CML, and bank proof.",
            "Step 4: Submit Dossier to Company Nodal Officer — Courier the complete physical dossier to the Designated Nodal Officer of the Company / RTA in an envelope marked 'Claim for refund from IEPF Authority' within 15 days of SRN generation.",
            "Step 5: Company E-Verification & IEPF Sanction — The Company Nodal Officer verifies physical documents within 30 calendar days and submits an online e-Verification Report to the IEPF Authority for sanction and credit."
        ],
        "timelines": "Physical dossier submission: 15 days from SRN; Company verification: 30 days; IEPF Authority approval: 60 calendar days post verification report.",
        "escalation_path": "Company Nodal Officer -> IEPF Authority Grievance Cell (iepf.gov.in / 011-23441243) -> MCA Nodal Redressal Desk",
        "citations": [
            "Section 124(6) and Section 125 of the Companies Act, 2013",
            "Investor Education and Protection Fund Authority (Accounting, Audit, Transfer and Refund) Rules, 2016 (as amended 2024)",
            "MCA Circular No. 05/2021 (Streamlining verification process of claims filed under Form IEPF-5)"
        ]
    },
    "ipo_asba_delay_compensation": {
        "category": "Public Issues & ASBA Processing",
        "severity": "HIGH",
        "severity_reason": "Unlawful freeze on retail investor bank funds post-IPO allotment; statutory entitlement to automated Rs 100/day penalty compensation.",
        "authority": "SEBI / Self-Certified Syndicate Banks (SCSBs) & Lead Merchant Bankers",
        "portal": "SCSB Grievance Cell / Registrar IPO Portal / SEBI SCORES 2.0",
        "summary": "Mandatory compensation of Rs 100 per day for delay in unblocking ASBA funds beyond the prescribed IPO timeline (T+1 post allotment finalization).",
        "evidence_checklist": [
            "IPO Application Form copy / UPI Mandate Request ID with timestamp",
            "Bank Account Statement highlighting active blocked lien amount and unblocking failure",
            "Allotment Status confirmation from Registrar (KFintech/Link Intime) showing non-allotment / partial allotment",
            "PAN Card and Bank Account Number linked to the ASBA bid",
            "Initial grievance email sent to SCSB Branch Manager / Nodal Officer"
        ],
        "resolution_dossier": [
            "Step 1: Confirm Non-Allotment & Block Status — Verify the basis of allotment on the Registrar's portal. Under SEBI regulations, ASBA funds must be unblocked on T+1 day following finalization of allotment.",
            "Step 2: Formal Notice to Bank SCSB Nodal Officer — Send a written complaint to the SCSB (Bank) Nodal Officer specifying Application No, UPI Transaction ID, and PAN, demanding immediate unblocking and statutory Rs 100/day compensation.",
            "Step 3: Automated Compensation Liability — Under SEBI Circular SEBI/HO/CFD/DIL2/CIR/P/2021/2480/1/M, the bank is legally obligated to compensate the investor at the rate of Rs 100 per day of delay directly into the investor's bank account.",
            "Step 4: Escalate to SEBI SCORES 2.0 — If the bank fails to unblock funds and credit compensation within 7 calendar days, lodge a complaint on SEBI SCORES 2.0 (scores.sebi.gov.in) under category 'Public Issue — ASBA / Non-unblocking of funds'.",
            "Step 5: Regulatory Action & Direct Credit — SEBI mandates the SCSB and Merchant Banker to settle the grievance and credit compensation within the 21-day Action Taken Report (ATR) period."
        ],
        "timelines": "Mandatory unblocking deadline: T+1 day from allotment finalization; Statutory penalty: Rs 100 per day until unblocked; SCORES ATR: 21 days.",
        "escalation_path": "SCSB Bank Nodal Officer -> Lead Merchant Banker -> SEBI SCORES 2.0 -> SMART ODR",
        "citations": [
            "SEBI Circular SEBI/HO/CFD/DIL2/CIR/P/2021/2480/1/M (Streamlining the process of public issues — ASBA fund unblocking and investor compensation)",
            "SEBI Circular SEBI/HO/CFD/DIL2/P/CIR/2022/75 (Processing of ASBA applications in Public Issues)",
            "SEBI (Issue of Capital and Disclosure Requirements) Regulations, 2018 — Regulation 23 & Schedule XII"
        ]
    },
    "non_responsive_rta_escalation": {
        "category": "RTA Compliance & Depository Operations",
        "severity": "HIGH",
        "severity_reason": "Statutory default by SEBI-registered RTA exceeding 30-day regulatory service timeline; triggers automated SCORES 2.0 review.",
        "authority": "SEBI / Designated Body (Stock Exchanges / Depositories) & SCORES 2.0",
        "portal": "SEBI SCORES 2.0 (scores.sebi.gov.in)",
        "summary": "Escalation against non-responsive Registrar and Share Transfer Agent (RTA) for failure to process service requests within 30 days.",
        "evidence_checklist": [
            "Copy of originally submitted Form ISR-1 / ISR-4 / ISR-5 with all supporting enclosures",
            "Postal Speed Post / Courier tracking receipt showing proof of delivery at RTA office (or inward email acknowledgment)",
            "System generated Inward Reference / Service Request Number (SRN) issued by RTA",
            "PAN Card and Folio Number details",
            "Email communication history showing RTA non-responsiveness beyond 30 calendar days"
        ],
        "resolution_dossier": [
            "Step 1: Verify 30-Day Statutory Default — Confirm that at least 30 calendar days have elapsed since the verified delivery of Form ISR-1/4/5 at the RTA's registered address.",
            "Step 2: Log in to SEBI SCORES 2.0 — Visit scores.sebi.gov.in and log in with your PAN credentials.",
            "Step 3: Lodge Complaint Against RTA — Select Category: 'Registrar to an Issue & Share Transfer Agent (RTA)' -> Select RTA Name (e.g. Link Intime / KFintech) -> Select Issuer Company. Provide folio number and attach postal proof.",
            "Step 4: 21-Day Action Taken Report (ATR) Monitoring — Under SCORES 2.0, the complaint is auto-forwarded to the RTA. The RTA must resolve the grievance and upload an Action Taken Report (ATR) within 21 calendar days.",
            "Step 5: Two-Level Review if Unsatisfied — If the ATR is unsatisfactory or rejected, trigger First Level Review by the Designated Body, followed by Second Level Review by SEBI Officer."
        ],
        "timelines": "Initial RTA SLA: 30 days; SCORES 2.0 ATR submission: 21 calendar days; First Level Review window: 15 days from ATR.",
        "escalation_path": "RTA Compliance Officer -> SEBI SCORES 2.0 -> Designated Body (1st Level Review) -> SEBI Officer (2nd Level Review) -> SMART ODR",
        "citations": [
            "SEBI Master Circular for Registrars to an Issue and Share Transfer Agents (2024)",
            "SEBI Master Circular on Redressal of Investor Grievances through SCORES (SEBI/HO/OIAE/IGRD/P/CIR/2024/11)",
            "SEBI (Intermediaries) Regulations, 2008 — Code of Conduct for RTAs"
        ]
    },
    "scores_two_level_review": {
        "category": "Investor Redressal & SMART ODR Framework",
        "severity": "MEDIUM",
        "severity_reason": "Statutory regulatory architecture governing grievance resolution timelines, multi-tier reviews, and online dispute arbitration.",
        "authority": "SEBI / Designated Bodies (Stock Exchanges & Depositories) & SMART ODR Portal",
        "portal": "SCORES 2.0 (scores.sebi.gov.in) & SMART ODR (smartodr.in)",
        "summary": "Mandatory 21-day Action Taken Report (ATR) redressal framework and automated two-level review mechanism under SCORES 2.0.",
        "evidence_checklist": [
            "SCORES 2.0 Registration Number and Grievance Reference ID",
            "Action Taken Report (ATR) uploaded by the entity",
            "Investor rebuttal statement articulating why the ATR is unsatisfactory or procedurally deficient",
            "Supporting transaction proofs, contract notes, or RTA letters",
            "PAN and registered contact details"
        ],
        "resolution_dossier": [
            "Step 1: Entity Redressal Timeline (21 Days) — When a complaint is registered on SCORES 2.0, the intermediary (broker, AMC, RTA, listed company) must address the grievance and upload a detailed Action Taken Report (ATR) within 21 calendar days.",
            "Step 2: First-Level Review by Designated Body — If the investor is dissatisfied with the ATR, request review within 15 calendar days. The complaint is evaluated by the Designated Body within 10 days.",
            "Step 3: Second-Level Review by SEBI — If the investor remains aggrieved, initiate a Second Level Review within 15 calendar days for independent SEBI Officer evaluation.",
            "Step 4: SMART ODR Escalation — If the dispute remains unresolved following SCORES review, initiate Online Dispute Resolution on the SMART ODR platform (smartodr.in).",
            "Step 5: Binding Arbitration Award — SMART ODR conciliators attempt settlement within 21 days; failing which an independent arbitrator issues an enforceable award within 30 days."
        ],
        "timelines": "Entity ATR: 21 calendar days; First Level Review Request: 15 days from ATR; Second Level Review Request: 15 days; SMART ODR Conciliation: 21 days; Arbitration Award: 30 days.",
        "escalation_path": "SCORES 2.0 Entity ATR -> Designated Body (1st Review) -> SEBI Officer (2nd Review) -> SMART ODR Conciliation -> SMART ODR Arbitration",
        "citations": [
            "SEBI Master Circular on Redressal of Investor Grievances through SCORES (SEBI/HO/OIAE/IGRD/P/CIR/2024/11)",
            "SEBI Master Circular on Online Resolution of Disputes in the Indian Securities Market (SEBI/HO/OIAE/OIAE_IAD-1/P/CIR/2023/145)",
            "SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015"
        ]
    },
    "cybercrime_telegram_scam": {
        "category": "External Statutory Routing & Cyber Fraud",
        "severity": "CRITICAL",
        "severity_reason": "Criminal cyber fraud by unregistered scammers involving fake broker apps and illegal funds siphoning; requires golden-hour banking freeze.",
        "authority": "National Cybercrime Reporting Portal, State Cyber Police & Reserve Bank of India (RBI)",
        "portal": "National Cybercrime Portal (cybercrime.gov.in) & Emergency Helpline 1930",
        "summary": "SEBI SCORES does not have jurisdiction over unregistered criminal syndicates, fake APK apps, or Telegram VIP tip channels. Immediate police/1930 reporting is required.",
        "evidence_checklist": [
            "Bank / UPI Transaction Reference Numbers (UTR IDs), timestamps, and debit bank statements",
            "Screenshots of Telegram / WhatsApp group chats, admin usernames, phone numbers, and investment promises",
            "APK installation files, website URLs, and fake profit dashboard screenshots",
            "Details of recipient mule bank accounts / UPI IDs where funds were remitted",
            "Formal written dispute email sent to your bank's fraud reporting desk"
        ],
        "resolution_dossier": [
            "Step 1: Refusal of SEBI Purview — SEBI SCORES only exercises regulatory jurisdiction over registered market intermediaries. Unregistered tip channels and fraudulent apps are criminal offenses under IPC Sections 419/420 and IT Act Section 66D.",
            "Step 2: Dial Emergency Cybercrime Helpline 1930 Immediately — Call 1930 within the 'Golden Hour' (first 2-4 hours) so the portal can trigger automated bank API alerts to freeze recipient mule accounts.",
            "Step 3: Lodge Incident on National Cyber Crime Portal — File a detailed complaint on cybercrime.gov.in. Upload bank transaction statements, UTR numbers, and Telegram chat transcripts.",
            "Step 4: Notify Remitting Bank for Chargeback/Lien Freeze — Submit the Cybercrime Incident Report to your bank's Nodal Officer / Fraud Risk Management team requesting formal transaction recall.",
            "Step 5: Register Formal Police FIR — Visit your local Cyber Crime Police Station to convert the cyber portal acknowledgment into a regular FIR under Section 66D IT Act and Sections 318/319 BNS."
        ],
        "timelines": "Immediate Action: Within Golden Hour (0-4 hours) via 1930; Portal filing: Within 24 hours; Bank chargeback notice: Immediate.",
        "escalation_path": "National Cyber Helpline 1930 -> cybercrime.gov.in -> Remitting Bank Fraud Desk -> Cyber Police Station FIR -> Judicial Magistrate Court",
        "citations": [
            "Information Technology Act, 2000 — Section 66D (Cheating by personation using computer resource)",
            "Bharatiya Nyaya Sanhita, 2023 — Sections 318 & 319 (Cheating and Fraud / IPC 419 & 420)",
            "SEBI Advisory against Unregistered Entities, Social Media Tip Channels & Fake Trading Apps (PR No. 28/2023)",
            "RBI Master Circular on Customer Protection — Limiting Liability of Customers in Unauthorised Electronic Banking Transactions"
        ]
    },
    "bank_savings_penalty_rbi": {
        "category": "External Statutory Routing & Banking Services",
        "severity": "MEDIUM",
        "severity_reason": "Banking ledger fee dispute outside securities market jurisdiction; falls under Reserve Bank of India ombudsman framework.",
        "authority": "Reserve Bank of India (RBI) / Integrated Banking Ombudsman",
        "portal": "RBI Complaint Management System (cms.rbi.org.in)",
        "summary": "Unauthorized penalty/fee debited to savings bank account linked to demat account falls under RBI regulatory purview, not SEBI SCORES.",
        "evidence_checklist": [
            "Bank Account Statement showing unauthorized debit of penalty with transaction date and description",
            "Account terms and Schedule of Charges (SOC) issued by the bank",
            "Copy of the formal written grievance letter/email sent to the Branch Manager",
            "Bank grievance reference number and final bank rejection / non-response record beyond 30 days",
            "Identity Proof (PAN / Aadhaar)"
        ],
        "resolution_dossier": [
            "Step 1: Refusal of SEBI Purview — Core banking ledger charges, minimum balance penalties, and unauthorized debits are governed by banking regulations under the Reserve Bank of India (RBI).",
            "Step 2: Internal Grievance with Bank — Submit a formal written complaint to the Branch Manager and Principal Nodal Officer (PNO) requesting reversal of the fee under RBI fair practices code.",
            "Step 3: 30-Day Resolution SLA — Allow the bank 30 calendar days to investigate and reverse the charge.",
            "Step 4: Escalate to RBI Integrated Ombudsman (CMS Portal) — If the bank rejects or fails to resolve within 30 days, lodge a complaint on the RBI Complaint Management System (cms.rbi.org.in) or call 14448.",
            "Step 5: Ombudsman Adjudication — The RBI Banking Ombudsman investigates unfair service charges and issues a binding order directing the bank to reverse the fee."
        ],
        "timelines": "Bank Internal SLA: 30 calendar days; RBI Ombudsman resolution: 30-60 calendar days.",
        "escalation_path": "Bank Branch Manager -> Bank Principal Nodal Officer -> RBI Integrated Ombudsman (cms.rbi.org.in / 14448)",
        "citations": [
            "Reserve Bank of India (Integrated Ombudsman Scheme), 2021",
            "RBI Master Circular on Customer Service in Banks (DBOD.No.Leg.BC.21/09.07.006/2015-16)",
            "Banking Regulation Act, 1949 — Section 35A"
        ]
    },
    "insurance_ulip_mis_selling_irdai": {
        "category": "External Statutory Routing & Insurance Products",
        "severity": "HIGH",
        "severity_reason": "Mis-selling of long-term insurance contract under the guise of an investment fund; subject to statutory 30-day Free Look cancellation.",
        "authority": "Insurance Regulatory and Development Authority of India (IRDAI) & Council for Insurance Ombudsmen",
        "portal": "IRDAI Bima Bharosa Portal (bimabharosa.irdai.gov.in)",
        "summary": "Unit Linked Insurance Plans (ULIPs) are life insurance products governed by IRDAI. Mis-selling disputes must be resolved via the Insurer Grievance Redressal Officer, Bima Bharosa, or Insurance Ombudsman.",
        "evidence_checklist": [
            "Original Policy Document, Benefit Illustration, and Proposal Form copy",
            "Premium Payment Receipt and Bank Statement showing deduction",
            "Sales marketing collaterals, WhatsApp chats, or call recordings proving misrepresentation as a 'guaranteed mutual fund'",
            "Proof of delivery date of the policy document (crucial for Free Look Period calculation)",
            "Copy of the written complaint served on the Insurance Company's Grievance Redressal Officer (GRO)"
        ],
        "resolution_dossier": [
            "Step 1: Refusal of SEBI Purview — Unit Linked Insurance Plans (ULIPs) are hybrid life insurance contracts regulated by IRDAI, not mutual funds under SEBI. SEBI SCORES does not entertain insurance complaints.",
            "Step 2: Invoke Statutory 30-Day Free Look Cancellation — If you received the policy within the last 30 calendar days, immediately submit a written 'Free Look Cancellation' request to the insurer demanding 100% refund.",
            "Step 3: Lodge Complaint with Insurer's Grievance Redressal Officer (GRO) — Submit a formal mis-selling complaint to the insurer's GRO. The insurer has a mandatory 15-day resolution timeline.",
            "Step 4: Escalate to IRDAI Bima Bharosa Portal — If the insurer fails to respond or rejects within 15 days, lodge a complaint on the IRDAI Bima Bharosa Portal (bimabharosa.irdai.gov.in) or call 155255.",
            "Step 5: Approach Council for Insurance Ombudsmen — If still unresolved, file a complaint with the Insurance Ombudsman (cioins.co.in) having territorial jurisdiction for binding award."
        ],
        "timelines": "Free Look Cancellation window: 30 days from policy receipt; Insurer GRO SLA: 15 calendar days; Insurance Ombudsman award: 90 days.",
        "escalation_path": "Insurer Grievance Redressal Officer (GRO) -> IRDAI Bima Bharosa Portal (155255) -> Insurance Ombudsman (cioins.co.in)",
        "citations": [
            "Insurance Regulatory and Development Authority of India (Protection of Policyholders' Interests) Regulations, 2024",
            "Insurance Ombudsman Rules, 2017 (as amended 2021)",
            "Insurance Act, 1938 — Section 45"
        ]
    }
}


def generate_statutory_notice(doc: Dict[str, Any], query_text: str = "") -> str:
    category = doc.get("category", "Securities Market Grievance")
    authority = doc.get("authority", "SEBI / Designated Intermediary")
    summary = doc.get("summary", "Securities Market Dispute")
    citations = "\n".join([f"   - {c}" for c in doc.get("citations", [])])
    timelines = doc.get("timelines", "21 Calendar Days (SCORES 2.0 ATR)")
    
    notice = f"""================================================================================
FORMAL STATUTORY LEGAL NOTICE & GRIEVANCE REDRESSAL DEMAND
[Prepared for Direct Submission on SEBI SCORES 2.0 & SMART ODR Platform]
================================================================================

DATE: 27-August-2026
DISPUTE TRACKING REFERENCE: MS/SEBI/2026/GRV-98421
MATTER: Formal Statutory Grievance under SEBI Act 1992, SCRA 1956 & SCORES 2.0 Rules

TO:
1. THE PRINCIPAL NODAL OFFICER / DESIGNATED COMPLIANCE OFFICER
   [Respondent Intermediary / Stock Broker / RTA / Listed Issuer / SCSB Bank]
   Address: Registered Corporate Office
   Email: compliance-desk@[entity].com / grievance@[entity].com

COPY SUBMITTED FOR STATUTORY RECORD & ESCALATION TO:
2. SECURITIES AND EXCHANGE BOARD OF INDIA (SEBI)
   Investor Grievance Redressal Division (SCORES 2.0 Desk)
   Plot No. C4-A, 'G' Block, Bandra-Kurla Complex, Bandra (East), Mumbai - 400 051
   Portal: https://scores.sebi.gov.in | Toll-Free: 1800 266 7575 / 1800 22 7575

3. SMART ODR REGISTRY (ONLINE DISPUTE RESOLUTION PLATFORM)
   Market Infrastructure Intermediaries (MIIs) Conciliation & Arbitration Portal
   Web: https://smartodr.in | Email: registrar@smartodr.in

--------------------------------------------------------------------------------
PART I: PARTICULARS OF THE COMPLAINANT (INVESTOR)
--------------------------------------------------------------------------------
Complainant Name        : [Investor Name / Legal Heir / Claimant]
Permanent Account Number: [PAN: XXXXX1234X]
Demat Account / DP-ID   : [Client ID / DP-ID / Folio Number]
Registered Contact      : [Mobile: +91-XXXXXXXXXX | Email: investor@domain.com]
Communication Address   : [Full Residential / Communication Address]

--------------------------------------------------------------------------------
PART II: PARTICULARS OF THE RESPONDENT INTERMEDIARY
--------------------------------------------------------------------------------
Entity Name             : [Name of Broker / RTA / Listed Company / SCSB Bank]
SEBI Registration / CIN : [SEBI Reg No. / Corporate Identification Number]
Designated Body         : [National Stock Exchange (NSE) / BSE / NSDL / CDSL]

--------------------------------------------------------------------------------
PART III: STATEMENT OF FACTS & CHRONOLOGY OF DISPUTE
--------------------------------------------------------------------------------
1. The Complainant is a bonafide retail investor maintaining an active investment account / shareholding folio with the Respondent under the particulars mentioned above.
2. REGULATORY DIAGNOSIS: {summary}
{f"3. FACTUAL NARRATIVE: {query_text}" if query_text else ""}
4. The Respondent has failed to adhere to the prescribed statutory Service Level Agreements (SLAs) and mandatory SEBI regulations, causing undue financial prejudice, deprivation of capital/securities, and actionable regulatory default.

--------------------------------------------------------------------------------
PART IV: STATUTORY GROUNDS & GOVERNING CITATIONS
--------------------------------------------------------------------------------
The Respondent's omission/action directly violates the following statutory mandates:
{citations}

--------------------------------------------------------------------------------
PART V: FORMAL DEMAND FOR IMMEDIATE STATUTORY RELIEF
--------------------------------------------------------------------------------
The Complainant hereby formally DEMANDS that the Respondent immediately, and within the prescribed statutory timeframe:
1. Complete full rectification and financial restitution of the grievance as per SEBI regulations.
2. Upload a formal, reasoned Action Taken Report (ATR) on the SEBI SCORES 2.0 portal within the mandatory 21 calendar days timeline as stipulated under SEBI Master Circular SEBI/HO/OIAE/IGRD/P/CIR/2024/11.
3. Credit any statutory accrued compensation (e.g. Rs 100 per day for ASBA delays under SEBI ICDR circulars) or reverse unauthorized transactions without demur.

--------------------------------------------------------------------------------
PART VI: PRE-ARBITRATION NOTICE UNDER SMART ODR FRAMEWORK
--------------------------------------------------------------------------------
PLEASE TAKE FORMAL NOTICE that in the event of failure to resolve the grievance within the statutory timeline or submission of an adverse/unsatisfactory Action Taken Report (ATR):
1. The Complainant shall immediately trigger First Level Review by the Designated Body and Second Level Review by the SEBI Officer.
2. The Complainant shall initiate binding Online Conciliation and Arbitration proceedings on the SMART ODR Platform (https://smartodr.in) under SEBI Circular SEBI/HO/OIAE/OIAE_IAD-1/P/CIR/2023/145.
3. The Complainant shall claim full restitution, compounding interest, and arbitration costs, and petition SEBI for punitive enforcement proceedings under Section 15C and Section 15HB of the Securities and Exchange Board of India Act, 1992.

--------------------------------------------------------------------------------
VERIFICATION & AFFIRMATION
--------------------------------------------------------------------------------
I, the Complainant above-named, do hereby verify and affirm that the contents of this Statutory Notice are true, correct, and complete to the best of my knowledge and documentary records.

Date : 27-August-2026
Place: [Complainant Jurisdiction]

____________________________________________________
SIGNATURE OF THE COMPLAINANT / AUTHORIZED LEGAL HEIR
================================================================================"""
    return notice


class MasterGrievanceEngine:
    def __init__(self, dossiers: Dict[str, Any] = STATUTORY_DOSSIERS):
        self.dossiers = dossiers

    def route_and_build(self, query_text: str) -> Dict[str, Any]:
        q_lower = query_text.lower().strip()
        
        # Financial / SEBI Domain Relevance Check
        financial_terms = [
            'share', 'stock', 'broker', 'demat', 'ipo', 'asba', 'dividend', 'iepf', 'rta', 
            'folio', 'scores', 'sebi', 'mutual fund', 'trading', 'nse', 'bse', 'cdsl', 'nsdl', 
            'trade', 'fund', 'withdrawal', 'payout', 'portfolio', 'collateral', 'bonus', 
            'margin', 'option', 'futures', 'kyc', 'grievance', 'complaint', 'intermediary', 
            'registrar', 'unfreeze', 'freeze', 'certificate', 'dispute', 'transaction', 
            'order', 'exchange', 'amc', 'nominee', 'nomination', 'transmission', 'investment', 
            'advisor', 'scam', 'fraud', 'bank', 'cybercrime', 'money', 'loss', 'securities', 
            'isin', 'dp id', 'client code', 'pan', 'allotment', 'rights issue', 'buyback', 
            'smart odr', 'odr', 'arbitration', 'conciliation', 'penalty', 'holding', 'pcr', 
            'f&o', 'derivatives', 'equity', 'debenture', 'bond', 'inav', 'nav', 'etf', 
            'zerodha', 'groww', 'angel', 'upstox', 'icici', 'hdfc', 'sbi', 'kotak', 'rupee', 'rs',
            'market', 'investor', 'financial', 'account', 'deposit', 'sebi scores', 'link intime',
            'kfintech', 'cml', 'dis', 'slip', 'pledge', 'unpledge', 'liquidat', 'glitch', 'insurance',
            'ulip', 'policy', 'irdai', 'bima bharosa'
        ]
        
        if not any(k in q_lower for k in financial_terms) or len(q_lower) < 4:
            return {
                "dossier_key": "irrelevant_query",
                "action": "IRRELEVANT_QUERY",
                "action_taken": "IRRELEVANT_QUERY",
                "category": "irrelevant_query",
                "category_label": "Irrelevant Query",
                "severity": "LOW",
                "severity_reason": "Out of scope - non-financial query.",
                "regulatory_provision": "Out of Scope (Non-SEBI / Non-Financial Query)",
                "can_answer": False,
                "response": "Irrelevant Query: The submitted query does not pertain to SEBI statutory regulations, stock exchange disputes, broker non-compliance, demat transfers, IPO ASBA refunds, or securities market grievances. Please enter a valid capital market dispute or investor grievance.",
                "formatted_response": "Irrelevant Query: Please enter a valid securities market dispute.",
                "raw_doc": {
                    "category": "Irrelevant Query",
                    "severity": "LOW",
                    "severity_reason": "Non-SEBI domain",
                    "authority": "N/A",
                    "portal": "N/A",
                    "summary": "Out of scope non-financial query",
                    "evidence_checklist": [],
                    "resolution_dossier": [],
                    "timelines": "N/A",
                    "escalation_path": "N/A",
                    "citations": []
                }
            }
        
        # 1. Cybercrime & Scams
        if any(k in q_lower for k in ['telegram', 'whatsapp', 'fake app', 'fake broker app', 'cybercrime', '1930', 'otp phishing', 'account takeover', 'scam', 'fraud', 'fake tips']):
            dossier_key = "cybercrime_telegram_scam"
            action = "OUT_OF_JURISDICTION"
            category = "jurisdiction_routing"
            
        # 2. Banking Ledger & Savings Account Charges
        elif any(k in q_lower for k in ['bank charged', 'savings account', 'rbi banking ombudsman', 'banking ombudsman', 'minimum balance']):
            dossier_key = "bank_savings_penalty_rbi"
            action = "OUT_OF_JURISDICTION"
            category = "jurisdiction_routing"
            
        # 3. Insurance & ULIP Mis-Selling
        elif any(k in q_lower for k in ['insurance', 'ulip', 'irdai', 'policy', 'bima bharosa', 'insurance ombudsman']):
            dossier_key = "insurance_ulip_mis_selling_irdai"
            action = "OUT_OF_JURISDICTION"
            category = "jurisdiction_routing"
            
        # 4. ASBA IPO Delay & Rs 100/Day Penalty
        elif any(k in q_lower for k in ['ipo asba', 'asba funds', 'allotment finished', '100 per day', 'asba compensation', 'asba process', 'unblock', 'ipo']):
            dossier_key = "ipo_asba_delay_compensation"
            action = "PLAYBOOK_MATCH"
            category = "ipo"
            
        # 5. Non-Responsive RTA Escalation
        elif any(k in q_lower for k in ['link intime', 'link intime rta', 'non-responsive rta', '40 days ago', 'rta 40 days', 'submitted form isr-1 to link', 'kfintech']):
            dossier_key = "non_responsive_rta_escalation"
            action = "PLAYBOOK_MATCH"
            category = "rta"
            
        # 6. IEPF-5 Unclaimed Dividends & Shares
        elif any(k in q_lower for k in ['iepf', 'iepf-5', '8 years', '7 years', 'unclaimed dividend', 'shares transferred to iepf', 'dividend']):
            dossier_key = "iepf_unclaimed_dividend_shares"
            action = "PLAYBOOK_MATCH"
            category = "corporate_action"
            
        # 7. Share Transmission without Nomination
        elif any(k in q_lower for k in ['father passed away', 'without nominating', 'transmission', 'passed away', 'deceased', 'legal heirs', 'succession certificate', 'probate', 'nominee']):
            dossier_key = "share_transmission_no_nominee"
            action = "PLAYBOOK_MATCH"
            category = "physical_securities"
            
        # 8. Unauthorized Broker Trade & Tech Glitches
        elif any(k in q_lower for k in ['unauthorized trade', 'options today', 'without my permission', 'within 24 hours', 'broker executed', 'trading app crashed', 'stop loss failed', 'broker', 'payout', 'margin', 'withdrawal']):
            dossier_key = "unauthorized_broker_trade"
            action = "PLAYBOOK_MATCH"
            category = "broker_dispute"
            
        # 9. Physical Share Dematerialisation & Service Requests
        elif any(k in q_lower for k in ['physical share', 'dematerialise', 'demat account', 'form isr-1', 'form isr-4', 'isr-2', 'isr-3', 'sh-13', 'sh-14', 'folio', 'certificate']):
            dossier_key = "physical_share_demat"
            action = "PLAYBOOK_MATCH"
            category = "physical_securities"
            
        else:
            dossier_key = "scores_two_level_review"
            action = "PLAYBOOK_MATCH"
            category = "investor_grievance"

        doc = self.dossiers[dossier_key]
        notice_text = generate_statutory_notice(doc, query_text)
        
        return {
            "dossier_key": dossier_key,
            "action": action,
            "action_taken": action,
            "category": category,
            "category_label": doc["category"],
            "severity": doc["severity"],
            "severity_reason": doc["severity_reason"],
            "regulatory_provision": doc["citations"][0] if doc["citations"] else "SEBI Master Circular 2024",
            "can_answer": True,
            "response": doc["summary"],
            "raw_doc": doc,
            "legal_draft": notice_text,
            "evidence_checklist": doc["evidence_checklist"],
            "statutory_timeline": doc["timelines"],
            "escalation_path": doc["escalation_path"],
            "citations": doc["citations"],
            "resolution_dossier": doc["resolution_dossier"]
        }


class AgenticRouter:
    def __init__(self):
        self.engine = MasterGrievanceEngine(STATUTORY_DOSSIERS)

    def route(self, query_text: str) -> Dict[str, Any]:
        return self.engine.route_and_build(query_text)


class CRAGEvaluator:
    def __init__(self, retriever: NativeHybridRetriever):
        self.retriever = retriever

    def evaluate_and_correct(self, query: str, retrieved_chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not retrieved_chunks:
            return {'status': 'REJECTED', 'score': 0.0, 'content': 'No relevant context retrieved.'}
            
        top_score = retrieved_chunks[0]['score']
        if top_score >= 0.08:
            combined = "\n\n".join([c['content'] for c in retrieved_chunks[:2]])
            return {'status': 'ACCEPTED', 'score': top_score, 'content': combined[:1000] + "..."}
            
        refined_query = re.sub(r'[^a-zA-Z0-9 ]', '', query) + " SEBI regulation circular guidelines"
        second_pass = self.retriever.search(refined_query, top_k=3)
        if second_pass and second_pass[0]['score'] > top_score:
            combined = "\n\n".join([c['content'] for c in second_pass[:2]])
            return {'status': 'CORRECTED_AND_ACCEPTED', 'score': second_pass[0]['score'], 'content': combined[:1000] + "..."}
            
        return {'status': 'LOW_CONFIDENCE', 'score': top_score, 'content': retrieved_chunks[0]['content'][:1000] + "..."}


class GroqLLMGenerator:
    def __init__(self, api_key: Optional[str] = None, model: str = "openai/gpt-oss-120b"):
        self.api_key = api_key or os.environ.get("GROQ_API_KEY", "")
        self.model = model
        self.url = "https://api.groq.com/openai/v1/chat/completions"

    def generate(self, query: str, context_text: str, category: str, action_taken: str) -> str:
        if action_taken == "IRRELEVANT_QUERY" or category == "irrelevant_query":
            return "Irrelevant Query: The query you submitted does not contain a recognized securities market dispute, broker breach, or SEBI regulatory grievance. Please enter a valid financial dispute or grievance."
            
        prompt = f"""You are an expert SEBI & Indian Financial Regulatory Compliance AI Assistant.
Answer the user's inquiry formally, clearly, and authoritatively based on the retrieved compliance rules below.

User Query: {query}

Category: {category}
Action: {action_taken}

Retrieved Grounding Rules & Circulars:
{context_text}

Instructions:
1. Specify exact form names (Form ISR-1, Form ISR-4, Form ISR-5, Form IEPF-5) where applicable.
2. Clearly state timelines (e.g. 21 days ATR), limits (Rs 5L physical / Rs 15L demat), or compensation (Rs 100/day ASBA delay).
3. Format output clearly using markdown tables and structured bullet points."""

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are a SEBI & Indian Financial Regulatory Compliance AI Assistant."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2
        }

        try:
            req = urllib.request.Request(self.url, data=json.dumps(payload).encode('utf-8'), headers={
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            })
            with urllib.request.urlopen(req, timeout=10) as resp:
                res_json = json.loads(resp.read().decode())
                return res_json['choices'][0]['message']['content']
        except Exception as e:
            return f"{context_text}\n\n*(Note: Groq LLM response fallback active: {str(e)})*"


# Global state singleton for RAG
_master_data = None
_retriever = None
_router = None
_crag_evaluator = None

def get_sebi_engine():
    global _master_data, _retriever, _router, _crag_evaluator
    if _master_data is None:
        chunks, authorities, playbooks, benchmark = load_master_data()
        _master_data = {
            'chunks': chunks,
            'authorities': authorities,
            'playbooks': playbooks,
            'benchmark': benchmark
        }
        _retriever = NativeHybridRetriever(chunks)
        _router = AgenticRouter()
        _crag_evaluator = CRAGEvaluator(_retriever)
        
    return _master_data, _retriever, _router, _crag_evaluator

def get_evidence_checklist_for_category(category: str) -> List[str]:
    for key, d in STATUTORY_DOSSIERS.items():
        if d.get("category") == category or key == category:
            return d.get("evidence_checklist", [])
    return STATUTORY_DOSSIERS["scores_two_level_review"]["evidence_checklist"]

def get_statutory_timeline_for_category(category: str) -> str:
    for key, d in STATUTORY_DOSSIERS.items():
        if d.get("category") == category or key == category:
            return d.get("timelines", "")
    return "Statutory Resolution Window: 21 Calendar Days ATR Timeline"

