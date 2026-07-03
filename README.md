# Community Guardian AI

## Live Demo

* Public Application: https://community-guardian-ai.web.app/
* backend :https://community-guardian-api-34365732036.asia-south1.run.app/docs

## AI-Powered Decision Intelligence Platform for Better Living and Smarter Communities

Community Guardian AI is an AI-powered decision intelligence platform that helps city stakeholders and community organizations transform fragmented operational data into actionable, human-reviewed decisions.

The platform combines structured community data, citizen reports, predictive risk analysis, natural-language analytics, multimodal image understanding, and AI-assisted workflow automation to support safer, healthier, and more sustainable communities.

## Problem

Communities generate large volumes of data from citizen feedback, public services, environmental monitoring, transportation systems, and operational workflows. This data is often fragmented, difficult to analyze, and not converted into timely action.

As a result, stakeholders may struggle to identify emerging risks, prioritize high-impact zones, understand citizen concerns, and coordinate response actions.

## Solution

Community Guardian AI provides a single decision intelligence workspace where stakeholders can:

* Analyze community data through dashboards and natural-language questions.
* Identify patterns, trends, anomalies, and high-risk zones.
* Generate predictive risk forecasts.
* Submit and analyze citizen reports, including image-based evidence.
* Receive Gemini-powered recommendations and action-plan drafts.
* Approve or reject AI recommendations through a human-in-the-loop workflow.
* Store decisions in BigQuery for transparency and auditability.

## Key Features

### 1. Community Intelligence Dashboard

A centralized dashboard showing community health indicators, unresolved reports, high-priority issues, zone-level trends, and operational signals.

### 2. Natural-Language Decision Center

Stakeholders can ask questions such as:

* Which zones need urgent attention?
* What are the most common community issues?
* Where are unresolved reports increasing?
* Which operational action should be prioritized?

Gemini converts the question into an evidence-based response using community data and retrieved context.

### 3. Forecast Intelligence and Anomaly Detection

The platform analyzes historical community signals and produces zone-level risk scores. High-risk or abnormal patterns are converted into alerts for stakeholder review.

### 4. Multimodal Citizen Reporting

Citizens or field teams can submit reports with text and images. Gemini analyzes visual evidence and helps classify the issue while preserving human review before any action is taken.

### 5. AI Workflow Automation

When a forecast alert is detected, Gemini drafts an operational action plan with:

* Recommended owner team
* Priority level
* Response window
* Practical action steps
* Human-review requirement

A stakeholder must approve or reject the plan. Every decision is recorded in BigQuery.

### 6. Responsible AI Controls

Community Guardian AI is designed as a decision-support system, not an autonomous governance system.

* AI does not deploy resources autonomously.
* Every recommendation requires stakeholder approval.
* The platform avoids identifying, scoring, or blaming individual citizens.
* AI outputs are grounded in available community data.
* Approval and rejection decisions are stored in an audit log.

## Architecture

```text
React + Vite Frontend
        ↓
Firebase Hosting
        ↓
Cloud Run FastAPI Backend
        ↓
Vertex AI Gemini + BigQuery + Cloud Storage
        ↓
Human-in-the-loop approval and audit trail
```

## Google Cloud Technologies Used

* Vertex AI Gemini for natural-language analytics, multimodal understanding, recommendations, and workflow action plans.
* BigQuery for structured community data, analytics, forecasts, alerts, and decision audit logs.
* Cloud Storage for uploaded citizen-report images and evidence files.
* Cloud Run for scalable deployment of the FastAPI backend.
* Cloud Build for source-based backend builds and deployment.
* Firebase Hosting for public React frontend deployment.
* IAM service accounts for controlled access between Cloud Run and Google Cloud services.

## End-to-End Decision Workflow

```text
Community data and citizen reports
        ↓
BigQuery analytics and risk forecasting
        ↓
Anomaly alert generated
        ↓
Gemini creates action-plan draft
        ↓
Human stakeholder approves or rejects plan
        ↓
Decision stored in BigQuery audit log
```

## Impact

Community Guardian AI can help communities make faster and more transparent decisions in areas such as:

* Urban mobility and transportation
* Environmental monitoring
* Waste management
* Public-service operations
* Community safety and preparedness
* Citizen engagement
* Local resource prioritization

## Market and Business Feasibility

The platform can be offered as a SaaS decision intelligence solution for:

* Municipal corporations
* Smart-city programs
* Community organizations
* Campus and township administrations
* NGOs and social-impact organizations
* Facility and operations teams

A future business model can include subscription-based dashboards, department-level licenses, analytics packages, and custom data-integration services.

## Local Development

### Backend

```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Deployment

* Frontend: Firebase Hosting
* Backend: Google Cloud Run
* Data and AI: BigQuery, Cloud Storage, and Vertex AI Gemini

## Team

Ready_Set_Go!
