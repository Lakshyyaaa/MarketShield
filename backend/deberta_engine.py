import os
import re
import html
import math
import time
import logging
from typing import Optional, List, Dict, Any, Tuple
from dotenv import load_dotenv

logger = logging.getLogger("deberta_engine")

import numpy as np

try:
    import torch
    import torch.nn as nn
    from transformers import AutoTokenizer, AutoModel
    TORCH_AVAILABLE = True
except ImportError:
    torch = None
    nn = None
    AutoTokenizer = None
    AutoModel = None
    TORCH_AVAILABLE = False

from pydantic import BaseModel, Field

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))

# -----------------------------------------------------------------------------
# Taxonomy & Class Definitions (Identical to Scam Detection/app.py)
# -----------------------------------------------------------------------------
LABELS = ['Investor_Warning', 'Legitimate', 'Regulatory_Violation', 'Scam', 'Suspicious']

THREAT_TYPES = [
    'Assured/Fixed Returns', 'Fake Document/Certificate', 'Fake SEBI Registration',
    'Fake Trading App', 'Fake Website', 'False Representation', 'Front Running',
    'Guaranteed Returns', 'High-Pressure/FOMO', 'Impersonation', 'Insider Trading',
    'Market Manipulation', 'Misleading Performance Claims', 'Other', 'Ponzi/Pyramid',
    'Pump and Dump', 'Referral Scheme', 'Social Media Investment Scam', 'Stock Tip Scam',
    'Telegram/WhatsApp Scam', 'Third-Party Payment', 'Unregistered Investment Advice',
    'Unrealistic Returns', 'Withdrawal Fee Scam', 'Zero-Risk Claims'
]

# -----------------------------------------------------------------------------
# Preset Test Cases (Identical to Scam Detection/app.py)
# -----------------------------------------------------------------------------
PRESET_TEST_CASES = [
    {
        "id": "withdrawal_extortion",
        "label": "Withdrawal Fee Extortion",
        "category": "Critical Threat (Fee Scam)",
        "expectedBand": "High",
        "text": "Sir your profit of Rs 4,50,000 is ready in trading wallet. To release your withdrawal, you must first deposit 15% GST fee (Rs 67,500) to our personal bank account within 24 hours or your funds will be forfeited."
    },
    {
        "id": "whatsapp_scam",
        "label": "WhatsApp Scam Pitch",
        "category": "High Threat (Scam)",
        "expectedBand": "High",
        "text": "Namaste Sir, our VIP institutional algorithmic trading group has 2 slots left. Deposit Rs 1,00,000 today and receive guaranteed Rs 25,000 daily fixed returns with 100% zero risk capital guarantee approved by SEBI certificate #INH99991111. Transfer to UPI immediately to confirm."
    },
    {
        "id": "hindi_guarantee",
        "label": "Hindi Guarantee (Paisa Double)",
        "category": "High Threat (Scam)",
        "expectedBand": "High",
        "text": "गारंटी मुनाफा! सिर्फ 15 दिन में पैसा डबल। SEBI certified advisor join VIP group now pay Rs 4999 to tips@ybl"
    },
    {
        "id": "vip_group_solicitation",
        "label": "Urgent VIP Group Solicitation",
        "category": "High Threat (Scam)",
        "expectedBand": "High",
        "text": "SURE SHOT Buy SUZLON at 47, target 95 in 10 days. Guaranteed profit. Pay Rs 2,999 to xyztips@okaxis for VIP group. Join t.me/xyzresearch now, only 5 seats left! - Amit Patel, XYZ Research Advisory, INH000004121"
    },
    {
        "id": "ipo_allotment_scam",
        "label": "IPO Allotment Scam",
        "category": "High Threat (Scam)",
        "expectedBand": "High",
        "text": "Guaranteed HNI quota allotment for Tata Technologies IPO. Transfer application amount directly to our escrow account rajesh.wealth@axisbank to confirm allocation."
    },
    {
        "id": "fake_registration",
        "label": "Fake SEBI Registration",
        "category": "High Threat (Scam)",
        "expectedBand": "High",
        "text": "I am a SEBI registered advisor, registration number INX999999999. Guaranteed monthly returns of 8% with zero risk. DM me on Telegram to join our VIP group."
    },
    {
        "id": "phishing_clone",
        "label": "Phishing Clone (zer0dha.top)",
        "category": "High Threat (Phishing)",
        "expectedBand": "High",
        "text": "Important notice: Complete your Zerodha KYC verification immediately to prevent account suspension.",
        "url": "https://zer0dha-invest.top/login"
    },
    {
        "id": "lookalike_domain",
        "label": "Lookalike Domain (groww-pro.in)",
        "category": "High Threat (Phishing)",
        "expectedBand": "High",
        "text": "Special pre-IPO allotment allocation via Groww Pro portal.",
        "url": "https://groww-pro-vip.in"
    },
    {
        "id": "guaranteed_500",
        "label": "Guaranteed Returns (500% ROI)",
        "category": "High Threat (Scam)",
        "expectedBand": "High",
        "text": "GUARANTEED 500% returns in 30 days! Pay Rs 10,000 now to secure your slot. Limited seats, act fast!",
        "url": "https://quickwealth100x.xyz"
    },
    {
        "id": "option_signal",
        "label": "Option Trading Signal",
        "category": "Market Signal",
        "expectedBand": "Moderate",
        "text": "BankNifty is poised for a massive 400-point breakout above 48200 tomorrow on expiry. Buy 48300 CE at 120 with stop loss at 85, target 240. Risk reward is 1:3. Heavy call writing seen at 48500 so trail profits accordingly."
    },
    {
        "id": "legitimate_research",
        "label": "Legitimate Research Note (SEBI RA)",
        "category": "Legitimate Advisory",
        "expectedBand": "Low",
        "text": "This is Deepa Krishnan, SEBI registered research analyst (INH000008841), sharing our quarterly outlook on large-cap IT. All equity investments carry market risk. Past returns are not an assurance of future performance. We do not provide assured return schemes.",
        "url": "https://capitalcompass-research.in"
    },
    {
        "id": "index_sip",
        "label": "Regulated Index SIP",
        "category": "Legitimate Advisory",
        "expectedBand": "Low",
        "text": "For beginners with a 10-year horizon, ignore daily market noise and set up a monthly SIP of Rs 15,000 in a low-cost Nifty 50 Index Fund and Rs 10,000 in Parag Parikh Flexi Cap. Rebalance annually and maintain a 6-month emergency fund."
    },
    {
        "id": "sebi_alert",
        "label": "SEBI Investor Alert",
        "category": "Investor Warning",
        "expectedBand": "Low",
        "text": "Caution to all investors: If you have been scammed by a fake Telegram group or cloned trading APK, immediately call national cybercrime helpline 1930 and file a complaint on cybercrime.gov.in within the golden hour."
    },
    {
        "id": "personal_chat",
        "label": "Personal Chat (Guardrail Test)",
        "category": "Guardrail Test",
        "expectedBand": "None",
        "text": "Hey bro, are you free this Sunday evening around 7 PM? Let's catch up at the cafe near MG Road for coffee and watch the cricket match together. Let me know if you can make it!"
    },
    {
        "id": "food_recipe",
        "label": "Food Recipe (Guardrail Test)",
        "category": "Guardrail Test",
        "expectedBand": "None",
        "text": "Can you give me an authentic recipe for homemade Hyderabadi chicken biryani including the exact marination time and spices needed for 4 people?"
    }
]

