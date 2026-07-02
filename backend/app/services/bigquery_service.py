from __future__ import annotations

from google.cloud import bigquery

from app.core.config import settings


class BigQueryService:
    def __init__(self) -> None:
        self.client = bigquery.Client(project=settings.google_cloud_project_id)
        self.project_id = settings.google_cloud_project_id
        self.dataset = settings.bigquery_dataset

    @property
    def citizen_reports_table(self) -> str:
        return f"`{self.project_id}.{self.dataset}.citizen_reports`"

    @property
    def traffic_metrics_table(self) -> str:
        return f"`{self.project_id}.{self.dataset}.traffic_metrics`"

    @property
    def environment_metrics_table(self) -> str:
        return f"`{self.project_id}.{self.dataset}.environment_metrics`"

    def get_dashboard_overview(self) -> dict:
        query = f"""
        WITH citizen_summary AS (
          SELECT
            COUNT(*) AS total_reports,
            COUNTIF(severity IN ('High', 'Critical')) AS high_priority_reports,
            COUNTIF(status IN ('Open', 'Under Review')) AS unresolved_reports
          FROM {self.citizen_reports_table}
        ),
        traffic_summary AS (
          SELECT
            ROUND(AVG(congestion_score), 2) AS avg_congestion_score,
            ROUND(AVG(average_speed_kmph), 2) AS avg_speed_kmph
          FROM {self.traffic_metrics_table}
        ),
        environment_summary AS (
          SELECT
            ROUND(AVG(aqi), 2) AS avg_aqi,
            ROUND(AVG(water_risk_score), 2) AS avg_water_risk
          FROM {self.environment_metrics_table}
        )
        SELECT
          citizen_summary.total_reports,
          citizen_summary.high_priority_reports,
          citizen_summary.unresolved_reports,
          traffic_summary.avg_congestion_score,
          traffic_summary.avg_speed_kmph,
          environment_summary.avg_aqi,
          environment_summary.avg_water_risk
        FROM citizen_summary
        CROSS JOIN traffic_summary
        CROSS JOIN environment_summary
        """

        rows = list(self.client.query(query).result())
        return dict(rows[0])

    def get_priority_zone(self) -> dict:
        query = f"""
        WITH citizen_risk AS (
          SELECT
            zone,
            COUNTIF(severity IN ('High', 'Critical')) AS high_priority_reports
          FROM {self.citizen_reports_table}
          GROUP BY zone
        ),
        traffic_risk AS (
          SELECT
            zone,
            ROUND(AVG(congestion_score), 2) AS avg_congestion_score,
            ROUND(AVG(average_speed_kmph), 2) AS avg_speed_kmph
          FROM {self.traffic_metrics_table}
          GROUP BY zone
        ),
        environment_risk AS (
          SELECT
            zone,
            ROUND(AVG(aqi), 2) AS avg_aqi,
            ROUND(AVG(water_risk_score), 2) AS avg_water_risk
          FROM {self.environment_metrics_table}
          GROUP BY zone
        )
        SELECT
          citizen_risk.zone,
          citizen_risk.high_priority_reports,
          traffic_risk.avg_congestion_score,
          traffic_risk.avg_speed_kmph,
          environment_risk.avg_aqi,
          environment_risk.avg_water_risk,
          ROUND(
            citizen_risk.high_priority_reports * 1.8
            + traffic_risk.avg_congestion_score * 0.7
            + environment_risk.avg_aqi * 0.25
            + environment_risk.avg_water_risk * 0.2,
            2
          ) AS combined_risk_score
        FROM citizen_risk
        JOIN traffic_risk USING (zone)
        JOIN environment_risk USING (zone)
        ORDER BY combined_risk_score DESC
        LIMIT 1
        """

        rows = list(self.client.query(query).result())
        return dict(rows[0])

    def get_top_alerts(self) -> list[dict]:
        query = f"""
        SELECT
          report_id,
          zone,
          category,
          severity,
          description,
          status,
          reported_at
        FROM {self.citizen_reports_table}
        WHERE severity IN ('High', 'Critical')
          AND status IN ('Open', 'Under Review', 'Assigned')
        ORDER BY
          CASE severity
            WHEN 'Critical' THEN 1
            WHEN 'High' THEN 2
            ELSE 3
          END,
          reported_at DESC
        LIMIT 3
        """

        return [dict(row) for row in self.client.query(query).result()]


bigquery_service = BigQueryService()