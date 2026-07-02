from __future__ import annotations
from PIL import Image
from io import BytesIO

import json

from google import genai
from google.genai import types

from app.core.config import settings


class GeminiService:
    def __init__(self) -> None:
        self.client = genai.Client(
            vertexai=True,
            project=settings.google_cloud_project_id,
            location=settings.google_cloud_region,
        )

    def generate_decision(
        self,
        question: str,
        evidence: dict,
    ) -> dict:
        prompt = f"""
You are Community Guardian AI, a responsible decision-support assistant for city and community stakeholders.

Your task is to answer the user's question using ONLY the BigQuery evidence supplied below.

User question:
{question}

BigQuery evidence:
{json.dumps(evidence, indent=2, default=str)}

Rules:
1. Do not invent statistics, zones, incidents, or facts not present in the evidence.
2. Give a practical recommendation for a city/community stakeholder.
3. Explain why the recommendation is supported by the evidence.
4. This is decision support only, not autonomous action.
5. Always require human review before any operational action.
6. Keep the response concise and suitable for an executive dashboard.
7. Confidence must be an integer from 0 to 100.
8. Return valid JSON only. Do not use markdown fences.

Return this exact JSON structure:
{{
  "summary": "short executive summary",
  "recommendation": "specific recommended action",
  "expected_impact": "expected positive outcome",
  "priority_zone": "zone name from evidence",
  "confidence": 0,
  "evidence": [
    {{
      "label": "evidence category",
      "value": "number or metric from evidence",
      "explanation": "why this matters"
    }}
  ]
}}
"""

        response = self.client.models.generate_content(
            model=settings.gemini_model,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.2,
                response_mime_type="application/json",
            ),
        )

        if not response.text:
            raise ValueError("Gemini returned an empty response.")

        return json.loads(response.text)

    def analyze_community_image(
        self,
        image_bytes: bytes,
        mime_type: str,
        user_description: str | None = None,
    ) -> dict:
        image = Image.open(BytesIO(image_bytes))
        image.verify()

        prompt = f"""
You are Community Guardian AI, a responsible multimodal assistant for city and community issue reporting.

Analyze the uploaded image only for visible community-infrastructure or public-service issues.

Optional reporter description:
{user_description or "No description provided."}

Allowed categories:
- Road Damage
- Waste Accumulation
- Streetlight Failure
- Traffic Violation
- Water Leakage
- Air Pollution Complaint
- Other Community Issue

Allowed severity values:
- Low
- Medium
- High
- Critical

Rules:
1. Only describe what is reasonably visible in the image.
2. Do not identify people, infer personal attributes, or make claims about individuals.
3. Do not diagnose health conditions.
4. If the image is unclear, use "Other Community Issue" and lower confidence.
5. Do not claim an emergency unless there is clearly visible immediate danger.
6. The result must require human review before submission or action.
7. Return valid JSON only. Do not use markdown fences.

Return this exact JSON structure:
{{
  "category": "one allowed category",
  "severity": "one allowed severity",
  "confidence": 0,
  "summary": "short visual finding",
  "detected_signals": ["visible signal 1", "visible signal 2"],
  "recommended_action": "practical municipal or community follow-up"
}}
"""

        response = self.client.models.generate_content(
            model=settings.gemini_model,
            contents=[
                types.Part.from_text(text=prompt),
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=mime_type,
                ),
            ],
            config=types.GenerateContentConfig(
                temperature=0.2,
                response_mime_type="application/json",
            ),
        )

        if not response.text:
            raise ValueError("Gemini returned an empty image analysis response.")

        return json.loads(response.text)


gemini_service = GeminiService()