from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Fraud Detection & Transaction Risk Agent API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Transaction(BaseModel):
    transaction_id: str
    amount: float
    transaction_type: str
    date: str
    time: str
    location: str
    device: str
    recipient: str
    failed_attempts: int = 0
    average_previous_amount: float = 0
    previous_frequency: float = 0
    new_device: bool = False
    new_location: bool = False

@app.get("/")
def root():
    return {"message": "Fraud Detection & Transaction Risk Agent API is running"}

@app.get("/api/health")
def health():
    return {"status": "healthy"}

@app.post("/api/analyze")
def analyze(tx: Transaction):
    score = 12
    reasons = []

    if tx.new_device:
        score += 28
        reasons.append({
            "title": "New Device",
            "description": "Transaction originated from a device not previously associated with this account.",
            "severity": "high"
        })

    if tx.new_location:
        score += 22
        reasons.append({
            "title": "Unusual Location",
            "description": "Location differs significantly from the account's usual transaction pattern.",
            "severity": "high"
        })

    if tx.failed_attempts >= 3:
        score += 16
        reasons.append({
            "title": "Failed Attempts",
            "description": f"{tx.failed_attempts} failed attempts were detected before the transaction.",
            "severity": "medium"
        })

    if tx.average_previous_amount and tx.amount > tx.average_previous_amount * 2:
        score += 20
        reasons.append({
            "title": "Unusual Amount",
            "description": "Transaction amount is substantially higher than the previous average.",
            "severity": "high"
        })

    score = min(score, 99)
    level = "HIGH" if score >= 70 else "MEDIUM" if score >= 40 else "LOW"

    if not reasons:
        reasons.append({
            "title": "Normal Pattern",
            "description": "No major anomaly was detected from the submitted transaction attributes.",
            "severity": "low"
        })

    return {
        "transaction_id": tx.transaction_id,
        "risk_score": score,
        "risk_level": level,
        "status": "Suspicious Transaction — Verification Recommended" if level == "HIGH" else "Review Recommended" if level == "MEDIUM" else "Transaction Appears Low Risk",
        "message": "This transaction shows patterns associated with high fraud risk." if level == "HIGH" else "The transaction was evaluated against configured risk indicators.",
        "reasons": reasons
    }
