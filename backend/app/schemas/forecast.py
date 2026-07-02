from pydantic import BaseModel


class RiskForecastItem(BaseModel):
    zone: str
    predicted_risk_score: float
    risk_level: str
    predicted_congestion_score: float
    predicted_aqi: float
    predicted_water_risk_score: float
    unresolved_reports: int
    anomaly_detected: bool
    anomaly_reason: str
    recommended_action: str


class ForecastAlert(BaseModel):
    alert_id: str
    zone: str
    alert_type: str
    severity: str
    message: str
    recommended_action: str
    anomaly_detected: bool