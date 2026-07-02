from pydantic import BaseModel, Field


class ImageAnalysisResponse(BaseModel):
    category: str
    severity: str
    confidence: int
    summary: str
    detected_signals: list[str]
    recommended_action: str
    requires_human_review: bool
    disclaimer: str
    generated_by: str


class CreateCitizenReportRequest(BaseModel):
    category: str
    severity: str
    description: str = Field(min_length=5, max_length=1000)
    zone: str
    latitude: float
    longitude: float
    image_gcs_uri: str | None = None
    source: str = "Web Portal"