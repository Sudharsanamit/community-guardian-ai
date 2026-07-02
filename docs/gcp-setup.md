# Google Cloud Setup

## Active services

- Cloud Run
- Artifact Registry
- Cloud Build
- Vertex AI
- BigQuery
- Cloud Storage
- IAM Service Account Credentials API

## Primary region

asia-south1

## Prototype data flow

1. CSV datasets and citizen-report images are stored in Cloud Storage.
2. Structured data is loaded into BigQuery.
3. FastAPI queries BigQuery for analytics and evidence.
4. Vertex AI Gemini generates explainable decision recommendations.
5. Cloud Run hosts the public frontend and backend application.