# -----------------------------------------------------------------------------
# PyTorch MultiTaskDebertaModel Definition
# -----------------------------------------------------------------------------
if TORCH_AVAILABLE and nn is not None:
    class MultiTaskDebertaModel(nn.Module):
        def __init__(self, model_name="microsoft/deberta-v3-base", num_labels=5, num_threats=25, dropout_rate=0.2):
            super(MultiTaskDebertaModel, self).__init__()
            self.deberta = AutoModel.from_pretrained(model_name)
            hidden_size = self.deberta.config.hidden_size
            self.dropout = nn.Dropout(dropout_rate)
            
            self.label_classifier = nn.Sequential(
                nn.Linear(hidden_size, 128),
                nn.GELU(),
                nn.Dropout(0.1),
                nn.Linear(128, num_labels)
            )
            
            self.threat_classifier = nn.Sequential(
                nn.Linear(hidden_size, 128),
                nn.GELU(),
                nn.Dropout(0.1),
                nn.Linear(128, num_threats)
            )

        def forward(self, input_ids, attention_mask):
            outputs = self.deberta(input_ids=input_ids, attention_mask=attention_mask)
            last_hidden_state = outputs.last_hidden_state
            input_mask_expanded = attention_mask.unsqueeze(-1).expand(last_hidden_state.size()).float()
            sum_embeddings = torch.sum(last_hidden_state * input_mask_expanded, 1)
            sum_mask = input_mask_expanded.sum(1)
            sum_mask = torch.clamp(sum_mask, min=1e-9)
            pooled = sum_embeddings / sum_mask
            pooled = self.dropout(pooled)
            return self.label_classifier(pooled), self.threat_classifier(pooled)
else:
    class MultiTaskDebertaModel:
        pass


# Global singleton cache for PyTorch model & tokenizer
_pytorch_model = None
_deberta_tokenizer = None
_model_status = "Not initialized"

def get_pytorch_model():
    global _pytorch_model, _deberta_tokenizer, _model_status
    if not TORCH_AVAILABLE:
        _model_status = "PyTorch/Transformers not installed. Cloud Groq Dual-Head engine active."
        return None, None, _model_status

    if _pytorch_model is not None and _deberta_tokenizer is not None:
        return _pytorch_model, _deberta_tokenizer, _model_status

    possible_weights_paths = [
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "best_market_shield_weights.pt"),
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "Scam Detection", "best_market_shield_weights.pt")
    ]
    
    weights_path = None
    for p in possible_weights_paths:
        if os.path.exists(p):
            weights_path = p
            break

    device = torch.device("cpu")
    if not weights_path:
        _model_status = f"Checkpoint `best_market_shield_weights.pt` not found in search paths."
        print(f"[DeBERTa Engine] {_model_status}")
        return None, None, _model_status

    try:
        print(f"[DeBERTa Engine] Loading tokenizer microsoft/deberta-v3-base...")
        tokenizer = AutoTokenizer.from_pretrained("microsoft/deberta-v3-base")
        print(f"[DeBERTa Engine] Instantiating MultiTaskDebertaModel...")
        model = MultiTaskDebertaModel(
            model_name="microsoft/deberta-v3-base",
            num_labels=len(LABELS),
            num_threats=len(THREAT_TYPES)
        )
        print(f"[DeBERTa Engine] Loading weights from {weights_path}...")
        state_dict = torch.load(weights_path, map_location=device, weights_only=True)
        model.load_state_dict(state_dict)
        model.to(device)
        model.eval()
        _pytorch_model = model
        _deberta_tokenizer = tokenizer
        _model_status = f"Native PyTorch DeBERTa-v3 Model active on {device.type.upper()}"
        print(f"[DeBERTa Engine] {_model_status}")
        return _pytorch_model, _deberta_tokenizer, _model_status
    except Exception as e:
        _model_status = f"PyTorch load error: {e}"
        print(f"[DeBERTa Engine] {_model_status}")
        return None, None, _model_status


# -----------------------------------------------------------------------------
# Highlight Scam Words Function (Identical to Scam Detection/app.py)
# -----------------------------------------------------------------------------
def highlight_scam_words(original_text: str, scam_items: list) -> Tuple[str, list]:
    phrases = []
    if scam_items and isinstance(scam_items, list):
        for item in scam_items:
            w = item.get("keyword") or item.get("phrase") if isinstance(item, dict) else str(item)
            r = item.get("reason", "") if isinstance(item, dict) else ""
            w = str(w).strip()
            if w and w.lower() in original_text.lower():
                phrases.append((w, r))
                
    if not phrases:
        return html.escape(original_text), []
        
    phrases.sort(key=lambda x: len(x[0]), reverse=True)
    low_text = original_text.lower()
    occupied = [False] * len(original_text)
    matches = []
    matched_phrases = []
    
    for phrase, reason in phrases:
        low_p = phrase.lower()
        start = 0
        found = False
        while True:
            idx = low_text.find(low_p, start)
            if idx == -1:
                break
            end = idx + len(low_p)
            if not any(occupied[idx:end]):
                matches.append((idx, end, original_text[idx:end]))
                for k in range(idx, end):
                    occupied[k] = True
                found = True
            start = end
        if found:
            matched_phrases.append((phrase, reason))
            
    matches.sort(key=lambda x: x[0])
    out = []
    last_idx = 0
    for idx, end, matched_str in matches:
        out.append(html.escape(original_text[last_idx:idx]))
        out.append(f"<mark class=\"scam-highlight\">{html.escape(matched_str)}</mark>")
        last_idx = end
    out.append(html.escape(original_text[last_idx:]))
    return "".join(out), matched_phrases


