from pydantic import BaseModel, Field


class ActionPlanRequest(BaseModel):
    alert_id: str
    zone: str
    alert_type: str
    severity: str
    alert_message: str
    recommended_action: str


class ActionPlanResponse(BaseModel):
    alert_id: str
    zone: str
    action_plan: str
    owner_team: str
    priority: str
    estimated_response_window: str
    stakeholder_review_required: bool
    safety_note: str
    generated_by: str


class WorkflowDecisionRequest(BaseModel):
    alert_id: str
    zone: str
    alert_type: str
    severity: str
    ai_action_plan: str
    recommended_owner_team: str
    recommended_priority: str
    human_decision: str = Field(pattern="^(Approved|Rejected)$")
    human_notes: str = Field(default="", max_length=1000)


class WorkflowDecisionResponse(BaseModel):
    decision_id: str
    decision_status: str
    message: str