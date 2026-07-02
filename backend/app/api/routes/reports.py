from __future__ import annotations

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.schemas.report import (
    CreateCitizenReportRequest,
    ImageAnalysisResponse,
)
from app.services.bigquery_service import bigquery_service
from app.services.gemini_service import gemini_service
from app.services.storage_service import storage_service

router = APIRouter(prefix="/api/reports", tags=["Multimodal Citizen Reports"])

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
}

MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024


@router.post("/analyze-image", response_model=ImageAnalysisResponse)
async def analyze_report_image(
    image: UploadFile = File(...),
    description: str | None = Form(default=None),
) -> ImageAnalysisResponse:
    try:
        if image.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=400,
                detail="Upload a JPG, PNG, or WEBP image.",
            )

        image_bytes = await image.read()

        if len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
            raise HTTPException(
                status_code=400,
                detail="Image size must be less than 8 MB.",
            )

        result = gemini_service.analyze_community_image(
            image_bytes=image_bytes,
            mime_type=image.content_type,
            user_description=description,
        )

        return ImageAnalysisResponse(
            category=result["category"],
            severity=result["severity"],
            confidence=max(0, min(100, int(result["confidence"]))),
            summary=result["summary"],
            detected_signals=result.get("detected_signals", []),
            recommended_action=result["recommended_action"],
            requires_human_review=True,
            disclaimer=(
                "This image analysis is AI-assisted and must be reviewed by a "
                "human before a citizen report is submitted or acted upon."
            ),
            generated_by="Vertex AI Gemini multimodal analysis",
        )

    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to analyze community image: {str(error)}",
        ) from error


@router.post("/submit")
async def submit_citizen_report(
    image: UploadFile = File(...),
    category: str = Form(...),
    severity: str = Form(...),
    description: str = Form(...),
    zone: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
) -> dict:
    try:
        if image.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=400,
                detail="Upload a JPG, PNG, or WEBP image.",
            )

        image_bytes = await image.read()

        if len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
            raise HTTPException(
                status_code=400,
                detail="Image size must be less than 8 MB.",
            )

        image_gcs_uri = storage_service.upload_report_image(
            image_bytes=image_bytes,
            original_filename=image.filename or "community-report-image",
            mime_type=image.content_type,
        )

        report = bigquery_service.create_citizen_report(
            category=category,
            severity=severity,
            description=description,
            zone=zone,
            latitude=latitude,
            longitude=longitude,
            image_available=True,
            source="Web Portal",
        )

        return {
            "message": "Citizen report submitted successfully for human review.",
            "report_id": report["report_id"],
            "status": report["status"],
            "image_gcs_uri": image_gcs_uri,
            "requires_human_review": True,
        }

    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to submit citizen report: {str(error)}",
        ) from error