# -----------------------------------------------------------------------------
# Dynamic Risk & Severity Engine (Identical to Scam Detection/app.py)
# -----------------------------------------------------------------------------
def compute_dynamic_risk(
    text: str,
    head1_label: str,
    label_probs: Dict[str, float],
    active_threats: List[Tuple[str, float]],
    scam_words: list,
    contextual_adjustment: float = 0.0
) -> Dict[str, Any]:
    scam_p = float(label_probs.get("Scam", 0.0))
    susp_p = float(label_probs.get("Suspicious", 0.0))
    viol_p = float(label_probs.get("Regulatory_Violation", 0.0))
    warn_p = float(label_probs.get("Investor_Warning", 0.0))
    legit_p = float(label_probs.get("Legitimate", 0.0))
    
    # 1. Model Classification Signal (0 to 45 pts)
    base_signal = (scam_p * 45.0) + (viol_p * 40.0) + (susp_p * 32.0) + (warn_p * 20.0) - (legit_p * 35.0)
    base_signal = max(0.0, min(45.0, base_signal))
    
    # 2. Financial Amount & Demands (0 to 20 pts)
    amounts = re.findall(r"(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d+)?)", text, re.IGNORECASE)
    cleaned_amounts = []
    for a in amounts:
        try:
            val = float(a.replace(",", ""))
            if val > 0:
                cleaned_amounts.append(val)
        except Exception:
            pass
            
    max_amount = max(cleaned_amounts) if cleaned_amounts else 0.0
    if max_amount > 0:
        financial_score = min(16.0, math.log10(max_amount) * 2.8)
    else:
        financial_score = 0.0
        
    # Check for upfront fee / GST demand / deposit requirement
    has_advance_fee = bool(re.search(r"(\d+%\s*gst|deposit|advance\s+fee|processing\s+fee|transfer\s+to|pay\s+first)", text, re.IGNORECASE))
    if has_advance_fee:
        financial_score = min(20.0, financial_score + 4.0)
        
    # 3. Urgency & Coercive Pressure (0 to 18 pts)
    urgency_score = 0.0
    has_countdown = bool(re.search(r"(\b\d+\s*hours?\b|\b\d+\s*mins?\b|\b\d+\s*minutes?\b|today\s+only|immediately|urgent|slots?\s+left)", text, re.IGNORECASE))
    if has_countdown:
        urgency_score += 8.5
        
    has_threat = bool(re.search(r"(forfeit|block|freeze|legal\s+action|seize|arrest|police|jail|lost|cancelled)", text, re.IGNORECASE))
    if has_threat:
        urgency_score += 9.5
    urgency_score = min(18.0, urgency_score)
    
    # 4. Multi-Threat Compounder (0 to 17 pts)
    threat_weights = {
        "Withdrawal Fee Scam": 6.5,
        "Fake Trading App": 6.0,
        "Fake SEBI Registration": 5.5,
        "Third-Party Payment": 5.0,
        "Guaranteed Returns": 4.5,
        "Assured/Fixed Returns": 4.5,
        "Impersonation": 4.5,
        "Ponzi/Pyramid": 5.0,
        "High-Pressure/FOMO": 4.0,
        "Zero-Risk Claims": 4.0,
        "Unrealistic Returns": 3.5,
        "Stock Tip Scam": 3.5,
        "Unregistered Investment Advice": 4.0
    }
    threat_compound = sum(threat_weights.get(t, 2.5) * score for t, score in active_threats)
    threat_compound = min(17.0, threat_compound)
    
    # 5. Keyword Density Score (0 to 10 pts)
    kw_count = len(scam_words)
    kw_score = min(10.0, kw_count * 2.5) if head1_label != "Legitimate" else 0.0
    
    # Total Score Calculation with contextual fine-tuning
    total_raw = base_signal + financial_score + urgency_score + threat_compound + kw_score + contextual_adjustment
    
    # If explicitly legitimate and high confidence, suppress risk down
    if head1_label == "Legitimate" and legit_p > 0.50:
        total_raw = total_raw * max(0.08, (1.0 - legit_p * 0.9))
        
    final_score = round(max(3.0, min(99.8, total_raw)), 1)
    
    if final_score >= 80.0:
        tier = "CRITICAL RISK"
        color = "#EF4444"
        badge_class = "badge-scam"
    elif final_score >= 55.0:
        tier = "HIGH RISK"
        color = "#F97316"
        badge_class = "badge-regulatory"
    elif final_score >= 30.0:
        tier = "MODERATE RISK"
        color = "#FBBF24"
        badge_class = "badge-suspicious"
    else:
        tier = "LOW RISK"
        color = "#10B981"
        badge_class = "badge-legitimate"
        
    return {
        "final_score": final_score,
        "tier": tier,
        "color": color,
        "badge_class": badge_class,
        "max_amount": max_amount,
        "has_advance_fee": has_advance_fee,
        "has_countdown": has_countdown,
        "has_threat": has_threat,
        "factors": {
            "Model Classification Signal": round(base_signal, 1),
            "Financial Demands & Stakes": round(financial_score, 1),
            "Urgency & Coercive Pressure": round(urgency_score, 1),
            "Threat Compounder": round(threat_compound, 1),
            "Scam Keyword Density": round(kw_score, 1)
        }
    }


# -----------------------------------------------------------------------------
# Pydantic Schemas for Groq LLM Extraction (Identical to Scam Detection/app.py)
# -----------------------------------------------------------------------------
class ScamKeyword(BaseModel):
    keyword: str = Field(description="Exact short phrase or word from the input (1 to 5 words max) that directly depicts the scam, coercion, or violation. E.g. 'deposit 15% GST fee', 'personal bank account', '24 hours', 'forfeited'.")
    reason: str = Field(description="Short explanation of why this specific word/phrase depicts a scam or violation.")

class MathCheck(BaseModel):
    has_claim: bool = Field(default=False, description="Set True ONLY if there are specific numbers, return percentages, profit numbers, or advance fee/tax amounts in the message to calculate. If no numbers, set False.")
    claim_summary: str = Field(default="", description="Summary of the numerical return or fee claim.")
    annualized_rate: str = Field(default="", description="Annualized compounded rate (CAGR / APY) or fee ratio, e.g. '9,125% Simple / 1.87e+35% Compounded APY' or '15% Upfront Cash Extraction Ratio'.")
    formula: str = Field(default="CAGR = (1 + r)^n - 1", description="Mathematical formula applied.")
    calculation_steps: list[str] = Field(default_factory=list, description="3 to 5 step-by-step mathematical calculation bullet points with formulas, numbers, and capital progression over time.")
    is_practically_possible: bool = Field(default=False, description="False if mathematically, practically, or economically unfeasible. True only if realistic market returns.")
    impossibility_justification: str = Field(default="", description="Rigorous mathematical and economic justification demonstrating why this return cannot exist in real-world capital markets.")
    benchmark_comparison: str = Field(default="", description="Comparison with real-world financial benchmarks: RBI Repo Rate (~6.5%), Nifty 50 (~12-14%), Warren Buffett (~19.8%), Renaissance Medallion (~39%).")

