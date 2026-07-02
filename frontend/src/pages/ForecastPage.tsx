import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BellRing,
  BrainCircuit,
  CheckCircle2,
  LoaderCircle,
  MapPinned,
  TrendingUp,
} from "lucide-react";

import {
  getForecastAlerts,
  getRiskForecast,
  type ForecastAlert,
  type RiskForecastItem,
} from "../services/api";

function getRiskBadgeClass(riskLevel: string) {
  if (riskLevel === "Critical") {
    return "bg-red-500/15 text-red-300";
  }

  if (riskLevel === "High") {
    return "bg-orange-500/15 text-orange-300";
  }

  if (riskLevel === "Medium") {
    return "bg-amber-500/15 text-amber-300";
  }

  return "bg-emerald-500/15 text-emerald-300";
}

export default function ForecastPage() {
  const [forecast, setForecast] = useState<RiskForecastItem[]>([]);
  const [alerts, setAlerts] = useState<ForecastAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadForecastData() {
    setIsLoading(true);
    setError(null);

    try {
      const [forecastData, alertData] = await Promise.all([
        getRiskForecast(),
        getForecastAlerts(),
      ]);

      setForecast(forecastData);
      setAlerts(alertData);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load predictive intelligence.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadForecastData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center text-slate-400">
        <LoaderCircle className="mr-3 animate-spin" size={22} />
        Loading predictive intelligence...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/15 p-3 text-cyan-300">
              <BrainCircuit size={25} />
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-300">
                Predictive Intelligence
              </p>
              <h2 className="text-2xl font-bold">24-hour community risk forecast</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={loadForecastData}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-700 hover:text-cyan-200"
          >
            Refresh forecast
          </button>
        </div>

        <p className="mt-4 max-w-4xl leading-7 text-slate-400">
          This prototype forecast combines historical traffic, environmental,
          and citizen-report signals from BigQuery. It is an explainable
          decision-support score, not an autonomous city action system.
        </p>
      </section>

      {error && (
        <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <section className="grid gap-5 lg:grid-cols-2">
        {forecast.map((item) => (
          <article
            key={item.zone}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-950 p-3 text-cyan-300">
                  <MapPinned size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{item.zone}</h3>
                  <p className="text-sm text-slate-500">
                    Next 24-hour predicted risk
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${getRiskBadgeClass(
                  item.risk_level,
                )}`}
              >
                {item.risk_level}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Risk score
                </p>
                <p className="mt-2 text-2xl font-bold text-cyan-300">
                  {item.predicted_risk_score}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Unresolved reports
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-100">
                  {item.unresolved_reports}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Predicted congestion
                </p>
                <p className="mt-2 text-xl font-semibold text-slate-200">
                  {item.predicted_congestion_score}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Predicted AQI
                </p>
                <p className="mt-2 text-xl font-semibold text-slate-200">
                  {item.predicted_aqi}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm font-medium text-slate-300">
                Recommended action
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {item.recommended_action}
              </p>
            </div>

            {item.anomaly_detected && (
              <div className="mt-5 flex gap-3 rounded-xl border border-amber-900/70 bg-amber-950/30 p-4 text-sm text-amber-100">
                <AlertTriangle className="shrink-0 text-amber-400" size={19} />
                <div>
                  <p className="font-medium">Anomaly detected</p>
                  <p className="mt-1">{item.anomaly_reason}</p>
                </div>
              </div>
            )}
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-3">
          <BellRing className="text-orange-300" size={22} />
          <div>
            <p className="text-sm font-medium text-orange-300">
              Automated alert queue
            </p>
            <h2 className="text-xl font-bold">Stakeholder review required</h2>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {alerts.map((alert) => (
            <article
              key={alert.alert_id}
              className="rounded-xl border border-slate-800 bg-slate-950 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-orange-300" size={20} />
                  <div>
                    <p className="font-medium text-slate-200">
                      {alert.alert_type} — {alert.zone}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {alert.alert_id}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-sm ${getRiskBadgeClass(
                    alert.severity,
                  )}`}
                >
                  {alert.severity}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                {alert.message}
              </p>

              <div className="mt-4 flex gap-2 text-sm text-emerald-300">
                <CheckCircle2 size={17} className="shrink-0" />
                <p>{alert.recommended_action}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}