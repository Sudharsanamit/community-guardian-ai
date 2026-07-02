# Community Guardian AI Data Model

## Data source policy

All prototype datasets are synthetic. They simulate community data patterns without using real citizen personal data.

## citizen_reports

Stores community issues reported through the web portal, mobile app, or community volunteers.

Key fields:

- `report_id`: Unique report identifier
- `reported_at`: Time of report submission
- `zone`: Community zone
- `category`: Type of issue
- `description`: Citizen-provided issue description
- `severity`: Low, Medium, High, or Critical
- `status`: Open, Under Review, Assigned, or Resolved
- `latitude`, `longitude`: Approximate issue coordinates
- `image_available`: Whether an image was provided
- `source`: Reporting channel

## traffic_metrics

Stores hourly mobility indicators for each community zone.

Key fields:

- `recorded_at`
- `zone`
- `vehicle_count`
- `average_speed_kmph`
- `congestion_score`
- `incident_count`

## environment_metrics

Stores daily environmental and public-utility indicators.

Key fields:

- `recorded_at`
- `zone`
- `aqi`
- `rainfall_mm`
- `waste_collection_efficiency`
- `water_risk_score`

## Hackathon decision use cases

- Detect zones with high-severity citizen reports.
- Identify recurring traffic congestion patterns.
- Detect environmental risk trends.
- Combine data evidence with Gemini to generate explainable recommendations.
- Require human review before operational action.