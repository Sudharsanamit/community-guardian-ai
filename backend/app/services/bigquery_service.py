from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

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

    def get_zone_risk_summary(self) -> list[dict]:
        query = f"""
        WITH citizen_risk AS (
          SELECT
            zone,
            COUNT(*) AS total_reports,
            COUNTIF(severity IN ('High', 'Critical')) AS high_priority_reports,
            COUNTIF(status IN ('Open', 'Under Review')) AS unresolved_reports
          FROM {self.citizen_reports_table}
          GROUP BY zone
        ),
        traffic_risk AS (
          SELECT
            zone,
            ROUND(AVG(congestion_score), 2) AS avg_congestion_score,
            ROUND(AVG(average_speed_kmph), 2) AS avg_speed_kmph,
            SUM(incident_count) AS traffic_incidents
          FROM {self.traffic_metrics_table}
          GROUP BY zone
        ),
        environment_risk AS (
          SELECT
            zone,
            ROUND(AVG(aqi), 2) AS avg_aqi,
            ROUND(AVG(water_risk_score), 2) AS avg_water_risk,
            ROUND(AVG(waste_collection_efficiency), 2) AS avg_waste_efficiency
          FROM {self.environment_metrics_table}
          GROUP BY zone
        )
        SELECT
          citizen_risk.zone,
          citizen_risk.total_reports,
          citizen_risk.high_priority_reports,
          citizen_risk.unresolved_reports,
          traffic_risk.avg_congestion_score,
          traffic_risk.avg_speed_kmph,
          traffic_risk.traffic_incidents,
          environment_risk.avg_aqi,
          environment_risk.avg_water_risk,
          environment_risk.avg_waste_efficiency,
          ROUND(
            citizen_risk.high_priority_reports * 1.8
            + citizen_risk.unresolved_reports * 0.8
            + traffic_risk.avg_congestion_score * 0.7
            + environment_risk.avg_aqi * 0.25
            + environment_risk.avg_water_risk * 0.2,
            2
          ) AS combined_risk_score
        FROM citizen_risk
        JOIN traffic_risk USING (zone)
        JOIN environment_risk USING (zone)
        ORDER BY combined_risk_score DESC
        """

        return [dict(row) for row in self.client.query(query).result()]

    def get_decision_evidence(self) -> dict:
        zones = self.get_zone_risk_summary()

        return {
            "data_source": "BigQuery synthetic community intelligence dataset",
            "zones": zones,
            "highest_priority_zone": zones[0] if zones else None,
        }

    def create_citizen_report(
        self,
        category: str,
        severity: str,
        description: str,
        zone: str,
        latitude: float,
        longitude: float,
        image_available: bool,
        source: str,
    ) -> dict:
        report_id = f"CR-USER-{uuid4().hex[:8].upper()}"

        row = {
            "report_id": report_id,
            "reported_at": datetime.now(timezone.utc).isoformat(),
            "zone": zone,
            "category": category,
            "description": description,
            "severity": severity,
            "status": "Under Review",
            "latitude": latitude,
            "longitude": longitude,
            "image_available": image_available,
            "source": source,
        }

        errors = self.client.insert_rows_json(
            f"{self.project_id}.{self.dataset}.citizen_reports",
            [row],
        )

        if errors:
            raise ValueError(f"BigQuery insert failed: {errors}")

        return {
            "report_id": report_id,
            "status": "Under Review",
        }

    def get_risk_forecast(self) -> list[dict]:
        query = f"""
        WITH citizen_summary AS (
          SELECT
            zone,
            COUNTIF(status IN ('Open', 'Under Review')) AS unresolved_reports,
            COUNTIF(severity IN ('High', 'Critical')) AS high_priority_reports
          FROM {self.citizen_reports_table}
          GROUP BY zone
        ),
        traffic_summary AS (
          SELECT
            zone,
            AVG(congestion_score) AS avg_congestion_score,
            STDDEV(congestion_score) AS congestion_stddev,
            MAX(congestion_score) AS max_congestion_score
          FROM {self.traffic_metrics_table}
          GROUP BY zone
        ),
        environment_summary AS (
          SELECT
            zone,
            AVG(aqi) AS avg_aqi,
            AVG(water_risk_score) AS avg_water_risk_score,
            AVG(waste_collection_efficiency) AS avg_waste_efficiency
          FROM {self.environment_metrics_table}
          GROUP BY zone
        )
        SELECT
          citizen_summary.zone,

          ROUND(
            traffic_summary.avg_congestion_score
            + (citizen_summary.unresolved_reports * 3)
            + (citizen_summary.high_priority_reports * 5),
            2
          ) AS predicted_congestion_score,

          ROUND(
            environment_summary.avg_aqi
            + (citizen_summary.high_priority_reports * 1.5),
            2
          ) AS predicted_aqi,

          ROUND(
            environment_summary.avg_water_risk_score
            + (citizen_summary.unresolved_reports * 1.2),
            2
          ) AS predicted_water_risk_score,

          citizen_summary.unresolved_reports,
          citizen_summary.high_priority_reports,

          ROUND(
            (
              traffic_summary.avg_congestion_score * 0.35
              + environment_summary.avg_aqi * 0.20
              + environment_summary.avg_water_risk_score * 0.15
              + citizen_summary.unresolved_reports * 4
              + citizen_summary.high_priority_reports * 7
            ),
            2
          ) AS predicted_risk_score,

          ROUND(traffic_summary.avg_congestion_score, 2) AS historical_congestion_average,
          ROUND(traffic_summary.max_congestion_score, 2) AS historical_congestion_maximum,
          ROUND(COALESCE(traffic_summary.congestion_stddev, 0), 2) AS congestion_variation

        FROM citizen_summary
        JOIN traffic_summary USING (zone)
        JOIN environment_summary USING (zone)
        ORDER BY predicted_risk_score DESC
        """

        return [dict(row) for row in self.client.query(query).result()]

    def get_forecast_alerts(self) -> list[dict]:
        forecasts = self.get_risk_forecast()
        alerts = []

        for index, forecast in enumerate(forecasts, start=1):
            risk_score = float(forecast["predicted_risk_score"])
            unresolved_reports = int(forecast["unresolved_reports"])
            high_priority_reports = int(forecast["high_priority_reports"])

            anomaly_detected = (
                risk_score >= 75
                or unresolved_reports >= 5
                or high_priority_reports >= 3
            )

            if risk_score >= 85:
                severity = "Critical"
                alert_type = "High Community Risk"
                recommended_action = (
                    "Escalate to the city operations team, validate the evidence, "
                    "and allocate immediate inspection resources."
                )
            elif risk_score >= 65:
                severity = "High"
                alert_type = "Elevated Community Risk"
                recommended_action = (
                    "Schedule priority inspection and assign relevant public-service teams."
                )
            elif risk_score >= 45:
                severity = "Medium"
                alert_type = "Emerging Community Risk"
                recommended_action = (
                    "Monitor the zone and prepare preventive action if the trend continues."
                )
            else:
                severity = "Low"
                alert_type = "Routine Monitoring"
                recommended_action = (
                    "Continue monitoring the zone through regular community operations."
                )

            alerts.append(
                {
                    "alert_id": f"ALERT-{index:03d}",
                    "zone": forecast["zone"],
                    "alert_type": alert_type,
                    "severity": severity,
                    "message": (
                        f"{forecast['zone']} has a predicted risk score of "
                        f"{risk_score}. It has {unresolved_reports} unresolved "
                        f"reports and {high_priority_reports} high-priority reports."
                    ),
                    "recommended_action": recommended_action,
                    "anomaly_detected": anomaly_detected,
                }
            )

        return alerts

    def create_workflow_decision_log(
        self,
        alert_id: str,
        zone: str,
        alert_type: str,
        severity: str,
        ai_action_plan: str,
        recommended_owner_team: str,
        recommended_priority: str,
        human_decision: str,
        human_notes: str,
    ) -> dict:
        decision_id = f"DEC-{uuid4().hex[:10].upper()}"

        row = {
            "decision_id": decision_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "alert_id": alert_id,
            "zone": zone,
            "alert_type": alert_type,
            "severity": severity,
            "ai_action_plan": ai_action_plan,
            "recommended_owner_team": recommended_owner_team,
            "recommended_priority": recommended_priority,
            "human_decision": human_decision,
            "human_notes": human_notes,
            "decision_status": (
                "Approved for stakeholder action"
                if human_decision == "Approved"
                else "Rejected by stakeholder"
            ),
            "model_name": settings.gemini_model,
            "source": "Community Guardian AI Workflow Automation",
        }

        table_id = f"{self.project_id}.{self.dataset}.decision_logs"

        errors = self.client.insert_rows_json(table_id, [row])

        if errors:
            raise ValueError(f"BigQuery decision-log insert failed: {errors}")

        return {
            "decision_id": decision_id,
            "decision_status": row["decision_status"],
        }


bigquery_service = BigQueryService()