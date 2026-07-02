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