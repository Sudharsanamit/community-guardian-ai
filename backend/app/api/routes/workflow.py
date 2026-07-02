from fastapi import APIRouter, HTTPException

from app.schemas.workflow import (
    ActionPlanRequest,
    ActionPlanResponse,
    WorkflowDecisionRequest,
    WorkflowDecisionResponse,
)
from app.services.bigquery_service import bigquery_service
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/api/workflow", tags=["AI Workflow Automation"])


@router.post("/generate-action-plan", response_model=ActionPlanResponse)
def generate_action_plan(request: ActionPlanRequest) -> ActionPlanResponse:
    try:
        result = gemini_service.generate_alert_action_plan(
            alert_id=request.alert_id,
            zone=request.zone,
            alert_type=request.alert_type,
            severity=request.severity,
            alert_message=request.alert_message,
            recommended_action=request.recommended_action,
        )

        return ActionPlanResponse(
            alert_id=request.alert_id,
            zone=request.zone,
            action_plan=result["action_plan"],
            owner_team=result["owner_team"],
            priority=result["priority"],
            estimated_response_window=result["estimated_response_window"],
            stakeholder_review_required=True,
            safety_note=result["safety_note"],
            generated_by="Vertex AI Gemini workflow automation",
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to generate action plan: {str(error)}",
        ) from error


@router.post("/record-decision", response_model=WorkflowDecisionResponse)
def record_workflow_decision(
    request: WorkflowDecisionRequest,
) -> WorkflowDecisionResponse:
    try:
        result = bigquery_service.create_workflow_decision_log(
            alert_id=request.alert_id,
            zone=request.zone,
            alert_type=request.alert_type,
            severity=request.severity,
            ai_action_plan=request.ai_action_plan,
            recommended_owner_team=request.recommended_owner_team,
            recommended_priority=request.recommended_priority,
            human_decision=request.human_decision,
            human_notes=request.human_notes,
        )

        return WorkflowDecisionResponse(
            decision_id=result["decision_id"],
            decision_status=result["decision_status"],
            message="Stakeholder decision recorded in the BigQuery audit log.",
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to record workflow decision: {str(error)}",
        ) from error