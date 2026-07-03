# Community Guardian AI Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                       Community Stakeholders                  │
│  City Operations | Community Teams | Field Teams | Citizens   │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                     React + Vite Frontend                     │
│ Dashboard | AI Decision Center | Forecasts | Reports | Workflow│
└─────────────────────────────┬────────────────────────────────┘
                              │ HTTPS
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                       Firebase Hosting                        │
└─────────────────────────────┬────────────────────────────────┘
                              │ HTTPS API Requests
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    Cloud Run FastAPI Backend                  │
│ API Layer | Analytics | Forecasts | RAG | Workflow Automation │
└───────┬──────────────────┬──────────────────┬─────────────────┘
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐   ┌────────────────┐  ┌──────────────────────┐
│ Vertex AI    │   │ BigQuery       │  │ Cloud Storage        │
│ Gemini       │   │ Community Data │  │ Citizen Report Files │
│              │   │ Forecasts      │  │ Images and Evidence  │
│ Natural Lang │   │ Alerts         │  └──────────────────────┘
│ Multimodal   │   │ Decision Logs  │
│ Recommendations│ └────────────────┘
└──────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│               Human-in-the-Loop Decision Control              │
│ AI Plan Draft → Stakeholder Approval / Rejection → Audit Log  │
└──────────────────────────────────────────────────────────────┘
```

## Security and Responsible AI

* Cloud Run uses a dedicated service account.
* IAM controls access to Vertex AI, BigQuery, and Cloud Storage.
* AI outputs are reviewed by human stakeholders.
* Decision outcomes are logged in BigQuery.
* The platform does not make autonomous public-service decisions.
