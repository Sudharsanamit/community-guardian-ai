from fastapi import APIRouter, HTTPException

from app.schemas.dashboard import (
    AlertItem,
    DashboardOverviewResponse,
    MetricCard,
    Recommendation,
)
from app.services.bigquery_service import bigquery_service

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/overview", response_model=DashboardOverviewResponse)
def get_dashboard_overview() -> DashboardOverviewResponse:
    try:
        summary = bigquery_service.get_dashboard_overview()
        priority_zone = bigquery_service.get_priority_zone()
        raw_alerts = bigquery_service.get_top_alerts()

        health_score = max(
            0,
            min(
                100,
                round(
                    100
                    - (summary["high_priority_reports"] * 0.25)
                    - (summary["avg_congestion_score"] * 0.18)
                    - (summary["avg_aqi"] * 0.10)
                    - (summary["avg_water_risk"] * 0.08)
                ),
            ),
        )

        metrics = [
            MetricCard(
                title="Community Health Score",
                value=str(health_score),
                suffix="/100",
                description="Calculated from safety, traffic, and environment indicators",
                status="Live BigQuery analytics",
                trend="Monitoring",
            ),
            MetricCard(
                title="Active Risk Alerts",
                value=str(summary["high_priority_reports"]),
                suffix="",
                description=f'{summary["unresolved_reports"]} reports still need review',
                status="Needs attention",
                trend="Priority signals",
            ),
            MetricCard(
                title="Citizen Reports",
                value=str(summary["total_reports"]),
                suffix="",
                description="Community issues ingested from prototype data sources",
                status="Live data",
                trend="30-day dataset",
            ),
            MetricCard(
                title="Environmental Index",
                value=str(round(summary["avg_aqi"])),
                suffix="/300 AQI",
                description=f'Average water-risk score: {round(summary["avg_water_risk"])}',
                status="Monitor closely",
                trend="Environmental signals",
            ),
        ]

        alerts = [
            AlertItem(
                title=alert["category"],
                zone=alert["zone"],
                severity=alert["severity"],
                description=alert["description"],
            )
            for alert in raw_alerts
        ]

        recommendation = Recommendation(
            title=f'Priority action required in {priority_zone["zone"]}',
            action=(
                f'Deploy traffic-management and municipal inspection resources '
                f'to {priority_zone["zone"]}. Review high-severity citizen reports '
                f'and congestion conditions within 24 hours.'
            ),
            expected_impact=(
                "Reduce unresolved incidents, improve peak-hour mobility, "
                "and prevent escalation of community complaints."
            ),
            confidence=92,
            requires_human_review=True,
        )

        return DashboardOverviewResponse(
            community_health_score=health_score,
            metrics=metrics,
            alerts=alerts,
            recommendation=recommendation,
            generated_from="BigQuery synthetic community intelligence dataset",
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to generate dashboard intelligence: {str(error)}",
        ) from error