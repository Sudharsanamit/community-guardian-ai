import { useEffect, useState } from "react";
import {
  Bot,
  CheckCircle2,
  ClipboardCheck,
  LoaderCircle,
  ShieldAlert,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import {
  generateActionPlan,
  getForecastAlerts,
  recordWorkflowDecision,
  type ActionPlanResponse,
  type ForecastAlert,
} from "../services/api";

export default function WorkflowPage() {
  const [alerts, setAlerts] = useState<ForecastAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<ForecastAlert | null>(null);
  const [actionPlan, setActionPlan] = useState<ActionPlanResponse | null>(null);
  const [notes, setNotes] = useState("");
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const alertData = await getForecastAlerts();
        setAlerts(alertData.filter((alert) => alert.anomaly_detected));
      } catch {
        setError("Unable to load automated alert queue.");
      } finally {
        setIsLoadingAlerts(false);
      }
    }

    loadAlerts();
  }, []);

  async function handleGeneratePlan(alert: ForecastAlert) {
    setSelectedAlert(alert);
    setActionPlan(null);
    setMessage(null);
    setError(null);
    setIsGenerating(true);

    try {
      const result = await generateActionPlan({
        alert_id: alert.alert_id,
        zone: alert.zone,
        alert_type: alert.alert_type,
        severity: alert.severity,
        alert_message: alert.message,
        recommended_action: alert.recommended_action,
      });

      setActionPlan(result);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to generate AI action plan.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleDecision(decision: "Approved" | "Rejected") {
    if (!selectedAlert || !actionPlan) {
      return;
    }

    setIsRecording(true);
    setError(null);

    try {
      const result = await recordWorkflowDecision({
        alert_id: selectedAlert.alert_id,
        zone: selectedAlert.zone,
        alert_type: selectedAlert.alert_type,
        severity: selectedAlert.severity,
        ai_action_plan: actionPlan.action_plan,
        recommended_owner_team: actionPlan.owner_team,
        recommended_priority: actionPlan.priority,
        human_decision: decision,
        human_notes: notes,
      });

      setMessage(`${result.message} Decision ID: ${result.decision_id}`);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to record stakeholder decision.",
      );
    } finally {
      setIsRecording(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-1">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-orange-500/15 p-3 text-orange-300">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-orange-300">Alert queue</p>
            <h2 className="text-xl font-bold">Needs review</h2>
          </div>
        </div>

        {isLoadingAlerts ? (
          <div className="mt-8 flex items-center text-sm text-slate-400">
            <LoaderCircle className="mr-2 animate-spin" size={17} />
            Loading alerts...
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {alerts.map((alert) => (
              <button
                key={alert.alert_id}
                type="button"
                onClick={() => handleGeneratePlan(alert)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-left transition hover:border-orange-700"
              >
                <p className="font-medium text-slate-200">{alert.zone}</p>
                <p className="mt-1 text-sm text-slate-500">{alert.alert_type}</p>
                <span className="mt-3 inline-block rounded-full bg-orange-500/15 px-2.5 py-1 text-xs text-orange-300">
                  {alert.severity}
                </span>
              </button>
            ))}

            {!alerts.length && (
              <p className="text-sm text-slate-500">
                No anomaly alerts currently require workflow review.
              </p>
            )}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-500/15 p-3 text-violet-300">
            <Bot size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-violet-300">
              AI workflow automation
            </p>
            <h2 className="text-xl font-bold">Human-approved action planning</h2>
          </div>
        </div>

        {!selectedAlert && (
          <div className="mt-12 text-center text-slate-500">
            Select an alert to generate an AI-assisted action plan.
          </div>
        )}

        {isGenerating && (
          <div className="mt-12 flex items-center justify-center text-slate-400">
            <LoaderCircle className="mr-3 animate-spin" size={21} />
            Gemini is drafting a responsible action plan...
          </div>
        )}

        {actionPlan && selectedAlert && (
          <div className="mt-6 space-y-5">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-500">Selected alert</p>
              <p className="mt-1 font-semibold text-slate-200">
                {selectedAlert.alert_type} — {selectedAlert.zone}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {selectedAlert.message}
              </p>
            </div>

            <div className="rounded-xl border border-violet-900/70 bg-violet-950/20 p-5">
              <div className="flex items-center gap-2 text-violet-300">
                <ClipboardCheck size={19} />
                <p className="font-medium">AI-generated action plan draft</p>
              </div>

              <p className="mt-4 whitespace-pre-line leading-7 text-slate-300">
                {actionPlan.action_plan}
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-slate-950 p-3">
                  <p className="text-xs text-slate-500">Owner team</p>
                  <p className="mt-1 text-sm font-medium text-slate-200">
                    {actionPlan.owner_team}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-950 p-3">
                  <p className="text-xs text-slate-500">Priority</p>
                  <p className="mt-1 text-sm font-medium text-slate-200">
                    {actionPlan.priority}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-950 p-3">
                  <p className="text-xs text-slate-500">Response window</p>
                  <p className="mt-1 text-sm font-medium text-slate-200">
                    {actionPlan.estimated_response_window}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-900/70 bg-amber-950/30 p-4 text-sm text-amber-100">
              {actionPlan.safety_note}
            </div>

            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional stakeholder notes..."
              className="min-h-24 w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-200 outline-none placeholder:text-slate-600 focus:border-violet-700"
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleDecision("Approved")}
                disabled={isRecording}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 font-medium text-slate-950 disabled:opacity-60"
              >
                {isRecording ? (
                  <LoaderCircle className="animate-spin" size={17} />
                ) : (
                  <ThumbsUp size={17} />
                )}
                Approve action plan
              </button>

              <button
                type="button"
                onClick={() => handleDecision("Rejected")}
                disabled={isRecording}
                className="flex items-center gap-2 rounded-xl border border-red-800 px-4 py-2.5 font-medium text-red-300 disabled:opacity-60"
              >
                <ThumbsDown size={17} />
                Reject action plan
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className="mt-6 flex gap-3 rounded-xl border border-emerald-900 bg-emerald-950/40 p-4 text-sm text-emerald-200">
            <CheckCircle2 className="shrink-0" size={19} />
            <p>{message}</p>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
            {error}
          </div>
        )}
      </section>
    </div>
  );
}