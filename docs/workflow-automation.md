# AI Workflow Automation

## Purpose

Community Guardian AI converts forecast anomalies into stakeholder-review workflows.

## Workflow

1. BigQuery data produces a zone-level risk forecast.
2. Threshold-based anomaly detection creates an alert.
3. Gemini generates an action-plan draft.
4. A human stakeholder approves or rejects the plan.
5. The decision is stored in BigQuery for auditability.

## Responsible AI controls

- Gemini does not autonomously deploy city resources.
- Every AI-generated plan requires human stakeholder review.
- Approved and rejected decisions are stored in an audit log.
- The platform does not identify, score, or blame individual citizens.
- The system is designed as decision support, not autonomous governance.