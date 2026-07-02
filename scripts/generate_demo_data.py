from __future__ import annotations

import random
from datetime import datetime, timedelta
from pathlib import Path

import pandas as pd

random.seed(42)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATASET_DIR = PROJECT_ROOT / "datasets"

ZONES = {
    "Zone A": {"lat": 9.9252, "lng": 78.1198},
    "Zone B": {"lat": 9.9321, "lng": 78.1264},
    "Zone C": {"lat": 9.9187, "lng": 78.1322},
    "Zone D": {"lat": 9.9403, "lng": 78.1156},
    "Zone E": {"lat": 9.9109, "lng": 78.1211},
}

REPORT_TYPES = [
    "Road Damage",
    "Waste Accumulation",
    "Streetlight Failure",
    "Traffic Violation",
    "Water Leakage",
    "Air Pollution Complaint",
]

REPORT_DESCRIPTIONS = {
    "Road Damage": [
        "Large pothole reported near a busy junction.",
        "Damaged road surface creating a safety risk for two-wheelers.",
        "Road crack widening after recent rain.",
    ],
    "Waste Accumulation": [
        "Garbage has not been collected for several days.",
        "Overflowing public waste bin near residential area.",
        "Waste pile causing odor and sanitation concerns.",
    ],
    "Streetlight Failure": [
        "Streetlight is not working near the pedestrian crossing.",
        "Multiple lights are off in the evening near the bus stop.",
        "Dark road section reported as unsafe after sunset.",
    ],
    "Traffic Violation": [
        "Frequent illegal parking blocking the main road.",
        "Traffic congestion caused by vehicles stopping near junction.",
        "Signal violation reported during peak traffic hours.",
    ],
    "Water Leakage": [
        "Water pipeline leak reported near residential street.",
        "Continuous water leakage causing road damage.",
        "Water is pooling near a public walking area.",
    ],
    "Air Pollution Complaint": [
        "Dust and smoke reported near construction activity.",
        "Residents reported poor air quality during evening hours.",
        "Vehicle smoke and dust affecting nearby shops.",
    ],
}

SEVERITY_LEVELS = ["Low", "Medium", "High", "Critical"]
STATUSES = ["Open", "Under Review", "Assigned", "Resolved"]


def random_timestamp(days_back: int = 30) -> datetime:
    now = datetime.now()
    return now - timedelta(
        days=random.randint(0, days_back),
        hours=random.randint(0, 23),
        minutes=random.randint(0, 59),
    )


def generate_citizen_reports() -> pd.DataFrame:
    rows = []

    for report_id in range(1, 301):
        zone_name = random.choice(list(ZONES.keys()))
        report_type = random.choice(REPORT_TYPES)

        severity_weights = {
            "Zone C": [0.08, 0.22, 0.42, 0.28],
            "Zone E": [0.12, 0.30, 0.38, 0.20],
        }

        weights = severity_weights.get(zone_name, [0.25, 0.40, 0.25, 0.10])
        severity = random.choices(SEVERITY_LEVELS, weights=weights, k=1)[0]

        status = random.choices(
            STATUSES,
            weights=[0.30, 0.28, 0.22, 0.20],
            k=1,
        )[0]

        zone = ZONES[zone_name]

        rows.append(
            {
                "report_id": f"CR-{report_id:04d}",
                "reported_at": random_timestamp().isoformat(),
                "zone": zone_name,
                "category": report_type,
                "description": random.choice(REPORT_DESCRIPTIONS[report_type]),
                "severity": severity,
                "status": status,
                "latitude": round(zone["lat"] + random.uniform(-0.004, 0.004), 6),
                "longitude": round(zone["lng"] + random.uniform(-0.004, 0.004), 6),
                "image_available": random.choice([True, False]),
                "source": random.choice(
                    ["Mobile App", "Web Portal", "Community Volunteer"]
                ),
            }
        )

    return pd.DataFrame(rows)


def generate_traffic_metrics() -> pd.DataFrame:
    rows = []
    start_time = datetime.now() - timedelta(days=14)

    for hour_index in range(14 * 24):
        timestamp = start_time + timedelta(hours=hour_index)
        hour = timestamp.hour

        for zone_name in ZONES:
            peak_multiplier = 1.0

            if hour in [8, 9, 10, 17, 18, 19, 20]:
                peak_multiplier = 1.8

            if zone_name == "Zone C":
                peak_multiplier += 0.7

            if zone_name == "Zone B":
                peak_multiplier += 0.25

            vehicle_count = int(random.randint(90, 180) * peak_multiplier)
            average_speed = round(
                max(8, random.uniform(25, 45) - (peak_multiplier * 7)),
                2,
            )

            congestion_score = round(
                min(
                    100,
                    (vehicle_count / 5)
                    + ((45 - average_speed) * 2)
                    + random.uniform(-5, 5),
                ),
                2,
            )

            incident_count = random.choices(
                [0, 1, 2, 3],
                weights=[0.65, 0.24, 0.09, 0.02],
                k=1,
            )[0]

            rows.append(
                {
                    "metric_id": f"TM-{hour_index:05d}-{zone_name[-1]}",
                    "recorded_at": timestamp.isoformat(),
                    "zone": zone_name,
                    "vehicle_count": vehicle_count,
                    "average_speed_kmph": average_speed,
                    "congestion_score": congestion_score,
                    "incident_count": incident_count,
                }
            )

    return pd.DataFrame(rows)


def generate_environment_metrics() -> pd.DataFrame:
    rows = []
    start_time = datetime.now() - timedelta(days=30)

    for day_index in range(30):
        timestamp = start_time + timedelta(days=day_index)

        for zone_name in ZONES:
            pollution_factor = 0

            if zone_name == "Zone E":
                pollution_factor = 28
            elif zone_name == "Zone C":
                pollution_factor = 15
            elif zone_name == "Zone B":
                pollution_factor = 8

            aqi = round(
                min(300, max(30, random.uniform(55, 110) + pollution_factor)),
                2,
            )

            rainfall_mm = round(max(0, random.gauss(4, 7)), 2)

            waste_collection_efficiency = round(
                max(45, min(100, random.uniform(68, 96) - pollution_factor / 4)),
                2,
            )

            water_risk_score = round(
                min(100, rainfall_mm * 4 + random.uniform(5, 25)),
                2,
            )

            rows.append(
                {
                    "environment_id": f"EM-{day_index:03d}-{zone_name[-1]}",
                    "recorded_at": timestamp.isoformat(),
                    "zone": zone_name,
                    "aqi": aqi,
                    "rainfall_mm": rainfall_mm,
                    "waste_collection_efficiency": waste_collection_efficiency,
                    "water_risk_score": water_risk_score,
                }
            )

    return pd.DataFrame(rows)


def main() -> None:
    DATASET_DIR.mkdir(exist_ok=True)

    citizen_reports = generate_citizen_reports()
    traffic_metrics = generate_traffic_metrics()
    environment_metrics = generate_environment_metrics()

    citizen_reports.to_csv(DATASET_DIR / "citizen_reports.csv", index=False)
    traffic_metrics.to_csv(DATASET_DIR / "traffic_metrics.csv", index=False)
    environment_metrics.to_csv(DATASET_DIR / "environment_metrics.csv", index=False)

    print("Demo datasets created successfully.")
    print(f"Citizen reports: {len(citizen_reports)} rows")
    print(f"Traffic metrics: {len(traffic_metrics)} rows")
    print(f"Environment metrics: {len(environment_metrics)} rows")
    print(f"Saved in: {DATASET_DIR}")


if __name__ == "__main__":
    main()