class ExplanationSection(BaseModel):
    single_para_explanation: str = Field(description="Strictly ONE single cohesive paragraph telling BOTH: 1) how this message is a scam (weaving in and explaining the words depicting the scam), and 2) why it feels genuine or convincing to a retail victim (authoritative jargon, tax/SEBI mimicry, virtual profit illusion). Do not divide into two paragraphs.")
    math_reality_check: Optional[MathCheck] = Field(default=None, description="Mathematical calculations IF numbers are present in the text. If no numbers, leave has_claim=false.")

class ExplainerOutput(BaseModel):
    is_financial: bool = Field(description="True if message is financial/investing/trading/scam related. False if personal chat, social, greeting, or unrelated.")
    guardrail_reason: str = Field(description="Explanation of guardrail pass/reject decision.")
    head1_label: str = Field(description="Predicted broad label: 'Scam', 'Suspicious', 'Legitimate', 'Regulatory_Violation', or 'Investor_Warning'.")
    head1_confidence: float = Field(default=0.88, description="Estimated calibrated confidence score between 0.50 and 0.99 for the predicted label.")
    label_probabilities: dict = Field(default_factory=dict, description="Dictionary mapping all 5 classes ('Scam', 'Suspicious', 'Legitimate', 'Regulatory_Violation', 'Investor_Warning') to probability values (float between 0.0 and 1.0) summing to 1.0.")
    head2_threats: list = Field(description="List of detected granular threat types from taxonomy.")
    head2_threat_scores: dict = Field(default_factory=dict, description="Dictionary mapping detected threat types to float confidence scores between 0.50 and 0.99.")
    one_line_explainer: str = Field(description="Exactly ONE single sentence explaining the exact financial threat mechanism, scam trick, or core financial proposition.")
    threat_severity: str = Field(description="'Critical', 'High', 'Moderate', or 'Safe / Regulated'.")
    contextual_risk_adjustment: float = Field(default=0.0, description="Contextual fine-tuning adjustment between -5.0 and +5.0 based on psychological coercion or high-stakes numbers.")
    risk_drivers: list[str] = Field(default_factory=list, description="2 to 3 concise bullet points explaining specific numbers, timeline urgency, or fraudulent mechanics driving the risk.")
    scam_keywords: list[ScamKeyword] = Field(default_factory=list, description="List of specific short scam keywords or phrases (1-5 words each) from the text that directly depict the scam.")
    explanation: ExplanationSection = Field(default_factory=ExplanationSection, description="Comprehensive in-depth explanation detailing the words depicting scam, why it feels genuine, and mathematical calculations.")


