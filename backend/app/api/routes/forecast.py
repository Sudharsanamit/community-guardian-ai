from fastapi import APIRouter, HTTPException

from app.schemas.forecast import ForecastAlert, RiskForecastItem
from app.services.bigquery_service import bigquery_service

router = APIRouter(prefix="/api/forecast", tags=["Predictive Intelligence"])


@router.get("/risk", response_model=list[RiskForecastItem])
def get_risk_forecast() -> list[RiskForecastItem]:
    try:
        forecast_rows = bigquery_service.get_risk_forecast()
        response = []

        for row in forecast_rows:
            risk_score = float(row["predicted_risk_score"])
            unresolved_reports = int(row["unresolved_reports"])
            high_priority_reports = int(row["high_priority_reports"])

            anomaly_detected = (
                risk_score >= 75
                or unresolved_reports >= 5
                or high_priority_reports >= 3
            )

            if risk_score >= 85:
                risk_level = "Critical"
                recommended_action = (
                    "Validate the risk with a human stakeholder and allocate "
                    "immediate inspection resources."
                )
            elif risk_score >= 65:
                risk_level = "High"
                recommended_action = (
                    "Prioritize this zone for city operations review within 24 hours."
                )
            elif risk_score >= 45:
                risk_level = "Medium"
                recommended_action = (
                    "Monitor the trend and prepare preventive community action."
                )
            else:
                risk_level = "Low"
                recommended_action = (
                    "Continue routine monitoring and collect more evidence."
                )

            anomaly_reason = (
                "Risk score or unresolved issue volume exceeded the prototype alert threshold."
                if anomaly_detected
                else "No major anomaly detected from the available prototype data."
            )

            response.append(
                RiskForecastItem(
                    zone=row["zone"],
                    predicted_risk_score=risk_score,
                    risk_level=risk_level,
                    predicted_congestion_score=float(
                        row["predicted_congestion_score"]
                    ),
                    predicted_aqi=float(row["predicted_aqi"]),
                    predicted_water_risk_score=float(
                        row["predicted_water_risk_score"]
                    ),
                    unresolved_reports=unresolved_reports,
                    anomaly_detected=anomaly_detected,
                    anomaly_reason=anomaly_reason,
                    recommended_action=recommended_action,
                )
            )

        return response

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to generate risk forecast: {str(error)}",
        ) from error


@router.get("/alerts", response_model=list[ForecastAlert])
def get_forecast_alerts() -> list[ForecastAlert]:
    try:
        alerts = bigquery_service.get_forecast_alerts()

        return [
            ForecastAlert(
                alert_id=alert["alert_id"],
                zone=alert["zone"],
                alert_type=alert["alert_type"],
                severity=alert["severity"],
                message=alert["message"],
                recommended_action=alert["recommended_action"],
                anomaly_detected=alert["anomaly_detected"],
            )
            for alert in alerts
        ]

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to generate forecast alerts: {str(error)}",
        ) from error