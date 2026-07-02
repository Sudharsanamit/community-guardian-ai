from fastapi import APIRouter, HTTPException

from app.schemas.decision import (
    DecisionAnswerResponse,
    DecisionQuestionRequest,
    EvidenceItem,
)
from app.services.bigquery_service import bigquery_service
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/api/decision", tags=["AI Decision Intelligence"])


@router.post("/ask", response_model=DecisionAnswerResponse)
def ask_decision_intelligence(
    request: DecisionQuestionRequest,
) -> DecisionAnswerResponse:
    try:
        evidence = bigquery_service.get_decision_evidence()

        if not evidence["highest_priority_zone"]:
            raise ValueError("No BigQuery evidence is available.")

        ai_result = gemini_service.generate_decision(
            question=request.question,
            evidence=evidence,
        )

        evidence_items = [
            EvidenceItem(
                label=item["label"],
                value=str(item["value"]),
                explanation=item["explanation"],
            )
            for item in ai_result.get("evidence", [])
        ]

        return DecisionAnswerResponse(
            question=request.question,
            summary=ai_result["summary"],
            recommendation=ai_result["recommendation"],
            expected_impact=ai_result["expected_impact"],
            priority_zone=ai_result["priority_zone"],
            confidence=max(0, min(100, int(ai_result["confidence"]))),
            requires_human_review=True,
            evidence=evidence_items,
            disclaimer=(
                "This recommendation is generated from prototype data and must "
                "be reviewed by an authorized human stakeholder before action."
            ),
            generated_by="Vertex AI Gemini + BigQuery evidence retrieval",
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to generate AI decision intelligence: {str(error)}",
        ) from error