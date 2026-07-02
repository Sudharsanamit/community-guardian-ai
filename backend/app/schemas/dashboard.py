from pydantic import BaseModel


class MetricCard(BaseModel):
    title: str
    value: str
    suffix: str = ""
    description: str
    status: str
    trend: str


class AlertItem(BaseModel):
    title: str
    zone: str
    severity: str
    description: str


class Recommendation(BaseModel):
    title: str
    action: str
    expected_impact: str
    confidence: int
    requires_human_review: bool


class DashboardOverviewResponse(BaseModel):
    community_health_score: int
    metrics: list[MetricCard]
    alerts: list[AlertItem]
    recommendation: Recommendation
    generated_from: str