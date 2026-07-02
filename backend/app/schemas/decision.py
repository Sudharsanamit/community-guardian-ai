from pydantic import BaseModel, Field


class DecisionQuestionRequest(BaseModel):
    question: str = Field(
        min_length=5,
        max_length=500,
        examples=["Which zone needs immediate attention today?"],
    )


class EvidenceItem(BaseModel):
    label: str
    value: str
    explanation: str


class DecisionAnswerResponse(BaseModel):
    question: str
    summary: str
    recommendation: str
    expected_impact: str
    priority_zone: str
    confidence: int
    requires_human_review: bool
    evidence: list[EvidenceItem]
    disclaimer: str
    generated_by: str