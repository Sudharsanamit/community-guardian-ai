const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export type HealthResponse = {
  status: string;
  service: string;
};

export type MetricCard = {
  title: string;
  value: string;
  suffix: string;
  description: string;
  status: string;
  trend: string;
};

export type AlertItem = {
  title: string;
  zone: string;
  severity: string;
  description: string;
};

export type Recommendation = {
  title: string;
  action: string;
  expected_impact: string;
  confidence: number;
  requires_human_review: boolean;
};

export type DashboardOverviewResponse = {
  community_health_score: number;
  metrics: MetricCard[];
  alerts: AlertItem[];
  recommendation: Recommendation;
  generated_from: string;
};

export async function getBackendHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error("Backend health check failed");
  }

  return response.json();
}

export async function getDashboardOverview(): Promise<DashboardOverviewResponse> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/overview`);

  if (!response.ok) {
    throw new Error("Dashboard analytics request failed");
  }

  return response.json();
}

export type DecisionQuestionRequest = {
  question: string;
};

export type EvidenceItem = {
  label: string;
  value: string;
  explanation: string;
};

export type DecisionAnswerResponse = {
  question: string;
  summary: string;
  recommendation: string;
  expected_impact: string;
  priority_zone: string;
  confidence: number;
  requires_human_review: boolean;
  evidence: EvidenceItem[];
  disclaimer: string;
  generated_by: string;
};

export async function askDecisionIntelligence(
  question: string,
): Promise<DecisionAnswerResponse> {
  const response = await fetch(`${API_BASE_URL}/api/decision/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.detail || "Unable to generate AI decision intelligence",
    );
  }

  return response.json();
}

export type ImageAnalysisResponse = {
  category: string;
  severity: string;
  confidence: number;
  summary: string;
  detected_signals: string[];
  recommended_action: string;
  requires_human_review: boolean;
  disclaimer: string;
  generated_by: string;
};

export type CitizenReportSubmitResponse = {
  message: string;
  report_id: string;
  status: string;
  image_gcs_uri: string;
  requires_human_review: boolean;
};

export async function analyzeCommunityImage(
  image: File,
  description: string,
): Promise<ImageAnalysisResponse> {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("description", description);

  const response = await fetch(`${API_BASE_URL}/api/reports/analyze-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.detail || "Unable to analyze image");
  }

  return response.json();
}

export async function submitCitizenReport(input: {
  image: File;
  category: string;
  severity: string;
  description: string;
  zone: string;
  latitude: number;
  longitude: number;
}): Promise<CitizenReportSubmitResponse> {
  const formData = new FormData();

  formData.append("image", input.image);
  formData.append("category", input.category);
  formData.append("severity", input.severity);
  formData.append("description", input.description);
  formData.append("zone", input.zone);
  formData.append("latitude", String(input.latitude));
  formData.append("longitude", String(input.longitude));

  const response = await fetch(`${API_BASE_URL}/api/reports/submit`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.detail || "Unable to submit citizen report");
  }

  return response.json();
}

export type RiskForecastItem = {
  zone: string;
  predicted_risk_score: number;
  risk_level: string;
  predicted_congestion_score: number;
  predicted_aqi: number;
  predicted_water_risk_score: number;
  unresolved_reports: number;
  anomaly_detected: boolean;
  anomaly_reason: string;
  recommended_action: string;
};

export type ForecastAlert = {
  alert_id: string;
  zone: string;
  alert_type: string;
  severity: string;
  message: string;
  recommended_action: string;
  anomaly_detected: boolean;
};

export async function getRiskForecast(): Promise<RiskForecastItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/forecast/risk`);

  if (!response.ok) {
    throw new Error("Unable to load risk forecast");
  }

  return response.json();
}

export async function getForecastAlerts(): Promise<ForecastAlert[]> {
  const response = await fetch(`${API_BASE_URL}/api/forecast/alerts`);

  if (!response.ok) {
    throw new Error("Unable to load forecast alerts");
  }

  return response.json();
}

export type ActionPlanResponse = {
  alert_id: string;
  zone: string;
  action_plan: string;
  owner_team: string;
  priority: string;
  estimated_response_window: string;
  stakeholder_review_required: boolean;
  safety_note: string;
  generated_by: string;
};

export async function generateActionPlan(input: {
  alert_id: string;
  zone: string;
  alert_type: string;
  severity: string;
  alert_message: string;
  recommended_action: string;
}): Promise<ActionPlanResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/workflow/generate-action-plan`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Unable to generate action plan");
  }

  return response.json();
}

export async function recordWorkflowDecision(input: {
  alert_id: string;
  zone: string;
  alert_type: string;
  severity: string;
  ai_action_plan: string;
  recommended_owner_team: string;
  recommended_priority: string;
  human_decision: "Approved" | "Rejected";
  human_notes: string;
}): Promise<{
  decision_id: string;
  decision_status: string;
  message: string;
}> {
  const response = await fetch(`${API_BASE_URL}/api/workflow/record-decision`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Unable to record decision");
  }

  return response.json();
}