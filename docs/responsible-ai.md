# Responsible AI Design

## Decision-support principle

Community Guardian AI supports stakeholder decisions. It does not autonomously trigger government, emergency, healthcare, or enforcement actions.

## Evidence-grounded generation

Gemini receives structured evidence retrieved from BigQuery before generating a recommendation. The application instructs Gemini not to invent facts outside that evidence.

## Human review

Every recommendation includes a visible human-review requirement. Authorized city or community stakeholders must validate the recommendation before taking action.

## Prototype data privacy

The hackathon prototype uses synthetic community datasets. It does not use real citizen identities, private health records, or personally identifiable information.

## Explainability

The AI Decision Center displays the evidence used, the recommended action, expected impact, confidence score, and limitations.

## Known limitations

- Synthetic data does not represent real-world operational conditions.
- AI confidence is an assistive indicator, not a guarantee.
- Production deployment would require data governance, bias evaluation, access controls, monitoring, and stakeholder approval workflows.

## Multimodal image analysis safeguards

- Image analysis is limited to visible public community-infrastructure issues.
- The system does not identify people or infer personal attributes.
- The system does not diagnose medical conditions or make enforcement decisions.
- AI-generated categories and severity levels are drafts that require human review.
- Uploaded images are stored in Cloud Storage for prototype reporting workflows.
- Production use would require consent, retention policies, access controls, abuse prevention, and human escalation procedures.