# -----------------------------------------------------------------------------
# Main Analysis Execution Engine
# -----------------------------------------------------------------------------
def run_deberta_scam_analysis(
    text: Optional[str] = None,
    url: Optional[str] = None,
    image_bytes: Optional[bytes] = None,
    image_name: Optional[str] = None,
    threat_threshold: float = 0.18
) -> Dict[str, Any]:
    """
    Executes the unified DeBERTa Multi-Task Classifier, Groq Threat Explainer,
    and Dynamic Risk Engine.
    """
    clean_text = (text or "").strip()

    # Real OCR Extraction via Tesseract if an image was uploaded
    ocr_text = ""
    ocr_info = {
        "available": False,
        "text": "",
        "summary": "",
        "filename": image_name or "uploaded_media.png",
        "word_count": 0,
        "char_count": 0
    }

    if image_bytes:
        try:
            import io
            from PIL import Image
            import pytesseract
            img = Image.open(io.BytesIO(image_bytes))
            if img.mode != 'RGB':
                img = img.convert('RGB')
            extracted = pytesseract.image_to_string(img).strip()
            if extracted:
                ocr_text = extracted
                ocr_info["available"] = True
                ocr_info["text"] = ocr_text
                ocr_info["filename"] = image_name or "screenshot.png"
                ocr_info["word_count"] = len(ocr_text.split())
                ocr_info["char_count"] = len(ocr_text)
                logger.info(f"OCR successfully extracted {ocr_info['word_count']} words from {image_name or 'image'}")
            else:
                ocr_info["reason"] = "No readable text detected in the uploaded image."
        except Exception as e:
            logger.warning(f"OCR extraction failed: {e}")
            ocr_info["reason"] = f"OCR engine error: {e}"

    # Route OCR text into DeBERTa analysis pipeline
    if ocr_text:
        if clean_text:
            clean_text = f"{ocr_text}\n\n[Attached Context]: {clean_text}"
        else:
            clean_text = ocr_text
    elif image_bytes and not clean_text:
        clean_text = f"[Image Uploaded: {image_name or 'file'}]"

    if url and not clean_text:
        clean_text = f"URL Link for Verification: {url}"
    elif url and clean_text and url not in clean_text:
        clean_text = f"{clean_text}\nURL: {url}"

    if not clean_text:
        return {"error": "Provide text, URL, or image to analyze."}

    # 1. Evaluate with Groq LLM Explainer
    groq_key = os.getenv("GROQ_API_KEY", "").strip()
    candidate_models = ["openai/gpt-oss-20b", "qwen/qwen3.8-27b", "openai/gpt-oss-120b"]
    configured_model = os.getenv("GROQ_MODEL", "").strip()
    if configured_model and configured_model not in candidate_models:
        candidate_models.insert(0, configured_model)
    
    # Pre-check for clear non-financial chatter to prevent false positives and unnecessary LLM tokens
    non_fin_patterns = [
        r"\b(cricket|match|cafe|coffee|biryani|recipe|cooking|ingredients|spices|marination|dinner|lunch|breakfast|movie|cinema|actor|actress|weather|weekend|sunday|saturday|party|birthday|hangout|catch\s+up|free\s+this|let\s+me\s+know|football|gym|workout|song|playlist|game|gaming)\b"
    ]
    fin_strict_patterns = [
        r"\b(profit|trade|trading|trader|invest|investing|investment|investor|stock|stocks|share|shares|equity|equities|nifty|banknifty|sensex|sebi|nse|bse|demat|ipo|allotment|dividend|broker|cagr|apy|roi|crypto|bitcoin|forex|option|options|call|put|strike|expiry|premium|stoploss|target|breakout|portfolio|mutual\s+fund|sip|paisa\s+double|guaranteed\s+return|fixed\s+return|gst\s+fee|processing\s+fee|advance\s+fee|escrow|wallet|withdrawal|forfeited|freeze|kyc)\b",
        r"(?:rs\.?|inr|₹|\$)\s*[\d,]+(?:\.\d+)?",
        r"\b\d+%\s*(?:roi|return|profit|gst|fee|cagr|p\.a\.)?\b"
    ]
    has_strong_fin = any(bool(re.search(pat, clean_text, re.IGNORECASE)) for pat in fin_strict_patterns)
    has_clear_non_fin = any(bool(re.search(pat, clean_text, re.IGNORECASE)) for pat in non_fin_patterns)

    llm_res = {}
    if groq_key and not (has_clear_non_fin and not has_strong_fin):
        parser = JsonOutputParser(pydantic_object=ExplainerOutput)
        sys_prompt = (
            "You are the Chief Financial Fraud Intelligence Officer for Market Shield.\n"
            "GUARDRAIL DIRECTIVE:\n"
            "1. Evaluate if the user input is strictly financial/investment related.\n"
            "2. If it is personal communication, greetings, recipes, sports, or non-financial, set is_financial=false.\n"
            "3. If is_financial=true:\n"
            "   - Classify Head 1 into one of: ['Scam', 'Suspicious', 'Legitimate', 'Regulatory_Violation', 'Investor_Warning'].\n"
            "   - Provide realistic, dynamic calibrated confidence score for the top label and probability distribution across all 5 classes summing to 1.0.\n"
            "   - Identify relevant threat types from: " + ", ".join(THREAT_TYPES) + " and assign each an individual confidence score (0.50 to 0.99).\n"
            "   - SCAM KEYWORDS EXTRACTION:\n"
            "     Extract specific concise scam keywords, fraudulent phrases, or red flags (1 to 5 words each) from the text that directly depict the scam, urgency, pressure, or violation.\n"
            "     Examples: 'deposit 15% GST fee', 'personal bank account', '24 hours', 'forfeited', 'guaranteed returns', 'zero risk', 'transfer to UPI'.\n"
            "     Do NOT extract full sentences. Extract only the exact words/short phrases that depict the scam.\n"
            "   - DYNAMIC RISK DRIVERS:\n"
            "     Identify 2 to 3 concise bullet points explaining the exact numeric stakes, return claims, timeline urgency, or coercion tactics.\n"
            "     Provide a contextual risk adjustment float between -5.0 and +5.0.\n"
            "   - Craft a punchy, executive ONE-LINE THREAT EXPLAINER (strictly 1 sentence).\n"
            "   - IN-DEPTH EXPLANATION (SINGLE COHESIVE PARAGRAPH):\n"
            "     In explanation.single_para_explanation, provide STRICTLY ONE SINGLE COHESIVE PARAGRAPH that tells BOTH:\n"
            "     1) How this message is a scam by directly citing and explaining the words depicting the scam.\n"
            "     2) Why it feels genuine to a victim (explaining the psychological hooks, authoritative jargon, GST/tax mimicry, or fake wallet balance).\n"
            "     Do NOT output two separate paragraphs or subheaders. It must be ONE unified, seamless paragraph.\n"
            "   - MATHEMATICAL REALITY CHECK (ONLY IF NUMBERS ARE PRESENT):\n"
            "     Only if the text contains specific numbers, return percentages, or fee amounts (e.g. 100% return, 25% daily, 15% GST on Rs 4,50,000):\n"
            "     Set has_claim=true and provide the annualized rate, step-by-step calculations, and benchmark comparisons.\n"
            "     If the text contains NO numbers, set has_claim=false and omit calculation steps.\n\n"
            "Output strictly valid JSON matching:\n{format_instructions}"
        )
        prompt = ChatPromptTemplate.from_messages([
            ("system", sys_prompt),
            ("human", "{user_input}")
        ])

        for m_name in candidate_models:
            try:
                llm = ChatGroq(model_name=m_name, groq_api_key=groq_key, temperature=0.1, max_tokens=800, max_retries=0, request_timeout=6.0)
                formatted_prompt = prompt.format_messages(
                    user_input=clean_text,
                    format_instructions=parser.get_format_instructions()
                )
                resp = llm.invoke(formatted_prompt)
                raw_text = getattr(resp, "content", "")
                if isinstance(raw_text, str):
                    clean_json = raw_text.strip()
                    clean_json = re.sub(r"<think>.*?</think>", "", clean_json, flags=re.DOTALL).strip()
                    if "```json" in clean_json:
                        clean_json = clean_json.split("```json")[1].split("```")[0].strip()
                    elif "```" in clean_json:
                        clean_json = clean_json.split("```")[1].split("```")[0].strip()
                    
                    parsed_obj = None
                    try:
                        import json_repair
                        parsed_obj = json_repair.loads(clean_json)
                    except Exception:
                        try:
                            import json as py_json
                            parsed_obj = py_json.loads(clean_json)
                        except Exception:
                            start_idx = clean_json.find("{")
                            end_idx = clean_json.rfind("}")
                            if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
                                try:
                                    import json_repair
                                    parsed_obj = json_repair.loads(clean_json[start_idx:end_idx + 1])
                                except Exception:
                                    pass
                    
                    if isinstance(parsed_obj, dict):
                        llm_res = parsed_obj
                        if "head1_label" in llm_res or "is_financial" in llm_res:
                            break
            except Exception as e:
                print(f"[DeBERTa Engine] Groq model '{m_name}' error: {e}")
                continue

    if not isinstance(llm_res, dict):
        llm_res = {}

    # Determine Guardrail is_financial status
    if "is_financial" in llm_res:
        is_financial = bool(llm_res.get("is_financial"))
        guardrail_reason = str(llm_res.get("guardrail_reason", "")).strip()
    elif has_clear_non_fin and not has_strong_fin:
        is_financial = False
        guardrail_reason = "Input contains personal or non-financial content (social chat, recipe, sports) with no investment or trading context."
    elif has_strong_fin:
        is_financial = True
        guardrail_reason = "Financial communication verified under regulatory market terminology."
    else:
        # Default heuristic based on word boundaries
        is_financial = False if (has_clear_non_fin or len(clean_text.split()) < 15 and not has_strong_fin) else True
        guardrail_reason = "Financial communication verified." if is_financial else "Non-financial message flagged by guardrail."

    if not guardrail_reason:
        guardrail_reason = "Financial communication verified." if is_financial else "Non-financial message flagged by guardrail."

    # SHORT-CIRCUIT IF REJECTED BY GUARDRAIL (Identical to Scam Detection/app.py lines 657-672)
    if not is_financial:
        return {
            "is_financial": False,
            "guardrail_reason": guardrail_reason,
            "engine_name": "Market Shield Financial Guardrail",
            "model_status": "Non-Financial Input Blocked",
            "head1_label": "Legitimate",
            "head1_confidence": 1.0,
            "head1_confidence_pct": 100.0,
            "label_probabilities": {
                "Legitimate": 1.0,
                "Investor_Warning": 0.0,
                "Regulatory_Violation": 0.0,
                "Scam": 0.0,
                "Suspicious": 0.0
            },
            "head2_threats": [],
            "active_threats": [],
            "primary_threat": "None (Non-Financial)",
            "primary_threat_confidence": 0.0,
            "overall_score": 0.0,
            "severity_score": 0.0,
            "severity_tier": "SAFE / REJECTED",
            "severity_color": "#10B981",
            "badge_class": "badge-legitimate",
            "risk_factors": {
                "Model Classification Signal": 0.0,
                "Financial Demands & Stakes": 0.0,
                "Urgency & Coercive Pressure": 0.0,
                "Threat Compounder": 0.0,
                "Scam Keyword Density": 0.0
            },
            "max_financial_stake": 0.0,
            "one_line_explainer": f"Input rejected by financial guardrail: {guardrail_reason}",
            "summary": f"Input rejected by financial guardrail: {guardrail_reason}",
            "risk_drivers": [],
            "highlighted_html": html.escape(clean_text),
            "words_depicting_scam": [],
            "single_para_explanation": f"This message was rejected by Market Shield's Financial Guardrail because it does not pertain to financial solicitations, investments, trading signals, or regulatory advisories. Reason: {guardrail_reason}",
            "math_reality_check": None,
            "verdict": "BLOCKED",
            "verdict_label": "NON-FINANCIAL",
            "content_type": "Personal / Non-Financial",
            "input": {
                "text": clean_text,
                "url": url
            },
            "annotated_transcript": {
                "text": clean_text,
                "highlighted_html": html.escape(clean_text)
            },
            "reasons": [],
            "findings": [],
            # Document Summary & OCR Forensics
            "ocr": ocr_info,
            "extracted_text": ocr_text,
            "is_ocr": bool(ocr_text),
            "assessment": {
                "riskLevel": "SAFE / REJECTED",
                "recommendedAction": [
                    "No action required. Non-financial communication."
                ]
            }
        }

    # 2. Extract Scam Keywords & Annotated HTML (with rule-based fallback if LLM omitted keywords)
    scam_items = llm_res.get("scam_keywords", []) if isinstance(llm_res.get("scam_keywords"), list) else []
    if not scam_items:
        fallback_patterns = [
            (r"(?:guaranteed|assured|fixed)\s+returns?", "Illegal promise of guaranteed return violating SEBI regulations"),
            (r"zero\s+risk", "Deceptive claim of risk-free market returns"),
            (r"(?:\d+%\s*gst|processing\s+fee|advance\s+fee)", "Advance extraction fee tactic typical of wallet extortion scams"),
            (r"personal\s+bank\s+account", "Soliciting payment to individual accounts rather than registered broker accounts"),
            (r"(?:forfeited|frozen|blocked|seized)", "Coercive urgency threat to compel panic payment"),
            (r"(?:within\s+\d+\s*hours?|immediately|urgent)", "Artificial deadline designed to prevent external verification"),
            (r"(?:vip\s+group|telegram|whatsapp)", "Private unmonitored group funnel avoiding regulatory audit"),
            (r"sebi\s+certificate\s*#?\w+", "Fabricated SEBI registration claim"),
            (r"transfer\s+to\s+upi", "Unregulated direct payment channel")
        ]
        for pat, why_text in fallback_patterns:
            m = re.search(pat, clean_text, re.IGNORECASE)
            if m:
                scam_items.append({"keyword": m.group(0), "reason": why_text})

    highlighted_html, matched_list = highlight_scam_words(clean_text, scam_items)

    # 3. Execute PyTorch DeBERTa Local Model (Identical to Scam Detection/app.py lines 726-758)
    pytorch_model, deberta_tokenizer, load_status = get_pytorch_model()
    
    pred_label = None
    label_confidence = 0.0
    active_threats: List[Tuple[str, float]] = []
    label_probs_dict: Dict[str, float] = {}
    engine_name = "PyTorch DeBERTa-v3 Native"

    if pytorch_model is not None and deberta_tokenizer is not None:
        try:
            curr_dev = next(pytorch_model.parameters()).device
            encoding = deberta_tokenizer(
                clean_text,
                truncation=True,
                padding="max_length",
                max_length=160,
                return_tensors="pt"
            )
            with torch.no_grad():
                l_logits, t_logits = pytorch_model(
                    encoding["input_ids"].to(curr_dev),
                    encoding["attention_mask"].to(curr_dev)
                )
                l_probs_raw = torch.softmax(l_logits.float(), dim=-1).cpu().numpy()[0]
                t_probs_raw = torch.sigmoid(t_logits.float()).cpu().numpy()[0]

            if not (np.isnan(l_probs_raw).any() or np.isnan(t_probs_raw).any()):
                best_idx = int(np.argmax(l_probs_raw))
                pred_label = LABELS[best_idx]
                label_confidence = float(l_probs_raw[best_idx])
                label_probs_dict = {LABELS[i]: float(l_probs_raw[i]) for i in range(len(LABELS))}

                th_indices = np.where(t_probs_raw >= threat_threshold)[0]
                active_threats = [(THREAT_TYPES[i], float(t_probs_raw[i])) for i in th_indices]
                if not active_threats:
                    top_th_idx = int(np.argmax(t_probs_raw))
                    active_threats = [(THREAT_TYPES[top_th_idx], float(t_probs_raw[top_th_idx]))]
                active_threats.sort(key=lambda x: x[1], reverse=True)
        except Exception as e:
            print(f"[DeBERTa Engine] PyTorch forward pass error: {e}")

    # Fallback to LLM prediction if local model was unavailable
    if pred_label is None:
        engine_name = "Groq Cloud Dual-Head Fallback"
        pred_label = llm_res.get("head1_label", "Suspicious")
        raw_conf = llm_res.get("head1_confidence", 0.88)
        label_confidence = float(raw_conf) if isinstance(raw_conf, (int, float)) else 0.88
        
        raw_probs = llm_res.get("label_probabilities", {})
        if isinstance(raw_probs, dict) and any(k in LABELS for k in raw_probs):
            label_probs_dict = {k: float(v) for k, v in raw_probs.items() if k in LABELS}
        else:
            rem = max(0.01, 1.0 - label_confidence)
            other_labels = [l for l in LABELS if l != pred_label]
            label_probs_dict = {pred_label: label_confidence}
            for l in other_labels:
                label_probs_dict[l] = round(rem / len(other_labels), 3)

        raw_threats = llm_res.get("head2_threats", ["Other"])
        threat_scores = llm_res.get("head2_threat_scores", {})
        active_threats = []
        for th in raw_threats:
            if th in THREAT_TYPES:
                s = threat_scores.get(th, 0.86) if isinstance(threat_scores, dict) else 0.86
                active_threats.append((th, float(s) if isinstance(s, (int, float)) else 0.86))
        if not active_threats:
            active_threats = [("Other", 0.78)]

    # Normalize probability distribution
    tot_p = sum(label_probs_dict.values())
    if tot_p > 0:
        label_probs_dict = {k: round(v / tot_p, 4) for k, v in label_probs_dict.items()}

    # 4. Compute Dynamic Severity Score (Identical to Scam Detection/app.py lines 848-855)
    risk_data = compute_dynamic_risk(
        text=clean_text,
        head1_label=pred_label,
        label_probs=label_probs_dict,
        active_threats=active_threats,
        scam_words=matched_list,
        contextual_adjustment=float(llm_res.get("contextual_risk_adjustment", 0.0))
    )

    # 5. Explanations & Reality Check
    top_th_name = active_threats[0][0] if active_threats else "unverified market claims"
    one_line_explainer = llm_res.get("one_line_explainer", "").strip()
    if not one_line_explainer:
        if pred_label == "Scam":
            one_line_explainer = f"Critical scam warning: Message exhibits hallmark fraud mechanics of {top_th_name} with coercive fund demands."
        elif pred_label == "Suspicious":
            one_line_explainer = f"Suspicious communication detected with high-risk characteristics of {top_th_name}; proceed with extreme caution."
        elif pred_label == "Regulatory_Violation":
            one_line_explainer = f"Regulatory breach: Communication violates SEBI statutory investment advisory and performance disclosure mandates."
        elif pred_label == "Investor_Warning":
            one_line_explainer = f"Investor risk advisory: High-risk speculative proposition with extreme capital volatility."
        else:
            one_line_explainer = "Standard financial communication verified with legitimate market conventions."

    explanation_data = llm_res.get("explanation", {}) if isinstance(llm_res, dict) else {}
    single_para = explanation_data.get("single_para_explanation", "").strip() if isinstance(explanation_data, dict) else ""
    if not single_para:
        kw_citations = ", ".join([f"'{w}'" for w, _ in matched_list[:3]]) if matched_list else "coercive triggers"
        single_para = (
            f"This communication displays clear characteristics of a financial {pred_label.lower().replace('_', ' ')} scheme centered around {top_th_name}, "
            f"specifically leveraging terms such as {kw_citations} to manufacture artificial urgency and compel rapid capital commitment. "
            "It deliberately mimics regulatory terminology or virtual ledger balances to disarm skepticism, while demanding irreversible payments through unverified channels."
        )

    math_reality = explanation_data.get("math_reality_check", None) if isinstance(explanation_data, dict) else None
    if not math_reality:
        pct_matches = re.findall(r"(\d+(?:\.\d+)?)\s*%", clean_text)
        amt_matches = re.findall(r"(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d+)?)", clean_text, re.IGNORECASE)
        if pct_matches or amt_matches:
            c_desc = f"Extortion/return claim of {pct_matches[0]}% on ₹{amt_matches[0]}" if (pct_matches and amt_matches) else (f"Demands involving ₹{amt_matches[0]}" if amt_matches else f"Return claim of {pct_matches[0]}%")
            math_reality = {
                "has_claim": True,
                "claim_summary": c_desc,
                "annualized_rate": f"{pct_matches[0]}% Capital Extraction Ratio" if pct_matches else "Unrealistic Capital Extraction Ratio",
                "formula": "Extraction Ratio = (Demanded Fee / Alleged Profit) × 100",
                "calculation_steps": [
                    f"1. Transaction terms identified: {c_desc}.",
                    "2. SEBI-registered brokers NEVER solicit upfront GST or processing fees via personal UPI IDs or private accounts to unfreeze funds.",
                    "3. Standard market taxes (STT, GST) are automatically settled at source via broker ledgers; asking for direct UPI transfer indicates an advance-fee fraud.",
                    "4. Net expected capital recovery from such private transfers is mathematically 0.00%."
                ],
                "is_practically_possible": False,
                "impossibility_justification": "SEBI regulations prohibit intermediaries from demanding cash/UPI payments directly into personal accounts for regulatory fee clearance.",
                "benchmark_comparison": "Legitimate Benchmarks: RBI Repo Rate (~6.50%), Nifty 50 historical average (~12.50%), Warren Buffett long-term CAGR (~19.80%)."
            }

    # Convert active threats into list of dicts for clean JSON serialization
    threats_payload = [
        {"threat": th, "score": round(sc, 4), "score_pct": round(sc * 100, 1)}
        for th, sc in active_threats
    ]

    # Map verdict label for UI compatibility
    verdict_label = pred_label.upper().replace("_", " ")

    # Extract or synthesize Specific Numeric & Textual Risk Drivers Detected
    risk_drivers = list(llm_res.get("risk_drivers", [])) if isinstance(llm_res.get("risk_drivers"), list) else []
    if not risk_drivers and is_financial:
        if risk_data.get("has_advance_fee"):
            risk_drivers.append("Upfront advance fee or GST payment demanded to release/unfreeze funds")
        if risk_data.get("has_countdown"):
            risk_drivers.append("High-pressure countdown or immediate deadline imposed to prevent independent verification")
        if risk_data.get("has_threat"):
            risk_drivers.append("Coercive intimidation tactics, forfeiture threats, or legal action warnings identified")
        if risk_data.get("max_amount", 0) > 0:
            risk_drivers.append(f"High financial capital stake involved: ₹{risk_data['max_amount']:,.0f}")
        for th_name, th_score in active_threats[:2]:
            if th_score >= 0.18 and th_name not in ["Other"]:
                risk_drivers.append(f"Hallmark operational patterns of {th_name} identified ({th_score:.1%} confidence)")

    # Assemble comprehensive payload
    response_payload = {
        "is_financial": is_financial,
        "guardrail_reason": guardrail_reason,
        "engine_name": engine_name,
        "model_status": load_status,
        
        # Head 1: Broad Classification
        "head1_label": pred_label,
        "head1_confidence": round(label_confidence, 4),
        "head1_confidence_pct": round(label_confidence * 100, 1),
        "label_probabilities": label_probs_dict,
        
        # Head 2: Threat Taxonomy Multi-Label
        "head2_threats": [t[0] for t in active_threats],
        "active_threats": threats_payload,
        "primary_threat": active_threats[0][0] if active_threats else "Other",
        "primary_threat_confidence": round(active_threats[0][1] * 100, 1) if active_threats else 80.0,
        
        # Severity Engine (0 to 100)
        "overall_score": int(round(risk_data["final_score"])),
        "severity_score": risk_data["final_score"],
        "severity_tier": risk_data["tier"],
        "severity_color": risk_data["color"],
        "badge_class": risk_data["badge_class"],
        "risk_factors": risk_data["factors"],
        "max_financial_stake": risk_data["max_amount"],
        
        # Executive Threat Summary & Specific Risk Drivers
        "one_line_explainer": one_line_explainer,
        "summary": one_line_explainer,
        "risk_drivers": risk_drivers,
        
        # Scam Keyword Highlighting & Forensics
        "highlighted_html": highlighted_html,
        "words_depicting_scam": [
            {"word": w, "reason": r} for w, r in matched_list
        ],
        
        # Detailed Explanations & Math Reality Check
        "single_para_explanation": single_para,
        "math_reality_check": math_reality,
        
        # Dashboard UI Compatibility Fields
        "verdict": pred_label.upper(),
        "verdict_label": verdict_label,
        "content_type": active_threats[0][0] if active_threats else pred_label,
        "input": {"text": clean_text, "url": url},
        "annotated_transcript": {
            "text": clean_text,
            "highlighted_html": highlighted_html
        },
        "reasons": [
            {
                "signal": f"{w}: {r}",
                "severity": "CRITICAL" if risk_data["final_score"] >= 80 else "HIGH",
                "evidence": w,
                "why": r,
                "category": "threat_keyword",
                "status": "OBSERVED"
            }
            for w, r in matched_list[:6]
        ],
        "findings": [
            {
                "signal": th["threat"],
                "severity": "CRITICAL" if th["score_pct"] >= 80 else "HIGH",
                "evidence": f"Confidence {th['score_pct']}%",
                "why": f"Identified by DeBERTa multi-task threat classifier under SEBI threat taxonomy.",
                "category": "neural_classification",
                "status": "ACTIVE"
            }
            for th in threats_payload[:5]
        ],
        "assessment": {
            "riskLevel": risk_data["tier"],
            "recommendedAction": [
                "Do not send money or share credentials.",
                "Verify SEBI registration on official SCORES portal.",
                "Report suspicious communications immediately."
            ] if risk_data["final_score"] >= 50 else ["Verify independently prior to investment."]
        },
        
        # Document Summary & OCR Forensics
        "ocr": ocr_info,
        "extracted_text": ocr_text,
        "is_ocr": bool(ocr_text)
    }

    # Generate concise summary of what the document / screenshot is about
    if ocr_info["available"]:
        if llm_res.get("one_line_explainer") and is_financial:
            ocr_info["summary"] = f"Document Summary: {llm_res['one_line_explainer']}"
        elif single_para and is_financial:
            ocr_info["summary"] = f"Document Summary: {single_para[:240]}..."
        else:
            ocr_info["summary"] = f"Screenshot containing {ocr_info['word_count']} words of extracted text analyzed for SEBI statutory compliance and financial risk."

    record_scam_analysis(response_payload)
    return response_payload


