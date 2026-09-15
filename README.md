# Fraud Detection & Transaction Risk Agent

A modern fintech-style React + Vite + Tailwind CSS frontend with a Python FastAPI backend for an AI/ML college project.

## Features
- Dashboard with risk summary cards
- Transaction risk distribution donut chart
- Transaction activity and high-risk trend charts
- Suspicious transaction table
- Manual transaction analysis form
- Mock AI risk scoring and explanations
- Alerts and fraud cases
- Settings page
- Responsive/collapsible sidebar
- REST API endpoint ready for a Python/ML model later

## Project structure
```text
FraudShield/
├── frontend/   # React + Vite + Tailwind + Recharts
├── backend/    # FastAPI REST API
└── README.md
```

## Run frontend
```bash
cd frontend
npm install
npm run dev
```

## Run backend
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend API: `http://localhost:8000`
Swagger docs: `http://localhost:8000/docs`

The frontend currently uses mock data so it works immediately. The API client is included in `frontend/src/api.js` for connecting the Analyze page to the FastAPI/ML backend later.

## GitHub
Create a GitHub repository named `fraud-detection-risk-agent`, then:

```bash
git init
git add .
git commit -m "Initial Fraud Detection Risk Agent"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fraud-detection-risk-agent.git
git push -u origin main
```

Your submission link will be:
`https://github.com/YOUR_USERNAME/fraud-detection-risk-agent`
