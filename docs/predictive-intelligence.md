# Predictive Intelligence Design

## Purpose

Community Guardian AI predicts which zones may require stakeholder attention within the next 24 hours.

## Data signals

The prototype combines:

- Average traffic congestion score
- Air Quality Index (AQI)
- Water-risk score
- Unresolved citizen reports
- High-priority citizen reports

## Explainable risk formula

The prototype calculates a zone-level risk score using a transparent weighted formula:

```text
Predicted Risk Score =
(Traffic Congestion × 0.35)
+ (AQI × 0.20)
+ (Water Risk × 0.15)
+ (Unresolved Reports × 4)
+ (High-Priority Reports × 7)

Anomaly thresholds

An anomaly is flagged when at least one condition is true:

Predicted risk score is 75 or higher
Unresolved report count is 5 or higher
High-priority report count is 3 or higher
Responsible use

The forecast is a prototype decision-support mechanism. It does not automatically deploy resources, issue public warnings, or trigger enforcement. A human stakeholder must validate all alerts before action.


---

## 11. Commit this milestone

Stop servers, then run:

```bat
cd /d D:\Projects\community-guardian-ai
git status