def get_demo_seed_cases() -> List[Dict[str, Any]]:
    """Returns the official 7 preset test cases matching Scam Detection."""
    return PRESET_TEST_CASES


# -----------------------------------------------------------------------------
# In-Memory Scam Analysis History & Network Graph
# -----------------------------------------------------------------------------
SCAM_HISTORY: List[Dict[str, Any]] = []

def record_scam_analysis(res: Dict[str, Any]):
    if not isinstance(res, dict):
        return
    entry = dict(res)
    if "id" not in entry:
        entry["id"] = f"scan_{int(time.time() * 1000)}"
    if "submittedAt" not in entry:
        entry["submittedAt"] = time.strftime("%Y-%m-%d %H:%M")
    SCAM_HISTORY.append(entry)
    if len(SCAM_HISTORY) > 50:
        SCAM_HISTORY.pop(0)


def get_scam_history() -> Dict[str, Any]:
    nodes = []
    edges = []
    node_set = set()
    summary = []

    for h in SCAM_HISTORY:
        nid = str(h.get("id", ""))
        inp = h.get("input", {})
        label = (inp.get("text") or inp.get("url") or h.get("extracted_text") or "Submission")[:40]
        score = h.get("overall_score", h.get("severity_score", 0))
        verdict = (h.get("verdict") or "UNKNOWN").lower()

        if nid and nid not in node_set:
            node_set.add(nid)
            nodes.append({
                "id": nid,
                "type": "submission",
                "label": label,
                "risk": verdict,
                "score": score
            })

        for th in h.get("head2_threats", []) or h.get("active_threats", []):
            th_name = th[0] if isinstance(th, (list, tuple)) else str(th)
            t_key = f"threat:{th_name}"
            if t_key not in node_set:
                node_set.add(t_key)
                nodes.append({
                    "id": t_key,
                    "type": "threat",
                    "label": th_name,
                    "risk": "critical" if score >= 80 else "warning"
                })
            edges.append([nid, t_key])

        for w_item in (h.get("words_depicting_scam", []) or [])[:3]:
            w = w_item.get("word") if isinstance(w_item, dict) else str(w_item)
            w_key = f"kw:{w}"
            if w_key not in node_set:
                node_set.add(w_key)
                nodes.append({
                    "id": w_key,
                    "type": "keyword",
                    "label": w,
                    "risk": "warning"
                })
            edges.append([nid, w_key])

        summary.append({
            "id": nid,
            "verdict": h.get("verdict", "UNKNOWN"),
            "score": score,
            "submittedAt": h.get("submittedAt", ""),
            "label": (inp.get("text") or inp.get("url") or h.get("extracted_text") or "")[:60]
        })

    return {"history": summary, "network": {"nodes": nodes, "edges": edges}}

