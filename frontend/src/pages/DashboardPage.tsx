import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  Cloud,
  HeartPulse,
  MapPinned,
  ShieldAlert,
  Users,
} from "lucide-react";

import { getBackendHealth, type HealthResponse } from "../services/api";

type HealthState = "loading" | "connected" | "offline";

const metrics = [
  {
    title: "Community Health Score",
    value: "87",
    suffix: "/100",
    description: "Improving across monitored zones",
    icon: HeartPulse,
    status: "Positive trend",
  },
  {
    title: "Active Risk Alerts",
    value: "12",
    suffix: "",
    description: "3 require immediate review",
    icon: ShieldAlert,
    status: "Needs attention",
  },
  {
    title: "Citizen Reports",
    value: "248",
    suffix: "",
    description: "18% increase this week",
    icon: Users,
    status: "Live data",
  },
  {
    title: "Environmental Index",
    value: "72",
    suffix: "/100",
    description: "Moderate air-quality risk",
    icon: Cloud,
    status: "Monitor closely",
  },
];

export default function DashboardPage() {
  const [healthState, setHealthState] = useState<HealthState>("loading");
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);

  useEffect(() => {
    async function checkBackend() {
      try {
        const data = await getBackendHealth();
        setHealthData(data);
        setHealthState("connected");
      } catch {
        setHealthState("offline");
      }
    }

    checkBackend();
  }, []);

  return (
    <div>
      <section className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-sky-400">
            <BrainCircuit size={18} />
            AI-powered community intelligence
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            Community overview
          </h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            Monitor risk signals, understand community conditions, and take
            explainable actions using AI-supported intelligence.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Backend Status
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                healthState === "connected"
                  ? "bg-emerald-400"
                  : healthState === "offline"
                    ? "bg-red-400"
                    : "bg-amber-400"
              }`}
            />
            <span className="font-medium">
              {healthState === "loading" && "Checking connection..."}
              {healthState === "connected" && "Connected to FastAPI"}
              {healthState === "offline" && "Backend offline"}
            </span>
          </div>
          {healthData && (
            <p className="mt-1 text-xs text-slate-500">
              {healthData.service}
            </p>
          )}
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/20"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-slate-400">{metric.title}</p>
                <Icon className="text-sky-400" size={22} />
              </div>
              <p className="mt-5 text-3xl font-bold">
                {metric.value}
                <span className="ml-1 text-base font-medium text-slate-500">
                  {metric.suffix}
                </span>
              </p>
              <p className="mt-3 text-sm text-emerald-400">
                {metric.description}
              </p>
              <p className="mt-2 text-xs text-slate-500">{metric.status}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-sky-900/70 bg-gradient-to-br from-sky-950/60 to-slate-900 p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-sky-500/15 p-3 text-sky-300">
              <BrainCircuit size={26} />
            </div>
            <div>
              <p className="text-sm font-medium text-sky-300">
                AI Executive Summary
              </p>
              <h3 className="text-xl font-semibold">
                Priority action is required in Zone C
              </h3>
            </div>
          </div>

          <p className="mt-6 leading-7 text-slate-300">
            Citizen reports and traffic indicators show a rising risk pattern
            in Zone C. The platform recommends assigning traffic-management
            staff and municipal inspection resources within the next 24 hours.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-red-500/15 px-3 py-1 text-sm text-red-300">
              High Priority
            </span>
            <span className="rounded-full bg-sky-500/15 px-3 py-1 text-sm text-sky-300">
              Confidence: 94%
            </span>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">
              Human review required
            </span>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-amber-400" size={24} />
            <h3 className="text-lg font-semibold">Active Alerts</h3>
          </div>

          <div className="mt-5 space-y-4">
            <div className="border-l-2 border-red-400 pl-3">
              <p className="font-medium">Traffic congestion</p>
              <p className="text-sm text-slate-400">Zone C · High severity</p>
            </div>
            <div className="border-l-2 border-amber-400 pl-3">
              <p className="font-medium">Air-quality warning</p>
              <p className="text-sm text-slate-400">
                Zone E · Moderate severity
              </p>
            </div>
            <div className="border-l-2 border-sky-400 pl-3">
              <p className="font-medium">Citizen report spike</p>
              <p className="text-sm text-slate-400">Zone B · Needs review</p>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <MapPinned className="text-sky-400" size={24} />
            <h3 className="text-lg font-semibold">Community Risk Map</h3>
          </div>
          <div className="mt-5 flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/60 px-6 text-center text-slate-500">
            Google Maps risk layers will be connected in a later phase.
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <Activity className="text-emerald-400" size={24} />
            <h3 className="text-lg font-semibold">Decision Intelligence</h3>
          </div>
          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-slate-800/70 p-4">
              <p className="font-medium">Recommended action</p>
              <p className="mt-1 text-sm text-slate-400">
                Deploy traffic officers to Zone C during peak hours.
              </p>
            </div>
            <div className="rounded-xl bg-slate-800/70 p-4">
              <p className="font-medium">Expected impact</p>
              <p className="mt-1 text-sm text-slate-400">
                Reduce congestion and unresolved complaints within 24 hours.
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}